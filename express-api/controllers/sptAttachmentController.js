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

    const numericHeaderId = Number(headerId);
    if (!/^\d+$/.test(String(headerId)) ||
        !Number.isSafeInteger(numericHeaderId) || numericHeaderId <= 0) {
      await cleanupTempFile(file && file.path).catch(() => {});
      return res.status(400).json({
        error: { code: "INVALID_HEADER_ID", message: "headerId tidak valid." },
      });
    }

    if (typeof documentCode !== "string" ||
        !documentCode.trim() || documentCode.trim().length > 100) {
      await cleanupTempFile(file && file.path).catch(() => {});
      return res.status(400).json({
        error: { code: "DOCUMENT_CODE_REQUIRED", message: "Field documentCode wajib diisi." },
      });
    }

    try {
      // sptHeaderRepository.findById only returns active headers (deleted_at IS NULL).
      const header = await sptHeaderRepository.findById(numericHeaderId);
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
        headerId: numericHeaderId,
        documentCode: documentCode.trim(),
        filePath: file.path,
        originalFileName: path.basename(file.originalname),
        mimeType: file.mimetype,
        fileSize: file.size,
      });

      return res.status(201).json({
        data: {
          attachmentId: saved.id,
          headerId: saved.header_id,
          documentCode: saved.document_code,
          originalFileName: saved.original_file_name,
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
}

module.exports = new SptAttachmentController();
module.exports.SptAttachmentController = SptAttachmentController;
