const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_header data
const spt_header = sequelizeConf.define(
  "spt_header",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    company_id: {
      // BUSINESS RELATIONSHIP ONLY -> companies.id.
      // No physical FK: companies is MyISAM, spt_header is InnoDB.
      // Do NOT add references/association for this field.
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    tax_year: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    tax_period: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ANNUAL',
    },
    tax_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'CORPORATE_INCOME_TAX',
    },
    tax_return_type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'NORMAL',
    },
    amendment_number: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    form_version: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: '1771',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    submitted_at: {
      type: DataTypes.DATE,
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
    tableName: 'spt_header',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['company_id', 'tax_year', 'tax_return_type', 'amendment_number'],
        name: 'uq_spt_header_company_year_type_amend',
      },
      {
        fields: ['company_id'],
        name: 'idx_spt_header_company_id',
      },
      {
        fields: ['tax_year'],
        name: 'idx_spt_header_tax_year',
      },
      {
        fields: ['tax_type'],
        name: 'idx_spt_header_tax_type',
      },
      {
        fields: ['status'],
        name: 'idx_spt_header_status',
      },
    ],
  }
);

// Export model
module.exports = spt_header;
