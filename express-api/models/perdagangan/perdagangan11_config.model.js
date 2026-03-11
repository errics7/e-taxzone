const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan11_config = sequelizeConf.define(
  "gsperdagangan11_config",
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
    tgl: {
      type: DataTypes.STRING,
    },
    subtabel: {
      type: DataTypes.STRING,
    },
    subinvoice: {
      type: DataTypes.STRING,
    },
    tglsoal: {
      type: DataTypes.STRING,
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

module.exports = perdagangan11_config;
