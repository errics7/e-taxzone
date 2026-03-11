const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const user_tour = sequelizeConf.define(
  "user_tour",
  {
    user_id: DataTypes.INTEGER,
    tour_key: DataTypes.STRING,
    completed: DataTypes.BOOLEAN
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
module.exports = user_tour;
