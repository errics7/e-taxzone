'use strict';

/**
 * spt_l9_asset
 * Baris aset per kategori (tangible/building/intangible). spt_l9 1:N spt_l9_asset.
 * Asset row Delete = HARD DELETE.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l9_asset', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      l9_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'spt_l9',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      subgroup: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      asset_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      month_year: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },
      cost_of_acquisition: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      fiscal_book_begin_year: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      method_commercial: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      method_fiscal: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      fiscal_depr_this_year: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      notes: {
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
    // l9_id alone already indexed automatically via FK constraint.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l9_asset');
  },
};
