'use strict';

/**
 * spt_l5_transaction
 * One row per TKU per month (omzet, PPh final self-paid/withheld).
 * spt_l5_place 1:N spt_l5_transaction (child of spt_l5_place, NOT spt_header directly).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l5_transaction', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      place_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'spt_l5_place',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tax_month: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      gross_turnover_amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      self_paid_tax_amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      withheld_tax_amount: {
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
      uniqueKeys: {
        uq_spt_l5_transaction_place_month: {
          fields: ['place_id', 'tax_month'],
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l5_transaction');
  },
};
