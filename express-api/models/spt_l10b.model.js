const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l10b data
const spt_l10b = sequelizeConf.define(
  "spt_l10b",
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
      unique: true,
      references: {
        model: 'spt_header',
        key: 'id',
      },
    },
    group1_q1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group1_q2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group1_q3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group1_q4: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group2_q1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group2_q2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group2_q3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group3_q1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group3_q2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group3_q3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group3_q4: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group3_q5: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group4_q1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group4_q2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    group4_q3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l10b',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l10b;
