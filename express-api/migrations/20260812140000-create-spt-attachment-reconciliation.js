'use strict';

/**
 * spt_attachment_reconciliation
 * Persistent orphan-detection / cleanup state for Section I attachments
 * (G2.6-H v2). spt_header 1:N spt_attachment_reconciliation.
 *
 * TiDB / spt_attachment stays the source of truth for attachment metadata;
 * this table only tracks Google Drive files that do NOT have a matching
 * spt_attachment.drive_file_id, across reconciliation runs and restarts.
 *
 * Status values (STRING, same convention as spt_header.status — not an ENUM):
 *   ORPHAN_CANDIDATE | CLEANUP_PENDING | CLEANUP_SUCCESS | CLEANUP_FAILED
 *
 * No deleted_at: a tracked candidate that later gains a matching
 * spt_attachment row is hard-deleted from this table (same hard-delete
 * approach already used for spt_attachment / L2 rows), so no extra
 * "resolved" status is needed.
 *
 * drive_file_id is UNIQUE: one Drive file has at most one tracking row,
 * which also makes detection an idempotent find-or-create.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_attachment_reconciliation', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      header_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'spt_header',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      drive_file_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      drive_folder_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'ORPHAN_CANDIDATE',
      },
      first_detected_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      last_detected_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      cleanup_attempted_at: {
        type: 'TIMESTAMP NULL',
        allowNull: true,
        defaultValue: null,
      },
      cleaned_at: {
        type: 'TIMESTAMP NULL',
        allowNull: true,
        defaultValue: null,
      },
      last_error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      engine: 'InnoDB',
      uniqueKeys: {
        uq_spt_attachment_reconciliation_drive_file_id: {
          fields: ['drive_file_id'],
        },
      },
    });

    // header_id alone is already indexed automatically via its FK constraint.
    // Serves the cleanup eligibility query:
    //   status = 'CLEANUP_PENDING' AND cleanup_attempted_at IS NULL
    await queryInterface.addIndex(
      'spt_attachment_reconciliation',
      ['status', 'cleanup_attempted_at'],
      { name: 'idx_spt_attachment_reconciliation_status_cleanup' }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_attachment_reconciliation');
  },
};
