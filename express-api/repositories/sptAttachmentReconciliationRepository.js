/**
 * SptAttachmentReconciliationRepository
 *
 * Persistence / Data Access Layer for spt_attachment_reconciliation (G2.6-H).
 * It does NOT call Google Drive, does NOT resolve ownership, does NOT decide
 * what counts as an orphan and does NOT delete Drive files. Every number that
 * encodes policy (minimum age, lease length, attempt limit, backoff) is passed
 * in by SptAttachmentReconciliationService; this file only turns them into
 * conditional SQL. It does not own transactions: options.transaction is only
 * forwarded.
 *
 * Time: every "now" in this file is the DATABASE clock (CURRENT_TIMESTAMP),
 * never an application-node Date, for ages, leases, backoff and quotas. The
 * explicit `updated_at` literal plus `silent: true` stops Sequelize from
 * stamping the application clock on these writes.
 *
 * Concurrency: claims and every state change after a claim are single
 * conditional UPDATE statements (compare-and-swap on cleanup_attempt_count),
 * not find-then-update. A worker whose token is stale simply matches 0 rows.
 *
 * SQL assumptions to confirm on TiDB (only CURRENT_TIMESTAMP has precedent in
 * this project's migrations): DATE_ADD/DATE_SUB with INTERVAL, and
 * "affected rows" counting. checkDbTimeSupport() lets the service fail closed
 * if the interval expressions are not usable. Every state-changing UPDATE here
 * always changes at least one column value, so a matched row is reported as
 * affected under either affected-rows convention.
 *
 * DELETE_ISSUED is irreversible for automatic deletion. Once a row carries it,
 * NO method here can clear or overwrite it except the single exit that ends
 * the row in CLEANUP_FAILED / CLEANUP_SUCCESS (finishTerminalAfterIssue /
 * finishSuccess). claim, selection, pause, transient release, resolve-delete
 * and pre-marker terminal updates all carry a NOT_DELETE_ISSUED predicate in
 * their WHERE clause, so the rule holds even if a caller misbehaves.
 *
 * Delete-request quota: see reserveQuotaSlot() (fixed slot rows, one
 * conditional UPDATE per slot) - never a COUNT followed by a write.
 *
 * Like spt_attachment, this table has NO deleted_at column.
 */

const { Sequelize, Op, QueryTypes, UniqueConstraintError } = require("sequelize");
const spt_attachment_reconciliation = require("../models/spt_attachment_reconciliation.model");
// Read-only use below (findAttachmentDriveFileIds): sptAttachmentRepository is
// locked and has no drive_file_id lookup, so spt_attachment is read here.
const spt_attachment = require("../models/spt_attachment.model");
// Read-only use below (findReconciliationUnits): enumerates active headers.
const spt_header = require("../models/spt_header.model");
// Persistent delete-request quota slots (see reserveQuotaSlot()).
const spt_attachment_delete_quota_slot = require("../models/spt_attachment_delete_quota_slot.model");

// Persistence-level vocabulary. The MEANING of each value belongs to the
// service; they live here only because conditional SQL has to name them.
const STATUS = Object.freeze({
  ORPHAN_CANDIDATE: "ORPHAN_CANDIDATE",
  CLEANUP_PENDING: "CLEANUP_PENDING",
  CLEANUP_SUCCESS: "CLEANUP_SUCCESS",
  CLEANUP_FAILED: "CLEANUP_FAILED",
});

const RESULT = Object.freeze({
  DELETE_ISSUED: "DELETE_ISSUED",
  DELETED: "DELETED",
  DELETE_OUTCOME_UNCONFIRMED: "DELETE_OUTCOME_UNCONFIRMED",
  DELETE_ISSUED_FILE_STILL_PRESENT: "DELETE_ISSUED_FILE_STILL_PRESENT",
  DELETE_REJECTED: "DELETE_REJECTED",
  DELETE_RATE_LIMITED: "DELETE_RATE_LIMITED",
  LEASE_EXPIRED_MAX_ATTEMPTS: "LEASE_EXPIRED_MAX_ATTEMPTS",
  BREAKER_TRIPPED: "BREAKER_TRIPPED",
});

