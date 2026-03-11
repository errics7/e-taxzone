const sequelizeConf = require("../../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const Joi = require("joi");
const gs3_config = require("../../../models/gsak1/gs3_config.model");
const gs3_data = require("../../../models/gsak1/gs3_data.model");
const gs3_dataakun = require("../../../models/gsak1/gs3_dataakun.model");
const gs3_datasoal = require("../../../models/gsak1/gs3_datasoal.model");

// app.get("/bankakun/selected",
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
  //
  const sqldata0 = `SELECT 
      gs3_data.sorting, 
      gs3_data.nilai, 
      gs3_dataakun.code, 
      gs3_dataakun.jenis, 
      gs3_dataakun.name, 
      gs3_dataakun.id as idbank 
      
      FROM gs3_data 
      JOIN gs3_dataakun on gs3_data.id_dataakun=gs3_dataakun.id 
      WHERE gs3_data.id_config=:tagid
      ORDER BY gs3_data.sorting`;

  var data0 = await sequelizeConf
    .query(sqldata0, {
      replacements: {
        tagid: tagid,
      },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length) {
        const data = result.map((item) => {
          const da = item;
          da["info"] = "";
          da["used"] = true;
          return da;
        });
        return data;
      } else return [];
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );
  //
  const sqldata1 = `SELECT *,gs3_dataakun.id as idbank FROM gs3_dataakun`;
  var data1 = await sequelizeConf
    .query(sqldata1, {
      replacements: {
        tagid: tagid,
      },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length) {
        const data = result.map((item) => {
          const da = item;
          da["sorting"] = "";
          da["info"] = "";
          da["nilai"] = 0;
          da["used"] = false;
          return da;
        });
        return data;
      } else return [];
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );
  //
  var listsoal = await gs3_datasoal
    .findAll({
      where: {
        id_config: tagid,
      },
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  //
  var dataConfig = await gs3_config
    .findOne({
      where: {
        id: tagid,
      },
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });

  // yang belum
  let difference = data1.filter((x) => !data0.find((el) => el.code === x.code));
  //
  // const alld = data0.push(difference);
  var newData = [...data0, ...difference];

  res.json({
    success: dataConfig ? true : false,
    config: dataConfig,
    selected: data0,
    alldata: newData,
    listsoal: listsoal,
    message: dataConfig ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updategsdata = async (req, res) => {
  const schema = Joi.object({
    idc: Joi.required().messages({
      "any.required": `"Data id" tidak boleh dikosongi`,
    }),
    dataconf: Joi.required().messages({
      "any.required": `"Data Config" tidak boleh dikosongi`,
    }),
    data: Joi.required().messages({
      "any.required": `"Data Config" tidak boleh dikosongi`,
    }),
    datasoal: Joi.required().messages({
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
  //   console.log(req.body.idc);
  const dataconf = req.body.dataconf;
  const data = req.body.data;
  const datasoal = req.body.datasoal;

  // removing old
  var proc1 = await gs3_data
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => { 
      const cdata = data.map((itm, index) => {
        // delete itm["id"];
        const id = itm.id ? itm.id : itm.idbank;
        return {
          id_config: req.body.idc,
          id_dataakun: id,
          sorting: index,
          nilai: itm.nilai,
        };
      }); 
      //  BAtch
      if (cdata.length > 0) {
        await gs3_data.bulkCreate(cdata).catch((error) => {
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
  //gs3_datasoal
  var proc1 = await gs3_datasoal
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdatasoal = datasoal.map((itm, index) => {
        // delete itm["id"];
        return {
          id_config: req.body.idc,
          name: itm.name,
          nilai: itm.nilai,
          sorting: index,
        };
      });
      //  BAtch
      if (cdatasoal.length > 0) {
        await gs3_datasoal.bulkCreate(cdatasoal).catch((error) => {
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

  var proc3 = await gs3_config
    .update(
      {
        title: dataconf.title,
        deskripsi: dataconf.deskripsi,
        info: dataconf.info,
        narasisoal: dataconf.narasisoal,
        narasi_1: dataconf.narasi_1,
        narasi_2: dataconf.narasi_2,
        narasi_3: dataconf.narasi_3,
        narasi_4: dataconf.narasi_4,
        narasi_5: dataconf.narasi_5,
        narasi_6: dataconf.narasi_6,

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

// BANK
exports.addAkunData = async (req, res) => {
  const schema = Joi.object({
    noakun: Joi.string().min(3).max(6).required().messages({
      "string.empty": `"No akun" tidak boleh kosong`,
      "any.required": `"tag id" tidak boleh dikosongi`,
      "string.min": `"kode akun" minimal 3 huruf`,
      "string.max": `"kode akun" maksimal 6 huruf`,
    }),
    akun: Joi.string().min(4).max(50).required().messages({
      "string.empty": `"Nama Akun" tidak boleh kosong`,
      "any.required": `"nama akun" tidak boleh dikosongi`,
      "string.min": `"nama akun" minimal 4 huruf`,
      "string.max": `"nama akun" maksimal 50 huruf`,
    }),
    jumlah: Joi.number().integer().required().messages({
      "any.required": `"jumlah" tidak boleh dikosongi`,
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
  //
  await gs1_bank
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
        await gs1_bank
          .create({
            code: req.body.noakun,
            name: req.body.akun,
            nominal: req.body.jumlah,
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

exports.deletedatabank = async (req, res) => {
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
  // insert db
  await gs3_dataakun
    .destroy({
      where: {
        id: req.body.id,
      },
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
    id: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
    }),
    akun: Joi.string().min(4).max(50).required().messages({
      "string.empty": `"Nama Akun" tidak boleh kosong`,
      "any.required": `"nama akun" tidak boleh dikosongi`,
      "string.min": `"nama akun" minimal 4 huruf`,
      "string.max": `"nama akun" maksimal 50 huruf`,
    }),
    // jumlah: Joi.number().integer().required().messages({
    //   "any.required": `"jumlah" tidak boleh dikosongi`,
    // }),
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

  // update db
  await gs3_dataakun
    .update(
      {
        name: req.body.akun,
        // nominal: req.body.jumlah,
        jenis: req.body.jenis,
      },
      {
        where: { id: req.body.id },
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
