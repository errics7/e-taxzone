const perdagangan12_config = require("../../../models/perdagangan/perdagangan12_config.model");
const perdagangan12_akun = require("../../../models/perdagangan/perdagangan12_akun.model");
const perdagangan12_bahan = require("../../../models/perdagangan/perdagangan12_bahan.model");
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
  let p12config;
  let p12akun;
  let p12bahan;

  //#region
  await perdagangan12_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p12config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan12_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p12akun = akun;
    });

  await perdagangan12_bahan
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((bahan) => {
      p12bahan = bahan;
    });
  //#endregion

  res.json({
    ...p12config,
    dataakun: p12akun,
    databahan: p12bahan,
    success: p12config ? true : false,
    message: p12config ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  // console.log("find : ", id);
  const config = {
    narasisoal: req.body.config.narasisoal,
    cvname: req.body.config.cvname,
    tblworkname: req.body.config.tblworkname,
    namapelanggan: req.body.config.namapelanggan,
    introsoal: req.body.config.introsoal,
    introsoal1: req.body.config.introsoal1,
    introsoal1sub: req.body.config.introsoal1sub,
    introsoal2: req.body.config.introsoal2,
    introsoal3: req.body.config.introsoal3,
    introsoal3sub: req.body.config.introsoal3sub,
    tgl1: req.body.config.tgl1,
    tgl2: req.body.config.tgl2,
    tgl3: req.body.config.tgl3,
    persentase: req.body.config.persentase,
  };

  const dataakun = req.body.config.dataakun;
  const databahan = req.body.config.databahan;

  //#region
  // #1
  await perdagangan12_config
    .update({ ...config }, { where: { id: id }, raw: true })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // #2
  const dataakunCustom = dataakun.map((itm) => ({
    ...itm,
    id_config: id,
  }));

  await perdagangan12_akun
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan12_akun
        .bulkCreate(dataakunCustom)
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
  const databahanCustom = databahan.map((itm) => ({
    ...itm,
    id_config: id,
  }));

  await perdagangan12_bahan
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan12_bahan
        .bulkCreate(databahanCustom)
        .then(() => console.log("Berhasil edit databahanCustom"))
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
  //#endregion

  res.json({
    success: true,
    message: "Data berhasil disimpan",
  });
};
