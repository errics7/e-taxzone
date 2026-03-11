const Joi = require("joi");
const perdagangan7_config = require("../../../models/perdagangan/perdagangan7_config.model");
const perdagangan7_jurnal = require("../../../models/perdagangan/perdagangan7_jurnal.model");
const perdagangan7_akun = require("../../../models/perdagangan/perdagangan7_akun.model");

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
  let p7config;
  let p7jurnal;
  let p7akun;

  //#region
  await perdagangan7_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p7config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan7_jurnal
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      // console.log('h', akun)
      p7jurnal = akun;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan7_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      // console.log('hiyaa', akun)
      const ds = akun.map((item) => ({
        ...item,
        idakun: JSON.parse(item.idakun),
      }));
      p7akun = ds;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  //#endregion
  // console.log(p7jurnal)
  // console.log(p7akun)
  res.json({
    ...p7config,
    datajurnal: p7jurnal,
    dataakun: p7akun,
    success: p7config ? true : false,
    message: p7config ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  console.log("find : ", id);
  const config = {
    narasisoal: req.body.config.narasisoal,
    cvname: req.body.config.cvname,
    tblworkname: req.body.config.tblworkname,
    intropembelian: req.body.config.intropembelian,
    introkas: req.body.config.introkas,
  };

  const datajurnal = req.body.config.datajurnal;
  const dataakun = req.body.config.dataakun;

  //#region
  // #1
  await perdagangan7_config
    .update({ ...config }, { where: { id: id }, raw: true })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  // #2
  const jurnalCustom = datajurnal.map((itm) => ({
    ...itm,
    id_config: id,
  }));
  await perdagangan7_jurnal
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan7_jurnal
        .bulkCreate(jurnalCustom)
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

  const akunCustom = dataakun.map((itm) => ({
    ...itm,
    id_config: id,
    uid: itm.uid,
    tgl: itm.tgl,
    detailname: itm.detailname,
    idakun: JSON.stringify(itm.idakun),
    datat: console.log("hallooooo ", itm),
  }));
  await perdagangan7_akun
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan7_akun
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
  //#endregion

  res.json({
    success: true,
    message: "Data berhasil disimpan",
  });
};
