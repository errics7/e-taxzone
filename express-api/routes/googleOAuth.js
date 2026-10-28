// Google OAuth authorization routes.
// Mounted at the app root, deliberately outside /api/v2 and /api/v3,
// so they are not behind the JWT middleware.
const express = require("express");
const googleOAuthController = require("../controllers/googleOAuthController");

const router = express.Router();

router.get("/oauth/google", googleOAuthController.start);
router.get("/oauth2callback", googleOAuthController.callback);

module.exports = router;
