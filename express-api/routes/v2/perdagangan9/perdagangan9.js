const perdagangan9_config = require("../../../models/perdagangan/perdagangan9_config.model");
const perdagangan9_jurnal = require("../../../models/perdagangan/perdagangan9_jurnal.model");
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
  let p9config;
  let p9jurnal;

  //#region
  await perdagangan9_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p9config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan9_jurnal
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p9jurnal = akun;
    });
  //#endregion

  res.json({
    ...p9config,
    datajurnal: p9jurnal,
    success: p9config ? true : false,
    message: p9config ? "" : "Tidak Ada data pada Game Simulasi ini.",
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
    introkaskeluar: req.body.config.introkaskeluar,
  };

  const datajurnal = req.body.config.datajurnal;

  //#region
  // #1
  await perdagangan9_config
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

  await perdagangan9_jurnal
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan9_jurnal
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
  //#endregion

  res.json({
    success: true,
    message: "Data berhasil disimpan",
  });
};
