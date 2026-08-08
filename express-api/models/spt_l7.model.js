const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l7 data
const spt_l7 = sequelizeConf.define(
  "spt_l7",
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
    tax_year: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    fiscal_net_profit_income: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    fiscal_loss_compensation_y_minus_4: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    fiscal_loss_compensation_y_minus_3: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    fiscal_loss_compensation_y_minus_2: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    fiscal_loss_compensation_y_minus_1: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    fiscal_loss_compensation_current_year: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    fiscal_loss_compensation_next_year: {
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
    tableName: 'spt_l7',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['header_id', 'tax_year'],
        name: 'uq_spt_l7_header_tax_year',
      },
    ],
  }
);

// Export model
module.exports = spt_l7;
