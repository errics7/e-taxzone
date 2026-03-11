const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs3_data = sequelizeConf.define(
  "gs3_data",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    id_dataakun: {
      type: DataTypes.INTEGER,
    },
    nilai: {
      type: DataTypes.INTEGER,
    },
    sorting: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = gs3_data;
