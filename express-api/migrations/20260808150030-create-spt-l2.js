'use strict';

/**
 * spt_l2
 * Part A/B rows (pemegang saham / related party). spt_header 1:N spt_l2.
 * No UNIQUE(header_id).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l2', {
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
      section_type: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      npwp_tin: { type: Sequelize.STRING(50), allowNull: true },
      name: { type: Sequelize.STRING(255), allowNull: true },
      position: { type: Sequelize.STRING(100), allowNull: true },
      country_code: { type: Sequelize.STRING(10), allowNull: true },
      paid_capital_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      paid_capital_percentage: { type: Sequelize.DECIMAL(7, 4), allowNull: true },
      dividend_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      investment_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      investment_percentage: { type: Sequelize.DECIMAL(7, 4), allowNull: true },
      debt_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      debt_year: { type: Sequelize.SMALLINT, allowNull: true },
      debt_interest_percentage: { type: Sequelize.DECIMAL(7, 4), allowNull: true },
      receivable_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      receivable_year: { type: Sequelize.SMALLINT, allowNull: true },
      receivable_interest_percentage: { type: Sequelize.DECIMAL(7, 4), allowNull: true },
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
      deleted_at: {
        type: 'TIMESTAMP NULL',
        allowNull: true,
        defaultValue: null,
      },
    }, {
      engine: 'InnoDB',
    });

    // Indexes per Data Dictionary: header_id; (header_id, section_type)
    // header_id alone already indexed automatically via FK constraint.
    await queryInterface.addIndex('spt_l2', ['header_id', 'section_type'], {
      name: 'idx_spt_l2_header_section_type',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l2');
  },
};
