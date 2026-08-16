const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l9 data
const spt_l9 = sequelizeConf.define(
  "spt_l9",
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
      unique: true,
      references: {
        model: 'spt_header',
        key: 'id',
      },
    },
    total_commercial_depreciation: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    total_commercial_amortization: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l9',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l9;
