const Joi = require("joi");
const perdagangan4_config = require("../../../models/perdagangan/perdagangan4_config.model");
const perdagangan4_invoice = require("../../../models/perdagangan/perdagangan4_invoice.model");
const perdagangan4_barang = require("../../../models/perdagangan/perdagangan4_barang.model");
const perdagangan4_akun = require("../../../models/perdagangan/perdagangan4_akun.model");

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
  let p4config;
  let p4invoice;
  let p4akun;
  let p4barang;

  await perdagangan4_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p4config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan4_invoice
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((invoice) => {
      p4invoice = invoice;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan4_barang
    .findAll({
      where: { id_config: id },
      raw: true,
    })
    .then((barang) => {
      p4barang = barang;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan4_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p4akun = akun;
    });

  res.json({
    ...p4config,
    success: p4config ? true : false,
    datainvoice: p4invoice,
    dataakun: p4akun,
    databarang: p4barang.flat(),
    message: p4config ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  console.log("find : ", id);
  const config = {
    narasisoal: req.body.config.narasisoal,
    cvname: req.body.config.cvname,
    subtabel: req.body.config.subtabel,
    subinvoice: req.body.config.subinvoice,
    alamat: req.body.config.alamat,
    narasibarang: req.body.config.narasibarang,
  };

  const dataAkun = req.body.config.dataakun;
  const dataBarang = req.body.config.databarang;
  const dataInvoice = req.body.config.datainvoice;

  // #1
  await perdagangan4_config
    .update({ ...config }, { where: { id: id }, raw: true })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // #2
  const akunCustom = dataAkun.map((akun) => ({ ...akun, id_config: id }));
  await perdagangan4_akun
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan4_akun
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
  await perdagangan4_barang
    .destroy({
      where: {
        id_config: id,
      },
    })
    .then(async () => {
      await perdagangan4_barang
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
  const invoiceCustom = dataInvoice.map((invoice) => ({
    ...invoice,
    id_config: id,
  }));
  await perdagangan4_invoice
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan4_invoice
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
