const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const gs6_config = sequelizeConf.define(
  "gs6_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.STRING,
    },
    tutorial: {
      type: DataTypes.STRING,
    },
    bppb: {
      type: DataTypes.STRING,
    },
    tgl_penerimabahan: {
      type: DataTypes.STRING,
    },
    tgl_bagiangudang: {
      type: DataTypes.STRING,
    },
    tgl_kepalabagian: {
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

module.exports = gs6_config;
