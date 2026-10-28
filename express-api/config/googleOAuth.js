// Google OAuth configuration (backend-only).
// All credentials come from environment variables; nothing is hard-coded.
require("dotenv").config({ quiet: true });

const DRIVE_FILE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const DEFAULT_REDIRECT_URI = "http://localhost:8000/oauth2callback";
const CALLBACK_PATH = "/oauth2callback";

class GoogleOAuthConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "GoogleOAuthConfigError";
  }
}

// The authorization routes hand out a long-lived credential, so they only
// respond while GOOGLE_OAUTH_SETUP_ENABLED=true (one-time setup switch).
function isSetupEnabled() {
  return (
    String(process.env.GOOGLE_OAUTH_SETUP_ENABLED || "")
      .trim()
      .toLowerCase() === "true"
  );
}

function getGoogleOAuthConfig() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  const redirectUri = (
    process.env.GOOGLE_REDIRECT_URI || DEFAULT_REDIRECT_URI
  ).trim();

  const missing = [];
  if (!clientId) missing.push("GOOGLE_CLIENT_ID");
  if (!clientSecret) missing.push("GOOGLE_CLIENT_SECRET");
  if (missing.length) {
    throw new GoogleOAuthConfigError(
      `Missing required environment variable(s): ${missing.join(", ")}`
    );
  }

  let parsed;
  try {
    parsed = new URL(redirectUri);
  } catch (e) {
    throw new GoogleOAuthConfigError("GOOGLE_REDIRECT_URI is not a valid URL");
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes: [DRIVE_FILE_SCOPE],
    secureCookie: parsed.protocol === "https:",
  };
}

module.exports = {
  DRIVE_FILE_SCOPE,
  CALLBACK_PATH,
  GoogleOAuthConfigError,
  isSetupEnabled,
  getGoogleOAuthConfig,
};
