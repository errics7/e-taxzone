const express = require("express");
const router = express.Router();
const v = require("../../middleware/verifikasi");

//#region Import
const scen = require("./scenario/skenario.controller");
const sptDraftController = require("../../controllers/sptDraftController");




//#region Skenario
router.get("/skenario/list", v.verifikasi(["dosen", "admin"]), scen.getAllScenarios);
// router.get("/skenario/listall", v.verifikasi(["admin"]), scen.listSkenarioalldata);
// router.get("/skenario/listgsworksheet/:id", v.verifikasi(["dosen","admin"]), scen.listWsSkenario);
// router.post("/skenario/baru", v.verifikasi(["dosen", "admin"]), scen.createScenario);
// router.post("/skenario/updategsworksheet", v.verifikasi(["dosen","admin"]), scen.updateGSSkenario);
// router.post("/skenario/updategsthemevirtualtour", v.verifikasi(["dosen","admin"]), vt.setdatadefaultTemplate); 
// router.post("/skenario/updateinfo", v.verifikasi(["dosen","admin"]), scen.updateinfoscen);
// router.post("/skenario/deleted", v.verifikasi(["dosen","admin"]), scen.softdeletedscen);
// router.post("/skenario/gamesimulasilist", v.verifikasi(["dosen","admin"]), gamesimulasi.gamesimulasilist);
// router.get("/skenario/subscriber/detail/:scenid", v.verifikasi(["dosen","admin"]), scen.getdetailsubscriber);
// router.post("/skenario/subscriber/update", v.verifikasi(["dosen","admin"]), scen.updateUsersSubscriber);
// router.post("/skenario/gsworksheet/updateimage", v.verifikasi(["dosen","admin"]), scen.updatedatagsicon);

//#endregion


//#region SPT Tahunan Badan - Draft Preparation
router.post("/spt/drafts", v.verifall(), sptDraftController.createDraft);
router.post("/spt/drafts/:headerId/sections/:sectionKey", v.verifall(), sptDraftController.saveSection);
router.patch("/spt/drafts/:headerId/sections/:sectionKey/:sectionId", v.verifall(), sptDraftController.updateSection);
router.post("/spt/drafts/:headerId/calculate", v.verifall(), sptDraftController.calculate);
router.post("/spt/drafts/:headerId/recalculate", v.verifall(), sptDraftController.recalculate);
router.delete("/spt/drafts/:headerId", v.verifall(), sptDraftController.deleteDraft);

//#endregion


module.exports = router;