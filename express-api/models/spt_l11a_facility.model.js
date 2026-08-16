const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11a_facility data
const spt_l11a_facility = sequelizeConf.define(
  "spt_l11a_facility",
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
    asset_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    acquisition_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    acquisition_value: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    depreciation_prior_year: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    depreciation_current_year: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11a_facility',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11a_facility;
