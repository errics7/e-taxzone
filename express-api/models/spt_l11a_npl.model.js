const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11a_npl data
const spt_l11a_npl = sequelizeConf.define(
  "spt_l11a_npl",
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
    debtor_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    credit_beginning: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    credit_ending: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    interest_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11a_npl',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11a_npl;
