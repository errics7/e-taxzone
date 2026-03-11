const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const gs10_config = sequelizeConf.define(
  "gs10_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.STRING,
    },
    perolehan: {
      type: DataTypes.STRING,
    },
    hargaperolehan: {
      type: DataTypes.INTEGER,
    },
    nilaisisa: {
      type: DataTypes.INTEGER,
    },
    umur: {
      type: DataTypes.INTEGER,
    },
    namept: {
      type: DataTypes.STRING,
    },
    nobm: {
      type: DataTypes.STRING,
    },
    narasialokasi: {
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

module.exports = gs10_config;
