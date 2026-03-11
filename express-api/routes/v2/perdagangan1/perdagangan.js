const Joi = require("joi");

const sequelizeConf = require("../../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const Perdagangan1_bank = require("../../../models/perdagangan/perdagangan1_bank.model");

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
  //
  const queryConfig = await sequelizeConf
    .query(
      "SELECT gsperdagangan1_config.id, gsperdagangan1_config.narasisoal, gsperdagangan1_config.narasi_adt1, gsperdagangan1_config.narasi_adt2 FROM gsperdagangan1_config WHERE gsperdagangan1_config.id=:id",
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

  const queryBuku = await sequelizeConf
    .query("SELECT * FROM perdagangan1_bank WHERE id_config=:id", {
      replacements: { id },
      logging: console.log,
      plain: false,
      raw: true,
    })
    .catch((error) =>
      res.status(400).json({
        message: error,
      })
    );

  console.log(queryConfig[0]);

  res.status(200).json({
    ...queryConfig[0],
    databuku: queryBuku[0],
    success: queryConfig[0] ? true : false,
    message: queryConfig[0] ? "" : "Tidak Ada data pada Game Simulasi ini.",
  });
};

exports.updatePerdaganganConfig = async (req, res) => {
  const id = req.body.config.id;
  const narasisoal = req.body.config.narasisoal;
  const narasi_adt1 = req.body.config.narasi_adt1;
  const narasi_adt2 = req.body.config.narasi_adt2;
  const dataBuku = req.body.config.databuku;

  await sequelizeConf
    .query(
      "UPDATE gsperdagangan1_config SET narasisoal=:narasisoal, narasi_adt1=:narasi_adt1, narasi_adt2=:narasi_adt2 WHERE id=:id",
      {
        replacements: {
          id: id,
          narasisoal,
          narasi_adt1,
          narasi_adt2,
        },
        logging: console.log,
        plain: false,
        raw: true,
      }
    )
    .catch((error) => res.status(400).json({ message: error }));

  const datains = dataBuku.map((bank) => ({
    name: bank.name,
    tgl: bank.tgl,
    tgl_worksheet: bank.tgl_worksheet,
    jumlah: bank.jumlah,
    jenis: bank.jenis,
    posisi: bank.posisi,
    id_config: id,
  }));
  await Perdagangan1_bank.destroy({ where: { id_config: id }, force: true })
    .then(async () => {
      await Perdagangan1_bank.bulkCreate(datains)
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Data Berhasil Disimpan",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            message: error,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    });
};