// The only results a row may end with after DELETE_ISSUED was written. Each
// of them means "a Drive delete request was issued (or may have been)", so a
// terminal row keeps that evidence in its own result code.
const DELETE_EVIDENCE_RESULTS = Object.freeze([
  RESULT.DELETE_OUTCOME_UNCONFIRMED,
  RESULT.DELETE_ISSUED_FILE_STILL_PRESENT,
  RESULT.DELETE_REJECTED,
  RESULT.DELETE_RATE_LIMITED,
]);

const REQUIRED_NEW_COLUMNS = Object.freeze([
  "cleanup_attempt_count",
  "cleanup_not_before_at",
  "last_result",
]);

const UNIQUE_INDEX_NAME = "uq_spt_attachment_reconciliation_drive_file_id";

// The project's sequelizeconf.js sets `retry: { max: 30 }` with no `match`;
// Sequelize then replaces its default retry options, so EVERY failed query
// (duplicate key, missing column, ...) is retried up to ~30 times. For this
// repository's queries that is overridden per query: a few retries, and only
// for errors that look transient. sequelizeconf.js itself is untouched.
const DB_RETRY = Object.freeze({
  max: 3,
  match: [
    /ECONNRESET|ETIMEDOUT|PROTOCOL_CONNECTION_LOST|ER_LOCK_DEADLOCK|ER_LOCK_WAIT_TIMEOUT|Deadlock found|Lock wait timeout/i,
  ],
});

// ---- database-clock expressions -------------------------------------------
const NOW = Sequelize.literal("CURRENT_TIMESTAMP");

function toSafeInt(value, label) {
  if (!Number.isInteger(value) || value < 0 || value > 1000000) {
    throw new TypeError(`${label} must be a non-negative integer`);
  }
  return value;
}
const dbAddMinutes = (minutes) =>
  Sequelize.literal(`DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${toSafeInt(minutes, "minutes")} MINUTE)`);
const dbSubHours = (hours) =>
  Sequelize.literal(`DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ${toSafeInt(hours, "hours")} HOUR)`);

// ---- reusable predicates ----------------------------------------------------
const LEASE_FREE = {
  [Op.or]: [{ cleanup_not_before_at: null }, { cleanup_not_before_at: { [Op.lte]: NOW } }],
};
const NOT_DELETE_ISSUED = {
  [Op.or]: [{ last_result: null }, { last_result: { [Op.ne]: RESULT.DELETE_ISSUED } }],
};

function isDriveFileIdDuplicate(err) {
  if (!(err instanceof UniqueConstraintError)) return false;
  const fields = err.fields || {};
  if (Object.prototype.hasOwnProperty.call(fields, "drive_file_id")) return true;
  if (Object.prototype.hasOwnProperty.call(fields, UNIQUE_INDEX_NAME)) return true;
  const text = String(err.message || "") + String((err.parent && err.parent.message) || "");
  return text.includes(UNIQUE_INDEX_NAME);
}

// One conditional UPDATE using the database clock. Returns affected rows.
async function conditionalUpdate(values, where, options = {}) {
  const { transaction } = options;
  const [affected] = await spt_attachment_reconciliation.update(
    { ...values, updated_at: NOW },
    { where, silent: true, transaction, retry: DB_RETRY }
  );
  return affected;
}

class SptAttachmentReconciliationRepository {
  // ---------------------------------------------------------------------
  // Plain reads
  // ---------------------------------------------------------------------

  /** @returns {Promise<Model|null>} */
  async findById(id, options = {}) {
    const { transaction } = options;
    return spt_attachment_reconciliation.findOne({ where: { id }, transaction, retry: DB_RETRY });
  }

  /**
   * Single-row finder, allowed because drive_file_id is UNIQUE.
   * @returns {Promise<Model|null>}
   */
  async findByDriveFileId(drive_file_id, options = {}) {
    const { transaction } = options;
    return spt_attachment_reconciliation.findOne({
      where: { drive_file_id },
      transaction,
      retry: DB_RETRY,
    });
  }

