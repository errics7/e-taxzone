'use strict';

/**
 * spt_l11a_regional_benefit
 * L11A Part A - regional benefit container + cost breakdown. spt_header 1:1 spt_l11a_regional_benefit.
 * Parent of spt_l11a_regional_facility. jumlahBiayaRegional is DERIVED (not persisted).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l11a_regional_benefit', {
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
      location_address: { type: Sequelize.TEXT, allowNull: true },
      decree_number: { type: Sequelize.STRING(255), allowNull: true },
      decree_date: { type: Sequelize.DATEONLY, allowNull: true },
      ext_decree_number: { type: Sequelize.STRING(255), allowNull: true },
      ext_decree_date: { type: Sequelize.DATEONLY, allowNull: true },
      housing: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      healthcare: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      education: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      worship: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      transport: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      sports: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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
    await queryInterface.dropTable('spt_l11a_regional_benefit');
  },
};
