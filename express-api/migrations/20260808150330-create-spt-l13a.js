'use strict';

/**
 * spt_l13a
 * Fasilitas penanaman modal (tax holiday) rows. spt_header 1:N spt_l13a.
 * HARD DELETE per row. approvedInvestmentTotal is DERIVED (not persisted).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l13a', {
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
      decision_number: { type: Sequelize.STRING(255), allowNull: true },
      decision_date: { type: Sequelize.DATEONLY, allowNull: true },
      utilization_decision_number: { type: Sequelize.STRING(255), allowNull: true },
      utilization_decision_date: { type: Sequelize.DATEONLY, allowNull: true },
      approved_investment_foreign_currency: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      approved_investment_equivalent: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      approved_investment_rupiah: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      approved_investment_currency_code: { type: Sequelize.CHAR(3), allowNull: true },
      investment_type: { type: Sequelize.STRING(255), allowNull: true },
      business_sector_area: { type: Sequelize.TEXT, allowNull: true },
      facility_type: { type: Sequelize.STRING(255), allowNull: true },
      facility_percentage: { type: Sequelize.DECIMAL(10, 4), allowNull: true },
      loss_compensation_year: { type: Sequelize.STRING(20), allowNull: true },
      investment_realization_cumulative: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      investment_realization_at_commercial: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      commercial_production_date: { type: Sequelize.DATEONLY, allowNull: true },
      net_income_deduction_year: { type: Sequelize.STRING(20), allowNull: true },
      net_income_deduction_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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
    await queryInterface.dropTable('spt_l13a');
  },
};
