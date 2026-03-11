const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs9_bank = sequelizeConf.define(
  "gs9_bank",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    nominal: {
      type: DataTypes.INTEGER,
    },
    debit: {
      type: DataTypes.INTEGER,
    },
    saldodebit: {
      type: DataTypes.INTEGER,
    },
    jenis: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    // createdAt: "created_date",
    // updatedAt: "updated_date",
  }
);

module.exports = gs9_bank;
