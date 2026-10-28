/**
 * SptAttachmentStorageService
 *
 * G2.6-A — Attachment Storage Contract.
 *
 * Orchestration boundary between the Business/SPT layer and the two
 * lower-level modules that actually own storage:
 *
 *   Business / SPT layer
 *         |
 *         v
 *   SptAttachmentStorageService   (this file)
 *         |              |
 *         v              v
 *   sptAttachmentRepository   googleDriveService
 *         |                        |
 *         v                        v
 *       TiDB                 Google Drive
 *
 * This service is intentionally GENERIC. It is not L9-L14-specific, not
 * Main-Form-specific, and not tied to any single section. Every current
 * and future attachment-bearing section (Main Form, L1-L14 and their
 * sub-sections) is expected to go through this same boundary. Do NOT add
 * section-specific methods here (e.g. uploadL9Attachment()) — extend the
 * generic contract below instead.
 *
 * Locked source-of-truth principle: TiDB (spt_attachment, via
 * sptAttachmentRepository) is the application's attachment metadata /
 * ownership source of truth. Google Drive is physical file storage only.
 * This service must never infer attachment ownership by searching Drive.
 *
 * Scope of THIS file (G2.6-A only):
 *   - Define the input/output contract for a generic attachment.
 *   - Declare the dependency boundary toward sptAttachmentRepository and
 *     googleDriveService (imported, never reimplemented/duplicated).
 *   - Perform basic structural input validation.
 *
 * Explicitly OUT of scope at this stage (left for later G2.6 sub-stages):
 *   - Actual Google Drive upload.
 *   - Actual spt_attachment DB insert / transaction.
 *   - Folder creation / folder resolution.
 *   - Delete / download lifecycle.
 *   - Any L1-L14 / Main Form / controller / route integration.
 * uploadAttachment() below is a deliberately unfinished boundary: once
 * input passes validation it throws AttachmentStorageNotImplementedError
 * rather than performing or faking a real upload/insert.
 *
 * This service does not read GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET /
 * GOOGLE_REFRESH_TOKEN, build an OAuth client, or handle authorization
 * URLs / OAuth callbacks — all of that stays inside googleDriveService.js
 * and config/googleOAuth.js, which this file treats as opaque dependencies.
 */

const sptAttachmentRepository = require("../repositories/sptAttachmentRepository");
// Imported now to declare the dependency boundary required by this stage.
// Not called anywhere yet — googleDriveService exposes only lazy,
// call-time client creation (see getOAuth2Client/getDriveClient in that
// file), so this require does not perform any Drive/OAuth call on its own.
const googleDriveService = require("./googleDriveService");

// G2.6-B — ownership resolution dependencies. Read-only data access only;
// see companiesRepository.js / usersRepository.js.
const sptHeaderRepository = require("../repositories/sptHeaderRepository");
const companiesRepository = require("../repositories/companiesRepository");
const usersRepository = require("../repositories/usersRepository");

// G2.6-G — the project's actual Sequelize instance (confirmed: a direct
// `new Sequelize(...)` instance, no custom transaction wrapper). Used only
// to open a transaction for the DB-persistence half of
// uploadAndPersistAttachment(); Google Drive is never part of this
// transaction. Per project convention, there is no existing managed-
// transaction pattern to follow, so an unmanaged transaction
// (begin -> commit/rollback) is used, matching config/sequelizeconf.js.
const sequelizeConf = require("../config/sequelizeconf");

// -----------------------------------------------------------------------
// Domain errors (in-file only — no new files created for these; mirrors
// the error-class convention used by sptDraftPreparationService.js).
// -----------------------------------------------------------------------
class AttachmentValidationError extends Error {
  constructor(message = "Invalid attachment input.") {
    super(message);
    this.name = "AttachmentValidationError";
    this.code = "ATTACHMENT_VALIDATION_ERROR";
  }
}

class AttachmentStorageNotImplementedError extends Error {
  constructor(
    message = "This attachment storage operation is not implemented yet (G2.6-A defines the contract/boundary only)."
  ) {
    super(message);
    this.name = "AttachmentStorageNotImplementedError";
    this.code = "ATTACHMENT_STORAGE_NOT_IMPLEMENTED";
  }
}

// -----------------------------------------------------------------------
// G2.6-B — ownership resolution errors. One class per failure point in the
// headerId -> spt_header -> companies -> users chain, so callers can
// distinguish them. None of these are thrown as a silent fallback — every
// missing/invalid piece of ownership data fails explicitly.
// -----------------------------------------------------------------------
class HeaderNotFoundError extends Error {
  constructor(message = "spt_header not found.") {
    super(message);
    this.name = "HeaderNotFoundError";
    this.code = "ATTACHMENT_OWNERSHIP_HEADER_NOT_FOUND";
  }
}

