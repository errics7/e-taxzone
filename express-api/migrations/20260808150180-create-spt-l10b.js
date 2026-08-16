'use strict';

/**
 * spt_l10b
 * 15-question boolean questionnaire (group1-4). spt_header 1:1 spt_l10b.
 * ''->NULL, Yes->TRUE, No->FALSE. No DEFAULT FALSE for unanswered.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l10b', {
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
      group1_q1: { type: Sequelize.BOOLEAN, allowNull: true },
      group1_q2: { type: Sequelize.BOOLEAN, allowNull: true },
      group1_q3: { type: Sequelize.BOOLEAN, allowNull: true },
      group1_q4: { type: Sequelize.BOOLEAN, allowNull: true },
      group2_q1: { type: Sequelize.BOOLEAN, allowNull: true },
      group2_q2: { type: Sequelize.BOOLEAN, allowNull: true },
      group2_q3: { type: Sequelize.BOOLEAN, allowNull: true },
      group3_q1: { type: Sequelize.BOOLEAN, allowNull: true },
      group3_q2: { type: Sequelize.BOOLEAN, allowNull: true },
      group3_q3: { type: Sequelize.BOOLEAN, allowNull: true },
      group3_q4: { type: Sequelize.BOOLEAN, allowNull: true },
      group3_q5: { type: Sequelize.BOOLEAN, allowNull: true },
      group4_q1: { type: Sequelize.BOOLEAN, allowNull: true },
      group4_q2: { type: Sequelize.BOOLEAN, allowNull: true },
      group4_q3: { type: Sequelize.BOOLEAN, allowNull: true },
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
    await queryInterface.dropTable('spt_l10b');
  },
};
