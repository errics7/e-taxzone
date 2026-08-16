'use strict';

/**
 * spt_l10c
 * Repeating raw transaction rows (partner, code, country, value). spt_header 1:N spt_l10c.
 * HARD DELETE per row.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l10c', {
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
      name_of_transaction_partner: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      type_of_transaction_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      country_code: {
        type: Sequelize.CHAR(2),
        allowNull: true,
      },
      transaction_value: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
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
    }, {
      engine: 'InnoDB',
    });
    // header_id alone already indexed automatically via FK constraint.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l10c');
  },
};
