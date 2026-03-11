const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs9_data = sequelizeConf.define(
  "gs9_data",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    id_bank: {
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

module.exports = gs9_data;
