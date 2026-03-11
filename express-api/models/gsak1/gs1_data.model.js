const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs1_data = sequelizeConf.define(
  "gs1_data",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    id_bank: {
      type: DataTypes.INTEGER,
    },
    used: {
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

module.exports = gs1_data;
