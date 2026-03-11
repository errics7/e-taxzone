const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan10_config = sequelizeConf.define(
  "gsperdagangan10_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.TEXT,
    },
    introsoal: {
      type: DataTypes.TEXT,
    },
    buyintro: {
      type: DataTypes.STRING,
    },
    buyptname: {
      type: DataTypes.STRING,
    },
    buyptalamat: {
      type: DataTypes.STRING,
    },
    buynoinvoice: {
      type: DataTypes.STRING,
    },
    buycustname: {
      type: DataTypes.STRING,
    },
    buycustalamat: {
      type: DataTypes.STRING,
    },
    buytgl: {
      type: DataTypes.STRING,
    },
    buynoorder: {
      type: DataTypes.STRING,
    },
    sellintro: {
      type: DataTypes.STRING,
    },
    sellptname: {
      type: DataTypes.STRING,
    },
    sellptalamat: {
      type: DataTypes.STRING,
    },
    sellptno: {
      type: DataTypes.STRING,
    },
    selltgl: {
      type: DataTypes.STRING,
    },
    selectedbrg: {
      type: DataTypes.STRING,
    },
    awaltgl: {
      type: DataTypes.STRING,
    },
    awalkuantitas: {
      type: DataTypes.BIGINT,
    },
    awalhpunit: {
      type: DataTypes.BIGINT,
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

module.exports = perdagangan10_config;
