'use strict';

/**
 * spt_l10d
 * Master/local documentation checklist (5+5 booleans) + 2 dates. spt_header 1:1 spt_l10d.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l10d', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      header_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'spt_header',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      master_summary_c1: { type: Sequelize.BOOLEAN, allowNull: true },
      master_summary_c2: { type: Sequelize.BOOLEAN, allowNull: true },
      master_summary_c3: { type: Sequelize.BOOLEAN, allowNull: true },
      master_summary_c4: { type: Sequelize.BOOLEAN, allowNull: true },
      master_summary_c5: { type: Sequelize.BOOLEAN, allowNull: true },
      local_summary_c1: { type: Sequelize.BOOLEAN, allowNull: true },
      local_summary_c2: { type: Sequelize.BOOLEAN, allowNull: true },
      local_summary_c3: { type: Sequelize.BOOLEAN, allowNull: true },
      local_summary_c4: { type: Sequelize.BOOLEAN, allowNull: true },
      local_summary_c5: { type: Sequelize.BOOLEAN, allowNull: true },
      master_doc_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      local_doc_date: {
        type: Sequelize.DATEONLY,
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
    });
    // header_id UNIQUE already provides required 1:1 index; no separate addIndex needed.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l10d');
  },
};
