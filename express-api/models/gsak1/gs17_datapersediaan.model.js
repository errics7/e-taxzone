const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const gs17_datapersediaan = sequelizeConf.define(
  "gs17_datapersediaan",
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
    eluid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    valtotbiaya: {
      type: DataTypes.DOUBLE,
    },
    valekuiv: {
      type: DataTypes.DOUBLE,
    },
    valbiayaunit: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    // createdAt: "created_date",
    // updatedAt: "updated_date",
  }
);

module.exports = gs17_datapersediaan;
