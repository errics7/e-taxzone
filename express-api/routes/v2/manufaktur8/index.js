const express = require("express");
const router = express.Router();
const verif = require("../../../middleware/verifikasi");

const confgs8data = require("./Gs8Data");
//admin
router.get("/gs8/datags/:tagId/selected", confgs8data.selectedAdmin); //admin
router.post("/gs8/datags/update", confgs8data.updategsdata); //admin
router.get("/gs8/data/:tagId/soal", confgs8data.selectedMahasiswaSoal); // USER
// Preview

module.exports = router;
