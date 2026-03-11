const Joi = require("joi");
const perdagangan5_config = require("../../../models/perdagangan/perdagangan5_config.model");
const perdagangan5_akun = require("../../../models/perdagangan/perdagangan5_akun.model");
const perdagangan5_barang = require("../../../models/perdagangan/perdagangan5_barang.model");
const perdagangan5_nota = require("../../../models/perdagangan/perdagangan5_nota.model");

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
  let p5config;
  let p5nota;
  let p5akun;
  let p5barang;

  //#region
  await perdagangan5_config
    .findOne({
      where: { id },
      logging: console.log,
      raw: true,
    })
    .then((config) => {
      p5config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan5_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p5akun = akun;
    });

  await perdagangan5_barang
    .findAll({
      where: { id_config: id },
      raw: true,
    })
    .then((barang) => {
      p5barang = barang;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan5_nota
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((invoice) => {
      p5nota = invoice;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  //#endregion

  res.json({
    ...p5config,
    datanota: p5nota,
    dataakun: p5akun,
    databarang: p5barang.flat(),
    success: p5config ? true : false,
    message: p5config ? "" : "Tidak Ada data pada Game Simulasi ini.",
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
  await perdagangan5_config
    .update({ ...config }, { where: { id: id }, raw: true })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // #2
  const akunCustom = dataAkun.map((akun) => ({ ...akun, id_config: id }));
  await perdagangan5_akun
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan5_akun
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
  await perdagangan5_barang
    .destroy({
      where: {
        id_config: id,
      },
    })
    .then(async () => {
      await perdagangan5_barang
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
  await perdagangan5_nota
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan5_nota
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
