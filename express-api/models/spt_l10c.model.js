const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l10c data
const spt_l10c = sequelizeConf.define(
  "spt_l10c",
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
    name_of_transaction_partner: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type_of_transaction_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country_code: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    transaction_value: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l10c',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l10c;
