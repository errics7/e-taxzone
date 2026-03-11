const perdagangan13_config = require("../../../models/perdagangan/perdagangan13_config.model");
const perdagangan13_akun = require("../../../models/perdagangan/perdagangan13_akun.model");
const perdagangan13_header = require("../../../models/perdagangan/perdagangan13_header.model");
const perdagangan13_nilai = require("../../../models/perdagangan/perdagangan13_nilai.model");
const perdagangan13_soal = require("../../../models/perdagangan/perdagangan13_soal.model");
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
  let p13config;
  let p13akun;
  let p13header;
  let p13soal;
  let p13nilai;

  //#region
  await perdagangan13_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p13config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  await perdagangan13_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p13akun = akun;
    });
  await perdagangan13_header
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((header) => {
      p13header = header;
    });
  await perdagangan13_soal
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((soal) => {
      const ds = soal.map((itm) => ({
        ...itm,
        list: JSON.parse(itm.list),
      }));
      p13soal = ds;
    });
  await perdagangan13_nilai
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
      p13nilai = dn;
    });
  //#endregion

  res.json({
    ...p13config,
    dataakun: p13akun,
    dataheader: p13header,
    datanilai: p13nilai,
    datasoal: p13soal,
    success: p13config ? true : false,
    message: p13config ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  // console.log("find : ", id);
  const config = {
    narasisoal: req.body.config.narasisoal,
    introsoal: req.body.config.introsoal,
    cvname: req.body.config.cvname,
    tblsoalname: req.body.config.tblsoalname,
    tblworkname: req.body.config.tblworkname,
    selectedwork: req.body.config.selectedwork,
  };

  const dataakun = req.body.config.dataakun;
  const dataheader = req.body.config.dataheader;
  const datanilai = req.body.config.datanilai;
  const datasoal = req.body.config.datasoal;

  //#region
  // #1
  await perdagangan13_config
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
  await perdagangan13_akun
    .destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await perdagangan13_akun
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
  await perdagangan13_header
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan13_header
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
  await perdagangan13_nilai
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan13_nilai
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
  // #5
  const datasoalCustom = datasoal.map((itm) => ({
    id_config: id,
    uid: itm.uid,
    tanggal: itm.tanggal,
    list: JSON.stringify(itm.list),
  }));
  await perdagangan13_soal
    .destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await perdagangan13_soal
        .bulkCreate(datasoalCustom)
        .then(() => console.log("Berhasil edit datasoalCustom"))
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
