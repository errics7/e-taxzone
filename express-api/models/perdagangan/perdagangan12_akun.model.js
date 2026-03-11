const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan12_akun = sequelizeConf.define(
  "perdagangan12_akun",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    uid: {
      type: DataTypes.STRING,
    },
    gen: {
      type: DataTypes.STRING,
    },
    base: {
      type: DataTypes.STRING,
    },
    noakun: {
      type: DataTypes.BIGINT,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    uidbahan: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan12_akun;
