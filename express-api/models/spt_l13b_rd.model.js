const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l13b_rd data
const spt_l13b_rd = sequelizeConf.define(
  "spt_l13b_rd",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    l13b_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spt_l13b',
        key: 'id',
      },
    },
    proposal_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    period_from: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    period_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cost_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    facility_percentage: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
    },
    ip_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l13b_rd',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l13b_rd;
