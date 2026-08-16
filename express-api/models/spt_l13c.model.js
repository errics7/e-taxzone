const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l13c data
const spt_l13c = sequelizeConf.define(
  "spt_l13c",
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
    grant_decision_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    grant_decision_date: {
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
    facility_period: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
    },
    utilization_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reduction_percentage: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
    },
    corporate_income_tax_rate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l13c',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l13c;
