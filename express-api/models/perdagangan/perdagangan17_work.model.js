const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan17_work = sequelizeConf.define(
  "perdagangan17_work",
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
    noakun: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.BIGINT,
    },
    key_noakun: {
      type: DataTypes.BOOLEAN,
    },
    key_alias: {
      type: DataTypes.BOOLEAN,
    },
    key_value: {
      type: DataTypes.BOOLEAN,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan17_work;
