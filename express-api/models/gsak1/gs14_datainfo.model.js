const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const gs14_datainfo = sequelizeConf.define(
  "gs14_datainfo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    uuid: {
      type: DataTypes.STRING,
    },
    no_debit: {
      type: DataTypes.STRING,
    },
    val_debit: {
      type: DataTypes.DOUBLE,
    },
    no_kredit: {
      type: DataTypes.STRING,
    },
    val_kredit: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = gs14_datainfo;
