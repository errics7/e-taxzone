const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for companies data
const companies = sequelizeConf.define(
  "companies",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pic_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    
    // Company Identity Data
    company_decision_number: {
      type: DataTypes.STRING(100),
    },
    decision_approval_date: {
      type: DataTypes.DATEONLY,
    },
    establishment_deed_number: {
      type: DataTypes.STRING(100),
    },
    establishment_place: {
      type: DataTypes.STRING(100),
    },
    establishment_date: {
      type: DataTypes.DATEONLY,
    },
    notary_nik: {
      type: DataTypes.STRING(20),
    },
    notary_name: {
      type: DataTypes.STRING(200),
    },
    company_capital_type: {
      type: DataTypes.STRING(100),
    },
    basic_capital: {
      type: DataTypes.TEXT,
    },
    
    // Contact & Address
    email: {
      type: DataTypes.STRING(255),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    fax: {
      type: DataTypes.STRING(20),
    },
    address_data: {
      type: DataTypes.JSON,
    },
    
    // Economic Data (JSON for KLU, metodePembukuan, etc)
    economic_data: {
      type: DataTypes.JSON,
    },
    
    // Related persons and taxpayers (JSON)
    related_persons: {
      type: DataTypes.JSON,
    },
    related_taxpayers: {
      type: DataTypes.JSON,
    },
    
    // Documents
    establishment_document: {
      type: DataTypes.STRING(255),
    },
    authorization_letter: {
      type: DataTypes.STRING(255),
    },
    
    // Status - HANYA registration_status
    registration_status: {
      type: DataTypes.ENUM('pending', 'active', 'rejected'),
      defaultValue: 'pending'
    },
  
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
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
module.exports = companies;