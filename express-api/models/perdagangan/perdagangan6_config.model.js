const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan6_config = sequelizeConf.define(
  "gsperdagangan6_config",
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
    cvalamat: {
      type: DataTypes.STRING,
    },
    tblworkname: {
      type: DataTypes.STRING,
    },
    introsoal: {
      type: DataTypes.STRING,
    },
    introkontan: {
      type: DataTypes.STRING,
    },
    introkas: {
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

module.exports = perdagangan6_config;
