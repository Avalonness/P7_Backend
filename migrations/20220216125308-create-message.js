'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      youtube: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contentImg: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contentText: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      likes: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      comments: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};