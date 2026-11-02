"use strict";

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const multer = require("multer");
const unzipper = require("unzipper");

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MiB
const ALLOWED_TYPES = Object.freeze({
  ".pdf": {
    mime: "application/pdf",
    signature: (b) => b.length >= 5 && b.subarray(0, 5).toString("ascii") === "%PDF-",
  },
  ".xls": {
    mime: "application/vnd.ms-excel",
    // Microsoft Compound File Binary (legacy XLS)
    signature: (b) => b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  },
  ".xlsx": {
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    signature: isZipSignature,
  },
  ".doc": {
    mime: "application/msword",
    // Legacy DOC uses the same Compound File Binary signature as XLS.
    signature: (b) => b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  },
  ".docx": {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    signature: isZipSignature,
  },
});

function isZipSignature(buffer) {
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b &&
    ((buffer[2] === 0x03 && buffer[3] === 0x04) ||
     (buffer[2] === 0x05 && buffer[3] === 0x06) ||
     (buffer[2] === 0x07 && buffer[3] === 0x08));
}

function safeOriginalName(name) {
  if (typeof name !== "string" || name.length === 0) return false;
  if (name.length > 255) return false;
  if (/[\\/\x00-\x1f\x7f]/.test(name)) return false;
  return path.basename(name) === name;
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, os.tmpdir()),
  filename: (_req, _file, callback) => callback(null, `spt-attachment-${crypto.randomUUID()}.tmp`),
});

const multerUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 5, fieldSize: 1024 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const rule = ALLOWED_TYPES[extension];
    if (!rule || file.mimetype !== rule.mime || !safeOriginalName(file.originalname)) {
      const error = new Error("Format file tidak didukung. Gunakan PDF, XLS, XLSX, DOC, atau DOCX.");
      error.code = "ATTACHMENT_INVALID_FILE_TYPE";
      return callback(error);
    }
    callback(null, true);
  },
}).single("file");

async function validateOoxmlStructure(file, extension) {
  // XLSX and DOCX are ZIP containers. A ZIP signature alone is insufficient:
  // require the package content-types file and the format-specific main part.
  const directory = await unzipper.Open.file(file.path);
  const entryNames = new Set(directory.files.map((entry) => entry.path));
  const hasContentTypes = entryNames.has("[Content_Types].xml");
  const requiredPart = extension === ".xlsx" ? "xl/workbook.xml" : "word/document.xml";

  if (!hasContentTypes || !entryNames.has(requiredPart)) {
    const error = new Error("Struktur dokumen Office tidak sesuai dengan ekstensi file.");
    error.code = "ATTACHMENT_INVALID_FILE_STRUCTURE";
    throw error;
  }
}

async function validateFileSignature(file) {
  const extension = path.extname(file.originalname).toLowerCase();
  const rule = ALLOWED_TYPES[extension];
  const handle = await fs.promises.open(file.path, "r");
  try {
    const buffer = Buffer.alloc(16);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    if (!rule || !rule.signature(buffer.subarray(0, bytesRead))) {
      const error = new Error("Isi file tidak sesuai dengan format dokumen yang diizinkan.");
      error.code = "ATTACHMENT_INVALID_FILE_SIGNATURE";
      throw error;
    }
  } finally {
    await handle.close();
  }

  if (extension === ".xlsx" || extension === ".docx") {
    try {
      await validateOoxmlStructure(file, extension);
    } catch (error) {
      if (error.code === "ATTACHMENT_INVALID_FILE_STRUCTURE") throw error;
      const invalid = new Error("File XLSX/DOCX bukan paket Office yang valid.");
      invalid.code = "ATTACHMENT_INVALID_FILE_STRUCTURE";
      throw invalid;
    }
  }
}

function cleanupTempFile(filePath) {
  if (!filePath) return Promise.resolve();
  return fs.promises.unlink(filePath).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}

function sptAttachmentUpload(req, res, next) {
  multerUpload(req, res, async (multerError) => {
    if (multerError) {
      const tooLarge = multerError.code === "LIMIT_FILE_SIZE";
      const status = tooLarge ? 413 : (multerError.code === "LIMIT_UNEXPECTED_FILE" ? 400 : 415);
      return res.status(status).json({
        error: {
          code: tooLarge ? "ATTACHMENT_FILE_TOO_LARGE" : (multerError.code || "ATTACHMENT_UPLOAD_INVALID"),
          message: tooLarge ? "Ukuran file maksimal adalah 4 MiB." : multerError.message,
        },
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: { code: "ATTACHMENT_FILE_REQUIRED", message: "Sertakan satu file pada field 'file'." },
      });
    }

    try {
      await validateFileSignature(req.file);
      next();
    } catch (error) {
      await cleanupTempFile(req.file.path).catch(() => {});
      const invalidFile = error.code === "ATTACHMENT_INVALID_FILE_SIGNATURE" ||
        error.code === "ATTACHMENT_INVALID_FILE_STRUCTURE";
      const status = invalidFile ? 415 : 500;
      return res.status(status).json({
        error: {
          code: error.code || "ATTACHMENT_FILE_VALIDATION_FAILED",
          message: status === 500 ? "File gagal divalidasi." : error.message,
        },
      });
    }
  });
}

module.exports = sptAttachmentUpload;
module.exports.MAX_FILE_SIZE = MAX_FILE_SIZE;
module.exports.cleanupTempFile = cleanupTempFile;
