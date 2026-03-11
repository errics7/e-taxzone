const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan8_jurnal = sequelizeConf.define(
  "perdagangan8_jurnal",
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
    namapelanggan: {
      type: DataTypes.STRING,
    },
    nofaktur: {
      type: DataTypes.STRING,
    },
    piutangdagang: {
      type: DataTypes.BIGINT,
    },
    hpp: {
      type: DataTypes.BIGINT,
    },
    penjualan: {
      type: DataTypes.BIGINT,
    },
    ppnkeluaran: {
      type: DataTypes.BIGINT,
    },
    persediaan: {
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

module.exports = perdagangan8_jurnal;
