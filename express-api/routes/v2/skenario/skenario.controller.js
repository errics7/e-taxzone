const sequelizeConf = require("../../../config/sequelizeconf");
const scenario = require("../../../models/scenario.model");
const gs_worksheet = require("../../../models/gs_worksheet.model");
const gs_virtualtour = require("../../../models/gs_virtualtour.model");
const course = require("../../../models/course.model");
const Joi = require("joi");
const { Sequelize } = require("sequelize");
const moment = require("moment-timezone");
moment.locale("id");

//#region
const gs1_config = require("../../../models/gsak1/gs1_config.model");
const gs2_config = require("../../../models/gsak1/gs2_config.model");
const gs3_config = require("../../../models/gsak1/gs3_config.model");
const gs4_config = require("../../../models/gsak1/gs4_config.model");
const gs5_config = require("../../../models/gsak1/gs5_config.model");
const gs6_config = require("../../../models/gsak1/gs6_config.model");
const gs7_config = require("../../../models/gsak1/gs7_config.model");
const gs8_config = require("../../../models/gsak1/gs8_config.model");
const gs9_config = require("../../../models/gsak1/gs9_config.model");
const gs10_config = require("../../../models/gsak1/gs10_config.model");
const gs11_config = require("../../../models/gsak1/gs11_config.model");
const gs12_config = require("../../../models/gsak1/gs12_config.model");
const gs13_config = require("../../../models/gsak1/gs13_config.model");
const gs14_config = require("../../../models/gsak1/gs14_config.model");
const gs15_config = require("../../../models/gsak1/gs15_config.model");
const gs16_config = require("../../../models/gsak1/gs16_config.model");
const gs17_config = require("../../../models/gsak1/gs17_config.model");
const gs18_config = require("../../../models/gsak1/gs18_config.model");

const prdg1_config = require("../../../models/perdagangan/perdagangan1_config.model");
const prdg2_config = require("../../../models/perdagangan/perdagangan2_config.model");
const prdg3_config = require("../../../models/perdagangan/perdagangan3_config.model");
const prdg4_config = require("../../../models/perdagangan/perdagangan4_config.model");
const prdg5_config = require("../../../models/perdagangan/perdagangan5_config.model");
const prdg6_config = require("../../../models/perdagangan/perdagangan6_config.model");
const prdg7_config = require("../../../models/perdagangan/perdagangan7_config.model");
const prdg8_config = require("../../../models/perdagangan/perdagangan8_config.model");
const prdg9_config = require("../../../models/perdagangan/perdagangan9_config.model");
const prdg10_config = require("../../../models/perdagangan/perdagangan10_config.model");
const prdg11_config = require("../../../models/perdagangan/perdagangan11_config.model");
const prdg12_config = require("../../../models/perdagangan/perdagangan12_config.model");
const prdg13_config = require("../../../models/perdagangan/perdagangan13_config.model");
const prdg14_config = require("../../../models/perdagangan/perdagangan14_config.model");
const prdg15_config = require("../../../models/perdagangan/perdagangan15_config.model");
const prdg16_config = require("../../../models/perdagangan/perdagangan16_config.model");
const prdg17_config = require("../../../models/perdagangan/perdagangan17_config.model");
const worksheet = require("../../../models/worksheet.model");
//#endregion

exports.listSkenario = async (req, res) => {
  const qDosen = `SELECT *,
        (
          select 
          CONCAT(
          gs.gs1_title,
          if(gs.gs1_title!="", "|",""), 
          gs.gs2_title,
          if(gs.gs2_title!="", "|",""), 
          gs.gs3_title,
          if(gs.gs3_title!="", "|",""), 
          gs.gs4_title,
          if(gs.gs4_title!="", "|",""), 
          gs.gs5_title,
          if(gs.gs5_title!="", "|",""), 
          gs.gs6_title,
          if(gs.gs6_title!="", "|",""), 
          gs.gs7_title,
          if(gs.gs7_title!="", "|",""), 
          gs.gs8_title,
          if(gs.gs8_title!="", "|",""), 
          gs.gs9_title,
          if(gs.gs9_title!="", "|",""), 
          gs.gs10_title,
          if(gs.gs10_title!="", "|",""), 
          gs.gs11_title,
          if(gs.gs11_title!="", "|",""), 
          gs.gs12_title,
          if(gs.gs12_title!="", "|",""), 
          gs.gs13_title,
          if(gs.gs13_title!="", "|",""), 
          gs.gs14_title,
          if(gs.gs14_title!="", "|",""), 
          gs.gs15_title,
          if(gs.gs15_title!="", "|",""), 
          gs.gs16_title,
          if(gs.gs16_title!="", "|",""), 
          gs.gs17_title,
          if(gs.gs17_title!="", "|",""), 
          gs.gs18_title,
          if(gs.gs18_title!="", "|",""),  
          gs.prdg1_title,
          if(gs.prdg1_title!="", "|",""), 
          gs.prdg2_title, 
          if(gs.prdg2_title!="", "|",""),
          gs.prdg3_title, 
          if(gs.prdg3_title!="", "|",""),
          gs.prdg4_title, 
          if(gs.prdg4_title!="", "|",""),
          gs.prdg5_title, 
          if(gs.prdg5_title!="", "|",""),
          gs.prdg6_title, 
          if(gs.prdg6_title!="", "|",""),
          gs.prdg7_title, 
          if(gs.prdg7_title!="", "|",""),
          gs.prdg8_title, 
          if(gs.prdg8_title!="", "|",""),
          gs.prdg9_title, 
          if(gs.prdg9_title!="", "|",""),
          gs.prdg10_title, 
          if(gs.prdg10_title!="", "|",""),
          gs.prdg11_title, 
          if(gs.prdg11_title!="", "|",""),
          gs.prdg12_title, 
          if(gs.prdg12_title!="", "|",""),
          gs.prdg13_title, 
          if(gs.prdg13_title!="", "|",""),
          gs.prdg14_title, 
          if(gs.prdg14_title!="", "|",""),
          gs.prdg15_title, 
          if(gs.prdg15_title!="", "|",""),
          gs.prdg16_title, 
          if(gs.prdg16_title!="", "|",""),
          gs.prdg17_title, 
          if(gs.prdg17_title!="", "","")
          )
          from gs_worksheet gs where id=scenario.worksheet_id LIMIT 1
      ) AS worksheet,(
        SELECT
          gs_virtualtour.list 
        FROM
          gs_virtualtour 
        WHERE
          gs_virtualtour.id = scenario.virtualtour_id 
        ) AS virtualtour, role_permission.role_name AS jabatan,
        users.nama AS author,scenario.nama,scenario.id as scn_id
      FROM
        scenario
        JOIN users ON scenario.created_by = users.id
        JOIN role_permission ON users.role = role_permission.role_id 
      where scenario.created_by=:id and scenario.status_delete=:dell`;

  const queryScn = await sequelizeConf
    .query(qDosen, {
      replacements: { id: req.auth._id, dell: 0 },
      logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      const lst = data.map((itm) => {
        const vt = JSON.parse(itm.virtualtour);
        var tmp = "";
        vt.forEach((element) => {
          tmp += element.name + "|";
        });
        console.log(vt);

        return { ...itm, virtualtour: tmp };
      });

      return lst;
    })
    .catch((error) =>
      res.status(400).json({
        message: error,
      })
    );

  res.status(200).json({
    success: true,
    data: queryScn,
    message: queryScn.length > 0 ? "" : "Anda belum memiliki Skenario Kelas.",
  });
};

