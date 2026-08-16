'use strict';

/**
 * spt_l13b_section_b
 * L13B Section B - fixed roster of 5 categories (sb-1..sb-5), authoritative persisted dataset.
 * spt_l13b 1:N spt_l13b_section_b. HARD DELETE per row.
 * LOCKED REDESIGN: replaces the previous 5-column-on-parent approach. No category master table.
 * Exactly one row per fixed category per L13B via UNIQUE(l13b_id, category_code).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l13b_section_b', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      l13b_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'spt_l13b',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      category_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      amount: {
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
      uniqueKeys: {
        uq_spt_l13b_section_b_l13b_category: {
          fields: ['l13b_id', 'category_code'],
        },
      },
    });
    // l13b_id alone already indexed automatically via FK constraint.
    // (l13b_id, category_code) already covered by the unique key above.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l13b_section_b');
  },
};
