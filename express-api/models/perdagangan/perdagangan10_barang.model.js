const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan10_barang = sequelizeConf.define(
  "perdagangan10_barang",
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
    type: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan10_barang;
