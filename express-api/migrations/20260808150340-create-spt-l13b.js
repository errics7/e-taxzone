'use strict';

/**
 * spt_l13b
 * Super deduction (vokasi/litbang) container. spt_header 1:1 spt_l13b.
 * Parent of spt_l13b_agreement, spt_l13b_section_b, spt_l13b_rd.
 * Section B is NOT stored here - see LOCKED redesign in spt_l13b_section_b.
 * row2/row4/row5 = Section D raw inputs. No.1/3/6, additionalGrossIncomeDeduction are DERIVED.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l13b', {
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
      row2: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      row4: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      row5: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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
    await queryInterface.dropTable('spt_l13b');
  },
};
