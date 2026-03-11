const Joi = require("joi");
const perdagangan16_config = require("../../../models/perdagangan/perdagangan16_config.model");
const perdagangan16_akun = require("../../../models/perdagangan/perdagangan16_akun.model");
const perdagangan16_nilai = require("../../../models/perdagangan/perdagangan16_nilai.model");
const perdagangan16_header = require("../../../models/perdagangan/perdagangan16_header.model");
const perdagangan16_work = require("../../../models/perdagangan/perdagangan16_work.model");

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

  let p16config;
  let p16akun;
  let p16header;
  let p16nilai;
  let p16work;

  //#region
  await perdagangan16_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p16config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  await perdagangan16_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p16akun = akun;
    });
  await perdagangan16_header
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((header) => {
      p16header = header;
    });
  await perdagangan16_nilai
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
      p16nilai = dn;
    });
  await perdagangan16_work
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((work) => {
      p16work = work;
    });
  //#endregion

  if (!p16config) {
    res.json({
      ...p16config,
      success: p16config ? true : false,
      message: p16config ? "" : "Tidak Ada data pada Game Simulasi ini.",
    });
  } else {
    res.json({
      ...p16config,
      showrowlaba:
        p16config.showrowlaba === null || p16config.showrowlaba === ""
          ? []
          : JSON.parse(p16config.showrowlaba),
      showrowtotal:
        p16config.showrowtotal === null || p16config.showrowtotal === ""
          ? []
          : JSON.parse(p16config.showrowtotal),
      dataakun: p16akun,
      dataheader: p16header,
      datanilai: p16nilai,
      datawork: p16work,
      success: p16config ? true : false,
      message: p16config ? "" : "Tidak Ada data pada Game Simulasi ini.",
    });
  }
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  console.log("find : ", id);
  const config = {
    narasisoal: req.body.config.narasisoal,
    cvname: req.body.config.cvname,
    tblsoalname: req.body.config.tblsoalname,
    tblworkname: req.body.config.tblworkname,
    showrowlaba: JSON.stringify(req.body.config.showrowlaba),
    showrowtotal: JSON.stringify(req.body.config.showrowtotal),
  };

  const dataakun = req.body.config.dataakun;
  const dataheader = req.body.config.dataheader;
  const datanilai = req.body.config.datanilai;
  const datawork = req.body.config.datawork;

  //#region
  // #1
  await perdagangan16_config
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

  await perdagangan16_akun
    .destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await perdagangan16_akun
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
  await perdagangan16_header
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan16_header
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
  await perdagangan16_nilai
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan16_nilai
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
  const dataworkCustom = datawork.map((itm) => ({
    id_config: id,
    uid: itm.uid,
    alias: itm.alias,
    value: itm.value,
    type: itm.type,
  }));

  await perdagangan16_work
    .destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await perdagangan16_work
        .bulkCreate(dataworkCustom)
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
  //#endregion

  res.json({
    success: true,
    message: "Data berhasil disimpan",
  });
};
