const express = require("express");
const router = express.Router();
const v = require("../../middleware/verifikasi");

//#region Import
const auth = require("./auth/auth.controller");
const account = require("./users/account.controller");
const scen = require("./skenario/skenario.controller");
const course = require("./course/course.controller");
const vt = require("./virtualtour/virtualtour.controller");
const uploadvt = require("./virtualtour/uploadareavt");
const uploadaudio = require("./upload/uploadaudiovt");
const upaudioControl = require("./upload/upload.controller");
const usermgm = require("./users/user.controller");
const posting = require("./blog/posting.controller");
const dasboardadmin = require("./dasboardgeneral/dasboard.admin.controller");
const worksheets = require("./worksheet/worksheet.controller");
const questions = require("./questions/questions.controller");
const questionnaire = require("./questionnaire/questionnaire.controller");
const feedback = require("./feedback/feedback.controller");
const userTour = require("./user-tour/user-tour.controller");
const djpAuthorizations = require("./djp/djpAuthorization");
const sptTahunanOrangPribadi = require("./djp/sptTahunanOrangPribadi");
const sptTahunanBadan = require("./djp/sptTahunanBadan");

const uploadimgblog = require("./upload/uploadimgblog.controller")
const uploadimgnarasi = require("./upload/uploadimagenarasi.controller")
const uploadimggsicon = require("./upload/uploadimagegsicon.controller")

const gamesimulasi = require("./skenario/gamesimulasi.controller");
const perdagangan1 = require("./perdagangan1/perdagangan");
const perdagangan2 = require("./perdagangan2/perdagangan2");
const perdagangan3 = require("./perdagangan3/perdagangan3");
const perdagangan4 = require("./perdagangan4/perdagangan4");
const perdagangan5 = require("./perdagangan5/perdagangan5");
const perdagangan6 = require("./perdagangan6/perdagangan6");
const perdagangan7 = require("./perdagangan7/perdagangan7");
const perdagangan8 = require("./perdagangan8/perdagangan8");
const perdagangan9 = require("./perdagangan9/perdagangan9");
const perdagangan10 = require("./perdagangan10/perdagangan10");
const perdagangan11 = require("./perdagangan11/perdagangan11");
const perdagangan12 = require("./perdagangan12/perdagangan12");
const perdagangan13 = require("./perdagangan13/perdagangan13");
const perdagangan14 = require("./perdagangan14/perdagangan14");
const perdagangan15 = require("./perdagangan15/perdagangan15");
const perdagangan16 = require("./perdagangan16/perdagangan16");
const perdagangan17 = require("./perdagangan17/perdagangan17");
const manufaktur1 = require("./manufaktur1/manufaktur1");
const manufaktur2 = require("./manufaktur2/manufaktur2");
const manufaktur3 = require("./manufaktur3/manufaktur3");
const manufaktur4 = require("./manufaktur4/manufaktur4");
const manufaktur5 = require("./manufaktur5/manufaktur5");
const manufaktur6 = require("./manufaktur6/manufaktur6");
const manufaktur7 = require("./manufaktur7/manufaktur7");
const manufaktur8 = require("./manufaktur8/manufaktur8");
const manufaktur9 = require("./manufaktur9/manufaktur9");
const manufaktur10 = require("./manufaktur10/manufakturgs10");
const manufaktur11 = require("./manufaktur11/manufakturgs11");
const manufaktur12 = require("./manufaktur12/manufakturgs12");
const manufaktur13 = require("./manufaktur13/manufakturgs13");
const manufaktur14 = require("./manufaktur14/manufakturgs14");
const manufaktur15 = require("./manufaktur15/manufakturgs15");
const manufaktur16 = require("./manufaktur16/manufakturgs16");
const manufaktur17 = require("./manufaktur17/manufakturgs17");
const manufaktur18 = require("./manufaktur18/manufakturgs18");

//#endregion 
//  \\===  NOTE JANGAN DI AUTO FORMAT ing  ===//  \\

// Route=> //v2
//#region Auth SignUp & Login 
router.post("/auth/signup", auth.signup);
router.post("/auth/signin", auth.login);
router.post("/auth/upload-register", uploadimgblog.uploadsingleFileExcel());
router.get('/get-me', v.verifikasi(["dosen", "admin", "mahasiswa"]), auth.getMe);
router.post('/update-profile-photo', v.verifikasi(["dosen", "admin", "mahasiswa"]), auth.updateProfilePhoto )
//#endregion 

