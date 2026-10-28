const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_attachment_reconciliation data
const spt_attachment_reconciliation = sequelizeConf.define(
  "spt_attachment_reconciliation",
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
    drive_file_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    drive_folder_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'ORPHAN_CANDIDATE',
    },
    first_detected_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_detected_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cleanup_attempted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cleaned_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // --- G2.6-H cleanup lease / retry state (additive migration
    //     20260812150000-add-cleanup-lease-to-spt-attachment-reconciliation) ---
    cleanup_attempt_count: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    cleanup_not_before_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_result: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_attachment_reconciliation',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['drive_file_id'],
        name: 'uq_spt_attachment_reconciliation_drive_file_id',
      },
      {
        fields: ['status', 'cleanup_attempted_at'],
        name: 'idx_spt_attachment_reconciliation_status_cleanup',
      },
      {
        fields: ['status', 'cleanup_not_before_at'],
        name: 'idx_spt_attachment_reconciliation_status_not_before',
      },
    ],
  }
);

// Export model
module.exports = spt_attachment_reconciliation;
