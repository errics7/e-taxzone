const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");
const { DataTypes } = Sequelize;

const worksheet_schedule = sequelizeConf.define("worksheet_schedules", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  worksheet_id: {
    type: DataTypes.INTEGER,
  },
  class_id: {
    type: DataTypes.STRING,  // For storing the class assigned to this schedule
  },
  start_time: {
    type: DataTypes.DATE,
  },
  end_time: {
    type: DataTypes.DATE,
  },
  question_count: {
    type: DataTypes.INTEGER,
  },
  randomize_questions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: "created_date",
  updatedAt: "updated_date",
});

module.exports = worksheet_schedule;