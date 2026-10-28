/**
 * SptAttachmentReconciliationService
 *
 * G2.6-H — persistent orphan reconciliation + automatic, recoverable cleanup
 * for Section I attachments.
 *
 * Standalone service. SptAttachmentStorageService (G2.6-A..G),
 * sptAttachmentRepository and googleDriveService are used strictly as
 * existing, locked dependencies and are not modified by anything here.
 *
 *   Drive --listFilesInFolder()--> googleDriveService
 *                                       |
 *                                       v
 *                  SptAttachmentReconciliationService
 *                    discover / compare / classify / persist
 *                                       |
 *                                       v
 *                        spt_attachment_reconciliation (TiDB)
 *   ORPHAN_CANDIDATE -(>=24h, seen again)-> CLEANUP_PENDING
 *        CLEANUP_PENDING -(claim, lease, live checks)-> CLEANUP_SUCCESS
 *                                          \--> CLEANUP_FAILED (manual review)
 *
 * TiDB holds all reconciliation state. Nothing in this file keeps state in
 * memory across calls (no instance fields, no module-level cache), so
 * detection, leases and quotas survive restarts and work across instances.
 *
 * Public methods, callable by a future authenticated scheduler endpoint (none
 * exists yet; no scheduler/route/controller is part of this file):
 *   - reconcile(headerId, options)   one header's Section I folder
 *   - reconcileScope(options)        bounded page of (company, tax year) units
 *   - runCleanup(options)            bounded cleanup run, governed by the mode
 *
 * RUNTIME CONFIGURATION (environment, read at call time, never cached)
 *   ATTACHMENT_CLEANUP_MODE         off (default) | report | dry-run | delete
 *   ATTACHMENT_CLEANUP_ALLOWED_DB   comma-separated "<DB_HOST>/<DB_NAME>"
 *                                   identities allowed to delete. A backend
 *                                   whose own database is not listed can
 *                                   never delete, even if it shares a Drive
 *                                   account with production.
 *   Deletion also requires NODE_ENV=production and every preflight to pass.
 *
 * SAFETY RULES
 *   - spt_attachment (TiDB) is the metadata source of truth. A Drive file is
 *     an orphan only if its drive_file_id is absent from the WHOLE table, on
 *     any header (one Section I folder can be shared by several headers).
 *     That global lookup runs at discovery and again right before a delete;
 *     if it fails, nothing is deleted.
 *   - Reconciliation never creates folders (the folder path is resolved
 *     read-only from the Drive root with listFilesInFolder).
 *   - HTTP 404 is never proof that a file is gone (under drive.file it cannot
 *     be told apart from "not visible to the app"): it is UNKNOWN/ambiguous.
 *   - Cleanup candidates only ever come from persisted rows; no method takes
 *     a Drive file id from a caller.
 *   - A lease limits stuck work; it cannot cancel a Drive request that was
 *     already sent. The delete itself is therefore guarded by a DELETE_ISSUED
 *     marker, and a delete is never re-issued after that marker exists.
 *   - DELETE_ISSUED is irreversible for automatic deletion. After it is
 *     written, every failure (rate limit, rejection, timeout, connection
 *     loss, unconfirmed response) ends the row in CLEANUP_FAILED with a result
 *     code that records the issued delete; ambiguous cases get read-only
 *     verification only. No code path returns such a row to CLEANUP_PENDING,
 *     and the repository enforces this in the WHERE clause of every update.
 *   - Delete-request quota (10 per run, 50 per rolling 24h across all
 *     instances) is RESERVED before the marker and before any Drive call, in
 *     the database (fixed slot rows, one conditional UPDATE per slot). If the
 *     reservation cannot be established, nothing is sent to Drive. A
 *     reservation is never released by code; it expires with its slot.
 */

const sptAttachmentRepository = require("../repositories/sptAttachmentRepository");
const sptAttachmentReconciliationRepository = require("../repositories/sptAttachmentReconciliationRepository");
const googleDriveService = require("./googleDriveService");
// Read-only reuse of locked methods: resolveOwnership() only reads;
// buildAttachmentFolderPath() performs no I/O. ensureAttachmentFolderPath*()
// are deliberately NOT used: they can create folders.
const sptAttachmentStorageService = require("./sptAttachmentStorageService");

const repository = sptAttachmentReconciliationRepository;
const { STATUS, RESULT: REPOSITORY_RESULT } = repository.constants;

// -----------------------------------------------------------------------
// Policy constants (initial values from the G2.6-H brief)
// -----------------------------------------------------------------------
const POLICY = Object.freeze({
  MIN_ORPHAN_AGE_HOURS: 24,
  LEASE_MINUTES: 15,
  MAX_CLEANUP_ATTEMPTS: 5, // includes the first attempt; every claim counts
  TRANSIENT_BACKOFF_MINUTES: Object.freeze([5, 30, 120, 360]), // after attempt 1..4
  AMBIGUOUS_RECHECK_MINUTES: 60, // one delayed read-only recheck, at least 1h later
  FATAL_RELEASE_MINUTES: 5,
  MAX_DELETIONS_PER_RUN: 10,
  MAX_DELETIONS_PER_24H: 50, // reservations per rolling window, enforced by quota slot rows
  QUOTA_WINDOW_HOURS: 24,
  BREAKER_ORPHAN_RATIO: 0.5,
  BREAKER_MIN_FILES: 10,
  BREAKER_HOLD_MINUTES: 360,
  DEFAULT_MAX_CANDIDATES_PER_RUN: 25,
  DEFAULT_TIME_BUDGET_MS: 45000, // bounded work per invocation; hosting limit NOT assumed
  CANDIDATE_START_MARGIN_MS: 20000,
  DRIVE_OP_TIMEOUT_MS: 30000,
  DRIVE_LISTING_TIMEOUT_MS: 60000,
  DEFAULT_MAX_UNITS_PER_SCOPE_RUN: 20,
  UNIT_START_MARGIN_MS: 15000,
});

// -----------------------------------------------------------------------
// TEMPORARY POLICY: automatic Google Drive deletion is disabled in code.
//
// This is a code-level switch, deliberately NOT read from the environment:
// ATTACHMENT_CLEANUP_MODE, NODE_ENV, ATTACHMENT_CLEANUP_ALLOWED_DB, database
// readiness and quota availability cannot turn it on. It is evaluated
//   - in runCleanup(), before any preflight, claim, reservation or write;
//   - in _runDeleteMode() and _processCandidate(), before any claim;
//   - in deleteGuardFailures(), so every existing guard check also fails;
//   - in _issueDriveDelete(), the ONLY place in this file that calls
//     googleDriveService.deleteFile().
// It fails closed: anything other than the boolean `true` keeps deletion off.
// Read-only reconciliation (reconcile, reconcileScope) and the report and
// dry-run modes are unaffected. Re-enabling requires an explicit code change
// here, after the separate audit and integration approval.
// -----------------------------------------------------------------------
const AUTOMATIC_DELETION_ENABLED = false;

function isAutomaticDeletionEnabled() {
  return AUTOMATIC_DELETION_ENABLED === true;
}

const MODES = Object.freeze({
  OFF: "off",
  REPORT: "report",
  DRY_RUN: "dry-run",
  DELETE: "delete",
});

const RESULT = Object.freeze({
  ...REPOSITORY_RESULT,
  RETRIES_EXHAUSTED: "RETRIES_EXHAUSTED",
  TARGET_IS_FOLDER: "TARGET_IS_FOLDER",
  PARENT_FOLDER_MISMATCH: "PARENT_FOLDER_MISMATCH",
  INVALID_TRACKING_ROW: "INVALID_TRACKING_ROW",
  DELETE_RESPONSE_NOT_CONFIRMED: "DELETE_RESPONSE_NOT_CONFIRMED",
  CLEANUP_MODE_DISABLED: "CLEANUP_MODE_DISABLED",
  DAILY_QUOTA_EXCEEDED: "DAILY_QUOTA_EXCEEDED",
  QUOTA_RECHECK_FAILED: "QUOTA_RECHECK_FAILED",
  AMBIGUOUS_UNRESOLVED: "AMBIGUOUS_UNRESOLVED",
});

// Google's public Drive API constants (the same values googleDriveService.js
// uses internally; they are Google's, not private to that file).
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
const DRIVE_ROOT_ID = "root";

