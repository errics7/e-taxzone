const Joi = require("joi");
const gs17_config = require("../../../models/gsak1/gs17_config.model");
const gs17_databb = require("../../../models/gsak1/gs17_databb.model");
const gs17_dataakun = require("../../../models/gsak1/gs17_dataakun.model");
const gs17_datapersediaan = require("../../../models/gsak1/gs17_datapersediaan.model");
const gs17_dataredaksi = require("../../../models/gsak1/gs17_dataredaksi.model");

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
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  //
  var tagid = Number(req.params.tagId);

  // CEK CONFIG IS Found
  const dataConfig = await gs17_config
    .findOne({
      where: { id: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });

  const ddatabb = await gs17_databb
    .findAll({
      where: { id_config: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  const ddataAkun = await gs17_dataakun
    .findAll({
      where: { id_config: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  const ddataPersediaan = await gs17_datapersediaan
    .findAll({
      where: { id_config: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  const ddataRedaksi = await gs17_dataredaksi
    .findAll({
      where: { id_config: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });

  res.json({
    status: dataConfig ? true : false,
    config: dataConfig,
    dataBB: ddatabb,
    dataAkun: ddataAkun,
    dataPersediaan: ddataPersediaan,
    dataRedaksi: ddataRedaksi,
    message: !dataConfig
      ? "Data Tidak Ditemukan, pastikan anda mengakses link yang benar."
      : "",
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
    dataBB: Joi.required().messages({
      "any.required": `"Data b" tidak boleh dikosongi`,
    }),
    dataAkun: Joi.required().messages({
      "any.required": `"Data akun" tidak boleh dikosongi`,
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  //
  //   console.log(req.body.idc);
  const dataConf = req.body.dataConf;
  const dataBB = req.body.dataBB;
  const dataAkun = req.body.dataAkun;
  const dataPersediaan = req.body.dataPersediaan;
  const dataRedaksi = req.body.dataRedaksi;

  // Update Config
  var proc1 = await gs17_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        namept: dataConf.namept,
        title: dataConf.title,
        subtitle: dataConf.subtitle,
        subtable1: dataConf.subtable1,
        subtable2: dataConf.subtable2,
        keteranganpen: dataConf.keteranganpen,
        bbb: dataConf.bbb,
        bbp: dataConf.bbp,
        btkl: dataConf.btkl,
        bop: dataConf.bop,
      },
      {
        where: { id: req.body.idc },
        raw: true,
      }
    )
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
      return;
    });
  //#region
  // removing
  var pdataBB = await gs17_databb
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const custbb = dataBB.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs17_databb.bulkCreate(custbb).catch((error) => {
        res.status(500).json({
          success: false,
          message: error,
        });
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );
  // removing
  var pdataAkun = await gs17_dataakun
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const custAkun = dataAkun.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs17_dataakun.bulkCreate(custAkun).catch((error) => {
        res.status(500).json({
          success: false,
          message: error,
        });
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );
  // removing
  var pdataPersediaan = await gs17_datapersediaan
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const custdataPersediaan = dataPersediaan.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs17_datapersediaan
        .bulkCreate(custdataPersediaan)
        .catch((error) => {
          res.status(500).json({
            success: false,
            message: error,
          });
        });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );
  // removing
  var pdataredaksi = await gs17_dataredaksi
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
      await gs17_dataredaksi.bulkCreate(custdataRedaksi).catch((error) => {
        res.status(500).json({
          success: false,
          message: error,
        });
      });
    })
    .catch((error) =>
      res.status(500).json({
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
