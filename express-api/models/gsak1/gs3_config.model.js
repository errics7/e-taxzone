const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const gs3_config = sequelizeConf.define(
  "gs3_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
    info: {
      type: DataTypes.STRING,
    },
    narasisoal: {
      type: DataTypes.STRING,
    },
    narasi_1: {
      type: DataTypes.STRING,
    },
    narasi_2: {
      type: DataTypes.STRING,
    },
    narasi_3: {
      type: DataTypes.STRING,
    },
    narasi_4: {
      type: DataTypes.STRING,
    },
    narasi_5: {
      type: DataTypes.STRING,
    },
    narasi_6: {
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

module.exports = gs3_config;
