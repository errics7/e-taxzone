// Google Drive service foundation (G2.5-A).
// Builds an authenticated Google Drive API client from the existing Google
// OAuth configuration (config/googleOAuth.js) and GOOGLE_REFRESH_TOKEN.
// Generic Drive infrastructure only: no SPT/attachment/business logic here.
const fs = require("fs");
const { google } = require("googleapis");
const {
  DRIVE_FILE_SCOPE,
  GoogleOAuthConfigError,
  getGoogleOAuthConfig,
} = require("../config/googleOAuth");

// Created lazily and reused, so the server still boots when Google
// credentials are absent and the library's access-token cache is shared.
let oauth2Client = null;
let driveClient = null;

function readRefreshToken() {
  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN || "").trim();
  if (!refreshToken) {
    throw new GoogleOAuthConfigError(
      "Missing required environment variable(s): GOOGLE_REFRESH_TOKEN"
    );
  }
  return refreshToken;
}

// OAuth2 client built from GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (via the
// existing config) with GOOGLE_REFRESH_TOKEN attached. Access tokens are
// obtained and refreshed automatically by googleapis when a request is made;
// they are kept in memory only and never stored or logged.
function getOAuth2Client() {
  if (oauth2Client) return oauth2Client;

  const config = getGoogleOAuthConfig(); // throws GoogleOAuthConfigError if ID/secret missing
  const refreshToken = readRefreshToken();

  const client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );
  client.setCredentials({ refresh_token: refreshToken });

  oauth2Client = client;
  return oauth2Client;
}

// Authenticated Google Drive v3 client (scope: drive.file).
function getDriveClient() {
  if (driveClient) return driveClient;
  driveClient = google.drive({ version: "v3", auth: getOAuth2Client() });
  return driveClient;
}

// Read-only: identity of the Google account behind the authenticated client.
// Uses Drive API about.get (GET /drive/v3/about) and requests only the three
// user fields below. Works with the drive.file scope. Google API errors are
// not caught: they propagate to the caller unchanged.
const IDENTITY_FIELDS = "user(displayName,emailAddress,permissionId)";

async function getDriveIdentity() {
  const drive = getDriveClient();
  const res = await drive.about.get({ fields: IDENTITY_FIELDS });
  const user = (res && res.data && res.data.user) || {};
  return {
    displayName: user.displayName || null,
    emailAddress: user.emailAddress || null,
    permissionId: user.permissionId || null,
  };
}

// ---------------------------------------------------------------------------
// Folder resolution (generic: callers supply already-resolved folder names).
// ---------------------------------------------------------------------------
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
const DRIVE_ROOT_ID = "root";

