const express = require("express");
const router = express.Router();
const verif = require("../../../middleware/verifikasi");

const confgs6data = require("./Gs6Data");
//admin
router.get("/gs6/datags/:tagId/selected", confgs6data.selectedAdmin); //admin
router.post("/gs6/datags/update", confgs6data.updategsdata); //admin
router.get("/gs6/data/:tagId/soal", confgs6data.selectedMahasiswaSoal); // USER

router.get("/gs6/tes", (req, res) => res.json("Data Tes TES"));
// Preview

module.exports = router;
