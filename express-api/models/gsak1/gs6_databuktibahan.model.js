const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs6_databuktibahan = sequelizeConf.define(
  "gs6_databuktibahan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    namabhn: {
      type: DataTypes.STRING,
    },
    satuan: {
      type: DataTypes.STRING,
    },
    diminta: {
      type: DataTypes.INTEGER,
    },
    keluar: {
      type: DataTypes.INTEGER,
    },
    hargasatuan: {
      type: DataTypes.INTEGER,
    },
    hargajumlah: {
      type: DataTypes.INTEGER,
    },
    keperluan: {
      type: DataTypes.STRING,
    },
    sorting: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = gs6_databuktibahan;
