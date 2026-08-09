/**
 * SptDraftPreparationService
 *
 * Business Responsibility: SPT Draft Lifecycle and Preparation Workflow —
 * Create Draft, Progressive Section Persistence, Section Update, Draft
 * Calculation, Draft Recalculation, and Draft Deletion.
 *
 * Source of truth: PHASE_2A_SERVICE_METHOD_CONTRACT_FINALIZATION.
 *
 * This Service is NOT a Model CRUD wrapper, Repository wrapper,
 * Controller, API handler, Route handler, or Database access layer.
 *
 * Forbidden in this file (per Phase 2A §16): direct Sequelize Model
 * access, raw database query, queryInterface, migration/schema changes,
 * sequelize.sync(), HTTP/Express handling, Controller/Route behavior,
 * unapproved new Repository, Repository modification, automatic
 * recalculation on Save/Update, Draft Derived-Value Persistence, new
 * Derived Value fields, new Calculation Formula, Snapshot persistence,
 * business cascade delete, hard delete, restore, amendment workflow,
 * post-submission editing.
 *
 * Authorization is explicitly OUT of scope for both Repository and
 * Service (Phase 2A / Repository Architecture Review boundary table:
 * Authorization = NO for both layers). This Service accepts an
 * actorContext for traceability (e.g. created_by) only — it does not
 * perform authorization decisions.
 *
 * GAP-CALC-01 (Calculation Formula / Calculation Result Schema) is
 * explicitly NOT DEFINED and explicitly NON-BLOCKING per Phase 2A §19.
 * calculate()/recalculate() therefore only orchestrate reading of Raw
 * Input through existing Repositories. No formula is invented, no
 * derived field is invented, and no derived value is persisted.
 */

const sequelizeConf = require("../config/sequelizeconf");

const sptHeaderRepository = require("../repositories/sptHeaderRepository");
const sptMainFormRepository = require("../repositories/sptMainFormRepository");
const sptL1Repository = require("../repositories/sptL1Repository");
const sptL2Repository = require("../repositories/sptL2Repository");
const sptL3Repository = require("../repositories/sptL3Repository");
const sptL4Repository = require("../repositories/sptL4Repository");
const sptL5PlaceRepository = require("../repositories/sptL5PlaceRepository");
const sptL5TransactionRepository = require("../repositories/sptL5TransactionRepository");
const sptL6Repository = require("../repositories/sptL6Repository");
const sptL7Repository = require("../repositories/sptL7Repository");
const sptL8Repository = require("../repositories/sptL8Repository");

// -----------------------------------------------------------------------
// Domain errors (in-file only — no new files created for these).
// These are plain Error subclasses so a future Controller layer can
// branch on `err.code`. Throwing a domain Error is not HTTP handling.
// -----------------------------------------------------------------------
class DraftNotFoundError extends Error {
  constructor(message = "Draft not found.") {
    super(message);
    this.name = "DraftNotFoundError";
    this.code = "DRAFT_NOT_FOUND";
  }
}

class InvalidDraftStateError extends Error {
  constructor(message = "Draft is not in DRAFT state.") {
    super(message);
    this.name = "InvalidDraftStateError";
    this.code = "INVALID_DRAFT_STATE";
  }
}

class DuplicateDraftError extends Error {
  constructor(message = "A draft with this business key already exists.") {
    super(message);
    this.name = "DuplicateDraftError";
    this.code = "DUPLICATE_DRAFT";
  }
}

class UnknownSectionError extends Error {
  constructor(sectionKey) {
    super(`Unknown section: ${sectionKey}`);
    this.name = "UnknownSectionError";
    this.code = "UNKNOWN_SECTION";
  }
}

class SectionNotFoundError extends Error {
  constructor(message = "Section record not found.") {
    super(message);
    this.name = "SectionNotFoundError";
    this.code = "SECTION_NOT_FOUND";
  }
}

class SectionOwnershipMismatchError extends Error {
  constructor(message = "Section does not belong to the given draft.") {
    super(message);
    this.name = "SectionOwnershipMismatchError";
    this.code = "SECTION_OWNERSHIP_MISMATCH";
  }
}

const DRAFT_STATUS = "DRAFT";

/**
 * Section registry: maps a section key to its Repository and whether
 * that section is header-scoped (owns a header_id column that this
 * Service enforces to match the Draft reference) or not.
 *
 * spt_l5_transaction has headerScoped: false because it has no
 * header_id column (only place_id), per Database Dictionary V3 /
 * migration FINAL. Its Draft ownership is NOT skipped — it is enforced
 * separately in saveSection/updateSection via the ownership chain:
 * spt_header --(header_id)--> spt_l5_place --(place_id)--> spt_l5_transaction.
 */
