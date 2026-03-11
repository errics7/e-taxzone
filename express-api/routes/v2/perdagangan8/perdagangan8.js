const Joi = require("joi");
const perdagangan8_config = require("../../../models/perdagangan/perdagangan8_config.model");
const perdagangan8_jurnal = require("../../../models/perdagangan/perdagangan8_jurnal.model");

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
  let p8config;
  let p8jurnal;

  //#region
  await perdagangan8_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p8config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan8_jurnal
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((akun) => {
      p8jurnal = akun;
    });
  //#endregion

  res.json({
    ...p8config,
    datajurnal: p8jurnal,
    success: p8config ? true : false,
    message: p8config ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  console.log("find : ", id);
  const config = {
    narasisoal: req.body.config.narasisoal,
    cvname: req.body.config.cvname,
    tblworkname: req.body.config.tblworkname,
    intropenjualan: req.body.config.intropenjualan,
    introkasmasuk: req.body.config.introkasmasuk,
  };

  const datajurnal = req.body.config.datajurnal;

  //#region
  // #1
  await perdagangan8_config
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
  await perdagangan8_jurnal
    .destroy({ where: { id_config: id } })
    .then(async () => {
      await perdagangan8_jurnal
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
