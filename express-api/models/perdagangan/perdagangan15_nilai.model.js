const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan15_nilai = sequelizeConf.define(
  "perdagangan15_nilai",
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

module.exports = perdagangan15_nilai;
