const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const gs14_listpembantu = sequelizeConf.define(
  "gs14_listpembantu",
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
    cuid: {
      type: DataTypes.STRING,
    },
    bln: {
      type: DataTypes.STRING,
    },
    tgl: {
      type: DataTypes.STRING,
    },
    ket: {
      type: DataTypes.STRING,
    },
    ref: {
      type: DataTypes.STRING,
    },
    debit: {
      type: DataTypes.DOUBLE,
    },
    kredit: {
      type: DataTypes.DOUBLE,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = gs14_listpembantu;