// -----------------------------------------------------------------------
// Errors (in-file; this service is standalone)
// -----------------------------------------------------------------------
class ReconciliationValidationError extends Error {
  constructor(message = "Invalid reconciliation input.") {
    super(message);
    this.name = "ReconciliationValidationError";
    this.code = "RECONCILIATION_VALIDATION_ERROR";
  }
}

/**
 * Automatic Drive deletion is disabled by the code-level policy switch.
 * Thrown only by _issueDriveDelete(), the last line of defence; in normal flow
 * runCleanup() returns a structured result long before this could happen.
 */
class AutomaticDeletionDisabledError extends Error {
  constructor(message = "Automatic Google Drive deletion is temporarily disabled by policy.") {
    super(message);
    this.name = "AutomaticDeletionDisabledError";
    this.code = "AUTOMATIC_DELETION_DISABLED_BY_POLICY";
  }
}

/** Required reconciliation schema is missing; nothing was done. */
class ReconciliationSchemaNotReadyError extends Error {
  constructor(missing = [], cause) {
    super(
      `spt_attachment_reconciliation schema is not ready (missing: ${missing.join(", ") || "unknown"}). Apply the G2.6-H migration first.`
    );
    this.name = "ReconciliationSchemaNotReadyError";
    this.code = "RECONCILIATION_SCHEMA_NOT_READY";
    this.missing = missing;
    this.cause = cause;
  }
}

/**
 * A database write that records cleanup state failed. Carries the underlying
 * error and, once runCleanup() has caught it, the outcomes of the run so far.
 * deleteConfirmed=true means Drive had already confirmed a delete: the state
 * could not be recorded, so it is NOT reported as success and the delete is
 * NOT repeated (the DELETE_ISSUED marker stays for recovery).
 */
class CleanupStateWriteError extends Error {
  constructor(cause, { trackingRowId = null, operation = null, deleteConfirmed = false } = {}) {
    super(
      `Failed to record cleanup state (${operation || "write"}): ${cause && cause.message ? cause.message : cause}`
    );
    this.name = "CleanupStateWriteError";
    this.code = "RECONCILIATION_STATE_WRITE_FAILED";
    this.cause = cause;
    this.trackingRowId = trackingRowId;
    this.operation = operation;
    this.deleteConfirmed = deleteConfirmed;
    this.partialOutcomes = [];
  }
}

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------
function isPresent(value) {
  return value !== undefined && value !== null && value !== "";
}

function fitResult(value) {
  return String(value).slice(0, 40);
}

// Redacts anything shaped like a credential before a message is stored or
// returned. The dependencies in this chain do not put secrets in error
// messages; this is defence in depth, not a licence to log them.
function safeErrorMessage(err) {
  let message = err && err.message ? String(err.message) : String(err);
  message = message
    .replace(/ya29\.[\w-]+/g, "[REDACTED]")
    .replace(/1\/\/[\w-]+/g, "[REDACTED]")
    .replace(/Bearer\s+[\w.~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/(client_secret|refresh_token|access_token|id_token|code)=[^&\s]+/gi, "$1=[REDACTED]");
  return message.slice(0, 500);
}

// Stops WAITING after `ms`; it cannot cancel an in-flight request. A late
// completion is ignored, which is why a timeout around deleteFile() is treated
// as an uncertain outcome rather than a failure.
function withTimeout(factory, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error(`${label} timed out after ${ms} ms`);
      err.code = "OPERATION_TIMEOUT";
      err.operation = label;
      reject(err);
    }, ms);
    Promise.resolve()
      .then(factory)
      .then(
        (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        }
      );
  });
}

function httpStatusOf(err) {
  if (!err) return null;
  const candidates = [err.code, err.status, err.response && err.response.status];
  for (const c of candidates) {
    const n = typeof c === "number" ? c : typeof c === "string" && /^\d{3}$/.test(c) ? Number(c) : NaN;
    if (Number.isInteger(n) && n >= 100 && n <= 599) return n;
  }
  return null;
}

function isHttpNotFound(err) {
  return httpStatusOf(err) === 404;
}

const NETWORK_CODES = new Set(["ECONNRESET", "ETIMEDOUT", "EAI_AGAIN", "ECONNREFUSED", "ENOTFOUND", "EPIPE", "ESOCKETTIMEDOUT"]);
const DB_TRANSIENT_CODES = new Set(["ER_LOCK_WAIT_TIMEOUT", "ER_LOCK_DEADLOCK", "PROTOCOL_CONNECTION_LOST", "ECONNRESET", "ETIMEDOUT"]);

/**
 * Conservative classification. Only error structures the project already
 * relies on are read: a numeric HTTP status, string network codes, Sequelize's
 * own error class names / `parent.code`, and this file's OPERATION_TIMEOUT.
 * No Google-specific error fields are assumed. Anything unrecognised is
 * "ambiguous", which is never destructive.
 *
 * kinds: transient (retry later) | permanent (manual review) |
 *        ambiguous (bounded read-only recheck) | fatal (stop the run)
 */
function classifyError(err, { duringDelete = false } = {}) {
  if (!err) return { kind: "ambiguous", code: "UNKNOWN_ERROR" };
  const name = err.name || "";
  const dbCode = err.parent && err.parent.code ? err.parent.code : null;
  const message = err.message ? String(err.message) : "";

  if (err.code === "OPERATION_TIMEOUT") {
    return duringDelete
      ? { kind: "ambiguous", code: "DELETE_TIMEOUT" }
      : { kind: "transient", code: "OPERATION_TIMEOUT" };
  }

  // Database (Sequelize)
  if (dbCode === "ER_BAD_FIELD_ERROR" || dbCode === "ER_NO_SUCH_TABLE") {
    return { kind: "fatal", code: "DB_SCHEMA_ERROR" };
  }
  if (/^SequelizeAccessDenied/.test(name)) return { kind: "fatal", code: "DB_ACCESS_DENIED" };
  if (/^Sequelize(Connection|Host|InvalidConnection|Timeout)/.test(name)) {
    return { kind: "transient", code: "DB_CONNECTION", stopRun: true };
  }
  if (dbCode && DB_TRANSIENT_CODES.has(dbCode)) return { kind: "transient", code: `DB_${dbCode}` };

  // Google Drive / network
  if (/invalid_grant/i.test(message)) return { kind: "fatal", code: "DRIVE_AUTH_INVALID_GRANT" };
  if (err.constructor && err.constructor.name === "GoogleOAuthConfigError") {
    return { kind: "fatal", code: "DRIVE_CONFIG_ERROR" };
  }
  const status = httpStatusOf(err);
  if (status === 401) return { kind: "fatal", code: "DRIVE_UNAUTHORIZED" };
  if (status === 429) return { kind: "transient", code: "HTTP_429" };
  if (status !== null && status >= 500) {
    // A 5xx on a delete may or may not have been executed.
    return duringDelete ? { kind: "ambiguous", code: `HTTP_${status}` } : { kind: "transient", code: `HTTP_${status}` };
  }
  // 404 and 403 are ambiguous: gone vs not visible to the app (drive.file),
  // or permission/rate-limit; no Google-specific reason field is parsed.
  if (status === 404 || status === 403) return { kind: "ambiguous", code: `HTTP_${status}` };
  if (status !== null) return { kind: "permanent", code: `HTTP_${status}` };
  if (typeof err.code === "string" && NETWORK_CODES.has(err.code)) {
    return duringDelete ? { kind: "ambiguous", code: "DELETE_NETWORK_ERROR" } : { kind: "transient", code: "NETWORK_ERROR" };
  }
  if (err instanceof TypeError) return { kind: "permanent", code: "INVALID_INPUT" };
  return { kind: "ambiguous", code: "UNCLASSIFIED" };
}

function verdictFromError(err, opts) {
  const c = classifyError(err, opts);
  return {
    kind: c.kind.toUpperCase(),
    code: c.code,
    error: safeErrorMessage(err),
    stopRun: Boolean(c.stopRun),
  };
}

// ---- runtime mode and guards -------------------------------------------------
function readCleanupMode() {
  const raw = String(process.env.ATTACHMENT_CLEANUP_MODE || "").trim().toLowerCase();
  return Object.values(MODES).includes(raw) ? raw : MODES.OFF;
}

