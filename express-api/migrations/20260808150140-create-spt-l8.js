'use strict';

/**
 * spt_l8
 * Peredaran bruto (gross turnover). One-to-one with spt_header.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l8', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      header_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'spt_header',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      gross_turnover_amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l8');
  },
};