  // ---------------------------------------------------------------------
  // Global metadata lookup (READ-ONLY, all headers)
  // ---------------------------------------------------------------------

  /**
   * Of the given Drive file ids, return those recorded as
   * spt_attachment.drive_file_id on ANY header. Never filtered by header: a
   * Section I folder can be shared by several headers. spt_attachment has no
   * index on drive_file_id, so this is a table scan.
   * @returns {Promise<string[]>}
   */
  async findAttachmentDriveFileIds(driveFileIds, options = {}) {
    const { transaction } = options;
    if (!Array.isArray(driveFileIds) || driveFileIds.length === 0) return [];
    const rows = await spt_attachment.findAll({
      attributes: ["drive_file_id"],
      where: { drive_file_id: driveFileIds }, // array value => SQL IN (...)
      transaction,
      retry: DB_RETRY,
    });
    return rows.map((row) => row.drive_file_id);
  }

  // ---------------------------------------------------------------------
  // Preflight (fail-closed support)
  // ---------------------------------------------------------------------

  /**
   * Whether all columns added by the G2.6-H migration exist.
   * @returns {Promise<{ready: boolean, missing: string[]}>}
   */
  async getSchemaStatus() {
    const queryInterface = spt_attachment_reconciliation.sequelize.getQueryInterface();
    const description = await queryInterface.describeTable(
      spt_attachment_reconciliation.getTableName(),
      { retry: { max: 1 } }
    );
    const missing = REQUIRED_NEW_COLUMNS.filter((c) => !Object.prototype.hasOwnProperty.call(description, c));
    return { ready: missing.length === 0, missing };
  }

  /**
   * Whether the database accepts the CURRENT_TIMESTAMP/INTERVAL expressions
   * the lease logic depends on. Read-only SELECT.
   * @returns {Promise<boolean>}
   */
  async checkDbTimeSupport() {
    const rows = await spt_attachment_reconciliation.sequelize.query(
      "SELECT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 MINUTE) AS plus_one, " +
        "DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR) AS minus_one",
      { type: QueryTypes.SELECT, retry: { max: 1 } }
    );
    return (
      Array.isArray(rows) && rows.length === 1 && rows[0].plus_one != null && rows[0].minus_one != null
    );
  }

  // ---------------------------------------------------------------------
  // Detection (reconcile)
  // ---------------------------------------------------------------------

  /**
   * Insert a first detection (ORPHAN_CANDIDATE). first/last_detected_at and
   * the Sequelize timestamps are written with the database clock. A duplicate
   * on drive_file_id (another run created it first) is NOT an error: the
   * existing row is returned with created=false. Any other error, including
   * a unique violation on a different key, is rethrown unchanged.
   * @returns {Promise<{created: boolean, row: Model}>}
   */
  async createDetected({ header_id, drive_file_id, drive_folder_id }, options = {}) {
    const { transaction } = options;
    try {
      const row = await spt_attachment_reconciliation.create(
        {
          header_id,
          drive_file_id,
          drive_folder_id,
          status: STATUS.ORPHAN_CANDIDATE,
          first_detected_at: NOW,
          last_detected_at: NOW,
          created_at: NOW,
          updated_at: NOW,
        },
        { transaction, silent: true, retry: DB_RETRY }
      );
      return { created: true, row };
    } catch (err) {
      if (!isDriveFileIdDuplicate(err)) throw err;
      const existing = await this.findByDriveFileId(drive_file_id, { transaction });
      if (!existing) throw err; // reported as duplicate but not found: do not hide it
      return { created: false, row: existing };
    }
  }

  /**
   * Refresh last_detected_at only (never first_detected_at), and only while
   * the row still has the expected status.
   * @returns {Promise<number>} 0 or 1
   */
  async touchDetected(id, expectedStatus, options = {}) {
    return conditionalUpdate({ last_detected_at: NOW }, { id, status: expectedStatus }, options);
  }

