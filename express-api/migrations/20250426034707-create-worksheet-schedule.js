'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('worksheet_schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      worksheet_id: {
        type: Sequelize.INTEGER
      },
      class_id: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      question_count: {
        type: Sequelize.INTEGER
      },
      randomize_questions: {
        type: Sequelize.BOOLEAN
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      updated_by: {
        type: Sequelize.INTEGER,
      },
      created_date: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.NOW,
      },
      updated_date: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('worksheet_schedules');
  }
};