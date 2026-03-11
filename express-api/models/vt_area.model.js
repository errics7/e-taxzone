const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const vt_area = sequelizeConf.define(
  "vt_area",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    item_count: {
      type: DataTypes.INTEGER,
    },
    linkarea_count: {
      type: DataTypes.INTEGER,
    },
    linksimulasi_count: {
      type: DataTypes.INTEGER,
    },
    vtimg_url: {
      type: DataTypes.STRING,
    },
    gsvt_id: {
      type: DataTypes.INTEGER,
    },
    status_key: {
      type: DataTypes.INTEGER,
    },
    status_delete: {
      type: DataTypes.INTEGER,
    },
    pitch: {
      type: DataTypes.DOUBLE,
    },
    yaw: {
      type: DataTypes.DOUBLE,
    },
    hfov: {
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
module.exports = vt_area;