exports.listSkenarioalldata = async (req, res) => {
  // console.log(req.auth);
  const qAdmin = `SELECT *,
            (
            SELECT
              CONCAT(
                gs.gs1_title,
              IF
                ( gs.gs1_title != "", "|", "" ),
                gs.gs2_title,
              IF
                ( gs.gs2_title != "", "|", "" ),
                gs.gs3_title,
              IF
                ( gs.gs3_title != "", "|", "" ),
                gs.gs4_title,
              IF
                ( gs.gs4_title != "", "|", "" ),
                gs.gs5_title,
              IF
                ( gs.gs5_title != "", "|", "" ),
                gs.gs6_title,
              IF
                ( gs.gs6_title != "", "|", "" ),
                gs.gs7_title,
              IF
                ( gs.gs7_title != "", "|", "" ),
                gs.gs8_title,
              IF
                ( gs.gs8_title != "", "|", "" ),
                gs.gs9_title,
              IF
                ( gs.gs9_title != "", "|", "" ),
                gs.gs10_title,
              IF
                ( gs.gs10_title != "", "|", "" ),
                gs.gs11_title,
              IF
                ( gs.gs11_title != "", "|", "" ),
                gs.gs12_title,
              IF
                ( gs.gs12_title != "", "|", "" ),
                gs.gs13_title,
              IF
                ( gs.gs13_title != "", "|", "" ),
                gs.gs14_title,
              IF
                ( gs.gs14_title != "", "|", "" ),
                gs.gs15_title,
              IF
                ( gs.gs15_title != "", "|", "" ),
                gs.gs16_title,
              IF
                ( gs.gs16_title != "", "|", "" ),
                gs.gs17_title,
              IF
                ( gs.gs17_title != "", "|", "" ),
                gs.gs18_title,
              IF
                ( gs.gs18_title != "", "|", "" ),
                gs.prdg1_title,
              IF
                ( gs.prdg1_title != "", "|", "" ),
                gs.prdg2_title,
              IF
                ( gs.prdg2_title != "", "|", "" ),
                gs.prdg3_title,
              IF
                ( gs.prdg3_title != "", "|", "" ),
                gs.prdg4_title,
              IF
                ( gs.prdg4_title != "", "|", "" ),
                gs.prdg5_title,
              IF
                ( gs.prdg5_title != "", "|", "" ),
                gs.prdg6_title,
              IF
                ( gs.prdg6_title != "", "|", "" ),
                gs.prdg7_title,
              IF
                ( gs.prdg7_title != "", "|", "" ),
                gs.prdg8_title,
              IF
                ( gs.prdg8_title != "", "|", "" ),
                gs.prdg9_title,
              IF
                ( gs.prdg9_title != "", "|", "" ),
                gs.prdg10_title,
              IF
                ( gs.prdg10_title != "", "|", "" ),
                gs.prdg11_title,
              IF
                ( gs.prdg11_title != "", "|", "" ),
                gs.prdg12_title,
              IF
                ( gs.prdg12_title != "", "|", "" ),
                gs.prdg13_title,
              IF
                ( gs.prdg13_title != "", "|", "" ),
                gs.prdg14_title,
              IF
                ( gs.prdg14_title != "", "|", "" ),
                gs.prdg15_title,
              IF
                ( gs.prdg15_title != "", "|", "" ),
                gs.prdg16_title,
              IF
                ( gs.prdg16_title != "", "|", "" ),
                gs.prdg17_title,
              IF
                ( gs.prdg17_title != "", "", "" ) 
              ) 
            FROM
              gs_worksheet gs 
            WHERE
              id = scenario.worksheet_id 
              LIMIT 1 
            ) AS worksheet,
            (
            SELECT
              gs_virtualtour.list 
            FROM
              gs_virtualtour 
            WHERE
              gs_virtualtour.id = scenario.virtualtour_id 
            ) AS virtualtour,
            role_permission.role_name AS jabatan,
            users.nama AS author,scenario.nama,scenario.id as scn_id
          FROM
            scenario
            JOIN users ON scenario.created_by = users.id
            JOIN role_permission ON users.role = role_permission.role_id 
          WHERE
        scenario.status_delete =:dell`;

  const queryScn = await sequelizeConf
    .query(qAdmin, {
      replacements: { dell: 0 },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      const lst = data.map((itm) => {
        const vt = JSON.parse(itm.virtualtour);
        var tmp = "";
        vt.forEach((element) => {
          tmp += element.name + "|";
        });
        console.log(vt);

        return { ...itm, virtualtour: tmp };
      });

      return lst;
    })
    .catch((error) =>
      res.status(400).json({
        message: error,
      })
    );

  res.status(200).json({
    success: true,
    data: queryScn,
    message: queryScn.length > 0 ? "" : "Anda belum memiliki Skenario Kelas.",
  });
};

