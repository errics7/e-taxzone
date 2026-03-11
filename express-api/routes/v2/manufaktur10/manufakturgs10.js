const Joi = require("joi");
const sequelizeConf = require("../../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const gs10_config = require("../../../models/gsak1/gs10_config.model");
const gs10_data = require("../../../models/gsak1/gs10_data.model");
const gs10_dataakun = require("../../../models/gsak1/gs10_dataakun.model");
const gs10_dataalokasi = require("../../../models/gsak1/gs10_dataalokasi.model");

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
  var dataConfig = await gs10_config
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

  //
  const sqlgs10_dataakun = `SELECT *,gs10_dataakun.id as idbank FROM gs10_dataakun`;
  var dataakunall = await sequelizeConf
    .query(sqlgs10_dataakun, {
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      const data = result.map((item) => {
        const da = item;
        da["sorting"] = "";
        da["used"] = false;
        return da;
      });
      return data;
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  //
  const sqldataselect = `SELECT 
    gs10_data.sorting, 
    gs10_dataakun.code, 
    gs10_dataakun.name, 
    gs10_dataakun.jenis, 
    gs10_dataakun.id as idbank 
    FROM gs10_data 
    JOIN gs10_dataakun on gs10_data.id_dataakun=gs10_dataakun.id 
    WHERE gs10_data.id_config=:tagid ORDER BY gs10_data.sorting`;
  var dataselect = await sequelizeConf
    .query(sqldataselect, {
      replacements: {
        tagid: tagid,
      },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      const data = result.map((item, index) => {
        const da = item;
        da["used"] = true;
        da["code_dnd"] = item.code;
        da["tableData"] = { id: index };
        return da;
      });
      return data;
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });

  // yang belum
  let difference = dataakunall.filter(
    (x) => !dataselect.find((el) => el.code === x.code)
  );
  var neData = [...dataselect, ...difference];

  // data alokasi
  const sqldataalokasi = `SELECT * FROM gs10_dataalokasi WHERE gs10_dataalokasi.id_config=:tagid `;
  var dataalokasi = await sequelizeConf
    .query(sqldataalokasi, {
      replacements: {
        tagid: tagid,
      },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length) {
        return result;
      } else {
        return [
          {
            nama: "",
            nilai: 0,
          },
        ];
      }
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
    dataakun: neData,
    selected: dataselect,
    dataalokasi: dataalokasi,
    message: dataConfig ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.ceknoakun = async (req, res) => {
  const schema = Joi.object({
    ids: Joi.required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  //
  //
  await gs10_dataakun
    .findAll({
      where: {
        code: req.body.ids,
      },
      raw: true,
    })
    .then((result) => {
      if (result.length) {
        res.status(200).json({
          status: 200,
          success: false,
          data: result.length,
          message: "Kode telah digunakan",
        });
      } else {
        // if no error
        res.status(200).json({
          status: 200,
          success: true,
          data: 0,
          message: "Kode tersedia",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
};

exports.addAkunData = async (req, res) => {
  const schema = Joi.object({
    noakun: Joi.string().min(3).max(6).required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "string.min": `"kode akun" minimal 3 huruf`,
      "string.max": `"kode akun" maksimal 6 huruf`,
    }),
    akun: Joi.string().min(4).max(50).required().messages({
      "any.required": `"no akun" tidak boleh dikosongi`,
      "string.min": `"nama akun" minimal 4 huruf`,
      "string.max": `"nama akun" maksimal 50 huruf`,
    }),
    jenis: Joi.string().min(3).max(50).required().messages({
      "string.empty": `"Jenis akun" harus dipilih`,
      "any.required": `"jenis" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  //

  await gs10_dataakun
    .findAll({
      where: {
        code: req.body.noakun,
      },
      raw: true,
    })
    .then(async (result) => {
      if (result.length) {
        res.status(500).json({
          success: false,
          message: "Kode telah digunakan",
        });
      } else {
        await gs10_dataakun
          .create({
            code: req.body.noakun,
            name: req.body.akun,
            jenis: req.body.jenis,
          })
          .then(() => {
            res.status(200).json({
              status: 200,
              success: true,
              message: "Berhasil Menambah Data",
            });
          })
          .catch((error) => {
            res.status(500).json({
              success: false,
              message: error,
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
};

exports.dataakundelete = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  //

  await gs10_dataakun
    .destroy({
      where: { id: req.body.id },
      raw: true,
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Data Berhasil dihapus",
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
};

exports.updateAkunData = async (req, res) => {
  const schema = Joi.object({
    id: Joi.required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "string.empty": `"tag id" tidak boleh dikosongi`,
    }),
    noakun: Joi.string().min(3).max(6).required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "string.min": `"kode akun" minimal 3 huruf`,
      "string.max": `"kode akun" maksimal 6 huruf`,
    }),
    akun: Joi.string().min(4).max(50).required().messages({
      "any.required": `"no akun" tidak boleh dikosongi`,
      "string.min": `"nama akun" minimal 4 huruf`,
      "string.max": `"nama akun" maksimal 50 huruf`,
    }),
    jenis: Joi.string().min(3).max(50).required().messages({
      "string.empty": `"Jenis akun" harus dipilih`,
      "any.required": `"jenis" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  //

  const code = req.body.noakun;
  const name = req.body.akun;
  const jenis = req.body.jenis;
  //
  await gs10_dataakun
    .update(
      {
        code: code,
        name: name,
        jenis: jenis,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    )
    .then(() => {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Data Berhasil Diperbarui",
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
};

exports.updategsdata = async (req, res) => {
  const schema = Joi.object({
    idc: Joi.required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
    }),
    dataConf: Joi.required().messages({
      "any.required": `"data" tidak boleh dikosongi`,
    }),
    dataSelected: Joi.required().messages({
      "any.required": `"dataSelected" tidak boleh dikosongi`,
    }),
    dataAlokasi: Joi.required().messages({
      "any.required": `"dataAlokasi" tidak boleh dikosongi`,
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
  const dataSelected = req.body.dataSelected;
  const dataAlokasi = req.body.dataAlokasi;

  // Update Config
  var proc1 = await gs10_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        perolehan: dataConf.perolehan,
        hargaperolehan: dataConf.hargaperolehan,
        nilaisisa: dataConf.nilaisisa,
        namept: dataConf.namept,
        nobm: dataConf.nobm,
        narasialokasi: dataConf.narasialokasi,
        umur: dataConf.umur,

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
  //#region
  // removing

  var proc2 = await gs10_data
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdataSelected = dataSelected.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
          id_dataakun: itm.idbank,
        };
      });
      //  BAtch
      if (cdataSelected.length > 0) {
        await gs10_data.bulkCreate(cdataSelected).catch((error) => {
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
  // ALOKASI
  var proc4 = await gs10_dataalokasi
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
      if (cdataAlokasi.length > 0) {
        await gs10_dataalokasi.bulkCreate(cdataAlokasi).catch((error) => {
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
  //  BAtch
  res.status(200).json({
    status: 200,
    success: true,
    message: "Data Berhasil diperbarui",
  });
};
