const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan9_jurnal = sequelizeConf.define(
  "perdagangan9_jurnal",
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
    gen: {
      type: DataTypes.STRING,
    },
    tgl: {
      type: DataTypes.STRING,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    namapemasok: {
      type: DataTypes.STRING,
    },
    no: {
      type: DataTypes.STRING,
    },
    persediaan: {
      type: DataTypes.BIGINT,
    },
    ppnmasukan: {
      type: DataTypes.BIGINT,
    },
    hutangdagang: {
      type: DataTypes.BIGINT,
    },
    kas: {
      type: DataTypes.BIGINT,
    },
    type: {
      type: DataTypes.STRING,
    },
    key: {
      type: DataTypes.STRING,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    jumlah: {
      type: DataTypes.BIGINT,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan9_jurnal;