  /**
   * ORPHAN_CANDIDATE -> CLEANUP_PENDING, only when first_detected_at is at
   * least minAgeHours old by the DATABASE clock. Idempotent and safe under
   * concurrent runs: at most one caller matches, the rest get 0.
   * @returns {Promise<number>} 1 if promoted by this call, else 0
   */
  async promoteIfEligible(id, { minAgeHours }, options = {}) {
    return conditionalUpdate(
      { status: STATUS.CLEANUP_PENDING, last_detected_at: NOW },
      {
        id,
        status: STATUS.ORPHAN_CANDIDATE,
        first_detected_at: { [Op.lte]: dbSubHours(minAgeHours) },
      },
      options
    );
  }

  /**
   * Remove a tracking row whose Drive file turned out to have metadata, but
   * ONLY if it is still an unclaimed-for-delete candidate: status
   * ORPHAN_CANDIDATE/CLEANUP_PENDING and no DELETE_ISSUED marker. Rows in a
   * terminal state or carrying DELETE_ISSUED are kept as evidence.
   * @returns {Promise<number>} rows removed
   */
  async deleteResolvableById(id, options = {}) {
    const { transaction } = options;
    return spt_attachment_reconciliation.destroy({
      where: {
        [Op.and]: [
          { id },
          { status: { [Op.in]: [STATUS.ORPHAN_CANDIDATE, STATUS.CLEANUP_PENDING] } },
          NOT_DELETE_ISSUED,
        ],
      },
      transaction,
      retry: DB_RETRY,
    });
  }

  // ---------------------------------------------------------------------
  // Bounded candidate selection
  // ---------------------------------------------------------------------

  /**
   * Candidates that may be claimed now: CLEANUP_PENDING, old enough, attempts
   * left, lease/backoff elapsed, and WITHOUT a DELETE_ISSUED marker (those are
   * recovery-only and never re-deleted). Oldest first, always bounded.
   * @returns {Promise<Model[]>}
   */
  async findDueForCleanup({ minAgeHours, maxAttempts, limit }, options = {}) {
    const { transaction } = options;
    return spt_attachment_reconciliation.findAll({
      where: {
        [Op.and]: [
          { status: STATUS.CLEANUP_PENDING },
          { first_detected_at: { [Op.lte]: dbSubHours(minAgeHours) } },
          { cleanup_attempt_count: { [Op.lt]: maxAttempts } },
          LEASE_FREE,
          NOT_DELETE_ISSUED,
        ],
      },
      order: [
        ["first_detected_at", "ASC"],
        ["id", "ASC"],
      ],
      limit: toSafeInt(limit, "limit"),
      transaction,
      retry: DB_RETRY,
    });
  }

  /**
   * Rows whose worker issued a delete marker and then lost its lease
   * (crash/timeout) while attempts remain. Recovery is read-only
   * verification plus a terminal state; there is never a second delete.
   * @returns {Promise<Model[]>}
   */
  async findExpiredDeleteIssued({ maxAttempts, limit }, options = {}) {
    const { transaction } = options;
    return spt_attachment_reconciliation.findAll({
      where: {
        [Op.and]: [
          { status: STATUS.CLEANUP_PENDING },
          { last_result: RESULT.DELETE_ISSUED },
          { cleanup_attempt_count: { [Op.lt]: maxAttempts } },
          LEASE_FREE,
        ],
      },
      order: [["id", "ASC"]],
      limit: toSafeInt(limit, "limit"),
      transaction,
      retry: DB_RETRY,
    });
  }

