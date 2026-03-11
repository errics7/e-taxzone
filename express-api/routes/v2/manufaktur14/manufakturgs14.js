const Joi = require("joi");
const gs14_config = require("../../../models/gsak1/gs14_config.model");
const gs14_alokasi = require("../../../models/gsak1/gs14_alokasi.model");
const gs14_datainfo = require("../../../models/gsak1/gs14_datainfo.model");
const gs14_listpembantu = require("../../../models/gsak1/gs14_listpembantu.model");

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
  var dataConfig = await gs14_config
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
  // 2
  var alokasi = await gs14_alokasi
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
  var dataInfo = await gs14_datainfo
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
  var listPembantu = await gs14_listpembantu
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
    alokasi: alokasi,
    dataInfo: dataInfo,
    listPembantu: listPembantu,
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
    alokasi: Joi.required().messages({
      "any.required": `"Data alokasi" tidak boleh dikosongi`,
    }),
    dataInfo: Joi.required().messages({
      "any.required": `"Data dataInfo" tidak boleh dikosongi`,
    }),
    listPembantu: Joi.required().messages({
      "any.required": `"Data list pembantu" tidak boleh dikosongi`,
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
  const alokasi = req.body.alokasi;
  const dataInfo = req.body.dataInfo;
  const listPembantu = req.body.listPembantu;

  // Update Config
  var proc1 = await gs14_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        nobm: dataConf.nobm,
        narasibuktimemo: dataConf.narasibuktimemo,
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

  // removing ALOKASI
  var _alokasi = await gs14_alokasi
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const calokasi = alokasi.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs14_alokasi.bulkCreate(calokasi).catch((error) => {
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
  // removing DataInfo
  var _DataInfo = gs14_datainfo
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdataInfo = dataInfo.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs14_datainfo.bulkCreate(cdataInfo).catch((error) => {
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
  // removing listPembantu OLD
  var _listPembantu = gs14_listpembantu
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const clistPembantu = listPembantu.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
          ket: itm.ket.toString().replace(/\s+/g, " ").trim(),
        };
      });
      //  BAtch
      await gs14_listpembantu.bulkCreate(clistPembantu).catch((error) => {
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
