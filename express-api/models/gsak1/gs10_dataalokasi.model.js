const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs10_dataalokasi = sequelizeConf.define(
  "gs10_dataalokasi",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    kodeacuan: {
      type: DataTypes.STRING,
    },
    nama: {
      type: DataTypes.STRING,
    },
    nilai: {
      type: DataTypes.INTEGER,
    },
    sorting: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    // createdAt: "created_date",
    // updatedAt: "updated_date",
  }
);

module.exports = gs10_dataalokasi;
