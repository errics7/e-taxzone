const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan1_config = sequelizeConf.define(
  "gsperdagangan1_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.TEXT,
    },
    narasi_adt1: {
      type: DataTypes.STRING,
    },
    narasi_adt2: {
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

module.exports = perdagangan1_config;
