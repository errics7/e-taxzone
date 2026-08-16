'use strict';

/**
 * spt_l10a
 * Repeating raw transfer pricing transaction rows. spt_header 1:N spt_l10a.
 * HARD DELETE per row.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l10a', {
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
      tin: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      type_of_relationship: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      business_activity: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type_of_transaction: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      transaction_value: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      pricing_method_applied: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reason_of_pricing_method: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('spt_l10a');
  },
};
