const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs6_datacontrol = sequelizeConf.define(
  "gs6_datacontrol",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    kode: {
      type: DataTypes.STRING,
    },
    nopusatbiaya: {
      type: DataTypes.STRING,
    },
    nopembantubiaya: {
      type: DataTypes.STRING,
    },
    nilai: {
      type: DataTypes.INTEGER,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    keperluan: {
      type: DataTypes.STRING,
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

module.exports = gs6_datacontrol;
