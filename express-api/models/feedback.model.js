const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const feedback = sequelizeConf.define(
  "feedback",
  {
    user_id: DataTypes.INTEGER,
    kritik: DataTypes.TEXT,
    saran: DataTypes.TEXT
  },
  {
    // Freeze Table Name
    // freezeTableName: true,
    timestamps: true,
    // createdAt: "created_date",
    // updatedAt: "updated_date",
  }
);

// Export model Product
module.exports = feedback;
