const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l3 data
const spt_l3 = sequelizeConf.define(
  "spt_l3",
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
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    name: { type: DataTypes.STRING(255), allowNull: true },
    country_code: { type: DataTypes.STRING(10), allowNull: true },
    transaction_date: { type: DataTypes.DATEONLY, allowNull: true },
    income_code: { type: DataTypes.STRING(20), allowNull: true },
    net_income_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    tax_payable_overseas_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    currency_code: { type: DataTypes.STRING(10), allowNull: true },
    foreign_currency_amount: { type: DataTypes.DECIMAL(20, 4), allowNull: true },
    tax_credit_calculated_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    tin: { type: DataTypes.STRING(50), allowNull: true },
    tax_type: { type: DataTypes.STRING(30), allowNull: true },
    tax_base_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    tax_withheld_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    withholding_slip_number: { type: DataTypes.STRING(100), allowNull: true },
    withholding_slip_date: { type: DataTypes.DATEONLY, allowNull: true },
    prior_year_credit_adjustment_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l3',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['section_type'],
        name: 'idx_spt_l3_section_type',
      },
    ],
  }
);

// Export model
module.exports = spt_l3;
