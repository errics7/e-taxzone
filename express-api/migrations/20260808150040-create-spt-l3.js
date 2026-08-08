'use strict';

/**
 * spt_l3
 * Part A, Part B, and PRIOR_YEAR_ADJUSTMENT in one table. spt_header 1:N spt_l3.
 * No UNIQUE(header_id). Section relevance + single PRIOR_YEAR_ADJUSTMENT
 * enforcement is business/service validation only, no DB CHECK.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l3', {
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
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      name: { type: Sequelize.STRING(255), allowNull: true },
      country_code: { type: Sequelize.STRING(10), allowNull: true },
      transaction_date: { type: Sequelize.DATEONLY, allowNull: true },
      income_code: { type: Sequelize.STRING(20), allowNull: true },
      net_income_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tax_payable_overseas_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      currency_code: { type: Sequelize.STRING(10), allowNull: true },
      foreign_currency_amount: { type: Sequelize.DECIMAL(20, 4), allowNull: true },
      tax_credit_calculated_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tin: { type: Sequelize.STRING(50), allowNull: true },
      tax_type: { type: Sequelize.STRING(30), allowNull: true },
      tax_base_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tax_withheld_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      withholding_slip_number: { type: Sequelize.STRING(100), allowNull: true },
      withholding_slip_date: { type: Sequelize.DATEONLY, allowNull: true },
      prior_year_credit_adjustment_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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

    // section_type marked IDX = YES in Data Dictionary.
    // header_id alone already indexed automatically via FK constraint.
    await queryInterface.addIndex('spt_l3', ['section_type'], {
      name: 'idx_spt_l3_section_type',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l3');
  },
};
