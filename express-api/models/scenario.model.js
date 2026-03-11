const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const scenario = sequelizeConf.define(
  "scenario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    subscriber_count: {
      type: DataTypes.INTEGER,
    },
    lulus_count: {
      type: DataTypes.INTEGER,
    },
    worksheet_count: {
      type: DataTypes.INTEGER,
    },
    virtualtour_count: {
      type: DataTypes.INTEGER,
    },
    worksheet_id: {
      type: DataTypes.INTEGER,
    },
    virtualtour_id: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
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
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "updated_date",
  }
);

// Export model Product
module.exports = scenario;
