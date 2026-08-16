const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l13b_agreement data
const spt_l13b_agreement = sequelizeConf.define(
  "spt_l13b_agreement",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    l13b_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spt_l13b',
        key: 'id',
      },
    },
    agreement_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    agreement_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    partner: {
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
    tableName: 'spt_l13b_agreement',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l13b_agreement;
