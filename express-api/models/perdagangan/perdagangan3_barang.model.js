const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan3_barang = sequelizeConf.define(
  "perdagangan3_barang",
  {
    barang_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    id: {
      type: DataTypes.STRING,
    },
    id_invoice: {
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
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan3_barang;
