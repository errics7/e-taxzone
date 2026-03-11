'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('worksheet', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      scenario_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'scenario',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      order: Sequelize.INTEGER,
      created_by: Sequelize.INTEGER,
      updated_by: Sequelize.INTEGER,
      created_date: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
      },
      updated_date: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
      },
      status_delete: Sequelize.INTEGER,
    }, {
      engine: 'InnoDB'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('worksheet');
  }
};
