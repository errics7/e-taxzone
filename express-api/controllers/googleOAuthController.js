const {
  CALLBACK_PATH,
  GoogleOAuthConfigError,
  isSetupEnabled,
} = require("../config/googleOAuth");
const googleOAuthService = require("../services/googleOAuthService");

const STATE_COOKIE = "etz_g_oauth_state";
const STATE_COOKIE_MAX_AGE_MS = 10 * 60 * 1000;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setNoStoreHeaders(res) {
  res.set({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  });
}

function sendPage(res, status, title, bodyHtml) {
  res
    .status(status)
    .type("html")
    .send(
      `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
        `<meta name="viewport" content="width=device-width, initial-scale=1">` +
        `<title>${escapeHtml(title)} - e-TAXZONE</title>` +
        `<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:48px auto;padding:0 16px;color:#1f2937;line-height:1.5}` +
        `h1{font-size:1.4rem}pre{background:#f3f4f6;padding:12px;border-radius:6px;white-space:pre-wrap;word-break:break-all}` +
        `.warn{background:#fef3c7;border:1px solid #f59e0b;padding:10px 12px;border-radius:6px}</style></head>` +
        `<body><h1>${escapeHtml(title)}</h1>${bodyHtml}</body></html>`
    );
}

function sendError(res, status, title, message) {
  sendPage(res, status, title, `<p>${escapeHtml(message)}</p>`);
}

function readCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim());
      } catch (e) {
        return undefined;
      }
    }
  }
  return undefined;
}

function stateCookieOptions(secure) {
  return {
    httpOnly: true,
    sameSite: "lax", // sent on the top-level redirect back from Google
    secure,
    path: CALLBACK_PATH,
  };
}

function handleConfigOrUnexpected(res, err, logLabel) {
  if (err instanceof GoogleOAuthConfigError) {
    return sendError(res, 500, "Google OAuth is not configured", err.message);
  }
  // Log only the message: never log tokens, codes or secrets.
  console.error(`[google-oauth] ${logLabel}:`, err && err.message);
  return sendError(
    res,
    500,
    "Google OAuth error",
    "Unexpected error. Check the backend logs."
  );
}

function ensureSetupEnabled(res) {
  if (isSetupEnabled()) return true;
  setNoStoreHeaders(res);
  sendError(
    res,
    403,
    "Google OAuth setup is disabled",
    "Set GOOGLE_OAUTH_SETUP_ENABLED=true in the backend environment and restart to run the one-time authorization."
  );
  return false;
}

// GET /oauth/google
exports.start = (req, res) => {
  if (!ensureSetupEnabled(res)) return;
  setNoStoreHeaders(res);
  try {
    const { url, state, secureCookie } =
      googleOAuthService.buildAuthorizationRequest();
    res.cookie(STATE_COOKIE, state, {
      ...stateCookieOptions(secureCookie),
      maxAge: STATE_COOKIE_MAX_AGE_MS,
    });
    return res.redirect(url);
  } catch (err) {
    return handleConfigOrUnexpected(res, err, "failed to start authorization");
  }
};

// GET /oauth2callback
exports.callback = async (req, res) => {
  if (!ensureSetupEnabled(res)) return;
  setNoStoreHeaders(res);

  // The state cookie is single-use as well.
  res.clearCookie(STATE_COOKIE, stateCookieOptions(false));

  const { code, state, error } = req.query;

  // 1. State check (single-use, unexpired, bound to this browser).
  const known = googleOAuthService.consumeState(state);
  const bound = googleOAuthService.statesMatch(
    state,
    readCookie(req, STATE_COOKIE)
  );
  if (!known || !bound) {
    return sendError(
      res,
      400,
      "Invalid or expired state",
      "Authorization could not be verified. Start again from /oauth/google."
    );
  }

  // 2. User denied access or Google returned an error.
  if (typeof error === "string" && error) {
    return sendError(
      res,
      400,
      "Authorization was not completed",
      `Google returned: ${error}`
    );
  }

  if (typeof code !== "string" || !code) {
    return sendError(
      res,
      400,
      "Missing authorization code",
      "Google did not return an authorization code."
    );
  }

  // 3. Exchange the code for tokens.
  let tokens;
  let requiredScopes;
  try {
    ({ tokens, requiredScopes } =
      await googleOAuthService.exchangeAuthorizationCode(code));
  } catch (err) {
    if (err instanceof GoogleOAuthConfigError) {
      return handleConfigOrUnexpected(res, err);
    }
    console.error("[google-oauth] code exchange failed:", err && err.message);
    return sendError(
      res,
      502,
      "Token exchange failed",
      "Google rejected the authorization code. Start again from /oauth/google."
    );
  }

  const grantedScopes = String(tokens.scope || "").split(/\s+/);
  if (!requiredScopes.every((s) => grantedScopes.includes(s))) {
    return sendError(
      res,
      400,
      "Required permission not granted",
      "The Google Drive (drive.file) permission was not granted. Start again and allow it."
    );
  }

  if (!tokens.refresh_token) {
    return sendError(
      res,
      400,
      "No refresh token returned",
      "Revoke e-TAXZONE access at https://myaccount.google.com/permissions and run /oauth/google again."
    );
  }

  // 4. Show the refresh token once. It is never written to disk or logged.
  return sendPage(
    res,
    200,
    "Google authorization successful",
    `<p>Add this line to the backend <code>.env</code>, then restart the backend:</p>` +
      `<pre>GOOGLE_REFRESH_TOKEN=${escapeHtml(tokens.refresh_token)}</pre>` +
      `<p class="warn">Treat this value like a password: do not commit it, share it, or put it in the frontend. ` +
      `After saving it, set <code>GOOGLE_OAUTH_SETUP_ENABLED=false</code> (or remove it).</p>`
  );
};
