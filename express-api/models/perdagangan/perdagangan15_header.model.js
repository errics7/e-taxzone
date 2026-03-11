const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan15_header = sequelizeConf.define(
  "perdagangan15_header",
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

module.exports = perdagangan15_header;
