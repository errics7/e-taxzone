'use strict';

/**
 * spt_l1
 * Raw account input (koreksi fiskal per akun). spt_header 1:N spt_l1.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l1', {
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
      section_code: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      account_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      account_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      commercial_amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      non_taxable_amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      final_tax_amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      positive_fiscal_correction: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      negative_fiscal_correction: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      correction_code: {
        type: Sequelize.STRING(20),
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
      deleted_at: {
        type: 'TIMESTAMP NULL',
        allowNull: true,
        defaultValue: null,
      },
    }, {
      engine: 'InnoDB',
      uniqueKeys: {
        uq_spt_l1_header_section_account: {
          fields: ['header_id', 'section_code', 'account_code'],
        },
      },
    });

    // Indexes per Data Dictionary: header_id; (header_id, section_type); (header_id, section_code)
    // header_id alone already indexed automatically via FK constraint.
    await queryInterface.addIndex('spt_l1', ['header_id', 'section_type'], {
      name: 'idx_spt_l1_header_section_type',
    });
    await queryInterface.addIndex('spt_l1', ['header_id', 'section_code'], {
      name: 'idx_spt_l1_header_section_code',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l1');
  },
};
