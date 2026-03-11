const perdagangan11_akun = require("../../../models/perdagangan/perdagangan11_akun.model");
const perdagangan11_config = require("../../../models/perdagangan/perdagangan11_config.model");
const perdagangan11_posting = require("../../../models/perdagangan/perdagangan11_posting.model");
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
  let p11config;
  let p11akun;
  let p11posting;

  //#region
  await perdagangan11_config
    .findOne({
      where: { id },
      logging: console.log,
      raw: true,
    })
    .then((config) => {
      p11config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan11_akun
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p11akun = akun;
    });

  await perdagangan11_posting
    .findAll({
      where: { id_config: id },
      raw: true,
    })
    .then((posting) => {
      p11posting = posting;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  //#endregion

  res.json({
    ...p11config,
    dataakun: p11akun,
    dataposting: p11posting,
    success: p11config ? true : false,
    message: p11config ? "" : "Tidak Ada data pada Game Simulasi ini.",
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
    tgl: req.body.config.tgl,
    tglsoal: req.body.config.tglsoal,
  };

  const dataAkun = req.body.config.dataakun;
  const dataPosting = req.body.config.dataposting;

  await perdagangan11_config
    .update({ ...config }, { where: { id: id }, raw: true })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  const akunCustom = dataAkun.map((akun) => ({ ...akun, id_config: id }));

  await perdagangan11_akun
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan11_akun
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

  const postingCustom = dataPosting.map((posting) => ({
    ...posting,
    id_config: id,
  }));

  await perdagangan11_posting
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan11_posting
        .bulkCreate(postingCustom)
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

  res.json({
    success: true,
    message: "Data berhasil disimpan",
  });
};
