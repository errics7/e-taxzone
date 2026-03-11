const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const gs8_config = sequelizeConf.define(
  "gs8_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.STRING,
    },
    ktanggal: {
      type: DataTypes.STRING,
    },
    knamarek: {
      type: DataTypes.STRING,
    },
    knobukti: {
      type: DataTypes.STRING,
    },
    kpbb1: {
      type: DataTypes.STRING,
    },
    kpbb2: {
      type: DataTypes.STRING,
    },
    kpppn1: {
      type: DataTypes.STRING,
    },
    kpppn2: {
      type: DataTypes.STRING,
    },
    kkhd1: {
      type: DataTypes.STRING,
    },
    kkhd2: {
      type: DataTypes.STRING,
    },
    fpnomorf: {
      type: DataTypes.STRING,
    },
    fpno: {
      type: DataTypes.STRING,
    },
    fpnama: {
      type: DataTypes.STRING,
    },
    fpalamat: {
      type: DataTypes.STRING,
    },
    fpnpwp: {
      type: DataTypes.STRING,
    },
    fpskpengukuhan: {
      type: DataTypes.STRING,
    },
    fptglfaktur: {
      type: DataTypes.STRING,
    },
    fpitmno: {
      type: DataTypes.STRING,
    },
    fpitmnama: {
      type: DataTypes.STRING,
    },
    fpitmkuantum: {
      type: DataTypes.STRING,
    },
    fpitmsatuan: {
      type: DataTypes.STRING,
    },
    fpitmtgl: {
      type: DataTypes.STRING,
    },
    fpitmpemilik: {
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

module.exports = gs8_config;
