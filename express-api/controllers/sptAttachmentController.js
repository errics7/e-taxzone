"use strict";

const path = require("path");
const sptHeaderRepository = require("../repositories/sptHeaderRepository");
const sptAttachmentStorageService = require("../services/sptAttachmentStorageService");
const sptAttachmentUploadMiddleware = require("../middleware/sptAttachmentUpload.middleware");

const { cleanupTempFile } = sptAttachmentUploadMiddleware;

function getActorId(req) {
  return req.auth && req.auth._id !== undefined && req.auth._id !== null
    ? req.auth._id
    : null;
}

// Canonical Section I filenames for Google Drive. The original uploaded
// filename remains in TiDB for audit; Drive uses these controlled names.
const SECTION_I_FILE_NAMES = Object.freeze({
  FINANCIAL_STATEMENT: "Financial Statement.pdf",
  CONSOLIDATED_FS_GROUP: "Consolidated Financial Statement.pdf",
  AUDIT_OPINION: "Audit Opinion.pdf",
  CONSOLIDATED_FS_PE: "Consolidated Financial Statement - Permanent Establishment.pdf",
  FOREIGN_TAX_CREDIT: "Foreign Tax Credit Withholding Evidence.pdf",
  REINVESTMENT_EVIDENCE: "Reinvestment and Realization Evidence.pdf",
  FOREIGN_DIVIDEND_CALC: "Foreign Dividend Tax Credit Calculation Letter.pdf",
  FOREIGN_CFC_FS: "Foreign Controlled Non-listed Company Financial Statement.pdf",
  FOREIGN_CFC_RETURN: "Foreign Controlled Non-listed Company Annual Tax Return.pdf",
  FOREIGN_CFC_PROFIT: "Foreign Controlled Non-listed Company Profit Calculation.pdf",
  FOREIGN_DIVIDEND_PAYMENT: "Foreign Dividend Income Tax Payment Evidence.pdf",
  ZAKAT_PAYMENT: "Zakat Payment Evidence.pdf",
  PUBLIC_CO_TAX_REDUCTION: "Public Company Tax Rate Reduction Report.pdf",
  MONTHLY_REPORT: "Monthly Report.pdf",
  RELATED_PARTY_SHARE: "Related Party Share Ownership Report.pdf",
  CBCR_RECEIPT: "Country-by-Country Report Electronic Receipt.pdf",
  OTHER_DOCUMENTS: null,
});

function getSectionIStoredFileName(documentCode, originalFileName) {
  const mapped = SECTION_I_FILE_NAMES[documentCode];
  if (mapped) return mapped;
  if (documentCode === "OTHER_DOCUMENTS") return path.basename(originalFileName);
  // Preserve generic attachment compatibility for codes owned by other sections.
  return path.basename(originalFileName);
}

function sendError(res, error) {
  const code = error && error.code;
  if (code === "ATTACHMENT_OWNERSHIP_HEADER_NOT_FOUND") {
    return res.status(404).json({ error: { code, message: "SPT tidak ditemukan." } });
  }
  if (code === "ATTACHMENT_VALIDATION_ERROR") {
    return res.status(400).json({ error: { code, message: error.message } });
  }
  if (code === "ATTACHMENT_COMPENSATION_FAILED") {
    // Do not expose Drive IDs or internal compensation details to the client.
    return res.status(500).json({
      error: { code, message: "Upload belum berhasil diselesaikan. Tim teknis perlu memeriksa proses penyimpanan." },
    });
  }
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan saat mengunggah attachment." },
  });
}

