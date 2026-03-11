const perdagangan15_config = require("../../../models/perdagangan/perdagangan15_config.model");
const perdagangan15_akun = require("../../../models/perdagangan/perdagangan15_akun.model");
const perdagangan15_header = require("../../../models/perdagangan/perdagangan15_header.model");
const perdagangan15_nilai = require("../../../models/perdagangan/perdagangan15_nilai.model");
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
  let p15config;
  let p15akun;
  let p15header;
  let p15nilai;

  //#region
  await perdagangan15_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p15config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  await perdagangan15_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p15akun = akun;
    });
  await perdagangan15_header
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((header) => {
      p15header = header;
    });
  await perdagangan15_nilai
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
      p15nilai = dn;
    });
  //#endregion

  if (!p15config) {
    res.json({
      ...p15config,
      success: p15config ? true : false,
      message: p15config ? "" : "Tidak Ada data pada Game Simulasi ini.",
    });
  } else {
    res.json({
      ...p15config,
      showrowlaba:
        p15config.showrowlaba === null || p15config.showrowlaba === ""
          ? []
          : JSON.parse(p15config.showrowlaba),
      showrowtotal:
        p15config.showrowtotal === null || p15config.showrowtotal === ""
          ? []
          : JSON.parse(p15config.showrowtotal),
      dataakun: p15akun,
      dataheader: p15header,
      datanilai: p15nilai,
      success: p15config ? true : false,
      message: p15config ? "" : "Tidak Ada data pada Game Simulasi ini.",
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
    keytabel: req.body.config.keytabel,
  };

  const dataakun = req.body.config.dataakun;
  const dataheader = req.body.config.dataheader;
  const datanilai = req.body.config.datanilai;

  //#region
  // #1
  await perdagangan15_config
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

  await perdagangan15_akun
    .destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await perdagangan15_akun
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
  await perdagangan15_header
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan15_header
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
  await perdagangan15_nilai
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan15_nilai
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