const SECTION_REGISTRY = Object.freeze({
  mainForm: { repository: sptMainFormRepository, headerScoped: true },
  l1: { repository: sptL1Repository, headerScoped: true },
  l2: { repository: sptL2Repository, headerScoped: true },
  l3: { repository: sptL3Repository, headerScoped: true },
  l4: { repository: sptL4Repository, headerScoped: true },
  l5Place: { repository: sptL5PlaceRepository, headerScoped: true },
  l5Transaction: { repository: sptL5TransactionRepository, headerScoped: false },
  l6: { repository: sptL6Repository, headerScoped: true },
  l7: { repository: sptL7Repository, headerScoped: true },
  l8: { repository: sptL8Repository, headerScoped: true },
});

class SptDraftPreparationService {
  // -----------------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------------

  /**
   * Load the header and assert it exists and is in DRAFT state.
   * Used by saveSection, updateSection, calculate, recalculate,
   * deleteDraft — all of which require "Draft State Requirement: DRAFT"
   * per Phase 2A §6.
   * @private
   */
  async _assertDraftIsEditable(headerId, options = {}) {
    const { transaction } = options;
    const header = await sptHeaderRepository.findById(headerId, { transaction });
    if (!header) {
      throw new DraftNotFoundError();
    }
    if (header.status !== DRAFT_STATUS) {
      throw new InvalidDraftStateError();
    }
    return header;
  }

  /**
   * Resolve a section key against the section registry.
   * @private
   */
  _resolveSection(sectionKey) {
    const entry = SECTION_REGISTRY[sectionKey];
    if (!entry) {
      throw new UnknownSectionError(sectionKey);
    }
    return entry;
  }

