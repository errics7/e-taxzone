const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const gs5_config = sequelizeConf.define(
  "gs5_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.STRING,
    },
    nobppb: {
      type: DataTypes.STRING,
    },
    info_tglpbahan: {
      type: DataTypes.STRING,
    },
    info_tglbgudang: {
      type: DataTypes.STRING,
    },
    info_tglkbagian: {
      type: DataTypes.STRING,
    },
    tgl_mutasikeluar: {
      type: DataTypes.STRING,
    },
    sal_kwt: {
      type: DataTypes.DOUBLE,
    },
    sal_harga: {
      type: DataTypes.DOUBLE,
    },
    sal_jumlah: {
      type: DataTypes.DOUBLE,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    kwt: {
      type: DataTypes.DOUBLE,
    },
    harga: {
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

module.exports = gs5_config;
