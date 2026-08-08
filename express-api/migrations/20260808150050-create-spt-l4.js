'use strict';

/**
 * spt_l4
 * Part A/B withholding tax in one table. spt_header 1:N spt_l4.
 * PART_A/PART_B completeness is business/service validation only, no DB CHECK.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l4', {
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
      withholding_tin: { type: Sequelize.STRING(50), allowNull: true },
      withholding_name: { type: Sequelize.STRING(255), allowNull: true },
      tax_object: { type: Sequelize.STRING(50), allowNull: true },
      tax_base_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tax_rate: { type: Sequelize.DECIMAL(7, 4), allowNull: true },
      income_type: { type: Sequelize.STRING(50), allowNull: true },
      income_source: { type: Sequelize.STRING(255), allowNull: true },
      gross_income_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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
    await queryInterface.addIndex('spt_l4', ['section_type'], {
      name: 'idx_spt_l4_section_type',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l4');
  },
};
