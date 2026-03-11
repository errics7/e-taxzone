const Joi = require("joi");
const perdagangan17_config = require("../../../models/perdagangan/perdagangan17_config.model");
const perdagangan17_akun = require("../../../models/perdagangan/perdagangan17_akun.model");
const perdagangan17_nilai = require("../../../models/perdagangan/perdagangan17_nilai.model");
const perdagangan17_header = require("../../../models/perdagangan/perdagangan17_header.model");
const perdagangan17_work = require("../../../models/perdagangan/perdagangan17_work.model");

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
  let p17config;
  let p17akun;
  let p17header;
  let p17nilai;
  let p17work;

  //#region
  await perdagangan17_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p17config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  await perdagangan17_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p17akun = akun;
    });
  await perdagangan17_header
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((header) => {
      p17header = header;
    });
  await perdagangan17_nilai
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((nilai) => {
      // const dn = nilai.map((itm) => ({
      //   ...itm,
      //   key: itm.key === 1 ? true : false,
      // }));
      p17nilai = nilai;
    });
  await perdagangan17_work
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((work) => {
      const dw = work.map((itm) => ({
        ...itm,
        key_noakun: itm.key_noakun === 1 ? true : false,
        key_alias: itm.key_alias === 1 ? true : false,
        key_value: itm.key_value === 1 ? true : false,
      }));
      p17work = dw;
    });
  //#endregion
  if (!p17config) {
    res.json({
      ...p17config,
      success: p17config ? true : false,
      message: p17config ? "" : "Tidak Ada data pada Game Simulasi ini.",
    });
  } else {
    res.json({
      ...p17config,
      showrowlaba:
        p17config.showrowlaba === null || p17config.showrowlaba === ""
          ? []
          : JSON.parse(p17config.showrowlaba),
      showrowtotal:
        p17config.showrowtotal === null || p17config.showrowtotal === ""
          ? []
          : JSON.parse(p17config.showrowtotal),
      dataakun: p17akun,
      dataheader: p17header,
      datanilai: p17nilai,
      datawork: p17work,
      success: p17config ? true : false,
      message: p17config ? "" : "Tidak Ada data pada Game Simulasi ini.",
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
  await perdagangan17_config
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

  await perdagangan17_akun
    .destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await perdagangan17_akun
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
  await perdagangan17_header
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan17_header
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
  await perdagangan17_nilai
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan17_nilai
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
    noakun: itm.noakun,
    alias: itm.alias,
    value: itm.value,
    key_noakun: itm.key_noakun,
    key_alias: itm.key_alias,
    key_value: itm.key_value,
    posisi: itm.posisi,
    type: itm.type,
  }));

  await perdagangan17_work
    .destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await perdagangan17_work
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
