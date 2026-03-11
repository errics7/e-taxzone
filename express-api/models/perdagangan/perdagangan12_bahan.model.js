const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan12_bahan = sequelizeConf.define(
  "perdagangan12_bahan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    uid: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    tgl: {
      type: DataTypes.STRING,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    perolehan: {
      type: DataTypes.BIGINT,
    },
    nilaisisa: {
      type: DataTypes.BIGINT,
    },
    durasi: {
      type: DataTypes.BIGINT,
    },
    satuanwaktu: {
      type: DataTypes.STRING,
    },
    jumlah: {
      type: DataTypes.BIGINT,
    },
    bungath: {
      type: DataTypes.BIGINT,
    },
    ref: {
      type: DataTypes.STRING,
    },
    debet: {
      type: DataTypes.BIGINT,
    },
    kredit: {
      type: DataTypes.BIGINT,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan12_bahan;