  // -----------------------------------------------------------------
  // 1. createDraft
  // -----------------------------------------------------------------
  /**
   * Create a new SPT Draft. Header is a persistence prerequisite;
   * Header + Main Form is one atomic business operation.
   *
   * Transaction Requirement: Required; owner = SptDraftPreparationService.
   *
   * @param {{ userId: number|string }} actorContext - Authenticated user
   *   context. Used only as created_by traceability; no authorization
   *   decision is made here (out of Service scope).
   * @param {object} draftData
   * @param {object} draftData.header - spt_header creation fields.
   *   Must include company_id, tax_year. May include tax_return_type,
   *   amendment_number, tax_period, tax_type, form_version (defaults
   *   to Model defaultValue when omitted).
   * @param {object} [draftData.mainForm] - optional initial spt_main_form
   *   fields (header_id is set by this Service, not the caller).
   * @returns {Promise<{ header: object, mainForm: object }>} Created Draft reference.
   */
  async createDraft(actorContext, draftData) {
    if (!actorContext || actorContext.userId === undefined || actorContext.userId === null) {
      throw new Error("createDraft requires actorContext.userId.");
    }
    if (!draftData || !draftData.header) {
      throw new Error("createDraft requires draftData.header.");
    }

    const { company_id, tax_year } = draftData.header;
    if (company_id === undefined || company_id === null) {
      throw new Error("createDraft requires draftData.header.company_id.");
    }
    if (tax_year === undefined || tax_year === null) {
      throw new Error("createDraft requires draftData.header.tax_year.");
    }

    // Mirror spt_header Model FINAL defaultValue for tax_return_type and
    // amendment_number so the pre-create duplicate check (business key)
    // matches what will actually be persisted when the caller omits them.
    // These literal defaults are restated from the Model, not invented.
    const tax_return_type = draftData.header.tax_return_type ?? "NORMAL";
    const amendment_number = draftData.header.amendment_number ?? 0;

    const transaction = await sequelizeConf.transaction();
    try {
      const existing = await sptHeaderRepository.findByBusinessKey(
        { company_id, tax_year, tax_return_type, amendment_number },
        { transaction }
      );
      if (existing) {
        throw new DuplicateDraftError();
      }

      const header = await sptHeaderRepository.create(
        {
          ...draftData.header,
          tax_return_type,
          amendment_number,
          created_by: actorContext.userId,
        },
        { transaction }
      );

      const mainForm = await sptMainFormRepository.create(
        {
          ...(draftData.mainForm || {}),
          header_id: header.id,
        },
        { transaction }
      );

      await transaction.commit();
      return { header, mainForm };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // -----------------------------------------------------------------
  // 2. saveSection
  // -----------------------------------------------------------------
  /**
   * Persist a Raw Input section progressively while the Draft is DRAFT.
   *
   * Transaction Requirement: Not mandatory (single-write operation).
   *
   * @param {{ userId: number|string }} actorContext - Authenticated user
   *   context. Accepted for signature consistency/traceability only; no
   *   authorization decision is made here (out of Service scope).
   * @param {number|string} headerId - Draft reference.
   * @param {string} sectionKey - one of SECTION_REGISTRY keys.
   * @param {object} sectionData - Raw Input for the section.
   * @returns {Promise<object>} Persisted section result.
   */
  async saveSection(actorContext, headerId, sectionKey, sectionData) {
    const { repository, headerScoped } = this._resolveSection(sectionKey);

    await this._assertDraftIsEditable(headerId);

    // spt_l5_transaction has no header_id column. Ownership is enforced
    // through the chain: sectionData.place_id -> spt_l5_place.header_id.
    // sectionData.place_id itself is never modified.
    if (sectionKey === "l5Transaction") {
      const place = await sptL5PlaceRepository.findById(sectionData.place_id);
      if (!place) {
        throw new SectionNotFoundError();
      }
      if (place.header_id !== headerId) {
        throw new SectionOwnershipMismatchError();
      }
      return repository.create({ ...sectionData });
    }

    const payload = headerScoped
      ? { ...sectionData, header_id: headerId }
      : { ...sectionData };

    return repository.create(payload);
  }

  // -----------------------------------------------------------------
  // 3. updateSection
  // -----------------------------------------------------------------
  /**
   * Update a previously persisted Raw Input section while the Draft is
   * DRAFT.
   *
   * Transaction Requirement: Not mandatory (single-write operation).
   *
   * @param {{ userId: number|string }} actorContext - Authenticated user
   *   context. Accepted for signature consistency/traceability only; no
   *   authorization decision is made here (out of Service scope).
   * @param {number|string} headerId - Draft reference.
   * @param {string} sectionKey - one of SECTION_REGISTRY keys.
   * @param {number|string} sectionId - primary key of the section row.
   * @param {object} sectionData - updated Raw Input for the section.
   * @returns {Promise<object|null>} Updated section result, or null if
   *   the section record does not exist.
   */
  async updateSection(actorContext, headerId, sectionKey, sectionId, sectionData) {
    const { repository, headerScoped } = this._resolveSection(sectionKey);

    await this._assertDraftIsEditable(headerId);

    // Basic / section-level validation: confirm the section actually
    // belongs to the referenced Draft before allowing the update.
    //
    // spt_l5_transaction has no header_id column, so ownership is
    // enforced through the chain:
    // sectionId -> spt_l5_transaction.place_id -> spt_l5_place.header_id.
    if (sectionKey === "l5Transaction") {
      const existingTransaction = await repository.findById(sectionId);
      if (!existingTransaction) {
        throw new SectionNotFoundError();
      }
      const place = await sptL5PlaceRepository.findById(existingTransaction.place_id);
      if (!place) {
        throw new SectionNotFoundError();
      }
      if (place.header_id !== headerId) {
        throw new SectionOwnershipMismatchError();
      }
      return repository.updateById(sectionId, { ...sectionData });
    }

    if (headerScoped) {
      const existing = await repository.findById(sectionId);
      if (!existing) {
        throw new SectionNotFoundError();
      }
      if (existing.header_id !== headerId) {
        throw new SectionOwnershipMismatchError();
      }
    }

    // Never allow the section update payload to move the row to a
    // different Draft.
    const payload = headerScoped
      ? { ...sectionData, header_id: headerId }
      : { ...sectionData };

    return repository.updateById(sectionId, payload);
  }

  // -----------------------------------------------------------------
  // Internal: Raw Input orchestration shared by calculate/recalculate
  // -----------------------------------------------------------------
  /**
   * Read all Raw Input tied to a Draft header, across every section
   * Repository. Performs NO computation and invents NO derived field —
   * Calculation Formula and Calculation Result Schema are explicitly
   * NOT DEFINED (Phase 2A §19, non-blocking gap).
   * @private
   */
  async _readRawInput(headerId) {
    const [
      mainForm,
      l1Entries,
      l2Entries,
      l3Entries,
      l4Entries,
      l5Places,
      l6,
      l7Entries,
      l8,
    ] = await Promise.all([
      sptMainFormRepository.findByHeaderId(headerId),
      sptL1Repository.findAllByHeaderId(headerId),
      sptL2Repository.findAllByHeaderId(headerId),
      sptL3Repository.findAllByHeaderId(headerId),
      sptL4Repository.findAllByHeaderId(headerId),
      sptL5PlaceRepository.findAllByHeaderId(headerId),
      sptL6Repository.findByHeaderId(headerId),
      sptL7Repository.findAllByHeaderId(headerId),
      sptL8Repository.findByHeaderId(headerId),
    ]);

    // spt_l5_transaction has no header_id — read per place_id, since
    // place rows are themselves Raw Input scoped to this header.
    const l5PlacesWithTransactions = await Promise.all(
      l5Places.map(async (place) => ({
        place,
        transactions: await sptL5TransactionRepository.findAllByPlaceId(place.id),
      }))
    );

    return {
      mainForm,
      l1Entries,
      l2Entries,
      l3Entries,
      l4Entries,
      l5Places: l5PlacesWithTransactions,
      l6,
      l7Entries,
      l8,
    };
  }

  // -----------------------------------------------------------------
  // 4. calculate
  // -----------------------------------------------------------------
  /**
   * Generate a (currently transient, formula-pending) Calculation
   * Result from Draft Raw Input. No persistence transaction is used —
   * output is transient by contract. Raw Input is never modified.
   *
   * Calculation Formula is NOT DEFINED (Phase 2A §19, non-blocking).
   * This method therefore performs Raw Input orchestration only; it
   * does not invent a formula or a derived field.
   *
   * @param {{ userId: number|string }} actorContext - Authenticated user
   *   context. Accepted for signature consistency/traceability only; no
   *   authorization decision is made here (out of Service scope).
   * @param {number|string} headerId - Draft reference.
   * @param {object} [calculationContext] - reserved for future formula
   *   input; currently unused because no formula is defined.
   * @returns {Promise<{ header: object, rawInput: object, calculationResult: null, status: string }>}
   */
  async calculate(actorContext, headerId, calculationContext = {}) {
    const header = await this._assertDraftIsEditable(headerId);
    const rawInput = await this._readRawInput(headerId);

    return {
      header,
      rawInput,
      calculationResult: null,
      status: "CALCULATION_FORMULA_NOT_DEFINED",
    };
  }

  // -----------------------------------------------------------------
  // 5. recalculate
  // -----------------------------------------------------------------
  /**
   * Regenerate the Calculation Result from current Draft Raw Input.
   * Identical orchestration to calculate() — recalculate always reads
   * current Raw Input fresh, which is exactly what calculate() already
   * does; no cached/previous result exists to invalidate since no
   * derived value is ever persisted.
   *
   * @param {{ userId: number|string }} actorContext - Authenticated user
   *   context. Accepted for signature consistency/traceability only; no
   *   authorization decision is made here (out of Service scope).
   * @param {number|string} headerId - Draft reference.
   * @param {object} [calculationContext] - reserved for future formula
   *   input; currently unused because no formula is defined.
   * @returns {Promise<{ header: object, rawInput: object, calculationResult: null, status: string }>}
   */
  async recalculate(actorContext, headerId, calculationContext = {}) {
    return this.calculate(actorContext, headerId, calculationContext);
  }

  // -----------------------------------------------------------------
  // 6. deleteDraft
  // -----------------------------------------------------------------
  /**
   * Delete a Draft via existing soft-delete capability. Only DRAFT may
   * be deleted. No hard delete, no restore, no business cascade to
   * child sections.
   *
   * Transaction Requirement: No new mandatory cascade transaction rule
   * (single-write operation).
   *
   * @param {{ userId: number|string }} actorContext - Authenticated user
   *   context. Accepted for signature consistency/traceability only; no
   *   authorization decision is made here (out of Service scope).
   * @param {number|string} headerId - Draft reference.
   * @returns {Promise<object|null>} Soft-deleted header record.
   */
  async deleteDraft(actorContext, headerId) {
    const header = await sptHeaderRepository.findById(headerId);
    if (!header) {
      throw new DraftNotFoundError();
    }
    if (header.status !== DRAFT_STATUS) {
      throw new InvalidDraftStateError("Only a DRAFT may be deleted.");
    }

    return sptHeaderRepository.softDeleteById(headerId);
  }
}

module.exports = new SptDraftPreparationService();
module.exports.SptDraftPreparationService = SptDraftPreparationService;
module.exports.errors = {
  DraftNotFoundError,
  InvalidDraftStateError,
  DuplicateDraftError,
  UnknownSectionError,
  SectionNotFoundError,
  SectionOwnershipMismatchError,
};