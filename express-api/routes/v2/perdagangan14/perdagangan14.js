const perdagangan14_config = require("../../../models/perdagangan/perdagangan14_config.model");
const perdagangan14_akun = require("../../../models/perdagangan/perdagangan14_akun.model");
const perdagangan14_header = require("../../../models/perdagangan/perdagangan14_header.model");
const perdagangan14_nilai = require("../../../models/perdagangan/perdagangan14_nilai.model");
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

  let p14config;
  let p14akun;
  let p14header;
  let p14nilai;

  //#region
  await perdagangan14_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p14config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  await perdagangan14_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p14akun = akun;
    });
  await perdagangan14_header
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((header) => {
      p14header = header;
    });
  await perdagangan14_nilai
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((nilai) => {
      const dn = nilai.map((itm) => ({
        ...itm,
        key: itm.key === 1 ? true : false,
      }));
      p14nilai = dn;
    });
  //#endregion
  if (!p14config) {
    res.json({
      ...p14config,
      success: p14config ? true : false,
      message: p14config ? "" : "Tidak Ada data pada Game Simulasi ini.",
    });
  } else {
    res.json({
      ...p14config,
      selectedwork:
        p14config.selectedwork === null
          ? []
          : JSON.parse(p14config.selectedwork),
      dataakun: p14akun,
      dataheader: p14header,
      datanilai: p14nilai,
      success: p14config ? true : false,
      message: p14config ? "" : "Tidak Ada data pada Game Simulasi ini.",
    });
  }
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  console.log("find : ", id);
  const config = {
    narasisoal: req.body.config.narasisoal,
    cvname: req.body.config.cvname,
    tblworkname: req.body.config.tblworkname,
    selectedwork: JSON.stringify(req.body.config.selectedwork),
  };

  const dataakun = req.body.config.dataakun;
  const dataheader = req.body.config.dataheader;
  const datanilai = req.body.config.datanilai;

  //#region
  // #1
  await perdagangan14_config
    .update({ ...config }, { where: { id: id }, raw: true })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // #2
  const dataakunCustom = dataakun.map((itm) => ({
    id_config: id,
    uid: itm.uid,
    alias: itm.alias,
    noakun: itm.noakun,
  }));
  await perdagangan14_akun
    .destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await perdagangan14_akun
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
  const dataheaderCustom = dataheader.map((itm) => ({
    ...itm,
    id_config: id,
  }));
  await perdagangan14_header
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan14_header
        .bulkCreate(dataheaderCustom)
        .then(() => console.log("Berhasil edit dataheaderCustom"))
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
  const datanilaiCustom = datanilai.map((itm) => ({
    ...itm,
    id_config: id,
  }));
  await perdagangan14_nilai
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan14_nilai
        .bulkCreate(datanilaiCustom)
        .then(() => console.log("Berhasil edit datanilaiCustom"))
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
