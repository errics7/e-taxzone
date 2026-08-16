const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11c data
const spt_l11c = sequelizeConf.define(
  "spt_l11c",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    header_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spt_header',
        key: 'id',
      },
    },
    nama_pemberi_pinjaman: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    alamat_pemberi_pinjaman: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    negara_yurisdiksi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    mata_uang: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    kurs_akhir_tahun: {
      type: DataTypes.DECIMAL(20, 6),
      allowNull: true,
    },
    pokok_utang_awal_tahun: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    penambahan_pokok_utang: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    pengurangan_pokok_utang: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    tanggal_mulai_pinjaman: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tanggal_jatuh_tempo_pinjaman: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tingkat_suku_bunga: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
    },
    jumlah_bunga: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    biaya_terkait_perolehan: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    peruntukan_pinjaman: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11c',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11c;
