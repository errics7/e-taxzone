const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_attachment_delete_quota_slot data.
// A fixed set of rows (slot_no 1..N) that together enforce the rolling-window
// limit on automatic Drive delete requests. See
// SptAttachmentReconciliationRepository.reserveQuotaSlot().
const spt_attachment_delete_quota_slot = sequelizeConf.define(
  "spt_attachment_delete_quota_slot",
  {
    slot_no: {
      type: DataTypes.SMALLINT.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    // Database-clock time of the live reservation held by this slot, or NULL if
    // the slot has never been used.
    reserved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Drive file the reservation was taken for (idempotence and diagnosis).
    drive_file_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_attachment_delete_quota_slot',
    // Control table: reserved_at is its only time column, and it is written
    // with the database clock by conditional UPDATEs.
    timestamps: false,
  }
);

// Export model
module.exports = spt_attachment_delete_quota_slot;