router.get('/djp/taxpayer/:nik_npwp', 
  v.verifikasi(["mahasiswa"]), 
  djpAuthorizations.getTaxpayerByNIK
);

router.post('/djp/authorization', v.verifikasi(["mahasiswa"]), djpAuthorizations.createDJPAuthorization);

router.get('/djp/user-status', v.verifikasi(["mahasiswa"]), djpAuthorizations.getUserDJPStatus);

// Download routes
router.get('/djp/download/receipt/:request_id', v.verifikasi(["mahasiswa"]), djpAuthorizations.downloadReceipt);

router.get('/djp/download/certificate/:request_id', v.verifikasi(["mahasiswa"]), djpAuthorizations.downloadCertificate);

// Admin routes for managing DJP requests
router.get('/djp/requests', v.verifikasi(["dosen", "mahasiswa"]), djpAuthorizations.getAllDJPRequests);

router.put('/djp/requests/:request_id/status', v.verifikasi(["dosen"]), djpAuthorizations.updateDJPStatus);


// SPT TAHUNAN

router.delete('/spt-tahunan/:spt_id', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.deleteSpt);

// Pribadi
router.get('/taxpayer/profile', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.getTaxpayerProfile);
router.post('/spt-tahunan', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.createSptTahunan);
router.put('/spt-tahunan/:spt_id/section', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.updateSptSection);
router.put('/spt-tahunan/:spt_id/submit', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.submitSpt);
router.get('/spt-tahunan/my-list', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.getUserSptList);
router.get('/spt-tahunan/:spt_id', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.getSptDetail);
router.get('/spt-tahunan/:spt_id/download', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.downloadSptPdf);

router.get('/dosen/spt-tahunan/for-grading', v.verifikasi(["dosen"]), sptTahunanOrangPribadi.getSptListForGrading);
router.get('/dosen/spt-tahunan/:spt_id/for-grading', v.verifikasi(["dosen"]), sptTahunanOrangPribadi.getSptDetailForGrading);
router.get('/mahasiswa/spt-tahunan/:spt_id', v.verifikasi(["mahasiswa"]), sptTahunanOrangPribadi.getSptDetailForGrading);

router.post('/dosen/spt-tahunan/:spt_id/grade', v.verifikasi(["dosen"]), sptTahunanOrangPribadi.gradeSpt);
router.get('/dosen/spt-tahunan/:spt_id/preview', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanOrangPribadi.previewSptPdf);

// Badan
router.get('/company/profile', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.getCompanyProfile);

// Create new SPT Tahunan Badan
router.post('/spt-tahunan-badan', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.createSptTahunanBadan);

router.delete('/spt-tahunan-badan/:spt_id', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.deleteSptBadan);

// Update specific section of SPT Badan
router.put('/spt-tahunan-badan/:spt_id/section', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.updateSptBadanSection);

// Submit SPT Badan
router.put('/spt-tahunan-badan/:spt_id/submit', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.submitSptBadan);

// Get user's SPT Badan list
router.get('/spt-tahunan-badan/my-list', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.getUserSptBadanList);

// Get specific SPT Badan detail
router.get('/spt-tahunan-badan/:spt_id', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.getSptBadanDetail);

// Download SPT Badan PDF
router.get('/spt-tahunan-badan/:spt_id/download', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.downloadSptBadanPdf);

// ===== ROUTES UNTUK DOSEN (Grading) =====

// // Get SPT Badan list for grading (untuk dosen)
// router.get('/dosen/spt-tahunan-badan/for-grading', v.verifikasi(["dosen"]), sptTahunanBadan.getSptBadanListForGrading);

// // Get SPT Badan detail for grading (untuk dosen)
// router.get('/dosen/spt-tahunan-badan/:spt_id/for-grading', v.verifikasi(["dosen"]), sptTahunanBadan.getSptBadanDetailForGrading);

// // Submit grade for SPT Badan (untuk dosen)
// router.post('/dosen/spt-tahunan-badan/:spt_id/grade', v.verifikasi(["dosen"]), sptTahunanBadan.gradeSptBadan);

