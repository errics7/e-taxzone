const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l5_transaction data
const spt_l5_transaction = sequelizeConf.define(
  "spt_l5_transaction",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    place_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spt_l5_place',
        key: 'id',
      },
    },
    tax_month: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    gross_turnover_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    self_paid_tax_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    withheld_tax_amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l5_transaction',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['place_id', 'tax_month'],
        name: 'uq_spt_l5_transaction_place_month',
      },
    ],
  }
);

// Export model
module.exports = spt_l5_transaction;
