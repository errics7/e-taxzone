const crypto = require("crypto");
const { google } = require("googleapis");
const { getGoogleOAuthConfig } = require("../config/googleOAuth");

// OAuth `state` protection:
// - random, single-use, short-lived value kept in memory on the backend
// - also bound to the browser that started the flow via an httpOnly cookie
//   (the controller sets/reads it), which prevents forged callbacks.
const STATE_TTL_MS = 10 * 60 * 1000;
const MAX_PENDING_STATES = 100;
const pendingStates = new Map(); // state -> expiresAt

function purgeExpired(now) {
  for (const [state, expiresAt] of pendingStates) {
    if (expiresAt <= now) pendingStates.delete(state);
  }
}

function issueState() {
  const now = Date.now();
  purgeExpired(now);
  while (pendingStates.size >= MAX_PENDING_STATES) {
    pendingStates.delete(pendingStates.keys().next().value); // drop oldest
  }
  const state = crypto.randomBytes(32).toString("hex");
  pendingStates.set(state, now + STATE_TTL_MS);
  return state;
}

// Single use: always removed, valid only if known and not expired.
function consumeState(state) {
  if (typeof state !== "string") return false;
  const expiresAt = pendingStates.get(state);
  pendingStates.delete(state);
  return expiresAt !== undefined && expiresAt > Date.now();
}

function statesMatch(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

function createOAuthClient(config) {
  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );
}

function buildAuthorizationRequest() {
  const config = getGoogleOAuthConfig();
  const client = createOAuthClient(config);
  const state = issueState();
  const url = client.generateAuthUrl({
    access_type: "offline", // required to obtain a refresh token
    prompt: "consent", // forces Google to return a refresh token every time
    scope: config.scopes,
    state,
  });
  return { url, state, secureCookie: config.secureCookie };
}

async function exchangeAuthorizationCode(code) {
  const config = getGoogleOAuthConfig();
  const client = createOAuthClient(config);
  const { tokens } = await client.getToken(code);
  return { tokens, requiredScopes: config.scopes };
}

module.exports = {
  buildAuthorizationRequest,
  exchangeAuthorizationCode,
  consumeState,
  statesMatch,
};
