const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");
const question = require("./question.model");
const { DataTypes } = Sequelize;

const question_drag_items = sequelizeConf.define("question_drag_items", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  question_id: {
    type: DataTypes.INTEGER,
  },
  item_text: {
    type: DataTypes.STRING,
  },
  correct_target: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = question_drag_items;
