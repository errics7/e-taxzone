const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan3_akun = sequelizeConf.define(
  "perdagangan3_akun",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    noakun: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    jumlah: {
      type: DataTypes.BIGINT,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan3_akun;
