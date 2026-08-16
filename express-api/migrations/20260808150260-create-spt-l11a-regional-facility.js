'use strict';

/**
 * spt_l11a_regional_facility
 * L11A Part A - regional facility asset rows. spt_l11a_regional_benefit 1:N spt_l11a_regional_facility.
 * HARD DELETE per row. depreciation_prior_year/current_year are manual raw inputs.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l11a_regional_facility', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      regional_benefit_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'spt_l11a_regional_benefit',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      asset_type: { type: Sequelize.STRING(255), allowNull: true },
      acquisition_year: { type: Sequelize.INTEGER, allowNull: true },
      acquisition_value: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      depreciation_prior_year: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      depreciation_current_year: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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
    // regional_benefit_id alone already indexed automatically via FK constraint.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l11a_regional_facility');
  },
};
