const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan12_config = sequelizeConf.define(
  "gsperdagangan12_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.TEXT,
    },
    cvname: {
      type: DataTypes.STRING,
    },
    tblworkname: {
      type: DataTypes.STRING,
    },
    namapelanggan: {
      type: DataTypes.STRING,
    },
    introsoal: {
      type: DataTypes.STRING,
    },
    introsoal1: {
      type: DataTypes.STRING,
    },
    introsoal1sub: {
      type: DataTypes.STRING,
    },
    introsoal2: {
      type: DataTypes.STRING,
    },
    introsoal3: {
      type: DataTypes.STRING,
    },
    introsoal3sub: {
      type: DataTypes.STRING,
    },
    tgl1: {
      type: DataTypes.STRING,
    },
    tgl2: {
      type: DataTypes.STRING,
    },
    tgl3: {
      type: DataTypes.STRING,
    },
    persentase: {
      type: DataTypes.DOUBLE,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    last_scen: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE(6),
    },
    updated_date: {
      type: DataTypes.DATE(6),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "updated_date",
  }
);

module.exports = perdagangan12_config;
