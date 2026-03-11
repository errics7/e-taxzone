const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");
const { DataTypes } = Sequelize;

const student_questionnaire = sequelizeConf.define("student_questionnaire", {
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
    answer: {
        type: DataTypes.JSON,
        allowNull: true,
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

module.exports = student_questionnaire;