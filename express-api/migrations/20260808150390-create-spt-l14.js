'use strict';

/**
 * spt_l14
 * Tax-year generated roster (taxYear-4 through taxYear), same generation pattern as spt_l7.
 * spt_header 1:N spt_l14. Generation performed by application/service layer - NOT a DB trigger.
 * Persisted at Submit per LOCKED decision. No delete UI/endpoint in this phase.
 * jumlahPenggunaan / sisaBelum / sisaMelewati are DERIVED (not persisted).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l14', {
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
      tax_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bentuk_penanaman: { type: Sequelize.STRING(255), allowNull: true },
      penyediaan: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tahun1: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tahun2: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tahun3: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tahun4: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
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
        uq_spt_l14_header_tax_year: {
          fields: ['header_id', 'tax_year'],
        },
      },
    });
    // header_id alone already indexed automatically via FK constraint.
    // (header_id, tax_year) already covered by the unique key above.
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_l14');
  },
};
