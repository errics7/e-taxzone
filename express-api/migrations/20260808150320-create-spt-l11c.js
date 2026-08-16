'use strict';

/**
 * spt_l11c
 * Foreign debt rows (kurs, pokok utang, suku bunga). spt_header 1:N spt_l11c.
 * HARD DELETE per row. pokokUtangAkhirTahun (ending principal) is DERIVED (not persisted).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_l11c', {
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
      nama_pemberi_pinjaman: { type: Sequelize.STRING(255), allowNull: true },
      alamat_pemberi_pinjaman: { type: Sequelize.TEXT, allowNull: true },
      negara_yurisdiksi: { type: Sequelize.STRING(100), allowNull: true },
      mata_uang: { type: Sequelize.STRING(10), allowNull: true },
      kurs_akhir_tahun: { type: Sequelize.DECIMAL(20, 6), allowNull: true },
      pokok_utang_awal_tahun: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      penambahan_pokok_utang: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      pengurangan_pokok_utang: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tanggal_mulai_pinjaman: { type: Sequelize.DATEONLY, allowNull: true },
      tanggal_jatuh_tempo_pinjaman: { type: Sequelize.DATEONLY, allowNull: true },
      tingkat_suku_bunga: { type: Sequelize.DECIMAL(10, 4), allowNull: true },
      jumlah_bunga: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      biaya_terkait_perolehan: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      peruntukan_pinjaman: { type: Sequelize.TEXT, allowNull: true },
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
    await queryInterface.dropTable('spt_l11c');
  },
};
