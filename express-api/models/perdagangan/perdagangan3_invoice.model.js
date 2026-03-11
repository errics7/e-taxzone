const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan3_invoice = sequelizeConf.define(
  "perdagangan3_invoice",
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
    vendorname: {
      type: DataTypes.STRING,
    },
    vendoralamat: {
      type: DataTypes.STRING,
    },
    buyername: {
      type: DataTypes.STRING,
    },
    buyeralamat: {
      type: DataTypes.STRING,
    },
    tanggal: {
      type: DataTypes.STRING,
    },
    noinvoice: {
      type: DataTypes.STRING,
    },
    noorder: {
      type: DataTypes.STRING,
    },
    subtotal: {
      type: DataTypes.BIGINT,
    },
    ppn: {
      type: DataTypes.BIGINT,
    },
    jumlah: {
      type: DataTypes.BIGINT,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan3_invoice;