  /**
   * Send every stuck row whose lease has expired and whose attempts are
   * exhausted to the terminal manual-review state (CLEANUP_FAILED). Two
   * conditional UPDATEs (set-based, bounded by the table's pending rows).
   * @returns {Promise<{deleteOutcomeUnconfirmed: number, leaseExpiredMaxAttempts: number}>}
   */
  async sweepExpiredLeases({ maxAttempts }, options = {}) {
    const exhausted = { cleanup_attempt_count: { [Op.gte]: maxAttempts } };

    const deleteOutcomeUnconfirmed = await conditionalUpdate(
      {
        status: STATUS.CLEANUP_FAILED,
        last_result: RESULT.DELETE_OUTCOME_UNCONFIRMED,
        last_error:
          "Lease expired after DELETE_ISSUED with the attempt budget used up; the delete outcome was not established. Manual review required.",
        cleanup_not_before_at: null,
      },
      {
        [Op.and]: [
          { status: STATUS.CLEANUP_PENDING },
          { last_result: RESULT.DELETE_ISSUED },
          exhausted,
          LEASE_FREE,
        ],
      },
      options
    );

    const leaseExpiredMaxAttempts = await conditionalUpdate(
      {
        status: STATUS.CLEANUP_FAILED,
        last_result: RESULT.LEASE_EXPIRED_MAX_ATTEMPTS,
        last_error:
          "Lease expired with the attempt budget used up (a worker may have stopped mid-attempt). Manual review required.",
        cleanup_not_before_at: null,
      },
      {
        [Op.and]: [{ status: STATUS.CLEANUP_PENDING }, exhausted, LEASE_FREE, NOT_DELETE_ISSUED],
      },
      options
    );

    return { deleteOutcomeUnconfirmed, leaseExpiredMaxAttempts };
  }

  // ---------------------------------------------------------------------
  // Lease, fencing and state transitions (single conditional UPDATEs)
  // ---------------------------------------------------------------------

  /**
   * Atomically claim one candidate. Compare-and-swap on the attempt count the
   * caller read: only one of several racing workers can match. On success the
   * count is incremented (that value is the fencing token) and the lease
   * (cleanup_not_before_at) is set from the database clock.
   *
   * Normal claim: eligible, old enough, no DELETE_ISSUED marker.
   * Recovery claim (recovery=true): requires the DELETE_ISSUED marker and an
   * expired lease; no age condition (the delete was already issued).
   *
   * @returns {Promise<number|null>} the new token, or null if not claimed
   */
  async claimForCleanup(id, expectedCount, { leaseMinutes, maxAttempts, minAgeHours, recovery = false }, options = {}) {
    toSafeInt(expectedCount, "expectedCount");
    const and = [
      { id },
      { status: STATUS.CLEANUP_PENDING },
      { cleanup_attempt_count: expectedCount },
      { cleanup_attempt_count: { [Op.lt]: maxAttempts } },
      LEASE_FREE,
    ];
    if (recovery) {
      and.push({ last_result: RESULT.DELETE_ISSUED });
    } else {
      and.push(NOT_DELETE_ISSUED);
      and.push({ first_detected_at: { [Op.lte]: dbSubHours(minAgeHours) } });
    }
    const affected = await conditionalUpdate(
      {
        cleanup_attempt_count: Sequelize.literal("cleanup_attempt_count + 1"),
        cleanup_attempted_at: NOW,
        cleanup_not_before_at: dbAddMinutes(leaseMinutes),
      },
      { [Op.and]: and },
      options
    );
    return affected === 1 ? expectedCount + 1 : null;
  }

  /**
   * Fenced pre-delete step: still the token holder, lease still valid by the
   * database clock, still old enough. Writes the DELETE_ISSUED marker (which
   * also changes the row, so a match is always counted) and renews the lease.
   * @returns {Promise<number>} 1 only if the delete may now be issued
   */
  async markDeleteIssued(id, token, { leaseMinutes, minAgeHours }, options = {}) {
    return conditionalUpdate(
      {
        last_result: RESULT.DELETE_ISSUED,
        cleanup_not_before_at: dbAddMinutes(leaseMinutes),
      },
      {
        [Op.and]: [
          { id },
          { status: STATUS.CLEANUP_PENDING },
          { cleanup_attempt_count: token },
          { cleanup_not_before_at: { [Op.gt]: NOW } },
          { first_detected_at: { [Op.lte]: dbSubHours(minAgeHours) } },
          NOT_DELETE_ISSUED,
        ],
      },
      options
    );
  }

