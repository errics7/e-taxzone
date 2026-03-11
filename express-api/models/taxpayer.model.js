const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for taxpayer data
const taxpayer = sequelizeConf.define(
  "taxpayer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    // Registration Type Info
    taxpayer_type: {
      type: DataTypes.ENUM('individual', 'company'),
    },
    has_nik: {
      type: DataTypes.BOOLEAN,
    },
    registration_type: {
      type: DataTypes.ENUM('nik-activation', 'registration-only'),
    },
    
    // Identity Data
    nik: {
      type: DataTypes.STRING(16),
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(200),
    },
    place_of_birth: {
      type: DataTypes.STRING(100),
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    taxpayer_category: {
      type: DataTypes.STRING(100),
    },
    country_of_origin: {
      type: DataTypes.STRING(50),
    },
    religion: {
      type: DataTypes.STRING(50),
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
    },
    marital_status: {
      type: DataTypes.STRING(50),
    },
    type_of_work: {
      type: DataTypes.STRING(100),
    },
    mother_name: {
      type: DataTypes.STRING(100),
    },
    family_card_number: {
      type: DataTypes.STRING(20),
    },
    family_relationship_status: {
      type: DataTypes.STRING(50),
    },
    
    // Contact Data
    email: {
      type: DataTypes.STRING(200),
    },
    handphone: {
      type: DataTypes.STRING(15),
    },
    telephone: {
      type: DataTypes.STRING(15),
    },
    fax: {
      type: DataTypes.STRING(15),
    },
    
    // Economic Data (JSON for flexibility)
    economic_data: {
      type: DataTypes.JSON,
    },
    
    // Address Data (JSON for multiple addresses)
    addresses: {
      type: DataTypes.JSON,
    },
    
    // Related Persons Data (JSON)
    related_persons: {
      type: DataTypes.JSON,
    },
    
    // Status
    registration_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    approved_by: {
      type: DataTypes.INTEGER,
    },
    approved_date: {
      type: DataTypes.DATE,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
    },
    
    // Metadata
    status_delete: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE(6),
    },
    updated_date: {
      type: DataTypes.DATE(6),
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "updated_date",
  }
);

// Export model
module.exports = taxpayer;