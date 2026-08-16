const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11a_entertainment data
const spt_l11a_entertainment = sequelizeConf.define(
  "spt_l11a_entertainment",
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    place: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    partner_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    partner_position: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    partner_company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    partner_business_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11a_entertainment',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11a_entertainment;
