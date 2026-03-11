const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const gs7_config = sequelizeConf.define(
  "gs7_config",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    narasisoal: {
      type: DataTypes.STRING,
    },
    kp_kelompok: {
      type: DataTypes.STRING,
    },
    kp_namabarang: {
      type: DataTypes.STRING,
    },
    kp_tgl1: {
      type: DataTypes.STRING,
    },
    kp_tgl2: {
      type: DataTypes.STRING,
    },
    kp_tgl3: {
      type: DataTypes.STRING,
    },
    kp_keterangan2: {
      type: DataTypes.STRING,
    },
    kp_keterangan3: {
      type: DataTypes.STRING,
    },
    kp_nobukti2: {
      type: DataTypes.STRING,
    },
    kp_nobukti3: {
      type: DataTypes.STRING,
    },
    kp_mk3: {
      type: DataTypes.STRING,
    },
    kp_mh3: {
      type: DataTypes.STRING,
    },
    kp_mj3: {
      type: DataTypes.STRING,
    },
    kp_kk2: {
      type: DataTypes.STRING,
    },
    kp_kh2: {
      type: DataTypes.STRING,
    },
    kp_kj2: {
      type: DataTypes.STRING,
    },
    kp_saldok1: {
      type: DataTypes.STRING,
    },
    kp_saldok2: {
      type: DataTypes.STRING,
    },
    kp_saldok3: {
      type: DataTypes.STRING,
    },
    kp_saldoh1: {
      type: DataTypes.STRING,
    },
    kp_saldoh2: {
      type: DataTypes.STRING,
    },
    kp_saldoh3: {
      type: DataTypes.STRING,
    },
    kp_saldoj1: {
      type: DataTypes.STRING,
    },
    kp_saldoj2: {
      type: DataTypes.STRING,
    },
    kp_saldoj3: {
      type: DataTypes.STRING,
    },
    fp_no: {
      type: DataTypes.STRING,
    },
    fp_nama: {
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

module.exports = gs7_config;