  /**
   * Fenced success: only after a confirmed Drive delete response, and only
   * while this worker still holds the token and the marker.
   * @returns {Promise<number>} 0 or 1
   */
  async finishSuccess(id, token, options = {}) {
    return conditionalUpdate(
      {
        status: STATUS.CLEANUP_SUCCESS,
        cleaned_at: NOW,
        last_result: RESULT.DELETED,
        last_error: null,
        cleanup_not_before_at: null,
      },
      {
        id,
        status: STATUS.CLEANUP_PENDING,
        cleanup_attempt_count: token,
        last_result: RESULT.DELETE_ISSUED,
      },
      options
    );
  }

  /**
   * Fenced transient release: stays CLEANUP_PENDING, not claimable until the
   * backoff (database clock) has elapsed. It can NEVER touch a row that has
   * the DELETE_ISSUED marker (NOT_DELETE_ISSUED is part of the WHERE clause):
   * after the marker is written there is no transient path back to an
   * automatically deletable state.
   * @returns {Promise<number>} 0 or 1 (0 also when the row carries the marker)
   */
  async finishTransient(id, token, { result, error, delayMinutes }, options = {}) {
    return conditionalUpdate(
      {
        last_result: result,
        last_error: error == null ? null : String(error).slice(0, 1000),
        cleanup_not_before_at: dbAddMinutes(delayMinutes),
      },
      {
        [Op.and]: [
          { id },
          { status: STATUS.CLEANUP_PENDING },
          { cleanup_attempt_count: token },
          NOT_DELETE_ISSUED,
        ],
      },
      options
    );
  }

  /**
   * Fenced terminal state for rows that have NOT issued a delete:
   * CLEANUP_FAILED = manual review. Refuses (0 rows) a row that carries the
   * DELETE_ISSUED marker; use finishTerminalAfterIssue() for those.
   * @returns {Promise<number>} 0 or 1
   */
  async finishTerminal(id, token, { result, error }, options = {}) {
    return conditionalUpdate(
      {
        status: STATUS.CLEANUP_FAILED,
        last_result: result,
        last_error: error == null ? null : String(error).slice(0, 1000),
        cleanup_not_before_at: null,
      },
      {
        [Op.and]: [
          { id },
          { status: STATUS.CLEANUP_PENDING },
          { cleanup_attempt_count: token },
          NOT_DELETE_ISSUED,
        ],
      },
      options
    );
  }

  /**
   * The ONLY way out of DELETE_ISSUED other than finishSuccess(): fenced move
   * to CLEANUP_FAILED (manual review) with a result code that itself records
   * that a delete request was issued. Never returns the row to an automatically
   * deletable state. Rejects any result that is not delete-evidence.
   * @returns {Promise<number>} 0 or 1
   */
  async finishTerminalAfterIssue(id, token, { result, error }, options = {}) {
    if (!DELETE_EVIDENCE_RESULTS.includes(result)) {
      throw new TypeError(
        `finishTerminalAfterIssue requires one of ${DELETE_EVIDENCE_RESULTS.join(", ")}; got "${result}"`
      );
    }
    return conditionalUpdate(
      {
        status: STATUS.CLEANUP_FAILED,
        last_result: result,
        last_error: error == null ? null : String(error).slice(0, 1000),
        cleanup_not_before_at: null,
      },
      {
        id,
        status: STATUS.CLEANUP_PENDING,
        cleanup_attempt_count: token,
        last_result: RESULT.DELETE_ISSUED,
      },
      options
    );
  }

  /**
   * Fenced removal of a claimed row that turned out not to be an orphan
   * (metadata exists). Only while the token holder, before any delete marker.
   * @returns {Promise<number>} rows removed (0 or 1)
   */
  async deleteClaimedById(id, token, options = {}) {
    const { transaction } = options;
    return spt_attachment_reconciliation.destroy({
      where: {
        [Op.and]: [
          { id },
          { status: STATUS.CLEANUP_PENDING },
          { cleanup_attempt_count: token },
          NOT_DELETE_ISSUED,
        ],
      },
      transaction,
      retry: DB_RETRY,
    });
  }

  // ---------------------------------------------------------------------
  // Quota and circuit-breaker evidence
  // ---------------------------------------------------------------------

