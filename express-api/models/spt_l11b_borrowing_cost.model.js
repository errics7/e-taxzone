const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11b_borrowing_cost data
const spt_l11b_borrowing_cost = sequelizeConf.define(
  "spt_l11b_borrowing_cost",
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
    creditor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    avg_debt_balance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    borrowing_cost: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    deductible_cost: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    non_deductible_cost: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11b_borrowing_cost',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11b_borrowing_cost;
