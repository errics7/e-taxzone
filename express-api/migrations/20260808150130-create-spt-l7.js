'use strict';

/**
 * spt_l7
 * Kompensasi kerugian fiskal, satu baris per tax_year. spt_header 1:N spt_l7.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l7', {
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
      tax_year: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      fiscal_net_profit_income: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      fiscal_loss_compensation_y_minus_4: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      fiscal_loss_compensation_y_minus_3: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      fiscal_loss_compensation_y_minus_2: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      fiscal_loss_compensation_y_minus_1: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      fiscal_loss_compensation_current_year: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      fiscal_loss_compensation_next_year: {
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
        uq_spt_l7_header_tax_year: {
          fields: ['header_id', 'tax_year'],
        },
      },
    });

    // Composite index per Data Dictionary: header_id; (header_id, tax_year)
    // header_id alone already indexed automatically via FK constraint.
    // (header_id, tax_year) already covered by the unique key above.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l7');
  },
};