  /**
   * Whether the quota slot rows required for `limit` reservations exist
   * (slot_no 1..limit). Seeded by the quota migration; if the policy limit is
   * raised, a new migration must add slots - until then cleanup stays disabled.
   * @returns {Promise<{ready: boolean, present: number, required: number}>}
   */
  async getQuotaSlotStatus({ limit }, options = {}) {
    const { transaction } = options;
    toSafeInt(limit, "limit");
    const present = await spt_attachment_delete_quota_slot.count({
      where: { slot_no: { [Op.lte]: limit } },
      transaction,
      retry: DB_RETRY,
    });
    return { ready: present === limit, present, required: limit };
  }

  /**
   * Live reservations in the rolling window (informational / pre-checks only;
   * NEVER used to decide a reservation - see reserveQuotaSlot()).
   * @returns {Promise<number>}
   */
  async countActiveQuotaReservations({ limit, windowHours }, options = {}) {
    const { transaction } = options;
    return spt_attachment_delete_quota_slot.count({
      where: {
        [Op.and]: [
          { slot_no: { [Op.lte]: toSafeInt(limit, "limit") } },
          { reserved_at: { [Op.gte]: dbSubHours(windowHours) } },
        ],
      },
      transaction,
      retry: DB_RETRY,
    });
  }

  /**
   * Reserve ONE delete-request slot in the rolling window, atomically.
   *
   * Mechanism: a fixed set of `limit` slot rows. A reservation is one
   * conditional UPDATE on ONE slot row:
   *
   *   UPDATE spt_attachment_delete_quota_slot
   *      SET reserved_at = CURRENT_TIMESTAMP, drive_file_id = ?
   *    WHERE slot_no = ?
   *      AND (reserved_at IS NULL
   *           OR reserved_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL <window> HOUR))
   *
   * A row holds at most one live reservation and is reusable only more than
   * `windowHours` after it was taken, so any window of `windowHours` contains
   * at most one reservation per slot, hence at most `limit` in total. No COUNT
   * is involved in the decision, so there is no check-then-act race. Two
   * instances racing for the same slot cannot both succeed (single-row
   * write-write conflict: the second sees 0 affected rows, or fails with a
   * conflict error, which the caller treats as "not reserved"). A slot found
   * free by the preliminary SELECT may be taken by someone else before the
   * UPDATE; the UPDATE then simply matches 0 rows and the next slot is tried.
   *
   * Idempotence: if a live slot already holds this drive_file_id (an earlier
   * attempt for the same file reserved it, even if its response was lost),
   * that slot is reused, so a retry does not consume a second reservation.
   * This is checked before the first candidate AND after every conditional
   * update that does not report exactly one affected row, so an update that
   * committed but whose outcome was lost or retried can never be followed by
   * the reservation of an additional slot for the same file.
   *
   * If any database call here throws or times out, the outcome is unknown: the
   * error propagates, nothing else is attempted, and no reservation is released
   * or overwritten (this method never writes a slot except to take a free or
   * expired one).
   *
   * A reservation is NEVER released by code: it expires only when its slot
   * becomes reusable. Errors propagate (the caller fails closed).
   *
   * @returns {Promise<{reserved: boolean, reused: boolean, slotNo: number|null}>}
   */
  async reserveQuotaSlot({ driveFileId, limit, windowHours }, options = {}) {
    const { transaction } = options;
    toSafeInt(limit, "limit");
    const cutoff = dbSubHours(windowHours);
    const reusable = {
      [Op.or]: [{ reserved_at: null }, { reserved_at: { [Op.lt]: cutoff } }],
    };

    const findOwn = () =>
      spt_attachment_delete_quota_slot.findOne({
        where: {
          [Op.and]: [
            { drive_file_id: driveFileId },
            { slot_no: { [Op.lte]: limit } },
            { reserved_at: { [Op.gte]: cutoff } },
          ],
        },
        transaction,
        retry: DB_RETRY,
      });

    const own = await findOwn();
    if (own) return { reserved: true, reused: true, slotNo: own.slot_no };

    const candidates = await spt_attachment_delete_quota_slot.findAll({
      attributes: ["slot_no"],
      where: { [Op.and]: [{ slot_no: { [Op.lte]: limit } }, reusable] },
      order: [
        ["reserved_at", "ASC"], // never-used slots (NULL) first, then the oldest expired
        ["slot_no", "ASC"],
      ],
      limit,
      transaction,
      retry: DB_RETRY,
    });

    for (const candidate of candidates) {
      const [affected] = await spt_attachment_delete_quota_slot.update(
        { reserved_at: NOW, drive_file_id: driveFileId },
        { where: { [Op.and]: [{ slot_no: candidate.slot_no }, reusable] }, transaction, retry: DB_RETRY }
      );
      if (affected === 1) return { reserved: true, reused: false, slotNo: candidate.slot_no };

      // Not exactly one affected row. That can mean another worker took this
      // slot, but it can ALSO mean our own earlier update committed and a retry
      // of it (see DB_RETRY) no longer matches because the slot is now ours.
      // Before ANY other slot is attempted, check whether this file already
      // owns a live reservation, and if so reuse it. If this read throws, the
      // error propagates (fail closed) and no further slot is tried.
      const ownNow = await findOwn();
      if (ownNow) return { reserved: true, reused: true, slotNo: ownNow.slot_no };
    }

    // No candidate slot could be taken (or there were none). One last check
    // before declaring the quota exhausted.
    const ownAfter = await findOwn();
    if (ownAfter) return { reserved: true, reused: true, slotNo: ownAfter.slot_no };
    return { reserved: false, reused: false, slotNo: null };
  }

