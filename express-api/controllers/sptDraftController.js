/**
 * SptDraftController
 *
 * Source of truth: Controller/API Contract FINAL, reconciled with the
 * now-patched Service Contract FINAL (POST-SERVICE VALIDATION = PASS).
 *
 * sptDraftPreparationService.js now accepts actorContext as the FIRST
 * parameter on all six business operations. This Controller calls the
 * Service accordingly on every method, including saveSection,
 * updateSection, calculate, recalculate, and deleteDraft, which
 * previously did not accept it.
 */


"use strict";

const sptDraftPreparationService = require("../services/sptDraftPreparationService");

const {
  DraftNotFoundError,
  InvalidDraftStateError,
  DuplicateDraftError,
  UnknownSectionError,
  SectionNotFoundError,
  SectionOwnershipMismatchError,
} = sptDraftPreparationService.errors || {};

// -----------------------------------------------------------------------
// Error mapping (per API Contract "ERROR MAPPING"). Keyed by err.code,
// exactly as thrown by the Service. No new business error is invented
// here and no Service error code is changed.
// -----------------------------------------------------------------------
const ERROR_CODE_TO_HTTP_STATUS = Object.freeze({
  DRAFT_NOT_FOUND: 404,
  INVALID_DRAFT_STATE: 409,
  DUPLICATE_DRAFT: 409,
  UNKNOWN_SECTION: 400,
  SECTION_NOT_FOUND: 404,
  SECTION_OWNERSHIP_MISMATCH: 409,
});

/**
 * Build the mandated actorContext from the FINAL authentication
 * convention (req.auth._id). Never falls back to req.user.id,
 * req.body.userId, req.query.userId, or req.params.userId.
 * @private
 */
function buildActorContext(req) {
  if (!req.auth || req.auth._id === undefined || req.auth._id === null) {
    return null;
  }
  return { userId: req.auth._id };
}

/**
 * Map a thrown error to an HTTP response.
 * Known Service domain errors (identified by err.code) use the
 * contract's fixed mapping. Anything else is an unexpected error and
 * gets a minimal, detail-free 500 — no stack trace or internal
 * database detail is exposed, and no new HTTP status is invented for
 * it.
 * @private
 */
function sendServiceError(res, err) {
  const status = err && err.code ? ERROR_CODE_TO_HTTP_STATUS[err.code] : undefined;
  if (status) {
    return res.status(status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
    },
  });
}

class SptDraftController {
  // -----------------------------------------------------------------
  // 1. createDraft
  //    POST /api/v3/spt/drafts
  // -----------------------------------------------------------------
  async createDraft(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const draftData = req.body && typeof req.body === "object" ? req.body : {};

    try {
      const result = await sptDraftPreparationService.createDraft(actorContext, draftData);
      return res.status(201).json({
        data: {
          headerId: result.header.id,
          mainFormId: result.mainForm.id,
        },
      });
    } catch (err) {
      return sendServiceError(res, err);
    }
  }

  // -----------------------------------------------------------------
  // 2. saveSection
  //    POST /api/v3/spt/drafts/:headerId/sections/:sectionKey
  // -----------------------------------------------------------------
  async saveSection(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const { headerId, sectionKey } = req.params;
    const sectionData = req.body && typeof req.body === "object" ? req.body : {};

    try {
      const result = await sptDraftPreparationService.saveSection(actorContext, headerId, sectionKey, sectionData);
      return res.status(201).json({
        data: {
          sectionKey,
          sectionId: result && result.id !== undefined ? result.id : null,
        },
      });
    } catch (err) {
      return sendServiceError(res, err);
    }
  }

  // -----------------------------------------------------------------
  // 3. updateSection
  //    PATCH /api/v3/spt/drafts/:headerId/sections/:sectionKey/:sectionId
  // -----------------------------------------------------------------
  async updateSection(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const { headerId, sectionKey, sectionId } = req.params;
    const sectionData = req.body && typeof req.body === "object" ? req.body : {};

    try {
      await sptDraftPreparationService.updateSection(actorContext, headerId, sectionKey, sectionId, sectionData);
      return res.status(200).json({
        data: {
          sectionKey,
          sectionId,
        },
      });
    } catch (err) {
      return sendServiceError(res, err);
    }
  }

