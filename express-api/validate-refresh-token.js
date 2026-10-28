// READ-ONLY, standalone validation: can GOOGLE_REFRESH_TOKEN obtain a new access token?
// Not part of the application. Run from the backend root (folder with .env and config/):
//     node /path/to/validate-refresh-token.js
// Prints only YES/no flags, an error name on failure, and the granted scope.
// Never prints or stores the client secret, refresh token or access token.
const path = require("path");

const root = process.cwd();
const need = (m) => require(require.resolve(m, { paths: [root] }));
const yn = (b) => (b ? "YES" : "no");
const out = (label, value) => console.log(`${label.padEnd(34)}: ${value}`);

(async () => {
  let cfg;
  try {
    // Existing app config (also loads .env); same source the OAuth routes use.
    cfg = require(path.join(root, "config", "googleOAuth.js")).getGoogleOAuthConfig();
  } catch (e) {
    out("client ID available", "no");
    out("config error", e.name || "Error");
    out("detail", String(e.message).split("\n")[0]); // names missing variables only
    process.exitCode = 1;
    return;
  }

  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN || "").trim();
  out("refresh token available", yn(!!refreshToken));
  out("client ID available", yn(!!cfg.clientId));
  if (!refreshToken) {
    process.exitCode = 1;
    return;
  }

  let client;
  try {
    const { google } = need("googleapis");
    client = new google.auth.OAuth2(cfg.clientId, cfg.clientSecret, cfg.redirectUri);
    client.setCredentials({ refresh_token: refreshToken });
    out("OAuth client created", "YES");
  } catch (e) {
    out("OAuth client created", "no");
    out("error name", e.name || "Error");
    process.exitCode = 1;
    return;
  }

  try {
    // No access token is set, so this performs a real refresh against Google.
    const { token } = await client.getAccessToken();
    out("refresh access token succeeded", yn(!!token));
    const scope = client.credentials && client.credentials.scope;
    out("scope", scope ? scope : "(not returned)");
    out("includes drive.file", yn(String(scope || "").split(/\s+/).includes("https://www.googleapis.com/auth/drive.file")));
  } catch (e) {
    // Do NOT print the error object: it embeds the request (secret + refresh token).
    const data = (e && e.response && e.response.data) || {};
    out("refresh access token succeeded", "no");
    out("error code", typeof data.error === "string" ? data.error : (e && e.code) || "unknown");
    if (typeof data.error_description === "string") out("description", data.error_description);
    if (e && e.response && e.response.status) out("HTTP status", e.response.status);
    process.exitCode = 1;
  }
})();
