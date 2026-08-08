const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l2 data
const spt_l2 = sequelizeConf.define(
  "spt_l2",
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
    npwp_tin: { type: DataTypes.STRING(50), allowNull: true },
    name: { type: DataTypes.STRING(255), allowNull: true },
    position: { type: DataTypes.STRING(100), allowNull: true },
    country_code: { type: DataTypes.STRING(10), allowNull: true },
    paid_capital_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    paid_capital_percentage: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    dividend_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    investment_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    investment_percentage: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    debt_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    debt_year: { type: DataTypes.SMALLINT, allowNull: true },
    debt_interest_percentage: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    receivable_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    receivable_year: { type: DataTypes.SMALLINT, allowNull: true },
    receivable_interest_percentage: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l2',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['header_id', 'section_type'],
        name: 'idx_spt_l2_header_section_type',
      },
    ],
  }
);

// Export model
module.exports = spt_l2;
