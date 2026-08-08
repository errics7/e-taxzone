const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l1 data
const spt_l1 = sequelizeConf.define(
  "spt_l1",
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
    section_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    section_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    account_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    account_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    commercial_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    non_taxable_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    final_tax_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    positive_fiscal_correction: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    negative_fiscal_correction: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    correction_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l1',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['header_id', 'section_code', 'account_code'],
        name: 'uq_spt_l1_header_section_account',
      },
      {
        fields: ['header_id', 'section_type'],
        name: 'idx_spt_l1_header_section_type',
      },
      {
        fields: ['header_id', 'section_code'],
        name: 'idx_spt_l1_header_section_code',
      },
    ],
  }
);

// Export model
module.exports = spt_l1;