exports.listWsSkenario = async (req, res) => {
  const id = req.params.id;
  await gs_worksheet
    .findOne({ where: { id: id } })
    .then((data) => {
      res.status(200).json({
        success: true,
        data: data,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    });
};

exports.createSkenario = async (req, res) => {
  const schema = Joi.object({
    nama: Joi.string().min(3).max(100).required(),
    code: Joi.string().min(4).max(10).required(),
    deskripsi: Joi.string().min(1).max(1000).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  //#region 1 Mulai cek Kode is Avail
  const code = await scenario
    .findAll({ where: { code: req.body.code } })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
  if (code && code.length > 0)
    return res.status(400).json({
      success: false,
      message:
        "Kode telah digunakan pada skenario lain, klik icon refresh untuk kombinasi kode lain",
    });
  //#endregion
  //#region 2 Buat Gs Control & VT Control
  const gsCtrl = await worksheet
    .create({})
    .then((data) => {
      return data;
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
  const gsVt = await gs_virtualtour
    .create({ created_by: req.auth._id, list: "[]" })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
  //#endregion
  //#region 3 Buat scenario
  if (!gsCtrl)
    return res.status(400).json({
      success: false,
      message: "Terjadi Kesalahan dalam membuat kelas",
    });
  const newScen = await scenario
    .create({
      nama: req.body.nama,
      code: req.body.code,
      deskripsi: req.body.deskripsi,
      worksheet_id: gsCtrl.id,
      virtualtour_id: gsVt.id,
      created_by: req.auth._id,
      status_delete: 0
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
  //#endregion

  res.status(200).json({
    success: true,
    data: { scene: newScen, gsctrl: gsCtrl },
    message: "Berhasil dibuat",
  });
};

exports.updateGSSkenario = async (req, res) => {
  const schema = Joi.object({
    scene: Joi.required(),
    gsctrl: Joi.required(),
    gs_count: Joi.number().integer().required(),
    gamelist: Joi.required(),
    type: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  // #

  const scen_id = req.body.scene.id;
  var data = req.body.gsctrl; //controller
  console.log(data);
  const list = req.body.gamelist;
  const gs_count = req.body.gs_count;

  console.log(gs_count);
  console.log("data before");
  // console.log(data);
  // console.log(list);

  //#region check Update GS
  var pros1 = await Promise.all(
    list.map(
      (element) =>
        new Promise((resolve, reject) => {
          // Switch By GameSimulasi Table
          switch (element.name) {
            case "gs1":
              if (
                (!data.gs1 && element.val) ||
                (data.gs1 === 0 && element.val)
              ) {
                //insert
                gs1_config
                  .create({
                    title: element.defname,
                    deskripsi: element.desc,
                    info: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs1"] = dat.id;
                    data["gs1_title"] = element.defname;
                    data["gs1_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs1 !== 0 && element.val) {
                console.log("gs1 just active");
                data["gs1_title"] = element.defname;
                return resolve(true);
              } else if (data.gs1_title !== "" && !element.val) {
                //dihapus
                console.log("Hapus gs1");
                data["gs1_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs1");
                return resolve(true);
              }
              break;
            case "gs2":
              if (
                (!data.gs2 && element.val) ||
                (data.gs2 === 0 && element.val)
              ) {
                //insert
                gs2_config
                  .create({
                    title: element.defname,
                    deskripsi: element.desc,
                    info: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs2"] = dat.id;
                    data["gs2_title"] = element.defname;
                    data["gs2_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs2 !== 0 && element.val) {
                console.log("gs2 just active");
                data["gs2_title"] = element.defname;
                return resolve(true);
              } else if (data.gs2_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs2");
                data["gs2_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs2");
                return resolve(true);
              }
              break;
            case "gs3":
              if (
                (!data.gs3 && element.val) ||
                (data.gs3 === 0 && element.val)
              ) {
                //insert
                gs3_config
                  .create({
                    title: element.defname,
                    deskripsi: element.desc,
                    info: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs3"] = dat.id;
                    data["gs3_title"] = element.defname;
                    data["gs3_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs3 !== 0 && element.val) {
                console.log("gs3 just active");
                data["gs3_title"] = element.defname;
                return resolve(true);
              } else if (data.gs3_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs3");
                data["gs3_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs3");
                return resolve(true);
              }
              break;
            case "gs4":
              if (
                (!data.gs4 && element.val) ||
                (data.gs4 === 0 && element.val)
              ) {
                // insert
                gs4_config
                  .create({
                    title: element.defname,
                    deskripsi: element.desc,
                    info: "",
                    nobppb: "01/BPPB/12/2021",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs4"] = dat.id;
                    data["gs4_title"] = element.defname;
                    data["gs4_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs4 !== 0 && element.val) {
                console.log("gs4 just active");
                data["gs4_title"] = element.defname;
                return resolve(true);
              } else if (data.gs4_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs4");
                data["gs4_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs4");
                return resolve(true);
              }
              break;
            case "gs5":
              if (
                (!data.gs5 && element.val) ||
                (data.gs5 === 0 && element.val)
              ) {
                // insert
                gs5_config
                  .create({
                    narasisoal: "",
                    nobppb: "01/BPPB/12/2021",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs5"] = dat.id;
                    data["gs5_title"] = element.defname;
                    data["gs5_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs5 !== 0 && element.val) {
                console.log("gs5 just active");
                data["gs5_title"] = element.defname;
                return resolve(true);
              } else if (data.gs5_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs5");
                data["gs5_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs5");
                return resolve(true);
              }
              break;
            case "gs6":
              if (
                (!data.gs6 && element.val) ||
                (data.gs6 === 0 && element.val)
              ) {
                // insert
                gs6_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs6"] = dat.id;
                    data["gs6_title"] = element.defname;
                    data["gs6_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs6 !== 0 && element.val) {
                console.log("gs6 just active");
                data["gs6_title"] = element.defname;
                return resolve(true);
              } else if (data.gs6_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs6");
                data["gs6_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs6");
                return resolve(true);
              }
              break;
            case "gs7":
              if (
                (!data.gs7 && element.val) ||
                (data.gs7 === 0 && element.val)
              ) {
                // insert
                gs7_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs7"] = dat.id;
                    data["gs7_title"] = element.defname;
                    data["gs7_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs7 !== 0 && element.val) {
                console.log("gs7 just active");
                data["gs7_title"] = element.defname;
                return resolve(true);
              } else if (data.gs7_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs7");
                data["gs7_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs7");
                return resolve(true);
              }
              break;
            case "gs8":
              if (
                (!data.gs8 && element.val) ||
                (data.gs8 === 0 && element.val)
              ) {
                // insert
                gs8_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs8"] = dat.id;
                    data["gs8_title"] = element.defname;
                    data["gs8_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs8 !== 0 && element.val) {
                console.log("gs8 just active");
                data["gs8_title"] = element.defname;
                return resolve(true);
              } else if (data.gs8_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs8");
                data["gs8_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs8");
                return resolve(true);
              }
              break;
            case "gs9":
              if (
                (!data.gs9 && element.val) ||
                (data.gs9 === 0 && element.val)
              ) {
                // insert
                gs9_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs9"] = dat.id;
                    data["gs9_title"] = element.defname;
                    data["gs9_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs9 !== 0 && element.val) {
                console.log("gs9 just active");
                data["gs9_title"] = element.defname;
                return resolve(true);
              } else if (data.gs9_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs9");
                data["gs9_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs9");
                return resolve(true);
              }
              break;
            case "gs10":
              if (
                (!data.gs10 && element.val) ||
                (data.gs10 === 0 && element.val)
              ) {
                // insert
                gs10_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs10"] = dat.id;
                    data["gs10_title"] = element.defname;
                    data["gs10_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs10 !== 0 && element.val) {
                console.log("gs10 just active");
                data["gs10_title"] = element.defname;
                return resolve(true);
              } else if (data.gs10_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs10");
                data["gs10_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs10");
                return resolve(true);
              }
              break;
            case "gs11":
              if (
                (!data.gs11 && element.val) ||
                (data.gs11 === 0 && element.val)
              ) {
                // insert
                gs11_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs11"] = dat.id;
                    data["gs11_title"] = element.defname;
                    data["gs11_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs11 !== 0 && element.val) {
                console.log("gs11 just active");
                data["gs11_title"] = element.defname;
                return resolve(true);
              } else if (data.gs11_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs11");
                data["gs11_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs11");
                return resolve(true);
              }
              break;
            case "gs12":
              if (
                (!data.gs12 && element.val) ||
                (data.gs12 === 0 && element.val)
              ) {
                // insert
                gs12_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs12"] = dat.id;
                    data["gs12_title"] = element.defname;
                    data["gs12_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs12 !== 0 && element.val) {
                console.log("gs12 just active");
                data["gs12_title"] = element.defname;
                return resolve(true);
              } else if (data.gs12_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs12");
                data["gs12_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs12");
                return resolve(true);
              }
              break;
            case "gs13":
              if (
                (!data.gs13 && element.val) ||
                (data.gs13 === 0 && element.val)
              ) {
                // insert
                gs13_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs13"] = dat.id;
                    data["gs13_title"] = element.defname;
                    data["gs13_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs13 !== 0 && element.val) {
                console.log("gs13 just active");
                data["gs13_title"] = element.defname;
                return resolve(true);
              } else if (data.gs13_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs13");
                data["gs13_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs13");
                return resolve(true);
              }
              break;
            case "gs14":
              if (
                (!data.gs14 && element.val) ||
                (data.gs14 === 0 && element.val)
              ) {
                // insert
                gs14_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs14"] = dat.id;
                    data["gs14_title"] = element.defname;
                    data["gs14_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs14 !== 0 && element.val) {
                console.log("gs14 just active");
                data["gs14_title"] = element.defname;
                return resolve(true);
              } else if (data.gs14_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs14");
                data["gs14_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs14");
                return resolve(true);
              }
              break;
            case "gs15":
              if (
                (!data.gs15 && element.val) ||
                (data.gs15 === 0 && element.val)
              ) {
                // insert
                gs15_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs15"] = dat.id;
                    data["gs15_title"] = element.defname;
                    data["gs15_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs15 !== 0 && element.val) {
                console.log("gs15 just active");
                data["gs15_title"] = element.defname;
                return resolve(true);
              } else if (data.gs15_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs15");
                data["gs15_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs15");
                return resolve(true);
              }
              break;
            case "gs16":
              if (
                (!data.gs16 && element.val) ||
                (data.gs16 === 0 && element.val)
              ) {
                // insert
                gs16_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs16"] = dat.id;
                    data["gs16_title"] = element.defname;
                    data["gs16_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs16 !== 0 && element.val) {
                console.log("gs16 just active");
                data["gs16_title"] = element.defname;
                return resolve(true);
              } else if (data.gs16_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs16");
                data["gs16_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs16");
                return resolve(true);
              }
              break;
            case "gs17":
              if (
                (!data.gs17 && element.val) ||
                (data.gs17 === 0 && element.val)
              ) {
                // insert
                gs17_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs17"] = dat.id;
                    data["gs17_title"] = element.defname;
                    data["gs17_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs17 !== 0 && element.val) {
                console.log("gs17 just active");
                data["gs17_title"] = element.defname;
                return resolve(true);
              } else if (data.gs17_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs17");
                data["gs17_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs17");
                return resolve(true);
              }
              break;
            case "gs18":
              if (
                (!data.gs18 && element.val) ||
                (data.gs18 === 0 && element.val)
              ) {
                // insert
                gs18_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["gs18"] = dat.id;
                    data["gs18_title"] = element.defname;
                    data["gs18_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.gs18 !== 0 && element.val) {
                console.log("gs18 just active");
                data["gs18_title"] = element.defname;
                return resolve(true);
              } else if (data.gs18_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus gs18");
                data["gs18_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange gs18");
                return resolve(true);
              }
              break;
            case "perdagangan1":
              if (
                (!data.prdg1 && element.val) ||
                (data.prdg1 === 0 && element.val)
              ) {
                // insert
                prdg1_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg1"] = dat.id;
                    data["prdg1_title"] = element.defname;
                    data["prdg1_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg1 !== 0 && element.val) {
                console.log("prdg1 just active");
                data["prdg1_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg1_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg1");
                data["prdg1_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg1");
                return resolve(true);
              }
              break;
            case "perdagangan2":
              if (
                (!data.prdg2 && element.val) ||
                (data.prdg2 === 0 && element.val)
              ) {
                // insert
                prdg2_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg2"] = dat.id;
                    data["prdg2_title"] = element.defname;
                    data["prdg2_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg2 !== 0 && element.val) {
                console.log("prdg2 just active");
                data["prdg2_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg2_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg2");
                data["prdg2_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg2");
                return resolve(true);
              }
              break;
            case "perdagangan3":
              if (
                (!data.prdg3 && element.val) ||
                (data.prdg3 === 0 && element.val)
              ) {
                // insert
                prdg3_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg3"] = dat.id;
                    data["prdg3_title"] = element.defname;
                    data["prdg3_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg3 !== 0 && element.val) {
                console.log("prdg3 just active");
                data["prdg3_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg3_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg3");
                data["prdg3_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg3");
                return resolve(true);
              }
              break;
            case "perdagangan4":
              if (
                (!data.prdg4 && element.val) ||
                (data.prdg4 === 0 && element.val)
              ) {
                // insert
                prdg4_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg4"] = dat.id;
                    data["prdg4_title"] = element.defname;
                    data["prdg4_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg4 !== 0 && element.val) {
                console.log("prdg4 just active");
                data["prdg4_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg4_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg4");
                data["prdg4_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg4");
                return resolve(true);
              }
              break;
            case "perdagangan5":
              if (
                (!data.prdg5 && element.val) ||
                (data.prdg5 === 0 && element.val)
              ) {
                // insert
                prdg5_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg5"] = dat.id;
                    data["prdg5_title"] = element.defname;
                    data["prdg5_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg5 !== 0 && element.val) {
                console.log("prdg5 just active");
                data["prdg5_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg5_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg5");
                data["prdg5_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg5");
                return resolve(true);
              }
              break;
            case "perdagangan6":
              if (
                (!data.prdg6 && element.val) ||
                (data.prdg6 === 0 && element.val)
              ) {
                // insert
                prdg6_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg6"] = dat.id;
                    data["prdg6_title"] = element.defname;
                    data["prdg6_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg6 !== 0 && element.val) {
                console.log("prdg6 just active");
                data["prdg6_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg6_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg6");
                data["prdg6_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg6");
                return resolve(true);
              }
              break;
            case "perdagangan7":
              if (
                (!data.prdg7 && element.val) ||
                (data.prdg7 === 0 && element.val)
              ) {
                // insert
                prdg7_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg7"] = dat.id;
                    data["prdg7_title"] = element.defname;
                    data["prdg7_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg7 !== 0 && element.val) {
                console.log("prdg7 just active");
                data["prdg7_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg7_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg7");
                data["prdg7_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg7");
                return resolve(true);
              }
              break;
            case "perdagangan8":
              if (
                (!data.prdg8 && element.val) ||
                (data.prdg8 === 0 && element.val)
              ) {
                // insert
                prdg8_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg8"] = dat.id;
                    data["prdg8_title"] = element.defname;
                    data["prdg8_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg8 !== 0 && element.val) {
                console.log("prdg8 just active");
                data["prdg8_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg8_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg8");
                data["prdg8_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg8");
                return resolve(true);
              }
              break;
            case "perdagangan9":
              if (
                (!data.prdg9 && element.val) ||
                (data.prdg9 === 0 && element.val)
              ) {
                // insert
                prdg9_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg9"] = dat.id;
                    data["prdg9_title"] = element.defname;
                    data["prdg9_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg9 !== 0 && element.val) {
                console.log("prdg9 just active");
                data["prdg9_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg9_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg9");
                data["prdg9_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg9");
                return resolve(true);
              }
              break;
            case "perdagangan10":
              if (
                (!data.prdg10 && element.val) ||
                (data.prdg10 === 0 && element.val)
              ) {
                // insert
                prdg10_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg10"] = dat.id;
                    data["prdg10_title"] = element.defname;
                    data["prdg10_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg10 !== 0 && element.val) {
                console.log("prdg10 just active");
                data["prdg10_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg10_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg10");
                data["prdg10_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg10");
                return resolve(true);
              }
              break;
            case "perdagangan11":
              if (
                (!data.prdg11 && element.val) ||
                (data.prdg11 === 0 && element.val)
              ) {
                // insert
                prdg11_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg11"] = dat.id;
                    data["prdg11_title"] = element.defname;
                    data["prdg11_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg11 !== 0 && element.val) {
                console.log("prdg11 just active");
                data["prdg11_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg11_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg11");
                data["prdg11_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg11");
                return resolve(true);
              }
              break;
            case "perdagangan12":
              if (
                (!data.prdg12 && element.val) ||
                (data.prdg12 === 0 && element.val)
              ) {
                // insert
                prdg12_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg12"] = dat.id;
                    data["prdg12_title"] = element.defname;
                    data["prdg12_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg12 !== 0 && element.val) {
                console.log("prdg12 just active");
                data["prdg12_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg12_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg12");
                data["prdg12_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg12");
                return resolve(true);
              }
              break;
            case "perdagangan13":
              if (
                (!data.prdg13 && element.val) ||
                (data.prdg13 === 0 && element.val)
              ) {
                // insert
                prdg13_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg13"] = dat.id;
                    data["prdg13_title"] = element.defname;
                    data["prdg13_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg13 !== 0 && element.val) {
                console.log("prdg13 just active");
                data["prdg13_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg13_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg13");
                data["prdg13_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg13");
                return resolve(true);
              }
              break;
            case "perdagangan14":
              if (
                (!data.prdg14 && element.val) ||
                (data.prdg14 === 0 && element.val)
              ) {
                // insert
                prdg14_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg14"] = dat.id;
                    data["prdg14_title"] = element.defname;
                    data["prdg14_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg14 !== 0 && element.val) {
                console.log("prdg14 just active");
                data["prdg14_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg14_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg14");
                data["prdg14_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg14");
                return resolve(true);
              }
              break;
            case "perdagangan15":
              if (
                (!data.prdg15 && element.val) ||
                (data.prdg15 === 0 && element.val)
              ) {
                // insert
                prdg15_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg15"] = dat.id;
                    data["prdg15_title"] = element.defname;
                    data["prdg15_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg15 !== 0 && element.val) {
                console.log("prdg15 just active");
                data["prdg15_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg15_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg15");
                data["prdg15_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg15");
                return resolve(true);
              }
              break;
            case "perdagangan16":
              if (
                (!data.prdg16 && element.val) ||
                (data.prdg16 === 0 && element.val)
              ) {
                // insert
                prdg16_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg16"] = dat.id;
                    data["prdg16_title"] = element.defname;
                    data["prdg16_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg16 !== 0 && element.val) {
                console.log("prdg16 just active");
                data["prdg16_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg16_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg16");
                data["prdg16_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg16");
                return resolve(true);
              }
              break;
            case "perdagangan17":
              if (
                (!data.prdg17 && element.val) ||
                (data.prdg17 === 0 && element.val)
              ) {
                // insert
                prdg17_config
                  .create({
                    narasisoal: "",
                    updated_by: req.auth._id,
                    last_scen: scen_id,
                  })
                  .then((dat) => {
                    data["prdg17"] = dat.id;
                    data["prdg17_title"] = element.defname;
                    data["prdg17_deskripsi"] = element.desc;
                    return resolve(true);
                  })
                  .catch((error) => {
                    res.status(400).json({
                      success: false,
                      message: error,
                    });
                  });
              } else if (data.prdg17 !== 0 && element.val) {
                console.log("prdg17 just active");
                data["prdg17_title"] = element.defname;
                return resolve(true);
              } else if (data.prdg17_title !== "" && !element.val) {
                // Hapus
                console.log("Hapus prdg17");
                data["prdg17_title"] = "";
                return resolve(true);
              } else {
                //tidak ada perubahan
                console.log("noting cahange prdg17");
                return resolve(true);
              }
              break;
            default:
              return resolve(true);
          }
        })
    )
  );

  // console.log("data AFTER");
  // console.log(data);
  //#endregion
  //#region update Gs_worksheet /GS Controller
  const updateGwork = {
    type: req.body.type,
    gs1: data.gs1,
    gs1_title: data.gs1_title,
    gs1_deskripsi: data.gs1_deskripsi,
    gs2: data.gs2,
    gs2_title: data.gs2_title,
    gs2_deskripsi: data.gs2_deskripsi,
    gs3: data.gs3,
    gs3_title: data.gs3_title,
    gs3_deskripsi: data.gs3_deskripsi,
    gs4: data.gs4,
    gs4_title: data.gs4_title,
    gs4_deskripsi: data.gs4_deskripsi,
    gs5: data.gs5,
    gs5_title: data.gs5_title,
    gs5_deskripsi: data.gs5_deskripsi,
    gs6: data.gs6,
    gs6_title: data.gs6_title,
    gs6_deskripsi: data.gs6_deskripsi,
    gs7: data.gs7,
    gs7_title: data.gs7_title,
    gs7_deskripsi: data.gs7_deskripsi,
    gs8: data.gs8,
    gs8_title: data.gs8_title,
    gs8_deskripsi: data.gs8_deskripsi,
    gs9: data.gs9,
    gs9_title: data.gs9_title,
    gs9_deskripsi: data.gs9_deskripsi,
    gs10: data.gs10,
    gs10_title: data.gs10_title,
    gs10_deskripsi: data.gs10_deskripsi,
    gs11: data.gs11,
    gs11_title: data.gs11_title,
    gs11_deskripsi: data.gs11_deskripsi,
    gs12: data.gs12,
    gs12_title: data.gs12_title,
    gs12_deskripsi: data.gs12_deskripsi,
    gs13: data.gs13,
    gs13_title: data.gs13_title,
    gs13_deskripsi: data.gs13_deskripsi,
    gs14: data.gs14,
    gs14_title: data.gs14_title,
    gs14_deskripsi: data.gs14_deskripsi,
    gs15: data.gs15,
    gs15_title: data.gs15_title,
    gs15_deskripsi: data.gs15_deskripsi,
    gs16: data.gs16,
    gs16_title: data.gs16_title,
    gs16_deskripsi: data.gs16_deskripsi,
    gs17: data.gs17,
    gs17_title: data.gs17_title,
    gs17_deskripsi: data.gs17_deskripsi,
    gs18: data.gs18,
    gs18_title: data.gs18_title,
    gs18_deskripsi: data.gs18_deskripsi,
    //
    prdg1: data.prdg1,
    prdg1_title: data.prdg1_title,
    prdg1_deskripsi: data.prdg1_deskripsi,
    prdg2: data.prdg2,
    prdg2_title: data.prdg2_title,
    prdg2_deskripsi: data.prdg2_deskripsi,
    prdg3: data.prdg3,
    prdg3_title: data.prdg3_title,
    prdg3_deskripsi: data.prdg3_deskripsi,
    prdg4: data.prdg4,
    prdg4_title: data.prdg4_title,
    prdg4_deskripsi: data.prdg4_deskripsi,
    prdg5: data.prdg5,
    prdg5_title: data.prdg5_title,
    prdg5_deskripsi: data.prdg5_deskripsi,
    prdg6: data.prdg6,
    prdg6_title: data.prdg6_title,
    prdg6_deskripsi: data.prdg6_deskripsi,
    prdg7: data.prdg7,
    prdg7_title: data.prdg7_title,
    prdg7_deskripsi: data.prdg7_deskripsi,
    prdg8: data.prdg8,
    prdg8_title: data.prdg8_title,
    prdg8_deskripsi: data.prdg8_deskripsi,
    prdg9: data.prdg9,
    prdg9_title: data.prdg9_title,
    prdg9_deskripsi: data.prdg9_deskripsi,
    prdg10: data.prdg10,
    prdg10_title: data.prdg10_title,
    prdg10_deskripsi: data.prdg10_deskripsi,
    prdg11: data.prdg11,
    prdg11_title: data.prdg11_title,
    prdg11_deskripsi: data.prdg11_deskripsi,
    prdg12: data.prdg12,
    prdg12_title: data.prdg12_title,
    prdg12_deskripsi: data.prdg12_deskripsi,
    prdg13: data.prdg13,
    prdg13_title: data.prdg13_title,
    prdg13_deskripsi: data.prdg13_deskripsi,
    prdg14: data.prdg14,
    prdg14_title: data.prdg14_title,
    prdg14_deskripsi: data.prdg14_deskripsi,
    prdg15: data.prdg15,
    prdg15_title: data.prdg15_title,
    prdg15_deskripsi: data.prdg15_deskripsi,
    prdg16: data.prdg16,
    prdg16_title: data.prdg16_title,
    prdg16_deskripsi: data.prdg16_deskripsi,
    prdg17: data.prdg17,
    prdg17_title: data.prdg17_title,
    prdg17_deskripsi: data.prdg17_deskripsi,
  };

  // console.log("updateGwork");
  // console.log(updateGwork);
  const gsworkctrl = await gs_worksheet
    .update(updateGwork, { where: { id: data.id } })
    .then(() => console.log("Berhasil edit config gs_worksheet"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  console.log("updateGwork");
  console.log(gs_count);
  console.log(req.body.type);
  console.log(scen_id);
  const scenarioctrl = await scenario
    .update(
      {
        worksheet_count: gs_count,
        type: req.body.type,
      },
      { where: { id: scen_id }, raw: true }
    )
    .then(() => console.log("Berhasil edit config scenario"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  //#endregion

  res.status(200).json({
    success: true,
    message: "Game Simulasi berhasil di atur",
  });
  return;
};

exports.updateinfoscen = async (req, res) => {
  const schema = Joi.object({
    updateid: Joi.required(),
    name: Joi.required(),
    deskripsi: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  // #

  //#region update
  const scenarioctrl = await scenario
    .update(
      {
        nama: req.body.name,
        deskripsi: req.body.deskripsi,
      },
      { where: { id: req.body.updateid }, raw: true }
    )
    .then(() => console.log("Berhasil Update Info"))
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
  //#endregion

  res.status(200).json({
    success: true,
    message: `Scenario ${req.body.name} Berhasil diperbarui`,
  });
  return;
};

exports.softdeletedscen = async (req, res) => {
  const schema = Joi.object({
    deletedid: Joi.required(),
    name: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  // #

  //#region update
  const scenarioctrl = await scenario
    .update(
      {
        status_delete: 1,
      },
      { where: { id: req.body.deletedid }, raw: true }
    )
    .then(() => console.log("Berhasil soft remove"))
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
  //#endregion

  res.status(200).json({
    success: true,
    message: `Scenario ${req.body.name} Berhasil Dihapus`,
  });
  return;
};

exports.getdetailsubscriber = async (req, res) => {
  const schema = Joi.object({
    scenid: Joi.number().integer().required().messages({
      "any.required": `"id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const query = `select course.*,users.nama,users.kelas,users.nim from course join users on course.user_id=users.id where scen_id=:scn`;

  const queryScn = await sequelizeConf
    .query(query, {
      replacements: { scn: req.params.scenid },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      const dataitems = data.map((item) => {
        const usr = item;
        usr["created_date"] = moment(new Date(item.created_date)).format(
          "HH:mm | DD-MM-YYYY"
        );
        usr["status"] = item.status === 1 ? "Aktif" : "Block";
        return usr;
      });
      return dataitems;
    })
    .catch((error) =>
      res.status(400).json({
        message: error,
      })
    );

  res.status(200).json({
    success: true,
    data: queryScn,
    message:
      queryScn.length > 0
        ? ""
        : "Skenario Kelas masih kosong, bagikan kode akses kepada mahasiswa.",
  });
};

exports.updateUsersSubscriber = async (req, res) => {
  const schema = Joi.object({
    idu: Joi.number().integer().required().messages({
      "any.required": `"id" tidak boleh dikosongi`,
    }),
    action: Joi.required(),
    named: Joi.required(),
    scen_id: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const act = req.body.action;
  var stat = 1;
  var msg = "";
  if (act === "block") {
    stat = 0;
    msg = `Berhasil Memblokir ${req.body.named}.`;
  } else if (act === "unblock") {
    stat = 1;
    msg = `Berhasil mengaktifkan kembali ${req.body.named}.`;
  }

  const queryScn = await course
    .update(
      {
        status: stat,
        updated_by: req.auth._id,
      },
      {
        where: { user_id: req.body.idu, scen_id: req.body.scen_id },
        raw: true,
      }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: msg,
      });
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
};

exports.updatedatagsicon = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "number.base": `"tag id" Tidak valid pastikan alamat url sesuai.`,
    }),
    title: Joi.string().min(3).max(250).required().messages({
      "string.empty": `"title" harus di isi`,
      "any.required": `"title" tidak boleh dikosongi`,
    }),
    deskripsi: Joi.string().min(3).max(250).required().messages({
      "string.empty": `"deskripsi" harus di isi`,
      "any.required": `"deskripsi" tidak boleh dikosongi`,
    }),
    img_path: Joi.string().min(3).max(250).required().messages({
      "string.empty": `"img_path" harus di isi`,
      "any.required": `"img_path" tidak boleh dikosongi`,
    }),
    gs: Joi.string().min(3).max(550).required().messages({
      "string.empty": `"gs" harus di isi`,
      "any.required": `"gs" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  // isi gs: gs1-manufaktur | gs1-perdagangan
  var coldat = "gs1";
  const datags = req.body.gs.split("-");
  if (datags[1] === "perdagangan") {
    //mengambil "prdg"+ angka
    coldat = "prdg" + datags[0].slice(2, 4);
  } else {
    coldat = datags[1];
  }

  const sqlsetimg = `update gs_worksheet set ${coldat}_title=:title, ${coldat}_deskripsi=:deskripsi, ${coldat}_img_path=:img_path where id=:idu`;
  await sequelizeConf
    .query(sqlsetimg, {
      replacements: {
        title: req.body.title,
        deskripsi: req.body.deskripsi,
        img_path: req.body.img_path,
        idu: req.body.id,
      },
      plain: false,
      raw: true,
    })
    .then((result) => {
      // if no error
      res.status(200).json({
        status: 200,
        success: true,
        message: "Update Successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
};
