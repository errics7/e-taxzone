'use strict';

/**
 * spt_l13b_agreement
 * L13B Section A - kerjasama/agreement rows. spt_l13b 1:N spt_l13b_agreement.
 * HARD DELETE per row.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l13b_agreement', {
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
      agreement_number: { type: Sequelize.STRING(255), allowNull: true },
      agreement_date: { type: Sequelize.DATEONLY, allowNull: true },
      partner: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
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
    // l13b_id alone already indexed automatically via FK constraint.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l13b_agreement');
  },
};
