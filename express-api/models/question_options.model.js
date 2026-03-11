const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");
const { DataTypes } = Sequelize;

const question_options = sequelizeConf.define("question_options", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  question_id: {
    type: DataTypes.INTEGER,
  },
  option_text: {
    type: DataTypes.STRING,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = question_options;