// // Preview SPT Badan (untuk dosen dan mahasiswa)
// router.get('/spt-tahunan-badan/:spt_id/preview', v.verifikasi(["mahasiswa", "dosen"]), sptTahunanBadan.previewSptBadanPdf);


//#region Course MHS
router.post("/course/cari", v.verifikasi(["mahasiswa"]), course.cariKelasScenMhs);
router.post("/course/enroll", v.verifikasi(["mahasiswa"]), course.enrollKelasScenMhs);
router.get("/course/list", v.verifikasi(["mahasiswa"]), course.datakelasuser);
router.post("/course/worksheetdata", v.verifikasi(["mahasiswa"]), course.selectedkelasgamesimulasi); //list
router.get("/course/:code/virtualtourdatalist", v.verifikasi(["mahasiswa"]), vt.getCourseVTDataList); //list

router.get("/admin/blog/:type", v.verifikasi(["admin"]), posting.dataBlog);
router.get("/admin/blog/detail/:type/:slug", posting.selected);
router.post("/admin/blog/update", v.verifikasi(["admin"]), posting.update);
router.post("/admin/blog/newpage", v.verifikasi(["admin"]), posting.newpages);
//Upload
router.post("/upload/img/blog", v.verifikasi(["dosen", "admin"]), uploadimgblog.uploadsingle());
router.post("/upload/img/narasigs", v.verifikasi(["dosen", "admin"]), uploadimgnarasi.uploadsingle());
router.post("/upload/img/gsicon", v.verifikasi(["dosen", "admin"]), uploadimggsicon.uploadsingle());
//#endregion
//#region Skenario
router.get("/skenario/list", v.verifikasi(["dosen", "admin"]), scen.listSkenario);

router.get("/skenario/listall", v.verifikasi(["admin"]), scen.listSkenarioalldata);
router.get("/skenario/listgsworksheet/:id", v.verifikasi(["dosen", "admin"]), scen.listWsSkenario);
router.post("/skenario/baru", v.verifikasi(["dosen", "admin"]), scen.createSkenario);
router.post("/skenario/updategsworksheet", v.verifikasi(["dosen", "admin"]), scen.updateGSSkenario);
router.post("/skenario/updategsthemevirtualtour", v.verifikasi(["dosen", "admin"]), vt.setdatadefaultTemplate);
router.post("/skenario/updateinfo", v.verifikasi(["dosen", "admin"]), scen.updateinfoscen);
router.post("/skenario/deleted", v.verifikasi(["dosen", "admin"]), scen.softdeletedscen);
router.post("/skenario/gamesimulasilist", v.verifikasi(["dosen", "admin"]), gamesimulasi.gamesimulasilist);
router.get("/skenario/subscriber/detail/:scenid", v.verifikasi(["dosen", "admin"]), scen.getdetailsubscriber);
router.post("/skenario/subscriber/update", v.verifikasi(["dosen", "admin"]), scen.updateUsersSubscriber);
router.post("/skenario/gsworksheet/updateimage", v.verifikasi(["dosen", "admin"]), scen.updatedatagsicon);

//#endregion

//#region Worksheet
router.get("/worksheet/list", v.verifikasi(["dosen", "admin",]), worksheets.getWorksheets)
router.post("/worksheet/create", v.verifikasi(["dosen", "admin"]), worksheets.createWorksheet);
router.get("/worksheet/:id", v.verifikasi(["dosen", "admin", "mahasiswa"]), worksheets.getWorksheetById);
router.put("/worksheet/:id", v.verifikasi(["dosen", "admin"]), worksheets.updateWorksheet);
router.delete("/worksheet/:id", v.verifikasi(["dosen", "admin"]), worksheets.deleteWorksheet)
//#endregion

//#region Questions
// Question Routes
router.get("/questions/worksheet-results", v.verifikasi(["dosen", "admin"]), questions.getWorksheetResults);
router.get("/questions/worksheet-results/export", v.verifikasi(["dosen", "admin"]), questions.exportWorksheetResults);
router.get("/questions/:worksheet_id", v.verifikasi(["dosen", "admin"]), questions.getQuestionsByWorksheet);
router.get("/questions/mhs/:worksheet_id", v.verifikasi(["mahasiswa"]), questions.getMhsQuestionsByWorksheet);
router.get("/questions/results/:student_id", v.verifikasi(["mahasiswa"]), questions.getStudentResults);

