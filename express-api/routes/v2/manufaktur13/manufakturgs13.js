const Joi = require("joi");
const gs13_config = require("../../../models/gsak1/gs13_config.model");
const gs13_data = require("../../../models/gsak1/gs13_data.model");
const gs13_departements = require("../../../models/gsak1/gs13_departements.model");
const gs13_headers = require("../../../models/gsak1/gs13_headers.model");
const gs13_kode = require("../../../models/gsak1/gs13_kode.model");
const gs13_kpembantu = require("../../../models/gsak1/gs13_kpembantu.model");
const gs13_sections = require("../../../models/gsak1/gs13_sections.model");
const gs13_dataalokasi = require("../../../models/gsak1/gs13_dataalokasi.model");

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
  var dataConfig = await gs13_config
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
  var dheaders = await gs13_headers
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
  //  3
  var departements = await gs13_departements
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
  //  4
  var sections = await gs13_sections
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
  // 5
  var kode = await gs13_kode
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
  //  6
  var kpembantu = await gs13_kpembantu
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
  //  7
  var data = await gs13_data
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
  //  8
  var dataalokasi = await gs13_dataalokasi
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
    headers: dheaders,
    departements: departements,
    sections: sections,
    kode: kode,
    kpembantu: kpembantu,
    data: data,
    dataalokasi: dataalokasi,
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
    headers: Joi.required().messages({
      "any.required": `"Data headers" tidak boleh dikosongi`,
    }),
    departements: Joi.required().messages({
      "any.required": `"Data departements" tidak boleh dikosongi`,
    }),
    sections: Joi.required().messages({
      "any.required": `"Data sections" tidak boleh dikosongi`,
    }),
    kode: Joi.required().messages({
      "any.required": `"Data kode" tidak boleh dikosongi`,
    }),
    kpembantu: Joi.required().messages({
      "any.required": `"Data pembantu" tidak boleh dikosongi`,
    }),
    data: Joi.required().messages({
      "any.required": `"Data data" tidak boleh dikosongi`,
    }),
    dataAlokasi: Joi.required().messages({
      "any.required": `"Data dataAlokasi" tidak boleh dikosongi`,
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
  const headers = req.body.headers;
  const departements = req.body.departements;
  const sections = req.body.sections;
  const kode = req.body.kode;
  const kpembantu = req.body.kpembantu;
  const data = req.body.data;
  const dataAlokasi = req.body.dataAlokasi;

  // Update Config
  var proc1 = await gs13_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        namept: dataConf.namept,
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
  //#region

  // 1
  var headers1 = await gs13_headers
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cusheaders = headers.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs13_headers.bulkCreate(cusheaders).catch((error) => {
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
  var departements2 = await gs13_departements
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdepartements = departements.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs13_departements.bulkCreate(cdepartements).catch((error) => {
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
  var sections3 = await gs13_sections
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const csections = sections.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs13_sections.bulkCreate(csections).catch((error) => {
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
  var kode4 = await gs13_kode
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const ckode = kode.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs13_kode.bulkCreate(ckode).catch((error) => {
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
  var kpembantu5 = await gs13_kpembantu
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const ckpembantu = kpembantu.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs13_kpembantu.bulkCreate(ckpembantu).catch((error) => {
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
  var data6 = await gs13_data
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdata = data.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      await gs13_data.bulkCreate(cdata).catch((error) => {
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
  var dataAlokasi7 = await gs13_dataalokasi
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdataAlokasi = dataAlokasi.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc, 
        };
      });
      //  BAtch
      await gs13_dataalokasi.bulkCreate(cdataAlokasi).catch((error) => {
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
