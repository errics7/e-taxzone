'use strict';

/**
 * spt_attachment_delete_quota_slot
 * Persistent, instance-independent quota for automatic Google Drive delete
 * requests (G2.6-H): at most SLOT_COUNT reservations in any rolling 24-hour
 * window.
 *
 * Why slot rows instead of counting: a COUNT followed by an INSERT/UPDATE is a
 * check-then-act race between instances. Here the limit is the NUMBER OF ROWS.
 * A reservation is a single conditional UPDATE on one row
 *   (reserved_at IS NULL OR reserved_at < CURRENT_TIMESTAMP - INTERVAL 24 HOUR),
 * a row can hold only one live reservation and is reusable only more than 24h
 * after it was taken, so any 24h window contains at most one reservation per
 * row. Two instances racing for the same row cannot both win (single-row
 * write-write conflict). No lock table, no transaction, no in-memory state.
 *
 *   slot_no        SMALLINT UNSIGNED PK  (1..SLOT_COUNT, not auto-increment)
 *   reserved_at    TIMESTAMP NULL        database-clock time of the live reservation
 *   drive_file_id  VARCHAR(255) NULL     file the reservation was taken for
 *
 * Reservations are never released by code. A reservation that never reached a
 * Drive request, or whose worker crashed or timed out, simply keeps its slot
 * until the slot becomes reusable (24h after reserved_at). That is deliberately
 * conservative: it can only under-use the quota, never exceed it.
 *
 * SLOT_COUNT must equal POLICY.MAX_DELETIONS_PER_24H in
 * SptAttachmentReconciliationService. The service verifies at preflight that
 * slots 1..limit exist and keeps cleanup disabled otherwise. To raise the
 * limit later, add a NEW migration that inserts the extra slot rows; do not
 * edit this one. Slots above the configured limit are never used.
 *
 * Additive only: no existing table, column, index or migration is touched.
 * The `down` migration discards the reservation records of the window.
 */
const SLOT_COUNT = 50;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_attachment_delete_quota_slot', {
      slot_no: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      reserved_at: {
        type: 'TIMESTAMP NULL',
        allowNull: true,
        defaultValue: null,
      },
      drive_file_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    }, {
      engine: 'InnoDB',
    });

    const rows = [];
    for (let slotNo = 1; slotNo <= SLOT_COUNT; slotNo += 1) {
      rows.push({ slot_no: slotNo, reserved_at: null, drive_file_id: null });
    }
    await queryInterface.bulkInsert('spt_attachment_delete_quota_slot', rows);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_attachment_delete_quota_slot');
  },
};