router.post("/questions/create", v.verifikasi(["dosen", "admin"]), questions.createQuestion);
router.put("/questions/:id", v.verifikasi(["dosen", "admin"]), questions.updateQuestion);
router.delete("/questions/:id", v.verifikasi(["dosen", "admin"]), questions.deleteQuestion);

// Question Options (Multiple Choice)
router.post("/questions/options", v.verifikasi(["dosen", "admin"]), questions.addQuestionOptions);
router.get("/questions/options/:question_id", v.verifikasi(["dosen", "admin", "mahasiswa"]), questions.getQuestionOptions);

// Drag & Drop Items
router.post("/questions/drag-items", v.verifikasi(["dosen", "admin"]), questions.addDragItems);
router.get("/questions/drag-items/:question_id", v.verifikasi(["dosen", "admin", "mahasiswa"]), questions.getDragItems);

// Create questionnaire
router.post('/questionnaire', v.verifikasi(["dosen", "mahasiswa"]), questionnaire.createQuestionnaire);
router.get('/questionnaire', v.verifikasi(["dosen", "admin", "mahasiswa"]), questionnaire.getQuestionnaires);
router.get('/questionnaire/export', v.verifikasi(["dosen", "admin", "mahasiswa"]), questionnaire.exportQuestionnaires);
router.get('/questionnaire/:id', v.verifikasi(["dosen", "admin", "mahasiswa"]), questionnaire.getQuestionnaireById);
router.delete('/questionnaire/:id', v.verifikasi(["dosen", "admin", "mahasiswa"]), questionnaire.deleteQuestionnaire);

// Worksheet Schedule Routes
router.post("/questions/schedule", v.verifikasi(["dosen", "admin"]), questions.createWorksheetSchedule);
router.get("/questions/schedules/:worksheet_id", v.verifikasi(["dosen", "admin"]), questions.getWorksheetSchedules);
router.get("/questions/class-schedules/:class_id", v.verifikasi(["dosen", "admin", "mahasiswa"]), questions.getClassSchedules);
router.delete("/questions/schedules/:id", v.verifikasi(["dosen", "admin"]), questions.deleteWorksheetSchedule);

// Student Results Routes
router.post("/questions/submit-answers", v.verifikasi(["mahasiswa"]), questions.submitAnswers);
// Get detailed result for a specific worksheet submission
router.get('/student-result', v.verifikasi(["mahasiswa"]), questions.getStudentResult);

//#endregion

//#region USERS Management
router.get("/users/needconfirmall", v.verifikasi(["dosen", "admin"]), usermgm.getusersconfirmall);
router.get("/users/getalluser", v.verifikasi(["dosen", "admin"]), usermgm.getUserdata);
router.post("/users/regconfirm", v.verifikasi(["dosen", "admin"]), usermgm.confirmRegUserBaru);
router.post("/users/updatemahasiswa", v.verifikasi(["dosen", "admin"]), usermgm.updateUserData);
router.post("/users/deleteakunforever", v.verifikasi(["admin"]), usermgm.hapusUserDataTemp);
router.post("/users/daftarbaru", v.verifikasi(["admin"]), usermgm.buatUserBaru);
router.get("/users/classes", usermgm.getDistinctKelas);

//akun
router.get("/myaccount/show/:id", v.verifall(), account.showuser);
router.post("/myaccount/data/update", v.verifall(), account.updatedatamyaccount);
router.post("/myaccount/changepassword/update", v.verifall(), account.updatepassworddata);
//#endregion

//#region Special
router.get("/admindasboard/main/summary", v.verifikasi(["admin"]), dasboardadmin.adminmainsummary);
router.get("/dosendasboard/main/summary", v.verifikasi(["dosen"]), dasboardadmin.dosenmainsummary);

//#endregion Special

//#region Feedback
router.post("/feedback", v.verifikasi(["dosen", "admin", "mahasiswa"]), feedback.createFeedback);
router.get("/feedback", feedback.getAllFeedback);
//#endregion Feedback

//#region User Tour
router.post("/user-tour", v.verifikasi(["dosen", "admin", "mahasiswa"]), userTour.markCompletedUserTour);
router.get("/user-tour/:tour_key",v.verifikasi(["dosen", "admin", "mahasiswa"]), userTour.getTour);
//#endregion Feedback

module.exports = router;