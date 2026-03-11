const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");
const { DataTypes } = Sequelize;

const worksheet = sequelizeConf.define("worksheet", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  scenario_id: {
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  file_url: {
    type: DataTypes.STRING
  },
  order: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
  },
  updated_by: {
    type: DataTypes.INTEGER,
  },
  created_date: {
    type: DataTypes.DATE(6),
  },
  updated_date: {
    type: DataTypes.DATE(6),
  },
  status_delete: {
    type: DataTypes.INTEGER,
  },
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: "created_date",
  updatedAt: "updated_date",
});

module.exports = worksheet;
