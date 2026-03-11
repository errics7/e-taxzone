const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan11_akun = sequelizeConf.define(
  "perdagangan11_akun",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    noakun: {
      type: DataTypes.INTEGER,
    },
    id_akun: {
      type: DataTypes.STRING,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    nama: {
      type: DataTypes.STRING,
    },
    total_kredit: {
      type: DataTypes.BIGINT,
    },
    total_debet: {
      type: DataTypes.BIGINT,
    },
    saldo_awal: {
      type: DataTypes.BIGINT,
    },
    type_saldo: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan11_akun;
