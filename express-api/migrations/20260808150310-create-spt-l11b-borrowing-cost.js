'use strict';

/**
 * spt_l11b_borrowing_cost
 * Borrowing cost rows per creditor. spt_l11b 1:N spt_l11b_borrowing_cost.
 * HARD DELETE per row. avg_debt_balance is MANUAL RAW input - no FK to debt balance.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l11b_borrowing_cost', {
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
      creditor: { type: Sequelize.STRING(255), allowNull: true },
      avg_debt_balance: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      borrowing_cost: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      deductible_cost: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      non_deductible_cost: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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
    await queryInterface.dropTable('spt_l11b_borrowing_cost');
  },
};
