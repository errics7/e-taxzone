'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_questionnaire', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_id: {
        type: Sequelize.INTEGER
      },
      worksheet_id: {
        type: Sequelize.INTEGER
      },
      answer: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_questionnaire');
  }
};