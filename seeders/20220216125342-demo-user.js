'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      username: 'Arthur',
      email: 'avalon@gmail.com',
      password: '$2b$10$MSEATEwSZ3CjF3k/8qfOn.Uq3.obrxifWmgjJT3rvVqbpVTsDXoHa',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
