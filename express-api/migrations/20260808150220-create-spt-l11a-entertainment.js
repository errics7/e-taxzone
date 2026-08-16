'use strict';

/**
 * spt_l11a_entertainment
 * L11A Part A - entertainment expense rows. spt_header 1:N spt_l11a_entertainment.
 * HARD DELETE per row.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l11a_entertainment', {
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
      date: { type: Sequelize.DATEONLY, allowNull: true },
      place: { type: Sequelize.STRING(255), allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      type: { type: Sequelize.STRING(255), allowNull: true },
      amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      partner_name: { type: Sequelize.STRING(255), allowNull: true },
      partner_position: { type: Sequelize.STRING(255), allowNull: true },
      partner_company_name: { type: Sequelize.STRING(255), allowNull: true },
      partner_business_type: { type: Sequelize.STRING(255), allowNull: true },
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
    // header_id alone already indexed automatically via FK constraint.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l11a_entertainment');
  },
};
