const { Sequelize } = require("sequelize");
const sequelizeConf = require("../../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const perdagangan1_bank = sequelizeConf.define(
  "perdagangan1_bank",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    tgl: {
      type: DataTypes.STRING,
    },
    tgl_worksheet: {
      type: DataTypes.STRING,
    },
    jumlah: {
      type: DataTypes.DOUBLE,
    },
    jenis: {
      type: DataTypes.STRING,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    id_config: {
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

// Export model Product
module.exports = perdagangan1_bank;
