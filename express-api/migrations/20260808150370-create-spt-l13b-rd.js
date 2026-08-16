'use strict';

/**
 * spt_l13b_rd
 * L13B Section C - R&D proposal rows. spt_l13b 1:N spt_l13b_rd.
 * HARD DELETE per row. additionalGrossIncomeDeduction (costAmount x facilityPercentage/100) is DERIVED.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l13b_rd', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      l13b_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'spt_l13b',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      proposal_number: { type: Sequelize.STRING(255), allowNull: true },
      period_from: { type: Sequelize.INTEGER, allowNull: true },
      period_to: { type: Sequelize.INTEGER, allowNull: true },
      cost_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      facility_percentage: { type: Sequelize.DECIMAL(10, 4), allowNull: true },
      ip_year: { type: Sequelize.INTEGER, allowNull: true },
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
    // l13b_id alone already indexed automatically via FK constraint.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l13b_rd');
  },
};
