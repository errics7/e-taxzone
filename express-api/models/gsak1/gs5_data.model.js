const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs5_data = sequelizeConf.define(
  "gs5_data",
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
    dimintaqty: {
      type: DataTypes.INTEGER,
    },
    keluarqty: {
      type: DataTypes.INTEGER,
    },
    hrgsatuan: {
      type: DataTypes.INTEGER,
    },
    hrgjumlah: {
      type: DataTypes.INTEGER,
    },
    keperluan: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    // createdAt: "created_date",
    // updatedAt: "updated_date",
  }
);

module.exports = gs5_data;
