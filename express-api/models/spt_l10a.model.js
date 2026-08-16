const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l10a data
const spt_l10a = sequelizeConf.define(
  "spt_l10a",
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
    tin: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    type_of_relationship: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    business_activity: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type_of_transaction: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    transaction_value: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    pricing_method_applied: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reason_of_pricing_method: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l10a',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l10a;
