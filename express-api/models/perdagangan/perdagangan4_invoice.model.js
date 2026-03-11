const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan4_invoice = sequelizeConf.define(
  "perdagangan4_invoice",
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
    noinvoice: {
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
    hpp: {
      type: DataTypes.BIGINT,
    },
    persediaan: {
      type: DataTypes.BIGINT,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan4_invoice;
