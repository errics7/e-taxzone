const { Sequelize } = require("sequelize");
const sequelizeConf = require("../../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const perdagangan2_bank = sequelizeConf.define(
  "perdagangan2_bank",
  {
    kode: {
      type: DataTypes.STRING,
    },
    namabarang: {
      type: DataTypes.STRING,
    },
    hargajual: {
      type: DataTypes.INTEGER,
    },
    hargabeli: {
      type: DataTypes.INTEGER,
    },
    stok: {
      type: DataTypes.INTEGER,
    },
    tgl: {
      type: DataTypes.STRING,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model Product
module.exports = perdagangan2_bank;