  /**
   * Persist evidence that the circuit breaker tripped for a folder and pause
   * its currently claimable candidates. Rows with a DELETE_ISSUED marker or
   * an active lease are not touched. Not a claim: the attempt count is kept.
   * @returns {Promise<number>} rows marked
   */
  async holdForBreaker(drive_folder_id, { summary, holdMinutes }, options = {}) {
    return conditionalUpdate(
      {
        last_result: RESULT.BREAKER_TRIPPED,
        last_error: String(summary).slice(0, 1000),
        cleanup_not_before_at: dbAddMinutes(holdMinutes),
      },
      {
        [Op.and]: [
          { drive_folder_id },
          { status: STATUS.CLEANUP_PENDING },
          LEASE_FREE,
          NOT_DELETE_ISSUED,
        ],
      },
      options
    );
  }

  // ---------------------------------------------------------------------
  // Scheduler work enumeration (read-only)
  // ---------------------------------------------------------------------

  /**
   * One page of reconciliation units: distinct (company_id, tax_year) pairs of
   * active headers, each with its lowest header id as representative (all
   * headers of the pair share one Section I folder). Keyset pagination, always
   * bounded.
   * @returns {Promise<Array<{companyId, taxYear, representativeHeaderId}>>}
   */
  async findReconciliationUnits({ afterCompanyId = null, afterTaxYear = null, limit }, options = {}) {
    const { transaction } = options;
    const where = { deleted_at: null };
    if (afterCompanyId !== null && afterCompanyId !== undefined) {
      where[Op.or] = [
        { company_id: { [Op.gt]: afterCompanyId } },
        {
          company_id: afterCompanyId,
          tax_year: { [Op.gt]: afterTaxYear === null || afterTaxYear === undefined ? -1 : afterTaxYear },
        },
      ];
    }
    const rows = await spt_header.findAll({
      attributes: [
        "company_id",
        "tax_year",
        [Sequelize.fn("MIN", Sequelize.col("id")), "representative_header_id"],
      ],
      where,
      group: ["company_id", "tax_year"],
      order: [
        ["company_id", "ASC"],
        ["tax_year", "ASC"],
      ],
      limit: toSafeInt(limit, "limit"),
      raw: true,
      transaction,
      retry: DB_RETRY,
    });
    return rows.map((r) => ({
      companyId: r.company_id,
      taxYear: r.tax_year,
      representativeHeaderId: r.representative_header_id,
    }));
  }
}

module.exports = new SptAttachmentReconciliationRepository();
module.exports.constants = { STATUS, RESULT, DELETE_EVIDENCE_RESULTS, REQUIRED_NEW_COLUMNS };
