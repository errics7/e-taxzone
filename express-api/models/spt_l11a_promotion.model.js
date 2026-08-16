const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11a_promotion data
const spt_l11a_promotion = sequelizeConf.define(
  "spt_l11a_promotion",
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
    identity_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    recipient_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expense_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    withholding_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    withholding_slip_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11a_promotion',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11a_promotion;
