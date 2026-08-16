const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11b_debt_balance data
const spt_l11b_debt_balance = sequelizeConf.define(
  "spt_l11b_debt_balance",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    l11b_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spt_l11b',
        key: 'id',
      },
    },
    creditor_identity: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    creditor_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    relationship: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    month_01: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_02: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_03: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_04: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_05: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_06: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_07: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_08: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_09: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_10: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_11: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    month_12: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11b_debt_balance',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11b_debt_balance;