// Escape a value for use inside a single-quoted Drive query string.
function escapeQueryValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${label} must be a non-empty string`);
  }
}

// All non-trashed folders named exactly `name` directly under `parentId`.
// Drive may return partial pages, so follow nextPageToken; stop as soon as a
// duplicate is seen. The name is re-checked in code because the exact-match
// semantics of Drive's `name =` operator are not relied upon.
async function listMatchingFolders(drive, name, parentId) {
  const q = [
    `name = '${escapeQueryValue(name)}'`,
    `mimeType = '${FOLDER_MIME_TYPE}'`,
    `'${escapeQueryValue(parentId)}' in parents`,
    "trashed = false",
  ].join(" and ");

  const matches = [];
  let pageToken;
  do {
    const res = await drive.files.list({
      q,
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
      spaces: "drive",
      pageToken,
    });
    for (const file of res.data.files || []) {
      if (file.name === name) matches.push(file);
    }
    pageToken = matches.length > 1 ? undefined : res.data.nextPageToken;
  } while (pageToken);
  return matches;
}

async function resolveFolder(name, parentId) {
  const drive = getDriveClient();
  const matches = await listMatchingFolders(drive, name, parentId);

  if (matches.length === 1) {
    return { folderId: matches[0].id, folderName: matches[0].name };
  }

  if (matches.length > 1) {
    const err = new Error(
      `Multiple Google Drive folders named "${name}" exist under parent "${parentId}"`
    );
    err.code = "DRIVE_FOLDER_DUPLICATE";
    err.folderName = name;
    err.parentId = parentId;
    err.folderIds = matches.map((f) => f.id);
    throw err;
  }

  const created = await drive.files.create({
    requestBody: { name, mimeType: FOLDER_MIME_TYPE, parents: [parentId] },
    fields: "id, name",
  });
  return { folderId: created.data.id, folderName: created.data.name };
}

// Concurrent calls for the same (parent, name) in this process share one
// lookup/creation, so they cannot create duplicates of each other.
const inFlightFolders = new Map();

// Find the folder `name` directly under `parentId`, or create it.
// Returns { folderId, folderName }. Throws (code DRIVE_FOLDER_DUPLICATE) when
// more than one match exists; Google API errors propagate unchanged.
async function findOrCreateFolder(name, parentId) {
  assertNonEmptyString(name, "name");
  assertNonEmptyString(parentId, "parentId");

  const key = `${parentId}\u0000${name}`;
  let task = inFlightFolders.get(key);
  if (!task) {
    task = resolveFolder(name, parentId).finally(() =>
      inFlightFolders.delete(key)
    );
    inFlightFolders.set(key, task);
  }
  return { ...(await task) };
}

// Resolve/create a nested path one level at a time, starting at the Drive
// root. Each level is searched only under the previous level's folder.
// Returns the final folder as { folderId, folderName }.
async function ensureFolderPath(folderNames) {
  if (!Array.isArray(folderNames) || folderNames.length === 0) {
    throw new TypeError("folderNames must be a non-empty array");
  }
  // Validate everything first so bad input never leaves a partial path.
  folderNames.forEach((n, i) => assertNonEmptyString(n, `folderNames[${i}]`));

  let parentId = DRIVE_ROOT_ID;
  let folder;
  for (const name of folderNames) {
    folder = await findOrCreateFolder(name, parentId);
    parentId = folder.folderId;
  }
  return folder;
}

// ---------------------------------------------------------------------------
// File operations (generic: identity is the Drive file ID, never the name).
// ---------------------------------------------------------------------------

// Drive returns size as a string of bytes (absent for some file types).
function toSize(size) {
  return size === undefined || size === null ? null : Number(size);
}

// Upload one local file as a NEW file inside an already-resolved folder.
// The file is streamed from disk (never loaded into memory) and is left in
// place afterwards; its lifecycle belongs to the caller. Nothing is
// overwritten: every call creates a new Drive file.
// Returns { fileId, fileName, mimeType, size } (size in bytes, or null).
async function uploadFile({ filePath, fileName, mimeType, parentFolderId } = {}) {
  assertNonEmptyString(filePath, "filePath");
  assertNonEmptyString(fileName, "fileName");
  assertNonEmptyString(mimeType, "mimeType");
  assertNonEmptyString(parentFolderId, "parentFolderId");

  // Local file problems (missing, unreadable) surface here as the original fs error.
  const stat = await fs.promises.stat(filePath);
  if (!stat.isFile()) {
    throw new TypeError("filePath must point to a regular file");
  }
  await fs.promises.access(filePath, fs.constants.R_OK);

  const drive = getDriveClient();
  const stream = fs.createReadStream(filePath);
  try {
    const res = await drive.files.create({
      requestBody: { name: fileName, parents: [parentFolderId] },
      media: { mimeType, body: stream },
      fields: "id, name, mimeType, size",
    });
    return {
      fileId: res.data.id,
      fileName: res.data.name,
      mimeType: res.data.mimeType,
      size: toSize(res.data.size),
    };
  } finally {
    // The request has settled. Release the file handle even if it failed before
    // reading the stream. A late open error (e.g. the caller already removed its
    // temp file) must not become an unhandled 'error' event that crashes the process.
    stream.on("error", () => {});
    stream.destroy();
  }
}

// Metadata only (no content download) for the Drive file with this ID.
// Returns { fileId, fileName, mimeType, size, parentFolderIds }.
async function getFile(fileId) {
  assertNonEmptyString(fileId, "fileId");
  const res = await getDriveClient().files.get({
    fileId,
    fields: "id, name, mimeType, size, parents",
  });
  return {
    fileId: res.data.id,
    fileName: res.data.name,
    mimeType: res.data.mimeType,
    size: toSize(res.data.size),
    parentFolderIds: res.data.parents || [],
  };
}

// List every non-trashed entry (files AND folders) directly inside the folder
// with this ID, following nextPageToken until all pages are consumed. Generic
// infrastructure only: it knows nothing about attachments, orphans, ownership,
// or any business rule, and uses fileId (never the name) as identity. Callers
// that only want files filter on mimeType themselves. Does not create anything.
// Google API errors propagate unchanged.
// Returns [{ fileId, fileName, mimeType, size, parentFolderIds }].
async function listFilesInFolder(parentFolderId) {
  assertNonEmptyString(parentFolderId, "parentFolderId");
  const drive = getDriveClient();

  const q = [
    `'${escapeQueryValue(parentFolderId)}' in parents`,
    "trashed = false",
  ].join(" and ");

  const files = [];
  let pageToken;
  do {
    const res = await drive.files.list({
      q,
      pageSize: 100,
      fields: "nextPageToken, files(id, name, mimeType, size, parents)",
      spaces: "drive",
      pageToken,
    });
    for (const file of res.data.files || []) {
      files.push({
        fileId: file.id,
        fileName: file.name,
        mimeType: file.mimeType,
        size: toSize(file.size),
        parentFolderIds: file.parents || [],
      });
    }
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return files;
}

// Permanently delete the Drive file with this ID (Drive's files.delete skips
// the trash). No lookup by name; errors (including 404/403) propagate.
// Returns { fileId, deleted: true }.
async function deleteFile(fileId) {
  assertNonEmptyString(fileId, "fileId");
  await getDriveClient().files.delete({ fileId });
  return { fileId, deleted: true };
}

// True when all required environment variables are present.
function isDriveConfigured() {
  try {
    getGoogleOAuthConfig();
    readRefreshToken();
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  DRIVE_FILE_SCOPE,
  getOAuth2Client,
  getDriveClient,
  getDriveIdentity,
  findOrCreateFolder,
  ensureFolderPath,
  uploadFile,
  getFile,
  listFilesInFolder,
  deleteFile,
  isDriveConfigured,
};
