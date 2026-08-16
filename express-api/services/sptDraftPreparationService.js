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
 *
 * Aligned against SERVICE_CONTRACT_FINAL_LOCKED_L9-L14 (Actor Context —
 * Hard Rule, §4): actorContext.userId is now validated as required on
 * every one of the six canonical operations (createDraft, saveSection,
 * updateSection, calculate, recalculate via calculate, deleteDraft),
 * not only on createDraft as before. No signature changed — all six
 * already matched the canonical contract exactly.
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

// L9-L14 repositories (Section Registry wiring only — see SECTION_REGISTRY
// below). Source of truth: SERVICE L9-L14 SECTION WIRING (FINAL LOCKED).
const sptL9Repository = require("../repositories/sptL9Repository");
const sptL9AssetRepository = require("../repositories/sptL9AssetRepository");
const sptL10aRepository = require("../repositories/sptL10aRepository");
const sptL10bRepository = require("../repositories/sptL10bRepository");
const sptL10cRepository = require("../repositories/sptL10cRepository");
const sptL10dRepository = require("../repositories/sptL10dRepository");
const sptL11aPromotionRepository = require("../repositories/sptL11aPromotionRepository");
const sptL11aEntertainmentRepository = require("../repositories/sptL11aEntertainmentRepository");
const sptL11aBadDebtRepository = require("../repositories/sptL11aBadDebtRepository");
const sptL11aFacilityRepository = require("../repositories/sptL11aFacilityRepository");
const sptL11aRegionalBenefitRepository = require("../repositories/sptL11aRegionalBenefitRepository");
const sptL11aRegionalFacilityRepository = require("../repositories/sptL11aRegionalFacilityRepository");
const sptL11aNplRepository = require("../repositories/sptL11aNplRepository");
const sptL11bRepository = require("../repositories/sptL11bRepository");
const sptL11bDebtBalanceRepository = require("../repositories/sptL11bDebtBalanceRepository");
const sptL11bEquityBalanceRepository = require("../repositories/sptL11bEquityBalanceRepository");
const sptL11bBorrowingCostRepository = require("../repositories/sptL11bBorrowingCostRepository");
const sptL11cRepository = require("../repositories/sptL11cRepository");
const sptL13aRepository = require("../repositories/sptL13aRepository");
const sptL13bRepository = require("../repositories/sptL13bRepository");
const sptL13bAgreementRepository = require("../repositories/sptL13bAgreementRepository");
const sptL13bSectionBRepository = require("../repositories/sptL13bSectionBRepository");
const sptL13bRdRepository = require("../repositories/sptL13bRdRepository");
const sptL13cRepository = require("../repositories/sptL13cRepository");
const sptL14Repository = require("../repositories/sptL14Repository");

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
 * Maps a parent-scoped L9-L14 section's `parentKey` to the existing
 * Repository method used to read all children of an already-resolved
 * immediate parent row. Matches exactly what GET SECTION L9-L14 PATCH
 * COMPATIBILITY §12 enumerates - no new Repository method is invented;
 * every name here already exists on its Repository (verified when each
 * of the 25 L9-L14 Repositories was built and reconciled).
 *
 * l13b_id intentionally maps to findAllByL13bId, not
 * findByL13bAndCategoryCode - a generic getSection("l13bSectionB") must
 * return the whole Section B roster, not one composite-identity row.
 * findByL13bAndCategoryCode remains available directly on
 * sptL13bSectionBRepository for callers that need that composite
 * lookup specifically.
 */
