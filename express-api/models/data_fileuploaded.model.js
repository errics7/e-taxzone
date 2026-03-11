const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const data_fileuploaded = sequelizeConf.define(
  "data_fileuploaded",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    keperluan: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.DOUBLE,
    },
    file_url: {
      type: DataTypes.STRING,
    },
    uploaded_filename: {
      type: DataTypes.STRING,
    },
    original_filename: {
      type: DataTypes.STRING,
    },
    mime_type: {
      type: DataTypes.STRING,
    },
    status_deleted: {
      type: DataTypes.INTEGER,
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
module.exports = data_fileuploaded;
