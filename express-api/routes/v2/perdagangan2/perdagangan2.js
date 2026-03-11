const Joi = require("joi");
const { Sequelize } = require("sequelize");
const sequelizeConf = require("../../../config/sequelizeconf");
const Perdagangan2_bank = require("../../../models/perdagangan/perdagangan2_bank.model");

exports.newPerdaganganConfig = async (req, res) => {
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
  const queryConfig = await sequelizeConf
    .query(
      "SELECT * FROM gsperdagangan2_config WHERE gsperdagangan2_config.id=:id",
      {
        replacements: { id },
        logging: console.log,
        plain: false,
        raw: true,
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    .catch((error) =>
      res.status(400).json({
        message: error,
      })
    );

  const queryBarang = await sequelizeConf
    .query("SELECT * FROM perdagangan2_bank WHERE id_config=:id", {
      replacements: { id },
      logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) =>
      res.status(400).json({
        message: error,
      })
    ); 
  res.status(200).json({
    success: queryConfig[0] ? true : false,
    ...queryConfig[0],
    databarang: queryBarang,
    message: queryConfig[0] ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdaganganConfig = async (req, res) => {
  const id = req.body.config.id;
  const narasisoal = req.body.config.narasisoal;
  const narasiadt1 = req.body.config.narasiadt1;
  const headadt1 = req.body.config.headadt1;
  const headadt2 = req.body.config.headadt2;
  const headadt3 = req.body.config.headadt3;
  const dataBarang = req.body.config.databarang;

  await sequelizeConf
    .query(
      "UPDATE gsperdagangan2_config SET narasisoal=:narasisoal, narasiadt1=:narasiadt1, headadt1=:headadt1, headadt2=:headadt2, headadt3=:headadt3 WHERE id=:id",
      {
        replacements: {
          id,
          narasisoal,
          narasiadt1,
          headadt1,
          headadt2,
          headadt3,
        },
        logging: console.log,
        plain: false,
        raw: true,
      }
    )
    .catch((error) => res.status(400).json({ message: error }));

  await Perdagangan2_bank.destroy({
    where: {
      id_config: id,
    },
    logging: console.log,
  }).catch((error) => res.status(400).json({ message: error }));

  const datains = dataBarang.map((buku) => ({
    // ...buku,
    id_config: id,
    kode: buku.kode,
    namabarang: buku.namabarang,
    hargajual: buku.hargajual,
    hargabeli: buku.hargabeli,
    stok: buku.stok,
    tgl: buku.tgl,
  }));

  await Perdagangan2_bank.bulkCreate(datains)
    .then(() => console.log("Users data have been saved"))
    .catch((error) => res.status(400).json({ message: error }));

  res.json({
    success: true,
    message: "Data Berhasil Disimpan",
  });
};
