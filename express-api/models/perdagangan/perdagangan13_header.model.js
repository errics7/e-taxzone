const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan13_header = sequelizeConf.define(
  "perdagangan13_header",
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
    alias: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan13_header;
