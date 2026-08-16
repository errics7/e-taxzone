const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l9_asset data
const spt_l9_asset = sequelizeConf.define(
  "spt_l9_asset",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    l9_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spt_l9',
        key: 'id',
      },
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    subgroup: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    asset_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    month_year: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    cost_of_acquisition: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    fiscal_book_begin_year: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    method_commercial: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    method_fiscal: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fiscal_depr_this_year: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l9_asset',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l9_asset;