class SptAttachmentController {
  /** GET /api/v3/spt/drafts/:headerId/attachments */
  async list(req, res) {
    const actorId = getActorId(req);
    if (actorId === null) {
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Pengguna belum terautentikasi." },
      });
    }

    const { headerId } = req.params;
    if (!/^\d+$/.test(String(headerId)) || Number(headerId) <= 0) {
      return res.status(400).json({
        error: { code: "INVALID_HEADER_ID", message: "headerId tidak valid." },
      });
    }

    try {
      const header = await sptHeaderRepository.findById(headerId);
      if (!header) {
        return res.status(404).json({
          error: { code: "DRAFT_NOT_FOUND", message: "SPT tidak ditemukan." },
        });
      }

      if (String(header.created_by) !== String(actorId)) {
        return res.status(403).json({
          error: { code: "SPT_ACCESS_DENIED", message: "Anda tidak memiliki akses ke SPT ini." },
        });
      }

      const rows = await sptAttachmentStorageService.listAttachmentsByHeaderId(headerId);
      const attachments = rows.map((row) => ({
        attachmentId: row.id,
        headerId: row.header_id,
        documentCode: row.document_code,
        originalFileName: row.original_file_name,
        storedFileName: row.stored_file_name,
        mimeType: row.mime_type,
        fileSize: Number(row.file_size),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return res.status(200).json({ data: { attachments } });
    } catch (error) {
      if (error && error.code === "ATTACHMENT_VALIDATION_ERROR") {
        return res.status(400).json({
          error: { code: error.code, message: error.message },
        });
      }
      console.error("[SPT_ATTACHMENT_LIST_FAILED]", error && error.message);
      return res.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan saat memuat daftar attachment." },
      });
    }
  }

  /** POST /api/v3/spt/drafts/:headerId/attachments */
  async upload(req, res) {
    const actorId = getActorId(req);
    if (actorId === null) {
      await cleanupTempFile(req.file && req.file.path).catch(() => {});
      return res.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Pengguna belum terautentikasi." },
      });
    }

    const { headerId } = req.params;
    const documentCode = req.body && req.body.documentCode;
    const file = req.file;

    if (!/^\d+$/.test(String(headerId)) || Number(headerId) <= 0) {
      await cleanupTempFile(file && file.path).catch(() => {});
      return res.status(400).json({
        error: { code: "INVALID_HEADER_ID", message: "headerId tidak valid." },
      });
    }

    if (typeof documentCode !== "string" || !documentCode.trim()) {
      await cleanupTempFile(file && file.path).catch(() => {});
      return res.status(400).json({
        error: { code: "DOCUMENT_CODE_REQUIRED", message: "Field documentCode wajib diisi." },
      });
    }

    try {
      // sptHeaderRepository.findById only returns active headers (deleted_at IS NULL).
      const header = await sptHeaderRepository.findById(headerId);
      if (!header) {
        return res.status(404).json({
          error: { code: "DRAFT_NOT_FOUND", message: "SPT tidak ditemukan." },
        });
      }

      // Account ownership is per SPT creator, not the company's PIC.
      if (String(header.created_by) !== String(actorId)) {
        return res.status(403).json({
          error: { code: "SPT_ACCESS_DENIED", message: "Anda tidak memiliki akses ke SPT ini." },
        });
      }

      if (header.status !== "DRAFT") {
        return res.status(409).json({
          error: { code: "INVALID_DRAFT_STATE", message: "Attachment hanya dapat diunggah selama SPT berstatus DRAFT." },
        });
      }

      const saved = await sptAttachmentStorageService.uploadAndPersistAttachment({
        headerId,
        documentCode: documentCode.trim(),
        filePath: file.path,
        originalFileName: path.basename(file.originalname),
        storedFileName: getSectionIStoredFileName(documentCode.trim(), file.originalname),
        mimeType: file.mimetype,
        fileSize: file.size,
      });

      return res.status(201).json({
        data: {
          attachmentId: saved.id,
          headerId: saved.header_id,
          documentCode: saved.document_code,
          originalFileName: saved.original_file_name,
          storedFileName: saved.stored_file_name,
          mimeType: saved.mime_type,
          fileSize: Number(saved.file_size),
          uploaded: true,
        },
      });
    } catch (error) {
      return sendError(res, error);
    } finally {
      await cleanupTempFile(file && file.path).catch((cleanupError) => {
        // The request outcome is already determined. Do not expose local paths.
        console.error("[SPT_ATTACHMENT_TEMP_CLEANUP_FAILED]", cleanupError.code || "UNKNOWN");
      });
    }
  }

  /** GET /api/v3/spt/drafts/:headerId/attachments/:attachmentId/preview */
  async preview(req, res) {
    const actorId = getActorId(req);
    if (actorId === null) {
      return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Pengguna belum terautentikasi." } });
    }

    const { headerId, attachmentId } = req.params;
    const numericHeaderId = Number(headerId);
    const numericAttachmentId = Number(attachmentId);
    if (!/^\d+$/.test(String(headerId)) || !Number.isSafeInteger(numericHeaderId) || numericHeaderId <= 0 ||
        !/^\d+$/.test(String(attachmentId)) || !Number.isSafeInteger(numericAttachmentId) || numericAttachmentId <= 0) {
      return res.status(400).json({ error: { code: "INVALID_ATTACHMENT_ID", message: "ID SPT atau attachment tidak valid." } });
    }

    try {
      const header = await sptHeaderRepository.findById(numericHeaderId);
      if (!header) return res.status(404).json({ error: { code: "DRAFT_NOT_FOUND", message: "SPT tidak ditemukan." } });
      if (String(header.created_by) !== String(actorId)) {
        return res.status(403).json({ error: { code: "SPT_ACCESS_DENIED", message: "Anda tidak memiliki akses ke SPT ini." } });
      }

      const result = await sptAttachmentStorageService.getAttachmentDownload(numericHeaderId, numericAttachmentId);
      if (!result) return res.status(404).json({ error: { code: "ATTACHMENT_NOT_FOUND", message: "Lampiran tidak ditemukan." } });
      if (result.attachment.mime_type !== "application/pdf") {
        result.stream.destroy();
        return res.status(415).json({ error: { code: "PREVIEW_UNSUPPORTED", message: "Preview hanya tersedia untuk PDF." } });
      }

      const safeName = String(result.attachment.stored_file_name || result.attachment.original_file_name || "attachment.pdf")
        .replace(/[\\r\\n"]/g, "_");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${safeName}"`);
      res.setHeader("Cache-Control", "private, no-store");
      result.stream.on("error", (error) => {
        console.error("[SPT_ATTACHMENT_PREVIEW_STREAM_FAILED]", error.code || error.message);
        if (!res.headersSent) res.status(502).end();
        else res.destroy(error);
      });
      result.stream.pipe(res);
    } catch (error) {
      console.error("[SPT_ATTACHMENT_PREVIEW_FAILED]", error.code || error.message);
      if (!res.headersSent) {
        return res.status(500).json({ error: { code: "ATTACHMENT_PREVIEW_FAILED", message: "File lampiran gagal dimuat." } });
      }
    }
  }

  /** DELETE /api/v3/spt/drafts/:headerId/attachments/:attachmentId */
  async remove(req, res) {
    const actorId = getActorId(req);
    if (actorId === null) {
      return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Pengguna belum terautentikasi." } });
    }

    const { headerId, attachmentId } = req.params;
    const numericHeaderId = Number(headerId);
    const numericAttachmentId = Number(attachmentId);
    if (!/^\d+$/.test(String(headerId)) || !Number.isSafeInteger(numericHeaderId) || numericHeaderId <= 0 ||
        !/^\d+$/.test(String(attachmentId)) || !Number.isSafeInteger(numericAttachmentId) || numericAttachmentId <= 0) {
      return res.status(400).json({ error: { code: "INVALID_ATTACHMENT_ID", message: "ID SPT atau attachment tidak valid." } });
    }

    try {
      const header = await sptHeaderRepository.findById(numericHeaderId);
      if (!header) return res.status(404).json({ error: { code: "DRAFT_NOT_FOUND", message: "SPT tidak ditemukan." } });
      if (String(header.created_by) !== String(actorId)) {
        return res.status(403).json({ error: { code: "SPT_ACCESS_DENIED", message: "Anda tidak memiliki akses ke SPT ini." } });
      }
      if (header.status !== "DRAFT") {
        return res.status(409).json({ error: { code: "INVALID_DRAFT_STATE", message: "Lampiran hanya dapat dihapus selama SPT berstatus DRAFT." } });
      }

      const deleted = await sptAttachmentStorageService.hardDeleteAttachment(numericHeaderId, numericAttachmentId);
      if (!deleted) return res.status(404).json({ error: { code: "ATTACHMENT_NOT_FOUND", message: "Lampiran tidak ditemukan pada draft ini." } });

      return res.status(200).json({ data: { attachmentId: deleted.attachmentId, deleted: true } });
    } catch (error) {
      if (error.code === "ATTACHMENT_VALIDATION_ERROR") {
        return res.status(400).json({ error: { code: error.code, message: error.message } });
      }
      if (error.code === "ATTACHMENT_DELETE_DB_INCONSISTENT") {
        console.error("[SPT_ATTACHMENT_DELETE_DB_INCONSISTENT]", error.cause?.code || error.message);
        return res.status(500).json({ error: { code: error.code, message: "File fisik sudah dihapus, tetapi metadata gagal dihapus. Hubungi administrator untuk rekonsiliasi." } });
      }
      console.error("[SPT_ATTACHMENT_DELETE_FAILED]", error.code || error.message);
      return res.status(500).json({ error: { code: "ATTACHMENT_DELETE_FAILED", message: "Lampiran gagal dihapus." } });
    }
  }
}

module.exports = new SptAttachmentController();
module.exports.SptAttachmentController = SptAttachmentController;
