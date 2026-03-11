const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const users_detail = sequelizeConf.define(
  "users_detail",
  {
    id_user_detail: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
    },
    ttl: {
      type: DataTypes.STRING,
    },
    alamat: {
      type: DataTypes.STRING,
    },
    no_tlfn: {
      type: DataTypes.STRING,
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
    timestamps: false,
    createdAt: "created_date",
    updatedAt: "updated_date",
  }
);

// Export model Product
module.exports = users_detail;
