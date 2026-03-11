const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs11_kode = sequelizeConf.define(
  "gs11_kode",
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
    alias: {
      type: DataTypes.STRING,
    },
    colspan: {
      type: DataTypes.INTEGER,
    },
    rowspan: {
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

module.exports = gs11_kode;
