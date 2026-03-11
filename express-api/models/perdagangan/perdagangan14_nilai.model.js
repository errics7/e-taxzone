const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan14_nilai = sequelizeConf.define(
  "perdagangan14_nilai",
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
    idc: {
      type: DataTypes.STRING,
    },
    idr: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.BIGINT,
    },
    type: {
      type: DataTypes.STRING,
    },
    key: {
      type: DataTypes.BOOLEAN,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan14_nilai;
