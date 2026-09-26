const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_attachment data
const spt_attachment = sequelizeConf.define(
  "spt_attachment",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    header_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spt_header',
        key: 'id',
      },
    },
    document_code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    original_file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stored_file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    drive_file_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    drive_folder_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_attachment',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['header_id', 'document_code'],
        name: 'idx_spt_attachment_header_document_code',
      },
    ],
  }
);

// Export model
module.exports = spt_attachment;
