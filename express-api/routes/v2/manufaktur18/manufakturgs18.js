const sequelizeConf = require("../../../config/sequelizeconf");
const gs18_config = require("../../../models/gsak1/gs18_config.model");
const gs18_dataredaksi = require("../../../models/gsak1/gs18_dataredaksi.model");
const gs18_datapersediaan = require("../../../models/gsak1/gs18_datapersediaan.model");
const Joi = require("joi");

// GS ADMIN CONFIG
exports.selected = async (req, res) => {
  const schema = Joi.object({
    tagId: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "number.base": `"tag id" Tidak valid pastikan alamat url sesuai.`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  //
  var tagid = Number(req.params.tagId);

  // CEK CONFIG IS Found
  var dataConfig = await gs18_config
    .findOne({
      where: { id: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });

  var ddataPersediaan = await gs18_datapersediaan
    .findAll({
      where: { id_config: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
  var ddataRedaksi = await gs18_dataredaksi
    .findAll({
      where: { id_config: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });

  res.json({
    status: dataConfig ? true : false,
    config: dataConfig,
    dataPersediaan: ddataPersediaan,
    dataRedaksi: ddataRedaksi,
    success: dataConfig ? true : false,
    message: dataConfig ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updategsdata = async (req, res) => {
  const schema = Joi.object({
    idc: Joi.required().messages({
      "any.required": `"Data config" tidak boleh dikosongi`,
    }),
    dataConf: Joi.required().messages({
      "any.required": `"Data config" tidak boleh dikosongi`,
    }),
    dataPersediaan: Joi.required().messages({
      "any.required": `"Data Persediaan" tidak boleh dikosongi`,
    }),
    dataRedaksi: Joi.required().messages({
      "any.required": `"Data Redaksi" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  //
  const dataConf = req.body.dataConf;
  const dataPersediaan = req.body.dataPersediaan;
  const dataRedaksi = req.body.dataRedaksi;

  // Update Config
  await gs18_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        namept: dataConf.namept,
        title: dataConf.title,
        subtitle: dataConf.subtitle,
        subtable1: dataConf.subtable1,
        subtable2: dataConf.subtable2,
        subtable3: dataConf.subtable3,
        keteranganpen: dataConf.keteranganpen,
        bbb: dataConf.bbb,
        bbp: dataConf.bbp,
        btkl: dataConf.btkl,
        btklbop: dataConf.btklbop,
      },
      {
        where: { id: req.body.idc },
        raw: true,
      }
    )
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
      return;
    });
  //#region
  // removing
  await gs18_datapersediaan
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const custPersediaan = dataPersediaan.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs18_datapersediaan.bulkCreate(custPersediaan).catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  await gs18_dataredaksi
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const custdataRedaksi = dataRedaksi.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs18_dataredaksi.bulkCreate(custdataRedaksi).catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
  //#endregion

  res.status(200).json({
    status: 200,
    success: true,
    message: "Data Berhasil diperbarui",
  });
};
