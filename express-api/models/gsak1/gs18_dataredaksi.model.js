const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs18_dataredaksi = sequelizeConf.define(
  "gs18_dataredaksi",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    uuid: {
      type: DataTypes.STRING,
    },
    redaksi: {
      type: DataTypes.STRING,
    },
    biaya: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    // createdAt: "created_date",
    // updatedAt: "updated_date",
  }
);

module.exports = gs18_dataredaksi;
