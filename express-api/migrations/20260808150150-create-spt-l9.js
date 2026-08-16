'use strict';

/**
 * spt_l9
 * Total komersial depresiasi/amortisasi. spt_header 1:1 spt_l9.
 * Parent of spt_l9_asset. Fiscal totals & differences are DERIVED (not persisted).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l9', {
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
      total_commercial_depreciation: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      total_commercial_amortization: {
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
    // header_id UNIQUE already provides required 1:1 index; no separate addIndex needed.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l9');
  },
};
