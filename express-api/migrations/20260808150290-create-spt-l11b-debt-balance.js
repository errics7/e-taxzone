'use strict';

/**
 * spt_l11b_debt_balance
 * Monthly debt balance rows per creditor. spt_l11b 1:N spt_l11b_debt_balance.
 * HARD DELETE per row. Monthly averages are DERIVED (not persisted).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l11b_debt_balance', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      l11b_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'spt_l11b',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      creditor_identity: { type: Sequelize.STRING(50), allowNull: true },
      creditor_name: { type: Sequelize.STRING(255), allowNull: true },
      relationship: { type: Sequelize.STRING(255), allowNull: true },
      month_01: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_02: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_03: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_04: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_05: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_06: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_07: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_08: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_09: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_10: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_11: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      month_12: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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
    // l11b_id alone already indexed automatically via FK constraint.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l11b_debt_balance');
  },
};
