const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");
const { DataTypes } = Sequelize;

const student_results = sequelizeConf.define("student_results", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.INTEGER,  // Reference to the users table
  },
  worksheet_id: {
    type: DataTypes.INTEGER,  // Reference to the worksheet
  },
  worksheet_schedule_id: {
    type: DataTypes.INTEGER,  // Reference to the schedule
  },
  // teacher_id: {
  //   type: DataTypes.INTEGER,  // Reference to the teacher
  // },
  score: {
    type: DataTypes.FLOAT,  // Student's score
  },
  correct_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  wrong_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  submitted_at: {
    type: DataTypes.DATE,
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

module.exports = student_results;