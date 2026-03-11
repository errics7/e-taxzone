const Joi = require("joi");
const perdagangan3_akun = require("../../../models/perdagangan/perdagangan3_akun.model");
const perdagangan3_barang = require("../../../models/perdagangan/perdagangan3_barang.model");
const perdagangan3_config = require("../../../models/perdagangan/perdagangan3_config.model");
const perdagangan3_invoice = require("../../../models/perdagangan/perdagangan3_invoice.model");

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
  let p3config;
  let p3invoice;
  let p3akun;
  let p3barang;
  await perdagangan3_config
    .findOne({ where: { id }, logging: console.log, raw: true })
    .then((config) => {
      p3config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan3_invoice
    .findAll({ where: { id_config: id }, logging: console.log, raw: true })
    .then((invoice) => {
      p3invoice = invoice;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan3_barang
    .findAll({
      where: { id_config: id },
      raw: true,
    })
    .then((barang) => {
      p3barang = barang;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan3_akun
    .findAll({ where: { id_config: id }, logging: console.log, raw: true })
    .then((akun) => {
      p3akun = akun;
    });

  res.json({
    success: p3config ? true : false,
    ...p3config,
    datainvoice: p3invoice,
    dataakun: p3akun,
    databarang: p3barang.flat(),
    message: p3config ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.params.id;
  const config = {
    narasisoal: req.body.config.narasisoal,
    cvname: req.body.config.cvname,
    subtable: req.body.config.subtable,
    subinvoice: req.body.config.subinvoice,
  };

  const dataAkun = req.body.config.dataakun;
  const dataInvoice = req.body.config.datainvoice;
  const dataBarang = req.body.config.databarang;

  await perdagangan3_config
    .update({ ...config }, { where: { id: id } })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  const akunCustom = dataAkun.map((akun) => {
    return { ...akun, id_config: id };
  });
  const invoiceCustom = dataInvoice.map((invoice) => {
    delete invoice["id"];
    return {
      ...invoice,
      id_config: id,
    };
  });
  const barangCustom = dataBarang.map((barang) => {
    delete barang["barang_id"];
    return {
      ...barang,
      id_config: id,
    };
  });

  await perdagangan3_akun
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan3_akun
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

  await perdagangan3_invoice
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan3_invoice
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

  await perdagangan3_barang
    .destroy({
      where: {
        id_config: id,
      },
    })
    .then(async () => {
      await perdagangan3_barang
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

  res.json({
    success: true,
    message: "Data berhasil disimpan",
  });
};
