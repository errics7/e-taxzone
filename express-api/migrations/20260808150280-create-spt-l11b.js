'use strict';

/**
 * spt_l11b
 * Debt-to-Equity Ratio / thin capitalization container. spt_header 1:1 spt_l11b.
 * has_foreign_debt is STRING ('', 'Ya', 'Tidak') per LOCKED correction - NOT boolean.
 * EBITDA / EBITDA 25% / DER / monthly averages are DERIVED (not persisted).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l11b', {
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
      has_foreign_debt: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      income_tax_expense: {
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
    await queryInterface.dropTable('spt_l11b');
  },
};
