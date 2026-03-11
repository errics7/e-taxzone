const Joi = require("joi");
const gs16_config = require("../../../models/gsak1/gs16_config.model");
const gs16_datapercent = require("../../../models/gsak1/gs16_datapercent.model");
const gs16_datasoal = require("../../../models/gsak1/gs16_datasoal.model");
const gs16_datatabel = require("../../../models/gsak1/gs16_datatabel.model");

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
  //
  var tagid = Number(req.params.tagId);

  // CEK CONFIG IS Found
  const dataConfig = await gs16_config
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

  var dpdataTabel = await gs16_datatabel
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
  var ddataSoal = await gs16_datasoal
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
  var ddataPerecent = await gs16_datapercent
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
    datatabel: dpdataTabel,
    datasoal: ddataSoal,
    dprcnt: ddataPerecent,
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
    dataTabel: Joi.required().messages({
      "any.required": `"Data Tabel" tidak boleh dikosongi`,
    }),
    dataSoal: Joi.required().messages({
      "any.required": `"Data Soal" tidak boleh dikosongi`,
    }),
    dataPerecent: Joi.required().messages({
      "any.required": `"Data Perecent" tidak boleh dikosongi`,
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
  const dataTabel = req.body.dataTabel;
  const dataSoal = req.body.dataSoal;
  const dataPerecent = req.body.dataPerecent;

  // Update Config
  var proc1 = await gs16_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        namept: dataConf.namept,
        title: dataConf.title,
        subtitle: dataConf.subtitle,
        subtitletbl1: dataConf.subtitletbl1,
        titlesoal: dataConf.titlesoal,
        titelpercent: dataConf.titelpercent,
        titlejumlah1: dataConf.titlejumlah1,
        titlejumlah2: dataConf.titlejumlah2,
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
  //1 removing
  var p_datatabel = await gs16_datatabel
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cusdataTabel = dataTabel.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs16_datatabel.bulkCreate(cusdataTabel).catch((error) => {
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
  //  BAtch
  //2 removing
  var p_dataSoal = await gs16_datasoal
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const custdataSoal = dataSoal.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs16_datasoal.bulkCreate(custdataSoal).catch((error) => {
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
  //3 removing
  var p_dataPerecent = await gs16_datapercent
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const custdataPerecent = dataPerecent.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs16_datapercent.bulkCreate(custdataPerecent).catch((error) => {
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
