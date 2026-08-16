'use strict';

/**
 * spt_l11a_bad_debt
 * L11A Part A - bad debt write-off rows. spt_header 1:N spt_l11a_bad_debt.
 * HARD DELETE per row.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l11a_bad_debt', {
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
      identity_number: { type: Sequelize.STRING(50), allowNull: true },
      debtor_name: { type: Sequelize.STRING(255), allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      credit_ceiling: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      uncollectible_debt: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      deduction_method: { type: Sequelize.STRING(255), allowNull: true },
      document_type: { type: Sequelize.STRING(255), allowNull: true },
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
    // header_id alone already indexed automatically via FK constraint.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l11a_bad_debt');
  },
};
