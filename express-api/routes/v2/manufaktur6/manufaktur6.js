const Joi = require("joi");
const gs6_config = require("../../../models/gsak1/gs6_config.model");
const gs6_datacontrol = require("../../../models/gsak1/gs6_datacontrol.model");
const gs6_databuktibahan = require("../../../models/gsak1/gs6_databuktibahan.model");

exports.updategsdata = async (req, res) => {
  const schema = Joi.object({
    idc: Joi.required().messages({
      "any.required": `"Data id" tidak boleh dikosongi`,
    }),
    dataC: Joi.required().messages({
      "any.required": `"Data Config" tidak boleh dikosongi`,
    }),
    dataBhn: Joi.required().messages({
      "any.required": `"Data Config" tidak boleh dikosongi`,
    }),
    dataConf: Joi.required().messages({
      "any.required": `"Data Config" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  //

  const dataC = req.body.dataC;
  const dataBhn = req.body.dataBhn;
  const dataConf = req.body.dataConf; 
  // return;
  // removing old DATAC
  var proc1 = await gs6_datacontrol
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdataC = dataC.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
          sorting: index,
        };
      });
      //  BAtch
      if (cdataC.length > 0) {
        await gs6_datacontrol.bulkCreate(cdataC).catch((error) => {
          res.status(500).json({
            success: false,
            message: error,
          });
        });
      }
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );
  // removing old BUKTI PERMINTAAN & PEMAKAIAN BAHAN
  var proc2 = await gs6_databuktibahan
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdataBhn = dataBhn.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
          sorting: index,
        };
      }); 
      //  BAtch
      if (cdataBhn.length > 0) {
        await gs6_databuktibahan.bulkCreate(cdataBhn).catch((error) => {
          res.status(500).json({
            success: false,
            message: error,
          });
        });
      }
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );

  // UPDATE CONFIG
  var proc3 = await gs6_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        bppb: dataConf.bppb,
        tgl_penerimabahan: dataConf.tgl_penerimabahan,
        tgl_bagiangudang: dataConf.tgl_bagiangudang,
        tgl_kepalabagian: dataConf.tgl_kepalabagian,

        updated_by: req.auth._id,
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

  res.status(200).json({
    status: 200,
    success: true,
    message: "Data Berhasil diperbarui",
  });
};

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

  var dataConfig = await gs6_config
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
  //    DA Control
  var dacontrol = await gs6_datacontrol
    .findAll({
      where: { id_config: tagid },
      order: [["sorting", "ASC"]],
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  //    DA bukti bahan
  var dabuktibahan = await gs6_databuktibahan
    .findAll({
      where: { id_config: tagid },
      order: [["sorting", "ASC"]],
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });

  res.status(200).json({
    success: dataConfig ? true : false,
    dabuktibahan: dabuktibahan,
    dacontrol: dacontrol,
    config: dataConfig,
    message: dataConfig ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};
