const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const vt_items = sequelizeConf.define(
  "vt_items",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    area_id: {
      type: DataTypes.INTEGER,
    },
    gsvt_id: {
      type: DataTypes.INTEGER,
    },
    uid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
    url_audio: {
      type: DataTypes.STRING,
    },
    to_id: {
      type: DataTypes.INTEGER,
    },
    to_link: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    pitch: {
      type: DataTypes.DOUBLE,
    },
    yaw: {
      type: DataTypes.DOUBLE,
    },
    //
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
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "updated_date",
  }
);

// Export model
module.exports = vt_items;
