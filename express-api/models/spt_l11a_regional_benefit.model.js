const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l11a_regional_benefit data
const spt_l11a_regional_benefit = sequelizeConf.define(
  "spt_l11a_regional_benefit",
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
    location_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    decree_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    decree_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ext_decree_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ext_decree_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    housing: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    healthcare: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    education: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    worship: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    transport: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    sports: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l11a_regional_benefit',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_l11a_regional_benefit;
