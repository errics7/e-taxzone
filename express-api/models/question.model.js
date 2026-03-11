const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");
const { DataTypes } = Sequelize;

const question = sequelizeConf.define("question", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  worksheet_id: {
    type: DataTypes.INTEGER,
  },
  question_type: {
    type: DataTypes.ENUM('fill_blank', 'radio', 'drag_drop'),
  },
  title: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  code_template: {
    type: DataTypes.TEXT,
  },
  correct_answer: {
    type: DataTypes.TEXT,
  },
  points: {
    type: DataTypes.INTEGER,
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
  status_delete: {
    type: DataTypes.INTEGER,
  },
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: "created_date",
  updatedAt: "updated_date",
});

module.exports = question;
