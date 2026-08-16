const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l14 data
const spt_l14 = sequelizeConf.define(
  "spt_l14",
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
    tax_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bentuk_penanaman: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    penyediaan: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    tahun1: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    tahun2: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    tahun3: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    tahun4: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l14',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['header_id', 'tax_year'],
        name: 'uq_spt_l14_header_tax_year',
      },
    ],
  }
);

// Export model
module.exports = spt_l14;
