const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan6_akun = sequelizeConf.define(
  "perdagangan6_akun",
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
    jumlah: {
      type: DataTypes.BIGINT,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan6_akun;
