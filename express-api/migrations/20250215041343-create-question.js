'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("question", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      worksheet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "worksheet",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      question_type: {
        type: Sequelize.ENUM("fill_blank", "radio", "drag_drop"),
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      code_template: {
        type: Sequelize.TEXT,
      },
      correct_answer: {
        type: Sequelize.TEXT,
      },
      points: {
        type: Sequelize.INTEGER,
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
      status_delete: {
        type: Sequelize.INTEGER,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("question");
  }
};