class InvalidTaxYearError extends Error {
  constructor(message = "spt_header.tax_year is missing or invalid.") {
    super(message);
    this.name = "InvalidTaxYearError";
    this.code = "ATTACHMENT_OWNERSHIP_INVALID_TAX_YEAR";
  }
}

class CompanyNotFoundError extends Error {
  constructor(message = "companies record not found.") {
    super(message);
    this.name = "CompanyNotFoundError";
    this.code = "ATTACHMENT_OWNERSHIP_COMPANY_NOT_FOUND";
  }
}

class InvalidCompanyOwnerError extends Error {
  constructor(message = "companies.pic_user_id is missing or invalid.") {
    super(message);
    this.name = "InvalidCompanyOwnerError";
    this.code = "ATTACHMENT_OWNERSHIP_INVALID_COMPANY_OWNER";
  }
}

class UserNotFoundError extends Error {
  constructor(message = "users record not found.") {
    super(message);
    this.name = "UserNotFoundError";
    this.code = "ATTACHMENT_OWNERSHIP_USER_NOT_FOUND";
  }
}

class InvalidUserNameError extends Error {
  constructor(message = "users.nama is missing or invalid.") {
    super(message);
    this.name = "InvalidUserNameError";
    this.code = "ATTACHMENT_OWNERSHIP_INVALID_USER_NAME";
  }
}

// -----------------------------------------------------------------------
// G2.6-G — compensation failure. Thrown ONLY when the Drive file was
// uploaded successfully, the DB persist/commit then failed, AND the
// follow-up googleDriveService.deleteFile() compensation ALSO failed
// (leaving an orphaned Drive file with no DB record — a case that cannot
// be auto-resolved here; reconciliation is a later stage). Carries the
// original persist/commit error, the driveFileId that could not be
// cleaned up, and the delete error — but never any credential, token, or
// secret (those never flow through this class; see googleDriveService.js,
// which this file treats as opaque).
// -----------------------------------------------------------------------
class AttachmentCompensationError extends Error {
  constructor(originalError, { driveFileId, compensationError } = {}) {
    const originalMessage =
      originalError && originalError.message ? originalError.message : String(originalError);
    super(
      `Attachment compensation failed: Google Drive file (id=${driveFileId}) could not be deleted after a database failure. Original error: ${originalMessage}`
    );
    this.name = "AttachmentCompensationError";
    this.code = "ATTACHMENT_COMPENSATION_FAILED";
    this.originalError = originalError;
    this.driveFileId = driveFileId;
    this.compensationFailed = true;
    this.compensationError = compensationError;
  }
}

// -----------------------------------------------------------------------
// Contract (G2.6-A). Service-level only — not a public API shape, and
// callers must never supply folder IDs / decide folder structure
// themselves; that is resolved by a later stage.
// -----------------------------------------------------------------------
/**
 * @typedef {Object} AttachmentUploadInput
 * @property {number|string} headerId      spt_header.id this attachment belongs to.
 * @property {string} documentCode         Business document code (e.g. an L-section code, OTHER_DOCUMENTS, etc).
 * @property {string} filePath             Local path of the file already written to disk by the caller.
 * @property {string} originalFileName     File name as provided by the end user.
 * @property {string} mimeType             MIME type of the file.
 * @property {number} fileSize             Size in bytes.
 * @property {Object} [attachmentContext]  Opaque context reserved for later folder-resolution
 *                                          (e.g. company/tax-year/section info); this service
 *                                          does not interpret its shape yet.
 */

/**
 * @typedef {Object} AttachmentResult
 * @property {number|string} id
 * @property {number|string} headerId
 * @property {string} documentCode
 * @property {string} originalFileName
 * @property {string} storedFileName
 * @property {string} mimeType
 * @property {number} fileSize
 * @property {string} driveFileId
 * @property {string} driveFolderId
 */

/**
 * @typedef {Object} OwnershipResolutionResult
 * @property {number|string} headerId
 * @property {number|string} companyId
 * @property {number|string} picUserId
 * @property {string} userName
 * @property {number|string} taxYear
 */

/**
 * @typedef {Object} FolderPathResult
 * @property {string[]} folderNames  Exactly 4 entries, in order:
 *   Account_{companyId}_{userName}, "SPT Badan", "{taxYear}", "Section I".
 */

