const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l4 data
const spt_l4 = sequelizeConf.define(
  "spt_l4",
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
    withholding_tin: { type: DataTypes.STRING(50), allowNull: true },
    withholding_name: { type: DataTypes.STRING(255), allowNull: true },
    tax_object: { type: DataTypes.STRING(50), allowNull: true },
    tax_base_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    tax_rate: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    income_type: { type: DataTypes.STRING(50), allowNull: true },
    income_source: { type: DataTypes.STRING(255), allowNull: true },
    gross_income_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l4',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['section_type'],
        name: 'idx_spt_l4_section_type',
      },
    ],
  }
);

// Export model
module.exports = spt_l4;
