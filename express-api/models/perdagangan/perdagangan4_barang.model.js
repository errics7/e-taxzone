const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan4_barang = sequelizeConf.define(
  "perdagangan4_barang",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_invoice: {
      type: DataTypes.STRING,
    },
    uid: {
      type: DataTypes.STRING,
    },
    namabarang: {
      type: DataTypes.STRING,
    },
    satuan: {
      type: DataTypes.STRING,
    },
    jumlah: {
      type: DataTypes.INTEGER,
    },
    harga: {
      type: DataTypes.BIGINT,
    },
    total: {
      type: DataTypes.BIGINT,
    },
    hpp: {
      type: DataTypes.BIGINT,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan4_barang;
