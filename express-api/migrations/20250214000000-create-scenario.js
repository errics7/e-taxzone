'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scenario', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      created_date: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
      },
      updated_date: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
      }
    }, {
      engine: 'InnoDB'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('scenario');
  }
};
