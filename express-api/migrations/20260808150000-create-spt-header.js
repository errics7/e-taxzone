'use strict';

/**
 * spt_header
 * Parent utama SPT Tahunan Badan (Form 1771).
 * Source of Truth: Database Dictionary SPT Tahunan Badan Tahap 1 (FINAL).
 * FK company_id/created_by menggunakan INTEGER agar kompatibel dengan
 * existing companies.id / users.id (Architecture Decision - lihat
 * FINAL PRE-MIGRATION CHECK, Opsi A).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_header', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      company_id: {
        // BUSINESS RELATIONSHIP ONLY -> companies.id.
        // No physical FK: companies is MyISAM, spt_header is InnoDB;
        // MariaDB cannot create a cross-engine FK. See Database Dictionary
        // FINAL v2, Sec. 4 & Sec. 22.
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      tax_year: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      tax_period: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ANNUAL',
      },
      tax_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'CORPORATE_INCOME_TAX',
      },
      tax_return_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'NORMAL',
      },
      amendment_number: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      form_version: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: '1771',
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      submitted_at: {
        type: 'TIMESTAMP NULL',
        allowNull: true,
        defaultValue: null,
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
        uq_spt_header_company_year_type_amend: {
          fields: ['company_id', 'tax_year', 'tax_return_type', 'amendment_number'],
        },
      },
    });

    // Additional single-column indexes per Data Dictionary (IDX = YES)
    // created_by already indexed automatically via its FK constraint.
    // company_id has NO physical FK (business relationship only), so its
    // index must be created explicitly.
    await queryInterface.addIndex('spt_header', ['company_id'], {
      name: 'idx_spt_header_company_id',
    });
    await queryInterface.addIndex('spt_header', ['tax_year'], {
      name: 'idx_spt_header_tax_year',
    });
    await queryInterface.addIndex('spt_header', ['tax_type'], {
      name: 'idx_spt_header_tax_type',
    });
    await queryInterface.addIndex('spt_header', ['status'], {
      name: 'idx_spt_header_status',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_header');
  },
};
