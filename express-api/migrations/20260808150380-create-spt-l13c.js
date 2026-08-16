'use strict';

/**
 * spt_l13c
 * Fasilitas pengurangan tarif (rate reduction facility) rows. spt_header 1:N spt_l13c.
 * HARD DELETE per row. taxableIncome/incomeTaxPayable/taxReductionFacility are DERIVED.
 * corporate_income_tax_rate has NO DEFAULT 22 per LOCKED contract.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l13c', {
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
      grant_decision_number: { type: Sequelize.STRING(255), allowNull: true },
      grant_decision_date: { type: Sequelize.DATEONLY, allowNull: true },
      utilization_decision_number: { type: Sequelize.STRING(255), allowNull: true },
      utilization_decision_date: { type: Sequelize.DATEONLY, allowNull: true },
      facility_period: { type: Sequelize.DECIMAL(10, 4), allowNull: true },
      utilization_year: { type: Sequelize.INTEGER, allowNull: true },
      reduction_percentage: { type: Sequelize.DECIMAL(10, 4), allowNull: true },
      corporate_income_tax_rate: { type: Sequelize.DECIMAL(10, 4), allowNull: true },
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
    await queryInterface.dropTable('spt_l13c');
  },
};
