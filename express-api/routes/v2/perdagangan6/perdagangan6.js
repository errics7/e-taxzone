const perdagangan6_config = require("../../../models/perdagangan/perdagangan6_config.model");
const perdagangan6_akun = require("../../../models/perdagangan/perdagangan6_akun.model");
const perdagangan6_barang = require("../../../models/perdagangan/perdagangan6_barang.model");
const perdagangan6_nota = require("../../../models/perdagangan/perdagangan6_nota.model");
const Joi = require("joi");

exports.getPerdagangan = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "number.base": `"tag id" Tidak valid pastikan alamat url sesuai.`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
    return;
  }
  //
  const id = req.params.id;
  let p6config;
  let p6nota;
  let p6akun;
  let p6barang;

  //#region
  await perdagangan6_config
    .findOne({
      where: { id },
      logging: console.log,
      raw: true,
    })
    .then((config) => {
      p6config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan6_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p6akun = akun;
    });

  await perdagangan6_barang
    .findAll({
      where: { id_config: id },
      raw: true,
    })
    .then((barang) => {
      p6barang = barang;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan6_nota
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((invoice) => {
      p6nota = invoice;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  //#endregion

  res.json({
    ...p6config,
    datanota: p6nota,
    dataakun: p6akun,
    databarang: p6barang.flat(),
    success: p6config ? true : false,
    message: p6config ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  console.log("find : ", id);
  const config = {
    narasisoal: req.body.config.narasisoal,
    cvname: req.body.config.cvname,
    cvalamat: req.body.config.cvalamat,
    tblworkname: req.body.config.tblworkname,
    introsoal: req.body.config.introsoal,
    introkontan: req.body.config.introkontan,
    introkas: req.body.config.introkas,
  };

  const dataAkun = req.body.config.dataakun;
  const dataBarang = req.body.config.databarang;
  const datanota = req.body.config.datanota;

  // #1
  await perdagangan6_config
    .update({ ...config }, { where: { id: id }, raw: true })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // #2
  const akunCustom = dataAkun.map((akun) => ({ ...akun, id_config: id }));
  await perdagangan6_akun
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan6_akun
        .bulkCreate(akunCustom)
        .then(() => console.log("Berhasil edit akun"))
        .catch((error) => {
          res.status(400).json({
            message: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // #3
  const barangCustom = dataBarang.map((barang) => ({
    ...barang,
    id_config: id,
  }));
  await perdagangan6_barang
    .destroy({
      where: {
        id_config: id,
      },
    })
    .then(async () => {
      await perdagangan6_barang
        .bulkCreate(barangCustom)
        .then(() => console.log("Berhasil edit barang"))
        .catch((error) => {
          res.status(400).json({
            message: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // #4
  const invoiceCustom = datanota.map((invoice) => ({
    ...invoice,
    id_config: id,
  }));
  await perdagangan6_nota
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan6_nota
        .bulkCreate(invoiceCustom)
        .then(() => console.log("Berhasil edit invoice"))
        .catch((error) => {
          res.status(400).json({
            message: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  res.json({
    success: true,
    message: "Data berhasil disimpan",
  });
};
