const perdagangan10_config = require("../../../models/perdagangan/perdagangan10_config.model");
const perdagangan10_barang = require("../../../models/perdagangan/perdagangan10_barang.model");
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
  let p10config;
  let p10barang;

  //#region
  await perdagangan10_config
    .findOne({
      where: { id },
      // logging: console.log,
      raw: true,
    })
    .then((config) => {
      p10config = config;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  await perdagangan10_barang
    .findAll({
      where: { id_config: id },
      // logging: console.log,
      raw: true,
    })
    .then((barang) => {
      p10barang = barang;
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  //#endregion

  res.json({
    ...p10config,
    databarang: p10barang,
    success: p10config ? true : false,
    message: p10config ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdagangan = async (req, res) => {
  const id = req.body.config.id;
  const config = {
    narasisoal: req.body.config.narasisoal,
    introsoal: req.body.config.introsoal,
    buyintro: req.body.config.buyintro,
    buyptname: req.body.config.buyptname,
    buyptalamat: req.body.config.buyptalamat,
    buynoinvoice: req.body.config.buynoinvoice,
    buycustname: req.body.config.buycustname,
    buycustalamat: req.body.config.buycustalamat,
    buytgl: req.body.config.buytgl,
    buynoorder: req.body.config.buynoorder,
    sellintro: req.body.config.sellintro,
    sellptname: req.body.config.sellptname,
    sellptalamat: req.body.config.sellptalamat,
    sellptno: req.body.config.sellptno,
    selltgl: req.body.config.selltgl,
    selectedbrg: req.body.config.selectedbrg,
    awaltgl: req.body.config.awaltgl,
    awalkuantitas: req.body.config.awalkuantitas,
    awalhpunit: req.body.config.awalhpunit,
  };
  const dataBarang = req.body.config.databarang;

  await perdagangan10_config
    .update({ ...config }, { where: { id: id } })
    .then(() => console.log("Berhasil edit config"))
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  const barangCustom = dataBarang.map((barang) => ({
    ...barang,
    id_config: id,
  }));

  await perdagangan10_barang
    .destroy({
      where: {
        id_config: id,
      },
    })
    .then(async () => {
      await perdagangan10_barang
        .bulkCreate(barangCustom)
        .then(() => console.log("Berhasil edit barang"))
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
