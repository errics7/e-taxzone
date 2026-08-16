const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l10d data
const spt_l10d = sequelizeConf.define(
  "spt_l10d",
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
    master_summary_c1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    master_summary_c2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    master_summary_c3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    master_summary_c4: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    master_summary_c5: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    local_summary_c1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    local_summary_c2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    local_summary_c3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    local_summary_c4: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    local_summary_c5: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    master_doc_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    local_doc_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l10d',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l10d;
