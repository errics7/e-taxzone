const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11a_bad_debt data
const spt_l11a_bad_debt = sequelizeConf.define(
  "spt_l11a_bad_debt",
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
    credit_ceiling: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    uncollectible_debt: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    deduction_method: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    document_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11a_bad_debt',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11a_bad_debt;
