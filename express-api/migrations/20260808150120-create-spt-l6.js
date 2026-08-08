'use strict';

/**
 * spt_l6
 * Angsuran PPh Pasal 25 tahun berjalan. One-to-one with spt_header.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l6', {
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
      income_base_amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      previous_year_tax_credit_amount: {
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
    await queryInterface.dropTable('spt_l6');
  },
};
