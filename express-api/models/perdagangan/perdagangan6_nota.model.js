const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan6_nota = sequelizeConf.define(
  "perdagangan6_nota",
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
    no: {
      type: DataTypes.STRING,
    },
    tgl: {
      type: DataTypes.STRING,
    },
    tgl2: {
      type: DataTypes.STRING,
    },
    subtotal: {
      type: DataTypes.BIGINT,
    },
    ppn: {
      type: DataTypes.BIGINT,
    },
    total: {
      type: DataTypes.BIGINT,
    },
    penerima: {
      type: DataTypes.STRING,
    },
    keperluan: {
      type: DataTypes.STRING,
    },
    nilaih: {
      type: DataTypes.STRING,
    },
    nilaia: {
      type: DataTypes.BIGINT,
    },
    alamat: {
      type: DataTypes.STRING,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan6_nota;