function assertPresent(value, label) {
  if (value === undefined || value === null || value === "") {
    throw new AttachmentValidationError(`${label} is required.`);
  }
}

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AttachmentValidationError(`${label} must be a non-empty string.`);
  }
}

function assertPositiveNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new AttachmentValidationError(`${label} must be a positive number.`);
  }
}

// G2.6-B revision — type/shape-only predicates (no business rule such as
// "current year" or "a specific range"; just rejecting values that are
// clearly not a numeric/integer id or year).
function isValidIntegerId(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isValidIntegerYear(value) {
  return typeof value === "number" && Number.isInteger(value);
}

class SptAttachmentStorageService {
  /**
   * Validate the shape of a generic attachment upload input. Structural
   * validation ONLY — required fields present, correct primitive types.
   * No business rule (e.g. single-vs-multi document_code), no ownership
   * check, no Drive/DB call. Those belong to later stages / other layers.
   *
   * @param {AttachmentUploadInput} input
   * @throws {AttachmentValidationError}
   */
  _validateUploadInput(input) {
    if (!input || typeof input !== "object") {
      throw new AttachmentValidationError(
        "Attachment upload input must be an object."
      );
    }
    assertPresent(input.headerId, "headerId");
    assertNonEmptyString(input.documentCode, "documentCode");
    assertNonEmptyString(input.filePath, "filePath");
    assertNonEmptyString(input.originalFileName, "originalFileName");
    assertNonEmptyString(input.mimeType, "mimeType");
    assertPositiveNumber(input.fileSize, "fileSize");
    // attachmentContext is optional and intentionally opaque at this stage.
  }

  /**
   * Orchestration boundary entry point for storing one attachment
   * (Google Drive upload via googleDriveService + spt_attachment metadata
   * persistence via sptAttachmentRepository).
   *
   * G2.6-A STATUS: boundary/contract only. Input is validated, but the
   * actual orchestration (folder resolution, Drive upload, DB insert, and
   * any compensation on partial failure) is intentionally NOT implemented
   * yet — left for later G2.6 sub-stages. This method never fakes a
   * successful result.
   *
   * @param {AttachmentUploadInput} input
   * @returns {Promise<AttachmentResult>}
   * @throws {AttachmentValidationError} on structurally invalid input
   * @throws {AttachmentStorageNotImplementedError} once input is valid (for now)
   */
  async uploadAttachment(input) {
    this._validateUploadInput(input);
    throw new AttachmentStorageNotImplementedError();
  }

  /**
   * G2.6-B — resolve the ownership chain for a headerId:
   *
   *   headerId -> spt_header (company_id, tax_year)
   *            -> companies (pic_user_id)
   *            -> users (nama)
   *
   * Read-only. Does not create/resolve any Drive folder and does not call
   * googleDriveService — that belongs to a later G2.6 sub-stage. Every
   * missing/invalid piece of ownership data fails explicitly (a distinct
   * error class per failure point below); nothing falls back silently
   * (e.g. company_name is never substituted for company_id, email is
   * never substituted for users.nama).
   *
   * @param {number|string} headerId
   * @param {Object} [options]
   * @param {*} [options.transaction] forwarded to every repository call
   * @returns {Promise<OwnershipResolutionResult>}
   * @throws {AttachmentValidationError} headerId not supplied
   * @throws {HeaderNotFoundError} no active spt_header for headerId
   * @throws {InvalidTaxYearError} spt_header.tax_year missing/invalid
   * @throws {CompanyNotFoundError} no companies row for spt_header.company_id
   * @throws {InvalidCompanyOwnerError} companies.pic_user_id missing/invalid
   * @throws {UserNotFoundError} no users row for companies.pic_user_id
   * @throws {InvalidUserNameError} users.nama missing/invalid
   */
  async resolveOwnership(headerId, options = {}) {
    const { transaction } = options;
    assertPresent(headerId, "headerId");

    const header = await sptHeaderRepository.findById(headerId, { transaction });
    if (!header) {
      throw new HeaderNotFoundError(
        `spt_header not found for headerId=${headerId}.`
      );
    }

    const companyId = header.company_id;
    // spt_header.company_id is NOT NULL per schema; guarded defensively
    // rather than assumed, consistent with "fail explicitly" (poin 6).
    // Type/shape check only (must be a positive integer id) — no business
    // rule about which company_id values are allowed.
    if (!isValidIntegerId(companyId)) {
      throw new HeaderNotFoundError(
        `spt_header ${headerId} has a missing/invalid company_id.`
      );
    }

    const taxYear = header.tax_year;
    // Type/shape check only (must be an integer) — no "current year" or
    // range rule.
    if (!isValidIntegerYear(taxYear)) {
      throw new InvalidTaxYearError(
        `spt_header ${headerId} has a missing/invalid tax_year.`
      );
    }

    const company = await companiesRepository.findById(companyId, { transaction });
    if (!company) {
      throw new CompanyNotFoundError(
        `companies not found for companyId=${companyId} (headerId=${headerId}).`
      );
    }

    const picUserId = company.pic_user_id;
    // Type/shape check only (must be a positive integer id) — no business
    // rule about ownership eligibility.
    if (!isValidIntegerId(picUserId)) {
      throw new InvalidCompanyOwnerError(
        `companies.pic_user_id is missing/invalid for companyId=${companyId}.`
      );
    }

    const user = await usersRepository.findById(picUserId, { transaction });
    if (!user) {
      throw new UserNotFoundError(
        `users not found for userId=${picUserId} (companyId=${companyId}).`
      );
    }

    const userName = user.nama;
    if (typeof userName !== "string" || userName.trim() === "") {
      throw new InvalidUserNameError(
        `users.nama is missing/invalid for userId=${picUserId}.`
      );
    }

    return {
      headerId,
      companyId,
      picUserId,
      userName,
      taxYear,
    };
  }

  /**
   * G2.6-C — pure, deterministic mapping from an ownership resolution
   * result to the locked Section I folder path:
   *
   *   Account_{companyId}_{userName}
   *   └── SPT Badan
   *       └── {taxYear}
   *           └── Section I
   *
   * No repository call, no Google Drive call, no filesystem operation, no
   * DB operation — this method only shapes strings already present in
   * `ownership`. Same input always produces the same output (poin 8).
   *
   * userName is used exactly as given: no slugification, normalization,
   * case change, trimming, hashing, or substitution with email / company
   * name / username / user id (aturan 2-3-5). taxYear is only stringified
   * for folder naming, not otherwise validated against a business rule
   * (aturan 6).
   *
   * @param {OwnershipResolutionResult} ownership  Typically the direct
   *   output of resolveOwnership(), but this method does not call
   *   resolveOwnership() itself — it only consumes the shape.
   * @returns {FolderPathResult}
   * @throws {AttachmentValidationError} on structurally invalid ownership
   *   (not an object, companyId not a positive integer, userName not a
   *   non-empty string, taxYear not an integer) — structural guard only,
   *   no new error class and no business rule.
   */
  buildAttachmentFolderPath(ownership) {
    if (!ownership || typeof ownership !== "object") {
      throw new AttachmentValidationError(
        "Ownership result must be an object."
      );
    }

    const { companyId, userName, taxYear } = ownership;

    if (!isValidIntegerId(companyId)) {
      throw new AttachmentValidationError(
        "ownership.companyId must be a positive integer."
      );
    }
    assertNonEmptyString(userName, "ownership.userName");
    if (!isValidIntegerYear(taxYear)) {
      throw new AttachmentValidationError(
        "ownership.taxYear must be an integer."
      );
    }

    // userName is interpolated as-is — no trim/normalize (aturan 3, 5).
    const folderNames = [
      `Account_${companyId}_${userName}`,
      "SPT Badan",
      String(taxYear),
      "Section I",
    ];

    return { folderNames };
  }

  /**
   * G2.6-D — ensure every folder in a resolved folder path exists on
   * Google Drive (creating any missing level) and return the folder ID(s).
   *
   * This method does NOT reimplement folder creation: it validates input
   * shape only, then delegates entirely to the existing, locked
   * googleDriveService.ensureFolderPath(). It never calls
   * getDriveClient()/findOrCreateFolder()/the Drive API directly, and it
   * returns whatever googleDriveService.ensureFolderPath() resolves with,
   * unmodified — no repackaging into a different shape.
   *
   * Errors from googleDriveService.ensureFolderPath() (including Drive API
   * errors and the DRIVE_FOLDER_DUPLICATE case) are NOT caught here and
   * propagate to the caller unchanged.
   *
   * @param {FolderPathResult} folderPath  Typically the direct output of
   *   buildAttachmentFolderPath(), but this method only consumes the shape
   *   — it does not call buildAttachmentFolderPath() itself.
   * @returns {Promise<*>} Exactly what googleDriveService.ensureFolderPath() resolves with.
   * @throws {AttachmentValidationError} on structurally invalid folderPath
   *   (not an object, folderNames not an array, empty array, or any entry
   *   not a non-empty string) — structural guard only, no new error class.
   */
  async ensureAttachmentFolderPath(folderPath) {
    if (!folderPath || typeof folderPath !== "object") {
      throw new AttachmentValidationError(
        "folderPath must be an object."
      );
    }

    const { folderNames } = folderPath;
    if (!Array.isArray(folderNames)) {
      throw new AttachmentValidationError(
        "folderPath.folderNames must be an array."
      );
    }
    if (folderNames.length === 0) {
      throw new AttachmentValidationError(
        "folderPath.folderNames must not be empty."
      );
    }
    folderNames.forEach((name, i) => {
      assertNonEmptyString(name, `folderPath.folderNames[${i}]`);
    });

    // Delegated entirely to the locked, generic googleDriveService — no
    // folder-creation logic duplicated here.
    return googleDriveService.ensureFolderPath(folderNames);
  }

  /**
   * G2.6-D — orchestration-only convenience: build the folder path from
   * an ownership resolution result, then ensure it exists on Drive.
   *
   *   ownership -> buildAttachmentFolderPath() -> ensureAttachmentFolderPath()
   *             -> googleDriveService.ensureFolderPath()
   *
   * Does not call resolveOwnership() itself and performs no repository /
   * DB call — ownership resolution remains the caller's responsibility
   * (per G2.6-B), unchanged by this method.
   *
   * @param {OwnershipResolutionResult} ownership
   * @returns {Promise<*>} Exactly what googleDriveService.ensureFolderPath() resolves with.
   * @throws {AttachmentValidationError} via buildAttachmentFolderPath() /
   *   ensureAttachmentFolderPath() on structurally invalid input.
   */
  async ensureAttachmentFolderPathFromOwnership(ownership) {
    const folderPath = this.buildAttachmentFolderPath(ownership);
    return this.ensureAttachmentFolderPath(folderPath);
  }

  /**
   * G2.6-E — orchestrate a physical file upload to Google Drive:
   *
   *   input (+ownership)
   *     -> ensureAttachmentFolderPathFromOwnership(ownership)   [G2.6-C/D]
   *     -> Section I folder { folderId, folderName }            [G2.6-D contract: ONE object, not an array]
   *     -> googleDriveService.uploadFile({ filePath, fileName, mimeType, parentFolderId })
   *     -> Drive file metadata, returned unmodified
   *
   * This method does NOT touch spt_attachment (no DB insert, no
   * transaction), does NOT catch/replace errors from
   * ensureAttachmentFolderPathFromOwnership() or
   * googleDriveService.uploadFile() (both propagate as-is), and does NOT
   * perform any filesystem check itself — googleDriveService.uploadFile()
   * already owns filePath/file-read validation.
   *
   * ownership's own fields (companyId/userName/taxYear) are NOT
   * re-validated here — that is already enforced inside
   * buildAttachmentFolderPath(), reached via
   * ensureAttachmentFolderPathFromOwnership(). This method only checks
   * that `ownership` itself is an object before passing it on.
   *
   * @param {Object} input
   * @param {string} input.filePath          Forwarded as-is to googleDriveService.uploadFile().
   * @param {string} input.originalFileName  Mapped to googleDriveService.uploadFile()'s `fileName`.
   * @param {string} input.mimeType          Forwarded as-is.
   * @param {number} input.fileSize          Validated (positive finite number) but not forwarded —
   *                                          googleDriveService.uploadFile() has no fileSize parameter.
   * @param {OwnershipResolutionResult} input.ownership  Passed to ensureAttachmentFolderPathFromOwnership().
   * @returns {Promise<*>} Exactly what googleDriveService.uploadFile() resolves with.
   * @throws {AttachmentValidationError} on structurally invalid input, or
   *   if the resolved folder result is missing a usable folderId.
   */
  async uploadAttachmentFile(input) {
    if (!input || typeof input !== "object") {
      throw new AttachmentValidationError(
        "uploadAttachmentFile input must be an object."
      );
    }

    const { filePath, originalFileName, mimeType, fileSize, ownership } = input;

    assertNonEmptyString(filePath, "filePath");
    assertNonEmptyString(originalFileName, "originalFileName");
    assertNonEmptyString(mimeType, "mimeType");
    assertPositiveNumber(fileSize, "fileSize");

    if (!ownership || typeof ownership !== "object") {
      throw new AttachmentValidationError("ownership must be an object.");
    }
    // companyId/userName/taxYear are validated downstream by
    // buildAttachmentFolderPath() (called inside the line below) — not
    // duplicated here.

    const folder = await this.ensureAttachmentFolderPathFromOwnership(ownership);

    // Defensive check on the G2.6-D contract: ONE folder object (the final
    // "Section I" level), not an array. See G2.6-D report for why this is
    // a single object rather than the array shape some earlier briefs
    // assumed.
    if (!folder || typeof folder !== "object") {
      throw new AttachmentValidationError(
        "Resolved folder result must be an object."
      );
    }
    assertNonEmptyString(folder.folderId, "folder.folderId");

    // Delegated entirely to googleDriveService — no Drive API call, no
    // filesystem check, duplicated here.
    return googleDriveService.uploadFile({
      filePath,
      fileName: originalFileName,
      mimeType,
      parentFolderId: folder.folderId,
    });
  }

  /**
   * G2.6-F — persist one attachment's metadata (the result of a prior,
   * already-completed physical Drive upload) as a spt_attachment row.
   *
   * This method does NOT call googleDriveService (no uploadFile/getFile/
   * deleteFile/Drive API of any kind) and does NOT resolve ownership (no
   * resolveOwnership(), no companiesRepository/usersRepository) — headerId
   * and every other field are taken from `input` exactly as the caller
   * supplies them. It does NOT open/commit/rollback a transaction; a
   * transaction, if any, is only forwarded via options.transaction to
   * sptAttachmentRepository.create(). Not combined with uploadAttachmentFile()
   * or any other stage into a single pipeline here — that is a later stage.
   *
   * @param {Object} input
   * @param {number|string} input.headerId        -> spt_attachment.header_id
   * @param {string} input.documentCode            -> spt_attachment.document_code
   * @param {string} input.originalFileName        -> spt_attachment.original_file_name
   * @param {string} input.storedFileName          -> spt_attachment.stored_file_name
   *   (the name actually used for the Drive upload — NOT generated here)
   * @param {string} input.mimeType                -> spt_attachment.mime_type
   * @param {number} input.fileSize                -> spt_attachment.file_size
   * @param {string} input.driveFileId             -> spt_attachment.drive_file_id
   * @param {string} input.driveFolderId           -> spt_attachment.drive_folder_id
   * @param {Object} [options]
   * @param {*} [options.transaction] forwarded to sptAttachmentRepository.create()
   * @returns {Promise<*>} Exactly what sptAttachmentRepository.create() resolves with.
   * @throws {AttachmentValidationError} on structurally invalid input.
   */
  async persistAttachmentMetadata(input, options = {}) {
    if (!input || typeof input !== "object") {
      throw new AttachmentValidationError(
        "persistAttachmentMetadata input must be an object."
      );
    }

    const {
      headerId,
      documentCode,
      originalFileName,
      storedFileName,
      mimeType,
      fileSize,
      driveFileId,
      driveFolderId,
    } = input;
    const { transaction } = options;

    assertPresent(headerId, "headerId");
    assertNonEmptyString(documentCode, "documentCode");
    assertNonEmptyString(originalFileName, "originalFileName");
    assertNonEmptyString(storedFileName, "storedFileName");
    assertNonEmptyString(mimeType, "mimeType");
    assertPositiveNumber(fileSize, "fileSize");
    assertNonEmptyString(driveFileId, "driveFileId");
    assertNonEmptyString(driveFolderId, "driveFolderId");

    const data = {
      header_id: headerId,
      document_code: documentCode,
      original_file_name: originalFileName,
      stored_file_name: storedFileName,
      mime_type: mimeType,
      file_size: fileSize,
      drive_file_id: driveFileId,
      drive_folder_id: driveFolderId,
    };

    // Delegated entirely to sptAttachmentRepository — no Sequelize model,
    // no DB connection, no SQL here. Error from the repository propagates
    // unchanged (not caught/replaced with AttachmentValidationError).
    return sptAttachmentRepository.create(data, { transaction });
  }

  /**
   * G2.6-G — full attachment upload orchestration, with Drive/DB
   * compensation on partial failure.
   *
   * WAJIB official order (brief section 5 / 12):
   *   1. Validate input                         (_validateUploadInput — G2.6-A, reused unchanged)
   *   2. Resolve ownership                       (resolveOwnership — G2.6-B, reused unchanged)
   *   3. Ensure Drive folder path                (ensureAttachmentFolderPathFromOwnership — G2.6-C/D, reused unchanged)
   *   4. Upload file to Google Drive              (googleDriveService.uploadFile — exactly once, no retry)
   *   5. Begin TiDB transaction                   (ONLY after step 4 succeeds)
   *   6. Persist metadata                         (persistAttachmentMetadata(..., { transaction }) — G2.6-F, reused unchanged)
   *   7. Commit
   *   8. Return success (the persisted row, as persistAttachmentMetadata resolves it)
   *
   * Steps 3-4 are implemented here as direct calls
   * (ensureAttachmentFolderPathFromOwnership() + googleDriveService.uploadFile())
   * rather than by delegating to uploadAttachmentFile() (G2.6-E). This is a
   * deliberate choice, not an oversight: uploadAttachmentFile()'s locked
   * contract returns ONLY googleDriveService.uploadFile()'s result, with no
   * folder id in it — but this orchestrator needs driveFolderId (the
   * Section I folder actually used) for persistAttachmentMetadata() and for
   * compensation context. Re-resolving the folder a second time inside a
   * reused uploadAttachmentFile() call would cost a redundant (if harmless,
   * idempotent) Drive round-trip; calling ensureAttachmentFolderPathFromOwnership()
   * once here instead keeps the official call order exactly
   * "ensureFolder -> uploadFile" with no extra calls. uploadAttachmentFile()
   * itself is left completely untouched and still usable standalone.
   *
   * Compensation (brief section 6/7/8, case E/F/G — and the G2.6-G
   * targeted correction below): once googleDriveService.uploadFile()
   * has resolved with a usable driveFileId, the physical Drive file is
   * known to exist, so EVERY failure from that point onward goes through
   * one shared compensation path (delete that Drive file):
   *   - malformed upload result (fileId present but e.g. fileName
   *     missing/invalid) — the file still physically exists on Drive;
   *   - sequelizeConf.transaction() itself failing to begin — the Drive
   *     file exists but no transaction/DB attempt was ever made;
   *   - persistAttachmentMetadata()/transaction.commit() failing — the
   *     transaction is rolled back first (if still active), then the
   *     same compensation runs.
   *   In every one of those cases:
   *     -> googleDriveService.deleteFile(driveFileId)  (permanent delete, no trash, no retry)
   *     -> delete succeeds: no DB record, no Drive file -> original error re-thrown ("clean failure")
   *     -> delete fails: AttachmentCompensationError (original error + driveFileId + compensation error)
   *   - Validation (step 1), ownership (step 2), or folder (step 3) failure:
   *       -> propagates immediately; Drive upload (step 4) is never attempted.
   *   - Drive upload (step 4) itself failing (the googleDriveService.uploadFile()
   *     call throwing), or resolving with NO usable fileId at all:
   *       -> propagates immediately, with NO compensation attempt — there is
   *          no physical file (or at least no usable id to delete), so
   *          calling deleteFile() would mean fabricating an id or calling it
   *          with an invalid one, which is explicitly disallowed. This is a
   *          documented internal limitation: if Drive silently created a
   *          file but returned no usable id for it, this orchestration
   *          cannot discover or clean it up — recourse for that scenario is
   *          out of scope for G2.6-G (a later reconciliation stage).
   *
   * Google Drive is never part of the Sequelize transaction — the
   * transaction covers only the spt_attachment insert.
   *
   * @param {AttachmentUploadInput} input  Same shape as uploadAttachment()'s (G2.6-A) input.
   * @returns {Promise<*>} Exactly what persistAttachmentMetadata() resolves with.
   * @throws {AttachmentValidationError} structurally invalid input / malformed folder
   *   result / Drive result with no usable fileId (uncompensated — see limitation above).
   * @throws {HeaderNotFoundError|InvalidTaxYearError|CompanyNotFoundError|InvalidCompanyOwnerError|UserNotFoundError|InvalidUserNameError}
   *   from resolveOwnership(), before any Drive call.
   * @throws {*} the original transaction-begin, Drive, or DB error, unchanged,
   *   when compensation was not needed, not attempted, or succeeded.
   * @throws {AttachmentCompensationError} when the Drive file exists (a usable
   *   driveFileId was obtained) and the subsequent failure's Drive compensation
   *   delete also failed.
   */
  async uploadAndPersistAttachment(input) {
    // 1. Validate input — reuses the G2.6-A validation boundary unchanged.
    this._validateUploadInput(input);

    const {
      headerId,
      documentCode,
      filePath,
      originalFileName,
      mimeType,
      fileSize,
    } = input;

    // 2. Resolve ownership. Any failure here happens before any Drive call.
    const ownership = await this.resolveOwnership(headerId);

    // 3. Ensure Drive folder path. Any failure here happens before the
    // actual file upload.
    const folder = await this.ensureAttachmentFolderPathFromOwnership(ownership);
    if (!folder || typeof folder !== "object") {
      throw new AttachmentValidationError(
        "Resolved folder result must be an object."
      );
    }
    assertNonEmptyString(folder.folderId, "folder.folderId");
    const driveFolderId = folder.folderId;

    // 4. Upload the file to Google Drive. Exactly one upload call — no
    // automatic retry. If this throws, it propagates immediately: no
    // transaction is opened and no compensation is attempted, because
    // nothing was created on Drive to clean up.
    const driveFile = await googleDriveService.uploadFile({
      filePath,
      fileName: originalFileName,
      mimeType,
      parentFolderId: driveFolderId,
    });

    // Extract a usable driveFileId as early as possible: once we have one,
    // the physical Drive file is known to exist, so EVERY failure from
    // here on (malformed result, transaction-begin failure, DB failure)
    // must go through compensation (see the shared catch block below).
    // Without a usable fileId there is nothing we can safely call
    // deleteFile() with — no id is fabricated, and no compensation is
    // attempted; this is a documented internal limitation (see method
    // doc comment above).
    if (!driveFile || typeof driveFile.fileId !== "string" || driveFile.fileId.trim() === "") {
      throw new AttachmentValidationError(
        "googleDriveService.uploadFile() result is missing a usable fileId."
      );
    }
    const driveFileId = driveFile.fileId;

    try {
      // Per brief poin 10: stored_file_name must be EXACTLY the name
      // Drive confirms it stored — not re-derived or guessed
      // independently. A malformed fileName here still means a physical
      // file exists on Drive (we already have driveFileId), so this
      // throw is caught below and compensated, not left bare.
      assertNonEmptyString(driveFile.fileName, "driveFile.fileName");
      const storedFileName = driveFile.fileName;

      // 5. Begin the TiDB transaction — ONLY now that Drive upload has
      // succeeded. Google Drive itself is never part of this transaction.
      // If transaction() itself fails to begin, the Drive file still
      // exists — that failure is caught below and compensated too.
      const transaction = await sequelizeConf.transaction();

      try {
        // 6. Persist metadata.
        const persisted = await this.persistAttachmentMetadata(
          {
            headerId,
            documentCode,
            originalFileName,
            storedFileName,
            mimeType,
            fileSize,
            driveFileId,
            driveFolderId,
          },
          { transaction }
        );

        // 7. Commit.
        await transaction.commit();

        // 8. Return success.
        return persisted;
      } catch (dbError) {
        // DB (persist or commit) failed. Roll back if the transaction is
        // still active — commit() may already have finished it in some
        // failure modes, and Sequelize throws on a second rollback/commit,
        // so this is guarded rather than assumed. Then re-throw to the
        // shared compensation handler below (outer catch) — rollback
        // failing does not change the compensation need; the Drive file
        // must still be cleaned up either way.
        if (!transaction.finished) {
          try {
            await transaction.rollback();
          } catch (rollbackError) {
            // Intentionally not swallowed into a different error: the
            // original dbError remains what is compensated/surfaced below.
          }
        }
        throw dbError;
      }
    } catch (postUploadError) {
      // Shared compensation path for every failure that can occur AFTER a
      // usable driveFileId was obtained: malformed fileName, transaction-
      // begin failure, or a (already rolled back) DB persist/commit
      // failure. The Drive file was created, but there is no DB record
      // for it — permanently delete it. No trash, no restore, no
      // automatic retry of the delete itself.
      try {
        await googleDriveService.deleteFile(driveFileId);
      } catch (compensationError) {
        throw new AttachmentCompensationError(postUploadError, {
          driveFileId,
          compensationError,
        });
      }

      // Compensation succeeded: no DB record, no Drive file — a clean
      // failure. Surface the original error unchanged.
      throw postUploadError;
    }
  }
}

module.exports = new SptAttachmentStorageService();
module.exports.SptAttachmentStorageService = SptAttachmentStorageService;
module.exports.errors = {
  AttachmentValidationError,
  AttachmentStorageNotImplementedError,
  HeaderNotFoundError,
  InvalidTaxYearError,
  CompanyNotFoundError,
  InvalidCompanyOwnerError,
  UserNotFoundError,
  InvalidUserNameError,
  AttachmentCompensationError,
};