const PARENT_SCOPED_FINDER_BY_PARENT_KEY = Object.freeze({
  l9_id: "findAllByL9Id",
  regional_benefit_id: "findAllByRegionalBenefitId",
  l11b_id: "findAllByL11bId",
  l13b_id: "findAllByL13bId",
});

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
  mainForm: { repository: sptMainFormRepository, headerScoped: true, cardinality: "one" },
  l1: { repository: sptL1Repository, headerScoped: true, cardinality: "many" },
  l2: { repository: sptL2Repository, headerScoped: true, cardinality: "many" },
  l3: { repository: sptL3Repository, headerScoped: true, cardinality: "many" },
  l4: { repository: sptL4Repository, headerScoped: true, cardinality: "many" },
  l5Place: { repository: sptL5PlaceRepository, headerScoped: true, cardinality: "many" },
  l5Transaction: { repository: sptL5TransactionRepository, headerScoped: false, cardinality: "many" },
  l6: { repository: sptL6Repository, headerScoped: true, cardinality: "one" },
  l7: { repository: sptL7Repository, headerScoped: true, cardinality: "many" },
  l8: { repository: sptL8Repository, headerScoped: true, cardinality: "one" },

  // -------------------------------------------------------------------
  // L9-L14 (FINAL LOCKED Section Registry — new entry shape).
  //
  // These entries deliberately do NOT reuse the legacy L1-L8
  // `headerScoped: boolean` shape. L9-L14 has real nested parent-child
  // chains (e.g. header -> l9 -> l9Asset; header -> l11b -> debtBalance)
  // that a single boolean cannot express, so each entry instead carries:
  //   scope:         "header" | "parent"
  //   parentKey:     FK column this Service enforces/sets
  //                  ("header_id" for scope:"header"; the immediate
  //                  parent's FK column, e.g. "l9_id", for scope:"parent")
  //   cardinality:   "one" | "many" (informational + parent-resolution use)
  //   finder:        name of the Repository's single-row finder used to
  //                  resolve a scope:"header", cardinality:"one" parent
  //                  row (e.g. "findByHeaderId"), or null when the section
  //                  itself has no single-row finder to expose.
  //   parentSection: (scope:"parent" only) the SECTION_REGISTRY key of
  //                  the immediate parent, used by
  //                  _resolveImmediateParentId() to walk one hop up the
  //                  chain via the parent's own `finder`.
  //
  // No Repository methods beyond what already exists are invoked here
  // (Repository Contract §5 / this task's §5) — every `finder` named
  // below is a method that already exists on that section's Repository.
  // -------------------------------------------------------------------
  l9: { repository: sptL9Repository, scope: "header", parentKey: "header_id", cardinality: "one", finder: "findByHeaderId" },
  l9Asset: { repository: sptL9AssetRepository, scope: "parent", parentKey: "l9_id", cardinality: "many", finder: null, parentSection: "l9" },

  l10a: { repository: sptL10aRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },
  l10b: { repository: sptL10bRepository, scope: "header", parentKey: "header_id", cardinality: "one", finder: "findByHeaderId" },
  l10c: { repository: sptL10cRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },
  l10d: { repository: sptL10dRepository, scope: "header", parentKey: "header_id", cardinality: "one", finder: "findByHeaderId" },

  l11aPromotion: { repository: sptL11aPromotionRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },
  l11aEntertainment: { repository: sptL11aEntertainmentRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },
  l11aBadDebt: { repository: sptL11aBadDebtRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },
  l11aFacility: { repository: sptL11aFacilityRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },
  l11aRegionalBenefit: { repository: sptL11aRegionalBenefitRepository, scope: "header", parentKey: "header_id", cardinality: "one", finder: "findByHeaderId" },
  l11aRegionalFacility: { repository: sptL11aRegionalFacilityRepository, scope: "parent", parentKey: "regional_benefit_id", cardinality: "many", finder: null, parentSection: "l11aRegionalBenefit" },
  l11aNpl: { repository: sptL11aNplRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },

  l11b: { repository: sptL11bRepository, scope: "header", parentKey: "header_id", cardinality: "one", finder: "findByHeaderId" },
  l11bDebtBalance: { repository: sptL11bDebtBalanceRepository, scope: "parent", parentKey: "l11b_id", cardinality: "many", finder: null, parentSection: "l11b" },
  l11bEquityBalance: { repository: sptL11bEquityBalanceRepository, scope: "parent", parentKey: "l11b_id", cardinality: "many", finder: null, parentSection: "l11b" },
  l11bBorrowingCost: { repository: sptL11bBorrowingCostRepository, scope: "parent", parentKey: "l11b_id", cardinality: "many", finder: null, parentSection: "l11b" },

  l11c: { repository: sptL11cRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },

  l13a: { repository: sptL13aRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },

  l13b: { repository: sptL13bRepository, scope: "header", parentKey: "header_id", cardinality: "one", finder: "findByHeaderId" },
  l13bAgreement: { repository: sptL13bAgreementRepository, scope: "parent", parentKey: "l13b_id", cardinality: "many", finder: null, parentSection: "l13b" },
  l13bSectionB: { repository: sptL13bSectionBRepository, scope: "parent", parentKey: "l13b_id", cardinality: "many", finder: "findByL13bAndCategoryCode", parentSection: "l13b" },
  l13bRd: { repository: sptL13bRdRepository, scope: "parent", parentKey: "l13b_id", cardinality: "many", finder: null, parentSection: "l13b" },

  l13c: { repository: sptL13cRepository, scope: "header", parentKey: "header_id", cardinality: "many", finder: null },

  l14: { repository: sptL14Repository, scope: "header", parentKey: "header_id", cardinality: "many", finder: "findByHeaderAndTaxYear" },
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

  /**
   * Return the FK column name this Service enforces/sets for a section
   * registry entry — works across both the legacy L1-L8 shape
   * (`headerScoped: boolean`) and the L9-L14 shape (`scope: "header"`).
   * Returns null when no ownership scope is enforced by this generic
   * path (legacy `headerScoped: false`, i.e. l5Transaction, which uses
   * its own bespoke chain already coded in saveSection/updateSection).
   * scope:"parent" entries are handled separately by their own branch
   * (see _resolveImmediateParentId) and never reach this helper.
   * @private
   */
  _sectionOwnershipKey(entry) {
    if (entry.scope === "header") {
      return entry.parentKey || "header_id";
    }
    return entry.headerScoped ? "header_id" : null;
  }

  /**
   * For a scope:"parent" L9-L14 section (e.g. l9Asset, l11bDebtBalance,
   * l13bSectionB), resolve the immediate parent's row id for the given
   * Draft header, by looking up the parent's own SECTION_REGISTRY entry
   * and calling its `finder` (e.g. sptL9Repository.findByHeaderId).
   * Every parentSection referenced by an L9-L14 scope:"parent" entry is
   * itself scope:"header", cardinality:"one", with a single-row finder
   * — so this is always a single hop, never a multi-level walk.
   * @returns {Promise<number|string|null>} parent row id, or null if the
   *   parent section has not been saved yet for this Draft.
   * @private
   */
  async _resolveImmediateParentId(entry, headerId) {
    const parentEntry = SECTION_REGISTRY[entry.parentSection];
    const parentRow = await parentEntry.repository[parentEntry.finder](headerId);
    return parentRow ? parentRow.id : null;
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
    if (!actorContext || actorContext.userId === undefined || actorContext.userId === null) {
      throw new Error("saveSection requires actorContext.userId.");
    }

    const entry = this._resolveSection(sectionKey);
    const { repository } = entry;

    await this._assertDraftIsEditable(headerId);

    // spt_l5_transaction has no header_id column. Ownership is enforced
    // through the chain: sectionData.place_id -> spt_l5_place.header_id.
    // sectionData.place_id itself is never modified.
    if (sectionKey === "l5Transaction") {
      const place = await sptL5PlaceRepository.findById(sectionData.place_id);
      if (!place) {
        throw new SectionNotFoundError();
      }
      if (String(place.header_id) !== String(headerId)) {
        throw new SectionOwnershipMismatchError();
      }
      return repository.create({ ...sectionData });
    }

    if (sectionKey === "l3" && sectionData && sectionData.section_type === "PRIOR_YEAR_ADJUSTMENT") {
      // Section F FINAL DECISION: max one PRIOR_YEAR_ADJUSTMENT row per
      // header. Defensive safeguard independent of frontend dbId tracking
      // — if one already exists, update it instead of creating a duplicate.
      const existingRows = await sptL3Repository.findAllByHeaderId(headerId);
      const existingPrior = existingRows.find((r) => r.section_type === "PRIOR_YEAR_ADJUSTMENT");
      if (existingPrior) {
        return repository.updateById(existingPrior.id, { ...sectionData, header_id: headerId });
      }
    }

    if (entry.scope === "parent") {
      // L9-L14 nested parent-child sections (e.g. l9Asset -> l9,
      // l11bDebtBalance -> l11b, l13bSectionB/Agreement/Rd -> l13b,
      // l11aRegionalFacility -> l11aRegionalBenefit). Mirrors the
      // l5Transaction pattern above: the caller supplies the immediate
      // parent FK in sectionData; the Service only VERIFIES that FK
      // belongs to this Draft's header — it does not auto-resolve or
      // inject it, and the payload is otherwise persisted verbatim.
      const parentFkValue = sectionData ? sectionData[entry.parentKey] : undefined;
      if (parentFkValue === undefined || parentFkValue === null) {
        throw new SectionNotFoundError();
      }
      const resolvedParentId = await this._resolveImmediateParentId(entry, headerId);
      if (resolvedParentId === null) {
        throw new SectionNotFoundError();
      }
      if (String(parentFkValue) !== String(resolvedParentId)) {
        throw new SectionOwnershipMismatchError();
      }
      return repository.create({ ...sectionData });
    }

    const ownershipKey = this._sectionOwnershipKey(entry);
    const payload = ownershipKey
      ? { ...sectionData, [ownershipKey]: headerId }
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
    if (!actorContext || actorContext.userId === undefined || actorContext.userId === null) {
      throw new Error("updateSection requires actorContext.userId.");
    }

    const entry = this._resolveSection(sectionKey);
    const { repository } = entry;

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
      if (String(place.header_id) !== String(headerId)) {
        throw new SectionOwnershipMismatchError();
      }
      return repository.updateById(sectionId, { ...sectionData });
    }

    if (entry.scope === "parent") {
      // L9-L14 nested parent-child sections. Resolve the immediate
      // parent's row for this Draft, then verify the existing row's FK
      // matches it — mirrors the l5Transaction ownership chain above.
      const existing = await repository.findById(sectionId);
      if (!existing) {
        throw new SectionNotFoundError();
      }
      const resolvedParentId = await this._resolveImmediateParentId(entry, headerId);
      if (resolvedParentId === null) {
        throw new SectionNotFoundError();
      }
      if (String(existing[entry.parentKey]) !== String(resolvedParentId)) {
        throw new SectionOwnershipMismatchError();
      }
      // Never allow the update payload to move the row to a different parent.
      return repository.updateById(sectionId, { ...sectionData, [entry.parentKey]: existing[entry.parentKey] });
    }

    const ownershipKey = this._sectionOwnershipKey(entry);
    if (ownershipKey) {
      const existing = await repository.findById(sectionId);
      if (!existing) {
        throw new SectionNotFoundError();
      }
      // Normalize both sides to String before comparing: headerId comes
      // from req.params (always a string), while existing.header_id
      // comes from the DB/Sequelize (BIGINT column, may surface as a
      // Number). Without this, equal-value identifiers of different
      // types (e.g. 1 !== "1") would incorrectly fail strict equality.
      if (String(existing[ownershipKey]) !== String(headerId)) {
        throw new SectionOwnershipMismatchError();
      }
    }

    // Never allow the section update payload to move the row to a
    // different Draft.
    const payload = ownershipKey
      ? { ...sectionData, [ownershipKey]: headerId }
      : { ...sectionData };

    return repository.updateById(sectionId, payload);
  }

  // -----------------------------------------------------------------
  // 3b. deleteSection
  //     DELETE /api/v3/spt/drafts/:headerId/sections/:sectionKey/:sectionId
  //     Section G FINAL DECISION: HARD delete (physical row removal),
  //     not soft delete. Used for L2/L3/L4/L7 (and any other section)
  //     child rows removed by the user via the Draft UI. Ownership check
  //     mirrors updateSection exactly, including the l5Transaction
  //     place-based ownership chain and the String() normalization
  //     (Bug 2 fix pattern) — a row must belong to the requested header
  //     before it can be deleted.
  // -----------------------------------------------------------------
  async deleteSection(actorContext, headerId, sectionKey, sectionId) {
    const entry = this._resolveSection(sectionKey);
    const { repository } = entry;

    await this._assertDraftIsEditable(headerId);

    if (sectionKey === "l5Transaction") {
      const existingTransaction = await repository.findById(sectionId);
      if (!existingTransaction) {
        throw new SectionNotFoundError();
      }
      const place = await sptL5PlaceRepository.findById(existingTransaction.place_id);
      if (!place) {
        throw new SectionNotFoundError();
      }
      if (String(place.header_id) !== String(headerId)) {
        throw new SectionOwnershipMismatchError();
      }
      await repository.hardDeleteById(sectionId);
      return;
    }

    if (entry.scope === "parent") {
      const existing = await repository.findById(sectionId);
      if (!existing) {
        throw new SectionNotFoundError();
      }
      const resolvedParentId = await this._resolveImmediateParentId(entry, headerId);
      if (resolvedParentId === null) {
        throw new SectionNotFoundError();
      }
      if (String(existing[entry.parentKey]) !== String(resolvedParentId)) {
        throw new SectionOwnershipMismatchError();
      }
    } else {
      const ownershipKey = this._sectionOwnershipKey(entry);
      if (ownershipKey) {
        const existing = await repository.findById(sectionId);
        if (!existing) {
          throw new SectionNotFoundError();
        }
        if (String(existing[ownershipKey]) !== String(headerId)) {
          throw new SectionOwnershipMismatchError();
        }
      }
    }

    if (typeof repository.hardDeleteById !== "function") {
      // Defensive: only sections whose Repository was given hardDeleteById
      // (Section G scope: l2, l3, l4, l7) support this operation. Anything
      // else is a programming error, not a runtime/user-facing state.
      throw new UnknownSectionError();
    }

    await repository.hardDeleteById(sectionId);
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
    if (!actorContext || actorContext.userId === undefined || actorContext.userId === null) {
      throw new Error("calculate requires actorContext.userId.");
    }

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
    if (!actorContext || actorContext.userId === undefined || actorContext.userId === null) {
      throw new Error("deleteDraft requires actorContext.userId.");
    }

    const header = await sptHeaderRepository.findById(headerId);
    if (!header) {
      throw new DraftNotFoundError();
    }
    if (header.status !== DRAFT_STATUS) {
      throw new InvalidDraftStateError("Only a DRAFT may be deleted.");
    }

    return sptHeaderRepository.softDeleteById(headerId);
  }

  // -----------------------------------------------------------------
  // 7. resolveDraft — READ existing draft by business key.
  //
  //    Pure READ. Does NOT create, does NOT modify anything. Reuses
  //    sptHeaderRepository.findByBusinessKey — the SAME method
  //    createDraft() already uses internally for its duplicate check
  //    (no new Repository method). tax_return_type/amendment_number
  //    defaulting mirrors the Model FINAL defaultValue, identical to
  //    createDraft() (restated, not invented).
  //
  //    Throws DraftNotFoundError (→ 404) when no matching draft exists.
  //    Caller (Controller/frontend) treats 404 as "no draft yet" and
  //    falls back to createDraft — this is the resolve-then-create
  //    pattern requested, replacing "POST /drafts used as resolve".
  //
  // @param {{ userId: number|string }} actorContext
  // @param {{ company_id: number|string, tax_year: number|string,
  //   tax_return_type?: string, amendment_number?: number }} businessKey
  // @returns {Promise<{ header: object }>}
  // -----------------------------------------------------------------
  async resolveDraft(actorContext, businessKey) {
    if (!actorContext || actorContext.userId === undefined || actorContext.userId === null) {
      throw new Error("resolveDraft requires actorContext.userId.");
    }
    if (!businessKey) {
      throw new Error("resolveDraft requires businessKey.");
    }
    const { company_id, tax_year } = businessKey;
    if (company_id === undefined || company_id === null) {
      throw new Error("resolveDraft requires businessKey.company_id.");
    }
    if (tax_year === undefined || tax_year === null) {
      throw new Error("resolveDraft requires businessKey.tax_year.");
    }
    // Mirror spt_header Model FINAL defaultValue — identical to createDraft().
    const tax_return_type = businessKey.tax_return_type ?? "NORMAL";
    const amendment_number = businessKey.amendment_number ?? 0;

    const header = await sptHeaderRepository.findByBusinessKey({
      company_id,
      tax_year,
      tax_return_type,
      amendment_number,
    });
    if (!header) {
      throw new DraftNotFoundError();
    }
    return { header };
  }

  // -----------------------------------------------------------------
  // 8. getSection — READ persisted section rows for a Draft.
  //
  //    Pure READ mirror of saveSection/updateSection's section
  //    resolution (same SECTION_REGISTRY). Compatible with BOTH registry
  //    shapes:
  //      - legacy L1-L8:  entry.headerScoped (boolean)
  //      - locked L9-L14: entry.scope === "header" | "parent"
  //    Reuses each Repository's EXISTING read method — findAllByHeaderId
  //    for multi-row header-scoped sections, findByHeaderId for
  //    single-row/hasOne header-scoped sections, and the existing
  //    parent-scoped finder (findAllByL9Id / findAllByRegionalBenefitId /
  //    findAllByL11bId / findAllByL13bId) for L9-L14 nested children,
  //    resolved through the immediate parent via the same one-hop chain
  //    already used by saveSection/updateSection/deleteSection
  //    (_resolveImmediateParentId + entry.parentSection). No new
  //    Repository method. Result is always normalized to an array (0 or
  //    1 item for single-row sections) for a uniform Controller/frontend
  //    contract.
  //
  //    Unlike saveSection/updateSection, does NOT require DRAFT state —
  //    reading sections of an already-submitted Draft is not a write,
  //    so it is not blocked by _assertDraftIsEditable.
  //
  //    l5Transaction (headerScoped: false — no header_id column, only
  //    place_id) is out of scope for this header-based READ shape and
  //    throws UnknownSectionError, same as an unrecognized sectionKey —
  //    unchanged from before this patch.
  //
  //    A parent-scoped section whose immediate parent has not been
  //    saved yet for this Draft returns [] (not an error) — the same
  //    "nothing entered yet" semantics already used everywhere else in
  //    this method (a header-scoped section with zero rows, or a
  //    cardinality:"one" section with no row yet, both already return
  //    [] rather than throwing). It never falls back to header_id.
  //
  // @param {{ userId: number|string }} actorContext
  // @param {number|string} headerId - Draft reference.
  // @param {string} sectionKey - one of SECTION_REGISTRY keys.
  // @returns {Promise<object[]>}
  // -----------------------------------------------------------------
  async getSection(actorContext, headerId, sectionKey) {
    if (!actorContext || actorContext.userId === undefined || actorContext.userId === null) {
      throw new Error("getSection requires actorContext.userId.");
    }

    const header = await sptHeaderRepository.findById(headerId);
    if (!header) {
      throw new DraftNotFoundError();
    }

    const entry = SECTION_REGISTRY[sectionKey];
    const legacyHeaderScoped = !!entry && entry.headerScoped === true;
    const newHeaderScoped = !!entry && entry.scope === "header";
    const newParentScoped = !!entry && entry.scope === "parent";
    if (!entry || (!legacyHeaderScoped && !newHeaderScoped && !newParentScoped)) {
      throw new UnknownSectionError(sectionKey);
    }
    const { repository, cardinality } = entry;

    // l5Place — bundle each place's transactions (spt_l5_transaction has no
    // header_id column; ownership flows through place_id -> spt_l5_place.
    // header_id, already validated above via header lookup). Mirrors the
    // exact bundling already established in _readRawInput (used by
    // calculate/recalculate) — no new Repository method, reuses
    // findAllByPlaceId. This is additive to the response shape only; no
    // new route/endpoint/service signature is introduced.
    if (sectionKey === "l5Place") {
      const places = await repository.findAllByHeaderId(headerId);
      return Promise.all(
        places.map(async (place) => {
          const transactions = await sptL5TransactionRepository.findAllByPlaceId(place.id);
          const plain = typeof place.get === "function" ? place.get({ plain: true }) : place;
          return { ...plain, transactions };
        })
      );
    }

    if (newParentScoped) {
      // L9-L14 nested parent-child sections: resolve the immediate
      // parent row for this Draft first, then read children through the
      // existing parent-scoped finder. Never falls back to header_id.
      const resolvedParentId = await this._resolveImmediateParentId(entry, headerId);
      if (resolvedParentId === null) {
        return [];
      }
      const finderName = PARENT_SCOPED_FINDER_BY_PARENT_KEY[entry.parentKey];
      return repository[finderName](resolvedParentId);
    }

    // legacyHeaderScoped || newHeaderScoped
    if (cardinality === "one") {
      const record = await repository.findByHeaderId(headerId);
      return record ? [record] : [];
    }
    return repository.findAllByHeaderId(headerId);
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