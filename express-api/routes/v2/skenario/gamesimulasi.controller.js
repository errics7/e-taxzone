const sequelizeConf = require("../../../config/sequelizeconf");
const scenario = require("../../../models/scenario.model");
const gs_worksheet = require("../../../models/gs_worksheet.model");
const gs_virtualtour = require("../../../models/gs_virtualtour.model");
const Joi = require("joi");
const { Sequelize } = require("sequelize");

exports.listSkenario = async (req, res) => {
  // console.log(req.auth);
  const qAdmin = `SELECT *,
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
      ) AS worksheet, (select "virtual 1|virtual 2|") AS virtualtour FROM scenario where status_delete=:dell`;
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
      ) AS worksheet, (select "virtual 1|virtual 2|") AS virtualtour FROM scenario where scenario.created_by=:id and status_delete=:dell`;

  const quer = req.auth.authorize === "admin" ? qAdmin : qDosen;
  const queryScn = await sequelizeConf
    .query(quer, {
      replacements: { id: req.auth._id, dell: 0 },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
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

exports.gamesimulasilist = async (req, res) => {
  const schema = Joi.object({
    code: Joi.string().min(4).max(10).required(),
    worksheet_id: Joi.number().integer().required().messages({
      "any.required": `"worksheet id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  //#region 1 Mulai find
  const quer =
    "SELECT gs_worksheet.* FROM scenario JOIN gs_worksheet ON scenario.worksheet_id=gs_worksheet.id WHERE scenario.code=:code AND scenario.worksheet_id=:worksheet_id AND scenario.created_by=:usr_id AND scenario.status_delete=:dell";
  const querAdmin =
    "SELECT gs_worksheet.* FROM scenario JOIN gs_worksheet ON scenario.worksheet_id=gs_worksheet.id WHERE scenario.code=:code AND scenario.worksheet_id=:worksheet_id AND scenario.status_delete=:dell";
  const mainquer = req.auth.authorize === "admin" ? querAdmin : quer;

  const code = await sequelizeConf
    .query(mainquer, {
      replacements: {
        code: req.body.code,
        worksheet_id: req.body.worksheet_id,
        usr_id: req.auth._id,
        dell: 0,
      },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      res.status(200).json({
        success: data[0] ? true : false,
        data: data[0],
        message: data[0] ? "" : "Skenario Kelas tidak valid",
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
};
