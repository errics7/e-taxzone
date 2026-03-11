const express = require("express");
const auth = require("./auth");
const verifikasi = require("./verifikasi");
const router = express.Router();

//Cek JWT
router.get("/api/v1/userauth", auth.jwtvalidation);
// register menu
router.post("/api/v1/register", auth.registrasi);
router.post("/api/v1/login", auth.login);

//Testing need Authorization
router.get( "/api/v1/rahasia", verifikasi.verifikasi(["admin"]), auth.halamanrahasia );

module.exports = router;
