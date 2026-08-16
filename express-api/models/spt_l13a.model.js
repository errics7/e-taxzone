const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l13a data
const spt_l13a = sequelizeConf.define(
  "spt_l13a",
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
    decision_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    decision_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    utilization_decision_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    utilization_decision_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    approved_investment_foreign_currency: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    approved_investment_equivalent: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    approved_investment_rupiah: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    approved_investment_currency_code: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    investment_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    business_sector_area: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    facility_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    facility_percentage: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
    },
    loss_compensation_year: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    investment_realization_cumulative: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    investment_realization_at_commercial: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    commercial_production_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    net_income_deduction_year: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    net_income_deduction_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l13a',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l13a;
