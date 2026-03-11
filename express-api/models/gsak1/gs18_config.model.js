const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs18_config = sequelizeConf.define(
  "gs18_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.STRING,
    },
    namept: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    subtitle: {
      type: DataTypes.STRING,
    },
    subtable1: {
      type: DataTypes.STRING,
    },
    subtable2: {
      type: DataTypes.STRING,
    },
    subtable3: {
      type: DataTypes.STRING,
    },
    keteranganpen: {
      type: DataTypes.STRING,
    },
    bbb: {
      type: DataTypes.DOUBLE,
    },
    bbp: {
      type: DataTypes.DOUBLE,
    },
    btkl: {
      type: DataTypes.DOUBLE,
    },
    bop: {
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

module.exports = gs18_config;
