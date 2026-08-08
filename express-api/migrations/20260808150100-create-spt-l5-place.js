'use strict';

/**
 * spt_l5_place
 * TKU (tempat kegiatan usaha) snapshot. spt_header 1:N spt_l5_place.
 * Parent of spt_l5_transaction.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l5_place', {
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
      tku_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      tku_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      village: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      province: {
        type: Sequelize.STRING(100),
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

    // Indexes per Data Dictionary: header_id; (header_id, tku_number)
    // header_id alone already indexed automatically via FK constraint.
    await queryInterface.addIndex('spt_l5_place', ['header_id', 'tku_number'], {
      name: 'idx_spt_l5_place_header_tku_number',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l5_place');
  },
};