  // -----------------------------------------------------------------
  // 3b. deleteSection
  //     DELETE /api/v3/spt/drafts/:headerId/sections/:sectionKey/:sectionId
  //     Hard delete (Section G FINAL DECISION) for child rows removed by
  //     the user via the Draft UI (L2/L3/L4/L7, etc).
  // -----------------------------------------------------------------
  async deleteSection(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const { headerId, sectionKey, sectionId } = req.params;

    try {
      await sptDraftPreparationService.deleteSection(actorContext, headerId, sectionKey, sectionId);
      return res.status(204).send();
    } catch (err) {
      return sendServiceError(res, err);
    }
  }

  // -----------------------------------------------------------------
  // 4. calculate
  //    POST /api/v3/spt/drafts/:headerId/calculate
  // -----------------------------------------------------------------
  async calculate(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const { headerId } = req.params;
    const calculationContext = req.body && typeof req.body === "object" ? req.body : {};

    try {
      const result = await sptDraftPreparationService.calculate(actorContext, headerId, calculationContext);
      return res.status(200).json({
        data: {
          headerId,
          calculationResult: result.calculationResult,
          status: result.status,
        },
      });
    } catch (err) {
      return sendServiceError(res, err);
    }
  }

  // -----------------------------------------------------------------
  // 5. recalculate
  //    POST /api/v3/spt/drafts/:headerId/recalculate
  // -----------------------------------------------------------------
  async recalculate(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const { headerId } = req.params;
    const calculationContext = req.body && typeof req.body === "object" ? req.body : {};

    try {
      const result = await sptDraftPreparationService.recalculate(actorContext, headerId, calculationContext);
      return res.status(200).json({
        data: {
          headerId,
          calculationResult: result.calculationResult,
          status: result.status,
        },
      });
    } catch (err) {
      return sendServiceError(res, err);
    }
  }

  // -----------------------------------------------------------------
  // 6. deleteDraft
  //    DELETE /api/v3/spt/drafts/:headerId
  // -----------------------------------------------------------------
  async deleteDraft(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const { headerId } = req.params;

    try {
      await sptDraftPreparationService.deleteDraft(actorContext, headerId);
      return res.status(204).send();
    } catch (err) {
      return sendServiceError(res, err);
    }
  }

  // -----------------------------------------------------------------
  // 7. resolveDraft
  //    GET /api/v3/spt/drafts/resolve?company_id=&tax_year=&tax_return_type=&amendment_number=
  //    READ-only. 404 DRAFT_NOT_FOUND means "no draft yet for this
  //    business key" — caller falls back to POST /drafts (createDraft).
  // -----------------------------------------------------------------
  async resolveDraft(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const { company_id, tax_year, tax_return_type, amendment_number } = req.query;
    if (company_id === undefined || tax_year === undefined) {
      return res.status(400).json({
        error: { code: "INVALID_BUSINESS_KEY", message: "company_id and tax_year are required." },
      });
    }

    try {
      const result = await sptDraftPreparationService.resolveDraft(actorContext, {
        company_id,
        tax_year,
        tax_return_type,
        amendment_number: amendment_number !== undefined ? Number(amendment_number) : undefined,
      });
      return res.status(200).json({
        data: { headerId: result.header.id },
      });
    } catch (err) {
      return sendServiceError(res, err);
    }
  }

  // -----------------------------------------------------------------
  // 8. getSection
  //    GET /api/v3/spt/drafts/:headerId/sections/:sectionKey
  //    READ-only. Returns all persisted rows for that section/header.
  // -----------------------------------------------------------------
  async getSection(req, res) {
    const actorContext = buildActorContext(req);
    if (!actorContext) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Missing authenticated actor." },
      });
    }

    const { headerId, sectionKey } = req.params;

    try {
      const rows = await sptDraftPreparationService.getSection(actorContext, headerId, sectionKey);
      return res.status(200).json({
        data: { sectionKey, rows },
      });
    } catch (err) {
      return sendServiceError(res, err);
    }
  }
}

module.exports = new SptDraftController();
module.exports.SptDraftController = SptDraftController;