/** Reasons deletion is NOT allowed right now (empty array = allowed). Read at call time. */
function deleteGuardFailures() {
  const failures = [];
  if (!isAutomaticDeletionEnabled()) failures.push("AUTOMATIC_DELETION_DISABLED_BY_POLICY");
  if (readCleanupMode() !== MODES.DELETE) failures.push("MODE_NOT_DELETE");
  if (process.env.NODE_ENV !== "production") failures.push("NODE_ENV_NOT_PRODUCTION");

  const allowList = String(process.env.ATTACHMENT_CLEANUP_ALLOWED_DB || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const host = String(process.env.DB_HOST || "").trim();
  const name = String(process.env.DB_NAME || "").trim();
  if (allowList.length === 0) {
    failures.push("ENV_ALLOWLIST_NOT_CONFIGURED");
  } else if (!host || !name) {
    failures.push("ENV_IDENTITY_UNKNOWN");
  } else if (!allowList.includes(`${host}/${name}`)) {
    failures.push("ENV_IDENTITY_NOT_ALLOWED");
  }
  return failures;
}

// ---- run options / events -----------------------------------------------------
function clampInt(value, min, max, fallback) {
  return Number.isInteger(value) ? Math.min(Math.max(value, min), max) : fallback;
}

// Only numbers and a callback are accepted; there is deliberately no option
// that carries a Drive file id.
function normalizeRunOptions(options) {
  const o = options && typeof options === "object" ? options : {};
  return {
    maxCandidates: clampInt(o.maxCandidates, 1, 100, POLICY.DEFAULT_MAX_CANDIDATES_PER_RUN),
    timeBudgetMs: clampInt(o.timeBudgetMs, 1000, 300000, POLICY.DEFAULT_TIME_BUDGET_MS),
    maxDeletions: clampInt(o.maxDeletions, 1, POLICY.MAX_DELETIONS_PER_RUN, POLICY.MAX_DELETIONS_PER_RUN),
    onEvent: typeof o.onEvent === "function" ? o.onEvent : null,
  };
}

function emit(ctx, event) {
  if (!ctx || !ctx.onEvent) return;
  try {
    ctx.onEvent({ at: new Date().toISOString(), ...event });
  } catch (err) {
    ctx.eventCallbackFailures += 1; // a logging callback must never abort a run
  }
}

async function guardedWrite(operation, trackingRowId, fn, extra = {}) {
  try {
    return await fn();
  } catch (err) {
    throw new CleanupStateWriteError(err, { trackingRowId, operation, ...extra });
  }
}

/**
 * Read-only resolution of an EXISTING folder path, level by level from the
 * Drive root, using only googleDriveService.listFilesInFolder(). Never creates
 * anything. Returns the final folder id, or null as soon as a level is
 * missing. Throws DRIVE_FOLDER_DUPLICATE when a level is ambiguous.
 */
async function resolveExistingFolderPath(folderNames) {
  let parentId = DRIVE_ROOT_ID;
  for (const name of folderNames) {
    const entries = await withTimeout(
      () => googleDriveService.listFilesInFolder(parentId),
      POLICY.DRIVE_LISTING_TIMEOUT_MS,
      "drive.listFilesInFolder"
    );
    const matches = entries.filter((e) => e.mimeType === FOLDER_MIME_TYPE && e.fileName === name);
    if (matches.length === 0) return null;
    if (matches.length > 1) {
      const err = new Error(
        `Multiple Google Drive folders named "${name}" exist under parent "${parentId}"; reconciliation scope is ambiguous.`
      );
      err.code = "DRIVE_FOLDER_DUPLICATE";
      err.folderName = name;
      err.parentId = parentId;
      err.folderIds = matches.map((m) => m.fileId);
      throw err;
    }
    parentId = matches[0].fileId;
  }
  return parentId;
}

class SptAttachmentReconciliationService {
  // =====================================================================
  // Detection
  // =====================================================================

  /**
   * Reconcile ONE header's Section I folder and persist orphan state. Never
   * deletes a Drive file and never creates a Drive folder.
   *
   * DB -> Drive (only when options.checkDbRecords !== false): each
   * spt_attachment row of THIS header is checked with getFile(): present ->
   * HEALTHY; HTTP 404 -> UNKNOWN (not declared missing; see class doc); any
   * other error -> UNKNOWN.
   *
   * Drive -> DB: every non-folder file in the existing Section I folder goes
   * through ONE global spt_attachment lookup (any header) before anything is
   * persisted; if that query fails, the error propagates and nothing is
   * written. A file with metadata anywhere is never an orphan. For the rest:
   *   no row yet                  -> create ORPHAN_CANDIDATE
   *   ORPHAN_CANDIDATE, >=24h old -> promote to CLEANUP_PENDING (database clock)
   *   ORPHAN_CANDIDATE, younger   -> stay ORPHAN_CANDIDATE, last_detected_at refreshed
   *   CLEANUP_PENDING             -> last_detected_at refreshed
   *   CLEANUP_SUCCESS/FAILED      -> untouched
   * first_detected_at is never reset. A >=24h-old row can only be promoted
   * by a later, separate detection, because the creating run is by definition
   * older than that.
   *
   * A tracking row whose file now has metadata is removed (no status means
   * "turned out not to be an orphan", and keeping the row would corrupt the
   * age rule), unless it is terminal or carries DELETE_ISSUED: those are kept
   * and reported in retainedForReview. Every such event is also passed to
   * options.onEvent so the integration layer can retain it.
   *
   * @param {number|string} headerId
   * @param {Object} [options] {checkDbRecords, includeKnownElsewhere, skipSchemaCheck, onEvent}
   */
  async reconcile(headerId, options = {}) {
    if (!isPresent(headerId)) {
      throw new ReconciliationValidationError("headerId is required.");
    }
    const ctx = { onEvent: typeof options.onEvent === "function" ? options.onEvent : null, eventCallbackFailures: 0 };
    const checkDbRecords = options.checkDbRecords !== false;
    const includeKnownElsewhere = options.includeKnownElsewhere !== false;

    if (!options.skipSchemaCheck) await this._assertSchemaReady();

    const ownership = await sptAttachmentStorageService.resolveOwnership(headerId);
    const folderPath = sptAttachmentStorageService.buildAttachmentFolderPath(ownership);
    const attachments = await sptAttachmentRepository.findAllByHeaderId(headerId);

    // ---- DB -> Drive ----
    const dbToDrive = [];
    if (checkDbRecords) {
      for (const row of attachments) {
        const base = {
          headerId,
          attachmentId: row.id,
          documentCode: row.document_code,
          driveFileId: row.drive_file_id,
          driveFolderId: row.drive_folder_id,
        };
        try {
          await withTimeout(
            () => googleDriveService.getFile(row.drive_file_id),
            POLICY.DRIVE_OP_TIMEOUT_MS,
            "drive.getFile"
          );
          dbToDrive.push({ ...base, category: "DB_RECORD_WITH_DRIVE_FILE_PRESENT", status: "HEALTHY", detail: null });
        } catch (err) {
          if (isHttpNotFound(err)) {
            // NOT "missing": indistinguishable from a file the app cannot see.
            dbToDrive.push({
              ...base,
              category: "DB_RECORD_DRIVE_FILE_NOT_FOUND_OR_NOT_VISIBLE",
              status: "UNKNOWN",
              httpNotFound: true,
              detail: `Drive answered HTTP 404 (${safeErrorMessage(err)}). This cannot be distinguished from a file the app is not allowed to see (drive.file scope), so the file is NOT declared missing.`,
            });
          } else {
            dbToDrive.push({
              ...base,
              category: "DB_RECORD_DRIVE_VISIBILITY_UNKNOWN",
              status: "UNKNOWN",
              detail: `Could not confirm Drive file existence (possible drive.file scope visibility limitation, network, or auth error): ${safeErrorMessage(err)}`,
            });
          }
        }
      }
    }

    // ---- previously tracked candidates that now have metadata ----
    const resolved = [];
    const retainedForReview = [];
    const thisHeaderDriveFileIds = new Set(attachments.map((r) => r.drive_file_id));
    for (const row of attachments) {
      await this._resolveIfTracked(row.drive_file_id, resolved, retainedForReview, ctx);
    }

    // ---- Drive -> DB ----
    const driveToDb = {
      performed: false,
      skippedReason: null,
      sectionIFolderId: null,
      knownUnderOtherHeader: [],
      orphanEvents: [],
    };

    const sectionIFolderId = await resolveExistingFolderPath(folderPath.folderNames);
    if (sectionIFolderId === null) {
      driveToDb.skippedReason =
        "Expected Section I folder does not exist on Drive; nothing to discover (no folder is created by reconciliation).";
    } else {
      driveToDb.performed = true;
      driveToDb.sectionIFolderId = sectionIFolderId;

      const entries = await withTimeout(
        () => googleDriveService.listFilesInFolder(sectionIFolderId),
        POLICY.DRIVE_LISTING_TIMEOUT_MS,
        "drive.listFilesInFolder"
      );
      const files = entries.filter((e) => e.mimeType !== FOLDER_MIME_TYPE); // folders are never orphans

      // GLOBAL metadata lookup, before anything is persisted for this folder.
      const globallyKnown = new Set(
        await repository.findAttachmentDriveFileIds(files.map((f) => f.fileId))
      );

      for (const entry of files) {
        if (globallyKnown.has(entry.fileId)) {
          if (!thisHeaderDriveFileIds.has(entry.fileId)) {
            if (includeKnownElsewhere) driveToDb.knownUnderOtherHeader.push(entry.fileId);
            await this._resolveIfTracked(entry.fileId, resolved, retainedForReview, ctx);
          }
          continue;
        }
        driveToDb.orphanEvents.push(
          await this._recordOrphanDetection(headerId, entry.fileId, sectionIFolderId, ctx)
        );
      }
    }

    return {
      headerId,
      scope: { expectedFolderNames: folderPath.folderNames },
      dbToDrive,
      resolved,
      retainedForReview,
      driveToDb,
      eventCallbackFailures: ctx.eventCallbackFailures,
    };
  }

  /**
   * One bounded page of reconciliation units for a future scheduler: distinct
   * (company, tax year) pairs of active headers, each reconciled once through
   * a representative header (they share one Section I folder), without the
   * per-row DB->Drive getFile() checks. Returns nextCursor (null when the
   * enumeration is complete) so a caller can continue; this method keeps no
   * cursor state itself. Errors that belong to one unit (ownership chain,
   * ambiguous folder) are reported per unit; anything else (database, Drive
   * auth/transport, schema) aborts and propagates.
   *
   * @param {Object} [options] {cursor:{companyId,taxYear}, maxUnits, timeBudgetMs, onEvent}
   */
  async reconcileScope(options = {}) {
    const o = options && typeof options === "object" ? options : {};
    const maxUnits = clampInt(o.maxUnits, 1, 200, POLICY.DEFAULT_MAX_UNITS_PER_SCOPE_RUN);
    const timeBudgetMs = clampInt(o.timeBudgetMs, 1000, 300000, POLICY.DEFAULT_TIME_BUDGET_MS);
    const cursor = o.cursor && typeof o.cursor === "object" ? o.cursor : null;
    const started = Date.now();

    await this._assertSchemaReady();

    const units = await repository.findReconciliationUnits({
      afterCompanyId: cursor ? cursor.companyId : null,
      afterTaxYear: cursor ? cursor.taxYear : null,
      limit: maxUnits,
    });

    const results = [];
    let nextCursor = cursor;
    let truncated = false;
    for (const unit of units) {
      if (Date.now() - started + POLICY.UNIT_START_MARGIN_MS > timeBudgetMs) {
        truncated = true;
        break;
      }
      try {
        const report = await this.reconcile(unit.representativeHeaderId, {
          checkDbRecords: false,
          includeKnownElsewhere: false,
          skipSchemaCheck: true,
          onEvent: o.onEvent,
        });
        results.push({ unit, ok: true, report });
      } catch (err) {
        const unitScoped =
          err &&
          typeof err.code === "string" &&
          (err.code.startsWith("ATTACHMENT_OWNERSHIP_") ||
            err.code === "DRIVE_FOLDER_DUPLICATE" ||
            err.code === "ATTACHMENT_VALIDATION_ERROR");
        if (!unitScoped) throw err;
        results.push({ unit, ok: false, error: { code: err.code, message: safeErrorMessage(err) } });
      }
      nextCursor = { companyId: unit.companyId, taxYear: unit.taxYear };
    }

    const finished = !truncated && units.length < maxUnits;
    return { units: results, nextCursor: finished ? null : nextCursor, truncated };
  }

  async _assertSchemaReady() {
    let status;
    try {
      status = await repository.getSchemaStatus();
    } catch (err) {
      throw new ReconciliationSchemaNotReadyError([], err);
    }
    if (!status.ready) throw new ReconciliationSchemaNotReadyError(status.missing);
  }

  /**
   * A tracking row exists for a file that has metadata. Remove it only if it
   * is still an unclaimed-for-delete candidate; keep terminal rows and rows
   * with a DELETE_ISSUED marker as evidence.
   */
  async _resolveIfTracked(driveFileId, resolvedList, retainedList, ctx) {
    const tracked = await repository.findByDriveFileId(driveFileId);
    if (!tracked) return;
    const removed = await repository.deleteResolvableById(tracked.id);
    const entry = {
      driveFileId,
      trackingRowId: tracked.id,
      previousStatus: tracked.status,
      previousResult: tracked.last_result || null,
    };
    if (removed === 1) {
      resolvedList.push(entry);
      emit(ctx, { type: "ORPHAN_RESOLVED_HAS_METADATA", ...entry });
    } else {
      retainedList.push(entry);
      emit(ctx, { type: "TRACKED_ROW_RETAINED_FOR_REVIEW", ...entry });
    }
  }

  async _recordOrphanDetection(headerId, driveFileId, driveFolderId, ctx) {
    const existing = await repository.findByDriveFileId(driveFileId);
    if (existing) return this._applyRediscovery(existing, ctx);

    const { created, row } = await repository.createDetected({
      header_id: headerId,
      drive_file_id: driveFileId,
      drive_folder_id: driveFolderId,
    });
    if (!created) return this._applyRediscovery(row, ctx); // another run created it first
    emit(ctx, { type: "ORPHAN_FIRST_DETECTED", driveFileId, trackingRowId: row.id });
    return { driveFileId, action: "FIRST_DETECTED", trackingRowId: row.id, status: STATUS.ORPHAN_CANDIDATE };
  }

  async _applyRediscovery(existing, ctx) {
    const base = { driveFileId: existing.drive_file_id, trackingRowId: existing.id };

    if (existing.status === STATUS.ORPHAN_CANDIDATE) {
      const promoted = await repository.promoteIfEligible(existing.id, {
        minAgeHours: POLICY.MIN_ORPHAN_AGE_HOURS,
      });
      if (promoted === 1) {
        emit(ctx, { type: "ORPHAN_PROMOTED_TO_CLEANUP_PENDING", ...base });
        return { ...base, action: "ADVANCED_TO_CLEANUP_PENDING", status: STATUS.CLEANUP_PENDING };
      }
      const touched = await repository.touchDetected(existing.id, STATUS.ORPHAN_CANDIDATE);
      return {
        ...base,
        action: touched === 1 ? "KEPT_ORPHAN_CANDIDATE_TOO_YOUNG" : "CONCURRENTLY_UPDATED",
        status: STATUS.ORPHAN_CANDIDATE,
      };
    }

    if (existing.status === STATUS.CLEANUP_PENDING) {
      await repository.touchDetected(existing.id, STATUS.CLEANUP_PENDING);
      return { ...base, action: "STILL_CLEANUP_PENDING", status: STATUS.CLEANUP_PENDING };
    }

    // CLEANUP_SUCCESS / CLEANUP_FAILED: discovery never rewrites these.
    return { ...base, action: "NO_CHANGE", status: existing.status };
  }

  // =====================================================================
  // Cleanup
  // =====================================================================

  /**
   * Bounded cleanup run governed by ATTACHMENT_CLEANUP_MODE (read at call
   * time). Takes only numeric limits and an optional onEvent callback; it
   * never accepts a Drive file id.
   *
   *   off      -> nothing is read or written.
   *   report   -> lists currently eligible candidates (database only); no
   *               claim, no Drive call, no write.
   *   dry-run  -> runs the read-only live checks for eligible candidates and
   *               says what WOULD happen; no claim, no marker, no write.
   *   delete   -> real cleanup, only if every guard holds. CURRENTLY DISABLED BY
   *               POLICY: returns a structured, non-destructive result (see
   *               AUTOMATIC_DELETION_ENABLED); nothing is claimed, reserved,
   *               marked, swept, recovered or deleted.
   *               (mode, NODE_ENV=production, DB identity allow-list,
   *               preflight, quotas, circuit breaker).
   *
   * Preflight failure or unmet guards return skipped=true (fail closed; no
   * Drive delete is possible on those paths). A failure to RECORD state is
   * surfaced as CleanupStateWriteError with the outcomes so far attached.
   *
   * @param {Object} [options] {maxCandidates, timeBudgetMs, maxDeletions, onEvent}
   */
  async runCleanup(options = {}) {
    const opts = normalizeRunOptions(options);
    const mode = readCleanupMode();
    const started = Date.now();
    const ctx = {
      onEvent: opts.onEvent,
      eventCallbackFailures: 0,
      outcomes: [],
      stop: false,
      stoppedBecause: null,
      deletionsThisRun: 0,
      sweeps: null,
      recoveries: 0,
    };
    const limits = {
      minOrphanAgeHours: POLICY.MIN_ORPHAN_AGE_HOURS,
      leaseMinutes: POLICY.LEASE_MINUTES,
      maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS,
      maxCandidates: opts.maxCandidates,
      maxDeletionsPerRun: opts.maxDeletions,
      maxDeletionsPer24h: POLICY.MAX_DELETIONS_PER_24H,
      timeBudgetMs: opts.timeBudgetMs,
    };
    const finish = (extra) => ({
      mode,
      limits,
      skipped: false,
      reason: null,
      outcomes: ctx.outcomes,
      sweeps: ctx.sweeps,
      stoppedBecause: ctx.stoppedBecause,
      eventCallbackFailures: ctx.eventCallbackFailures,
      automaticDeletionDisabledByPolicy: !isAutomaticDeletionEnabled(),
      ...extra,
    });

    if (mode === MODES.OFF) {
      return finish({ skipped: true, reason: "CLEANUP_MODE_OFF" });
    }

    // Policy guard, evaluated before preflight and before anything is read or
    // written: no claim, no quota reservation, no DELETE_ISSUED marker, no
    // sweep, no recovery and no Drive delete. Independent of environment,
    // database readiness and quota.
    if (mode === MODES.DELETE && !isAutomaticDeletionEnabled()) {
      return finish({
        skipped: true,
        reason: "AUTOMATIC_DELETION_DISABLED_BY_POLICY",
        message:
          "Automatic Google Drive deletion is temporarily disabled by policy. Nothing was claimed, reserved, marked or deleted. Use report or dry-run mode for read-only findings.",
      });
    }

    try {
      const preflight = await this._preflight({ needDrive: mode !== MODES.REPORT });
      if (!preflight.ok) {
        return finish({ skipped: true, reason: "PREFLIGHT_FAILED", preflight });
      }

      if (mode === MODES.REPORT) {
        const due = await repository.findDueForCleanup({
          minAgeHours: POLICY.MIN_ORPHAN_AGE_HOURS,
          maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS,
          limit: opts.maxCandidates,
        });
        const recovery = await repository.findExpiredDeleteIssued({
          maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS,
          limit: opts.maxCandidates,
        });
        ctx.outcomes = due.map((r) => ({
          trackingRowId: r.id,
          driveFileId: r.drive_file_id,
          driveFolderId: r.drive_folder_id,
          headerId: r.header_id,
          attemptsUsed: r.cleanup_attempt_count,
          outcome: "ELIGIBLE",
        }));
        return finish({
          preflight,
          recoveryCandidates: recovery.map((r) => ({ trackingRowId: r.id, driveFileId: r.drive_file_id })),
        });
      }

      if (mode === MODES.DELETE) {
        const guards = deleteGuardFailures();
        if (guards.length > 0) {
          return finish({ skipped: true, reason: "DELETE_GUARDS_NOT_SATISFIED", guards, preflight });
        }
        await this._runDeleteMode(opts, ctx, started);
      } else {
        await this._runDryRunMode(opts, ctx, started);
      }
      return finish({ preflight });
    } catch (err) {
      if (err instanceof CleanupStateWriteError) err.partialOutcomes = ctx.outcomes;
      throw err;
    }
  }

  /** Fail-closed checks that run before any candidate is touched. */
  async _preflight({ needDrive }) {
    const reasons = [];
    let dbReady = true;
    try {
      const schema = await repository.getSchemaStatus();
      if (!schema.ready) {
        reasons.push({ code: "SCHEMA_NOT_READY", missing: schema.missing });
        dbReady = false;
      }
    } catch (err) {
      reasons.push({ code: "SCHEMA_CHECK_FAILED", error: safeErrorMessage(err) });
      dbReady = false;
    }
    if (dbReady) {
      try {
        if (!(await repository.checkDbTimeSupport())) reasons.push({ code: "DB_TIME_EXPRESSIONS_UNSUPPORTED" });
      } catch (err) {
        reasons.push({ code: "DB_TIME_CHECK_FAILED", error: safeErrorMessage(err) });
      }
    }
    if (dbReady && needDrive) {
      try {
        const quota = await repository.getQuotaSlotStatus({ limit: POLICY.MAX_DELETIONS_PER_24H });
        if (!quota.ready) {
          reasons.push({ code: "QUOTA_SLOTS_NOT_READY", present: quota.present, required: quota.required });
        }
      } catch (err) {
        reasons.push({ code: "QUOTA_SLOT_CHECK_FAILED", error: safeErrorMessage(err) });
      }
    }
    if (needDrive) {
      if (!googleDriveService.isDriveConfigured()) {
        reasons.push({ code: "DRIVE_NOT_CONFIGURED" });
      } else {
        try {
          await withTimeout(
            () => googleDriveService.getDriveIdentity(),
            POLICY.DRIVE_OP_TIMEOUT_MS,
            "drive.getDriveIdentity"
          );
        } catch (err) {
          reasons.push({ code: "DRIVE_PREFLIGHT_FAILED", error: safeErrorMessage(err) });
        }
      }
    }
    return { ok: reasons.length === 0, reasons };
  }

  _outOfBudget(ctx, started, opts) {
    if (ctx.stop) return true;
    if (Date.now() - started + POLICY.CANDIDATE_START_MARGIN_MS > opts.timeBudgetMs) {
      ctx.stop = true;
      ctx.stoppedBecause = "TIME_BUDGET";
      return true;
    }
    return false;
  }

  // ---- dry-run: read-only evaluation, no claim, no marker, no write ----
  async _runDryRunMode(opts, ctx, started) {
    const due = await repository.findDueForCleanup({
      minAgeHours: POLICY.MIN_ORPHAN_AGE_HOURS,
      maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS,
      limit: opts.maxCandidates,
    });
    let dailyUsed = await repository.countActiveQuotaReservations({
      limit: POLICY.MAX_DELETIONS_PER_24H,
      windowHours: POLICY.QUOTA_WINDOW_HOURS,
    });
    let wouldDelete = 0;
    const folderChecks = new Map();

    for (const row of due) {
      if (this._outOfBudget(ctx, started, opts)) break;
      const base = { trackingRowId: row.id, driveFileId: row.drive_file_id };

      let fc = folderChecks.get(row.drive_folder_id);
      if (!fc) {
        fc = await this._checkFolderBreaker(row.drive_folder_id, { persistEvidence: false });
        folderChecks.set(row.drive_folder_id, fc);
      }
      if (!fc.ok) {
        ctx.outcomes.push({ ...base, outcome: "SKIPPED_FOLDER_CHECK_FAILED", code: fc.verdict.code });
        if (fc.verdict.kind === "FATAL") {
          ctx.stop = true;
          ctx.stoppedBecause = `FATAL_${fc.verdict.code}`;
        }
        continue;
      }
      if (fc.tripped) {
        ctx.outcomes.push({ ...base, outcome: "WOULD_ABORT_CIRCUIT_BREAKER", folder: fc });
        ctx.stop = true;
        ctx.stoppedBecause = "CIRCUIT_BREAKER";
        break;
      }

      const verdict = await this._verifyCandidateLive(row);
      let outcome;
      if (verdict.kind === "READY") {
        if (wouldDelete >= opts.maxDeletions) {
          ctx.stop = true;
          ctx.stoppedBecause = "RUN_DELETION_QUOTA";
          break;
        }
        if (dailyUsed + wouldDelete >= POLICY.MAX_DELETIONS_PER_24H) {
          ctx.stop = true;
          ctx.stoppedBecause = "DAILY_DELETION_QUOTA";
          break;
        }
        wouldDelete += 1;
        outcome = "WOULD_DELETE";
      } else if (verdict.kind === "NOT_ORPHAN") outcome = "WOULD_RESOLVE_NOT_ORPHAN";
      else if (verdict.kind === "TRANSIENT") outcome = "WOULD_RETRY_LATER";
      else if (verdict.kind === "AMBIGUOUS") outcome = "WOULD_RECHECK_THEN_MANUAL_REVIEW";
      else if (verdict.kind === "PERMANENT") outcome = "WOULD_FAIL_MANUAL_REVIEW";
      else outcome = "FATAL_WOULD_STOP_RUN";

      ctx.outcomes.push({ ...base, outcome, code: verdict.code || null, deleted: false });
      if (verdict.kind === "FATAL") {
        ctx.stop = true;
        ctx.stoppedBecause = `FATAL_${verdict.code}`;
      }
    }
  }

  // ---- delete mode ----
  async _runDeleteMode(opts, ctx, started) {
    if (!isAutomaticDeletionEnabled()) {
      ctx.stop = true;
      ctx.stoppedBecause = "AUTOMATIC_DELETION_DISABLED_BY_POLICY";
      return;
    }
    // Housekeeping: expired leases whose attempt budget is used up.
    ctx.sweeps = await guardedWrite("sweepExpiredLeases", null, () =>
      repository.sweepExpiredLeases({ maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS })
    );

    // Recovery: a worker issued DELETE_ISSUED and then lost its lease. Read-only
    // verification only; a delete is NEVER re-issued for these rows.
    const recoverable = await repository.findExpiredDeleteIssued({
      maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS,
      limit: opts.maxCandidates,
    });
    for (const row of recoverable) {
      if (this._outOfBudget(ctx, started, opts)) break;
      ctx.outcomes.push(await this._recoverIssuedDelete(row, ctx));
      ctx.recoveries += 1;
    }

    const due = await repository.findDueForCleanup({
      minAgeHours: POLICY.MIN_ORPHAN_AGE_HOURS,
      maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS,
      limit: opts.maxCandidates,
    });
    const folderChecks = new Map();

    for (const row of due) {
      if (this._outOfBudget(ctx, started, opts)) break;
      const base = { trackingRowId: row.id, driveFileId: row.drive_file_id };

      // The mode is read again before every candidate (and again right before
      // each delete). If it flipped to off, stop deleting.
      const guards = deleteGuardFailures();
      if (guards.length > 0) {
        ctx.stop = true;
        ctx.stoppedBecause = `DELETE_GUARDS_NOT_SATISFIED:${guards.join(",")}`;
        break;
      }
      if (ctx.deletionsThisRun >= opts.maxDeletions) {
        ctx.stop = true;
        ctx.stoppedBecause = "RUN_DELETION_QUOTA";
        break;
      }
      let dailyUsed;
      try {
        dailyUsed = await repository.countActiveQuotaReservations({
          limit: POLICY.MAX_DELETIONS_PER_24H,
          windowHours: POLICY.QUOTA_WINDOW_HOURS,
        });
      } catch (err) {
        ctx.stop = true;
        ctx.stoppedBecause = "QUOTA_CHECK_FAILED";
        ctx.outcomes.push({ ...base, outcome: "SKIPPED_QUOTA_CHECK_FAILED", error: safeErrorMessage(err) });
        break;
      }
      if (dailyUsed >= POLICY.MAX_DELETIONS_PER_24H) {
        ctx.stop = true;
        ctx.stoppedBecause = "DAILY_DELETION_QUOTA";
        break;
      }

      // Circuit breaker, once per folder per run, BEFORE claiming (so a trip
      // does not consume any candidate's attempts).
      let fc = folderChecks.get(row.drive_folder_id);
      if (!fc) {
        fc = await this._checkFolderBreaker(row.drive_folder_id, { persistEvidence: true });
        folderChecks.set(row.drive_folder_id, fc);
        if (fc.ok && fc.tripped) {
          emit(ctx, { type: "CIRCUIT_BREAKER_TRIPPED", driveFolderId: row.drive_folder_id, ...fc });
        }
      }
      if (!fc.ok) {
        ctx.outcomes.push({ ...base, outcome: "SKIPPED_FOLDER_CHECK_FAILED", code: fc.verdict.code });
        if (fc.verdict.kind === "FATAL") {
          ctx.stop = true;
          ctx.stoppedBecause = `FATAL_${fc.verdict.code}`;
        }
        continue;
      }
      if (fc.tripped) {
        ctx.outcomes.push({ ...base, outcome: "ABORTED_CIRCUIT_BREAKER", folder: fc });
        ctx.stop = true;
        ctx.stoppedBecause = "CIRCUIT_BREAKER";
        break;
      }

      ctx.outcomes.push(await this._processCandidate(row, ctx));
    }
  }

  /**
   * Circuit breaker for one folder: of the non-folder files currently listed,
   * how many have no metadata on any header. Trips at >=50% once at least 10
   * files are listed. When it trips (and persistEvidence is set) the folder's
   * claimable candidates are paused and tagged BREAKER_TRIPPED with a summary.
   */
  async _checkFolderBreaker(driveFolderId, { persistEvidence }) {
    let listing;
    try {
      listing = await withTimeout(
        () => googleDriveService.listFilesInFolder(driveFolderId),
        POLICY.DRIVE_LISTING_TIMEOUT_MS,
        "drive.listFilesInFolder"
      );
    } catch (err) {
      return { ok: false, verdict: verdictFromError(err) };
    }
    const files = listing.filter((f) => f.mimeType !== FOLDER_MIME_TYPE);
    if (files.length === 0) return { ok: true, tripped: false, files: 0, withoutMetadata: 0, ratio: 0 };

    let known;
    try {
      known = new Set(await repository.findAttachmentDriveFileIds(files.map((f) => f.fileId)));
    } catch (err) {
      return { ok: false, verdict: verdictFromError(err) };
    }
    const withoutMetadata = files.filter((f) => !known.has(f.fileId)).length;
    const ratio = withoutMetadata / files.length;
    const tripped = files.length >= POLICY.BREAKER_MIN_FILES && ratio >= POLICY.BREAKER_ORPHAN_RATIO;
    if (tripped && persistEvidence) {
      await guardedWrite("holdForBreaker", null, () =>
        repository.holdForBreaker(driveFolderId, {
          summary: `Circuit breaker: ${withoutMetadata} of ${files.length} files in the folder have no spt_attachment metadata (ratio ${ratio.toFixed(2)}).`,
          holdMinutes: POLICY.BREAKER_HOLD_MINUTES,
        })
      );
    }
    return { ok: true, tripped, files: files.length, withoutMetadata, ratio };
  }

  /**
   * Read-only live verification of one candidate. Never writes. Returns a
   * verdict: READY | NOT_ORPHAN | TRANSIENT | AMBIGUOUS | PERMANENT | FATAL.
   * Order: Drive metadata (file, not a folder, recorded parent folder) ->
   * presence in the live folder listing (which excludes Trash) -> the global
   * spt_attachment lookup LAST, so it is the check closest to the delete.
   */
  async _verifyCandidateLive(row) {
    const driveFileId = row.drive_file_id;
    const driveFolderId = row.drive_folder_id;
    if (
      typeof driveFileId !== "string" ||
      driveFileId.trim() === "" ||
      typeof driveFolderId !== "string" ||
      driveFolderId.trim() === ""
    ) {
      return { kind: "PERMANENT", code: RESULT.INVALID_TRACKING_ROW, error: "Tracking row has no usable Drive ids." };
    }

    let file;
    try {
      file = await withTimeout(
        () => googleDriveService.getFile(driveFileId),
        POLICY.DRIVE_OP_TIMEOUT_MS,
        "drive.getFile"
      );
    } catch (err) {
      return verdictFromError(err);
    }
    if (!file || typeof file.mimeType !== "string" || !Array.isArray(file.parentFolderIds)) {
      return { kind: "AMBIGUOUS", code: "DRIVE_METADATA_MALFORMED", error: "Drive file metadata was not usable." };
    }
    if (file.mimeType === FOLDER_MIME_TYPE) {
      return { kind: "PERMANENT", code: RESULT.TARGET_IS_FOLDER, error: "Target is a folder; refusing to delete." };
    }
    if (!file.parentFolderIds.includes(driveFolderId)) {
      return {
        kind: "PERMANENT",
        code: RESULT.PARENT_FOLDER_MISMATCH,
        error: "Drive file is not inside the recorded application-managed folder.",
      };
    }

    let listing;
    try {
      listing = await withTimeout(
        () => googleDriveService.listFilesInFolder(driveFolderId),
        POLICY.DRIVE_LISTING_TIMEOUT_MS,
        "drive.listFilesInFolder"
      );
    } catch (err) {
      return verdictFromError(err);
    }
    if (!listing.some((f) => f.fileId === driveFileId)) {
      return {
        kind: "AMBIGUOUS",
        code: "NOT_IN_FOLDER_LISTING",
        error: "File is not in the live folder listing (trashed, moved, or not visible to the app).",
      };
    }

    let known;
    try {
      known = await repository.findAttachmentDriveFileIds([driveFileId]);
    } catch (err) {
      return verdictFromError(err);
    }
    if (known.includes(driveFileId)) return { kind: "NOT_ORPHAN", code: "HAS_METADATA" };

    return { kind: "READY", code: "READY" };
  }

  /** One candidate in delete mode: claim -> verify -> marker -> delete -> record. */
  async _processCandidate(row, ctx) {
    const id = row.id;
    const base = { trackingRowId: id, driveFileId: row.drive_file_id };

    // Policy guard before ANY state change: no claim (so no attempt is
    // consumed), no quota reservation, no marker.
    if (!isAutomaticDeletionEnabled()) {
      ctx.stop = true;
      ctx.stoppedBecause = "AUTOMATIC_DELETION_DISABLED_BY_POLICY";
      return { ...base, outcome: "SKIPPED_AUTOMATIC_DELETION_DISABLED", deleted: false };
    }

    const token = await guardedWrite("claim", id, () =>
      repository.claimForCleanup(id, row.cleanup_attempt_count, {
        leaseMinutes: POLICY.LEASE_MINUTES,
        maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS,
        minAgeHours: POLICY.MIN_ORPHAN_AGE_HOURS,
      })
    );
    if (token === null) return { ...base, outcome: "SKIPPED_NOT_CLAIMED", deleted: false };
    base.attempt = token;
    emit(ctx, { type: "CLEANUP_CLAIMED", ...base });

    const verdict = await this._verifyCandidateLive(row);
    if (verdict.kind !== "READY") return this._applyNonReadyVerdict(row, token, verdict, ctx, base);

    // Mode and guards are read again right before the delete.
    const guards = deleteGuardFailures();
    if (guards.length > 0) {
      ctx.stop = true;
      ctx.stoppedBecause = `DELETE_GUARDS_NOT_SATISFIED:${guards.join(",")}`;
      return this._retryLater(row, token, RESULT.CLEANUP_MODE_DISABLED, `Guards not satisfied: ${guards.join(",")}`, POLICY.FATAL_RELEASE_MINUTES, base);
    }

    // Quota is reserved BEFORE the DELETE_ISSUED marker and before any Drive
    // call. A reservation is never released by code (see
    // repository.reserveQuotaSlot()): if anything below fails, or this worker
    // dies, it keeps its slot until the 24h window passes. If the reservation
    // cannot be established (quota full, or ANY database error, including an
    // uncertain outcome), nothing is sent to Drive. The row has no marker yet,
    // so releasing it for a later attempt is still permitted.
    let reservation;
    try {
      reservation = await repository.reserveQuotaSlot({
        driveFileId: row.drive_file_id,
        limit: POLICY.MAX_DELETIONS_PER_24H,
        windowHours: POLICY.QUOTA_WINDOW_HOURS,
      });
    } catch (err) {
      ctx.stop = true;
      ctx.stoppedBecause = "QUOTA_RESERVATION_FAILED";
      return this._retryLater(row, token, RESULT.QUOTA_RECHECK_FAILED, safeErrorMessage(err), 60, base);
    }
    if (!reservation.reserved) {
      ctx.stop = true;
      ctx.stoppedBecause = "DAILY_DELETION_QUOTA";
      return this._retryLater(row, token, RESULT.DAILY_QUOTA_EXCEEDED, "Rolling 24h delete-request quota is fully reserved.", 60, base);
    }
    base.quotaSlot = reservation.slotNo;

    // Fenced marker: still the token holder, lease valid (database clock),
    // still >= 24h old. Written AFTER the quota reservation and BEFORE the
    // delete. From here on there is no path back to CLEANUP_PENDING: the
    // repository refuses every transient/pre-marker update on this row.
    const issued = await guardedWrite("markDeleteIssued", id, () =>
      repository.markDeleteIssued(id, token, {
        leaseMinutes: POLICY.LEASE_MINUTES,
        minAgeHours: POLICY.MIN_ORPHAN_AGE_HOURS,
      })
    );
    if (issued !== 1) {
      return { ...base, outcome: "LOST_LEASE_OR_INELIGIBLE_BEFORE_DELETE", deleted: false };
    }
    ctx.deletionsThisRun += 1;

    let deleteResponse;
    try {
      deleteResponse = await withTimeout(
        () => this._issueDriveDelete(row.drive_file_id),
        POLICY.DRIVE_OP_TIMEOUT_MS,
        "drive.deleteFile"
      );
    } catch (err) {
      return this._handleDeleteFailure(row, token, err, ctx, base);
    }

    // Success only on a confirmed response for THIS file id.
    if (!deleteResponse || deleteResponse.deleted !== true || deleteResponse.fileId !== row.drive_file_id) {
      // A delete WAS issued but its response did not confirm this file: uncertain
      // outcome. Read-only verification only; never another delete.
      const verified = await this._readOnlyVerifyAfterIssue(
        row,
        `${RESULT.DELETE_RESPONSE_NOT_CONFIRMED}: the delete call resolved without a confirmation for this file id.`
      );
      return this._terminalAfterIssue(row, token, verified.result, verified.detail, base, null);
    }

    let recorded;
    try {
      recorded = await repository.finishSuccess(id, token);
    } catch (err) {
      ctx.outcomes.push({
        ...base,
        outcome: "DELETE_CONFIRMED_STATE_UPDATE_FAILED",
        deleted: true,
        error: safeErrorMessage(err),
      });
      ctx.stop = true;
      ctx.stoppedBecause = "STATE_WRITE_FAILED";
      // Never reported as CLEANUP_SUCCESS and never retried: the DELETE_ISSUED
      // marker stays, and recovery will send the row to manual review.
      throw new CleanupStateWriteError(err, { trackingRowId: id, operation: "finishSuccess", deleteConfirmed: true });
    }
    if (recorded !== 1) {
      return { ...base, outcome: "DELETE_CONFIRMED_STATE_NOT_RECORDED", deleted: true };
    }
    emit(ctx, { type: "CLEANUP_SUCCESS", ...base });
    return { ...base, outcome: STATUS.CLEANUP_SUCCESS, deleted: true };
  }

  /**
   * The ONLY place in this file that calls googleDriveService.deleteFile().
   * The policy switch is checked here, immediately before the request, as the
   * last line of defence. Earlier guards make this unreachable while the
   * switch is off; if it were ever reached, no request is sent.
   */
  async _issueDriveDelete(driveFileId) {
    if (!isAutomaticDeletionEnabled()) throw new AutomaticDeletionDisabledError();
    return googleDriveService.deleteFile(driveFileId);
  }

  _backoffMinutes(token) {
    const list = POLICY.TRANSIENT_BACKOFF_MINUTES;
    return list[Math.min(Math.max(token, 1) - 1, list.length - 1)];
  }

  async _retryLater(row, token, result, error, delayMinutes, base) {
    const n = await guardedWrite("finishTransient", row.id, () =>
      repository.finishTransient(row.id, token, { result: fitResult(result), error, delayMinutes })
    );
    if (n !== 1) return { ...base, outcome: "LOST_LEASE", deleted: false };
    return { ...base, outcome: "RETRY_SCHEDULED", result: fitResult(result), retryInMinutes: delayMinutes, deleted: false };
  }

  async _terminal(row, token, result, error, base) {
    const n = await guardedWrite("finishTerminal", row.id, () =>
      repository.finishTerminal(row.id, token, { result: fitResult(result), error })
    );
    if (n !== 1) return { ...base, outcome: "LOST_LEASE", deleted: false };
    return { ...base, outcome: STATUS.CLEANUP_FAILED, result: fitResult(result), error: String(error).slice(0, 300), deleted: false };
  }

  /** Non-READY verdicts, before any delete marker exists. */
  async _applyNonReadyVerdict(row, token, verdict, ctx, base) {
    const exhausted = token >= POLICY.MAX_CLEANUP_ATTEMPTS;

    if (verdict.kind === "NOT_ORPHAN") {
      const n = await guardedWrite("deleteClaimedById", row.id, () => repository.deleteClaimedById(row.id, token));
      emit(ctx, { type: "ORPHAN_RESOLVED_HAS_METADATA", ...base });
      return n === 1
        ? { ...base, outcome: "RESOLVED_NOT_ORPHAN", deleted: false }
        : { ...base, outcome: "LOST_LEASE", deleted: false };
    }

    if (verdict.kind === "PERMANENT") {
      return this._terminal(row, token, verdict.code, verdict.error, base);
    }

    if (verdict.kind === "FATAL") {
      // Stop the run so one environment problem does not burn every candidate's
      // attempts; only this already-claimed candidate pays one attempt.
      ctx.stop = true;
      ctx.stoppedBecause = `FATAL_${verdict.code}`;
      return this._retryLater(row, token, `FATAL_${verdict.code}`, verdict.error, POLICY.FATAL_RELEASE_MINUTES, base);
    }

    if (verdict.kind === "TRANSIENT") {
      if (verdict.stopRun) {
        ctx.stop = true;
        ctx.stoppedBecause = `INFRA_${verdict.code}`;
      }
      if (exhausted) return this._terminal(row, token, RESULT.RETRIES_EXHAUSTED, `${verdict.code}: ${verdict.error}`, base);
      return this._retryLater(row, token, verdict.code, verdict.error, this._backoffMinutes(token), base);
    }

    // AMBIGUOUS: at most one delayed read-only recheck, then manual review.
    // A 404 / not-in-listing is never treated as "already gone".
    const alreadyRechecked = typeof row.last_result === "string" && row.last_result.startsWith("AMBIGUOUS_");
    if (alreadyRechecked || exhausted) {
      return this._terminal(row, token, RESULT.AMBIGUOUS_UNRESOLVED, `${verdict.code}: ${verdict.error}`, base);
    }
    return this._retryLater(row, token, `AMBIGUOUS_${verdict.code}`, verdict.error, POLICY.AMBIGUOUS_RECHECK_MINUTES, base);
  }

  /**
   * A delete request was issued (marker written). Whatever went wrong, there is
   * NO automatic retry and NO transition back to an automatically deletable
   * state: the row ends in CLEANUP_FAILED (manual review) with a result code
   * that records that a delete was issued. A rate limit (HTTP 429) is treated
   * the same way: the request was rejected, but a second automatic delete for
   * the same record is not permitted.
   */
  async _handleDeleteFailure(row, token, err, ctx, base) {
    const c = classifyError(err, { duringDelete: true });
    const message = safeErrorMessage(err);
    if (c.kind === "fatal") {
      ctx.stop = true;
      ctx.stoppedBecause = `FATAL_${c.code}`;
    }

    if (c.kind === "transient") {
      return this._terminalAfterIssue(
        row,
        token,
        RESULT.DELETE_RATE_LIMITED,
        `${c.code}: ${message}. The delete request was issued once; no automatic re-delete. Manual re-queue required.`,
        base,
        false
      );
    }
    if (c.kind === "fatal" || c.kind === "permanent") {
      return this._terminalAfterIssue(row, token, RESULT.DELETE_REJECTED, `${c.code}: ${message}`, base, false);
    }
    // Ambiguous (timeout, connection loss, 5xx, 404, unclassified): the delete
    // may or may not have been executed. Read-only verification only.
    const verified = await this._readOnlyVerifyAfterIssue(row, `${c.code}: ${message}.`);
    return this._terminalAfterIssue(row, token, verified.result, verified.detail, base, null);
  }

  /**
   * Read-only look at the file after a delete was issued with an uncertain
   * outcome. Never deletes and never reports success: a 404 or an absent file
   * is NOT confirmation (the response of the delete call is the only evidence
   * of success, and it is not available here).
   * @returns {Promise<{result: string, detail: string}>}
   */
  async _readOnlyVerifyAfterIssue(row, context) {
    let result = RESULT.DELETE_OUTCOME_UNCONFIRMED;
    let detail = `${context} The delete outcome could not be established; manual review required.`;
    try {
      await withTimeout(
        () => googleDriveService.getFile(row.drive_file_id),
        POLICY.DRIVE_OP_TIMEOUT_MS,
        "drive.getFile"
      );
      const listing = await withTimeout(
        () => googleDriveService.listFilesInFolder(row.drive_folder_id),
        POLICY.DRIVE_LISTING_TIMEOUT_MS,
        "drive.listFilesInFolder"
      );
      if (listing.some((f) => f.fileId === row.drive_file_id)) {
        result = RESULT.DELETE_ISSUED_FILE_STILL_PRESENT;
        detail = `${context} The file is still present; no automatic re-delete is performed, manual review required.`;
      }
    } catch (err) {
      detail += ` Verification: ${classifyError(err).code}: ${safeErrorMessage(err)}`;
    }
    return { result, detail };
  }

  /**
   * Fenced end of a row that issued a delete: CLEANUP_FAILED with a
   * delete-evidence result code. `deleted` is false when the request is known
   * to have been rejected, null when the outcome is unknown.
   */
  async _terminalAfterIssue(row, token, result, error, base, deletedFlag) {
    const n = await guardedWrite("finishTerminalAfterIssue", row.id, () =>
      repository.finishTerminalAfterIssue(row.id, token, { result: fitResult(result), error })
    );
    if (n !== 1) {
      // Not ours any more: the row is left exactly as it is, marker intact.
      return { ...base, outcome: "LOST_LEASE_AFTER_DELETE_ISSUED", deleted: deletedFlag };
    }
    return {
      ...base,
      outcome: STATUS.CLEANUP_FAILED,
      result: fitResult(result),
      error: String(error).slice(0, 300),
      deleted: deletedFlag,
    };
  }

  /**
   * Recovery for a row whose lease expired after DELETE_ISSUED. Claims it
   * (fenced), performs read-only verification, and ALWAYS ends in
   * CLEANUP_FAILED for manual review. It never issues another delete and never
   * records success: a 404 is not confirmation, and nothing here saw a
   * confirmed delete response.
   */
  async _recoverIssuedDelete(row, ctx) {
    const id = row.id;
    const base = { trackingRowId: id, driveFileId: row.drive_file_id, recovery: true };
    const token = await guardedWrite("claimRecovery", id, () =>
      repository.claimForCleanup(id, row.cleanup_attempt_count, {
        leaseMinutes: POLICY.LEASE_MINUTES,
        maxAttempts: POLICY.MAX_CLEANUP_ATTEMPTS,
        minAgeHours: POLICY.MIN_ORPHAN_AGE_HOURS,
        recovery: true,
      })
    );
    if (token === null) return { ...base, outcome: "SKIPPED_NOT_CLAIMED", deleted: null };
    base.attempt = token;

    const verified = await this._readOnlyVerifyAfterIssue(row, "Lease expired after DELETE_ISSUED.");
    emit(ctx, { type: "DELETE_ISSUED_RECOVERED_TO_MANUAL_REVIEW", ...base, result: verified.result });
    return this._terminalAfterIssue(row, token, verified.result, verified.detail, base, null);
  }
}

module.exports = new SptAttachmentReconciliationService();
module.exports.SptAttachmentReconciliationService = SptAttachmentReconciliationService;
module.exports.errors = {
  ReconciliationValidationError,
  ReconciliationSchemaNotReadyError,
  CleanupStateWriteError,
  AutomaticDeletionDisabledError,
};
module.exports.STATUS = STATUS; // kept for compatibility with the previous export
module.exports.constants = { STATUS, RESULT, MODES, POLICY, AUTOMATIC_DELETION_ENABLED };
