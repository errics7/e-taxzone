'use strict';

/**
 * spt_attachment
 * Section I file attachment metadata. spt_header 1:N spt_attachment.
 * Deletion is HARD DELETE (no deleted_at / paranoid mode).
 * Business rule (single-row vs multi-row per document_code, e.g.
 * OTHER_DOCUMENTS) is enforced in the service layer, not the schema —
 * no DB-level UNIQUE(header_id, document_code) is created here.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_attachment', {
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
      document_code: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      original_file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      stored_file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      file_size: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      drive_file_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      drive_folder_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    });

    // Indexes per task spec:
    //   - header_id alone: already indexed automatically via the FK
    //     constraint above (same convention as spt_l1 / spt_l2).
    //   - (header_id, document_code): explicit composite index, NOT unique,
    //     so OTHER_DOCUMENTS can have multiple rows per header_id.
    await queryInterface.addIndex('spt_attachment', ['header_id', 'document_code'], {
      name: 'idx_spt_attachment_header_document_code',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_attachment');
  },
};
