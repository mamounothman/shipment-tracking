'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      id: 'd26a5ada-b118-4d16-9373-6e0e267c8651',
      name: 'admin',
      email: 'admin@mail.com',
      password: '$2b$10$1GcQvisxuYsYcbAo9wpHN.kAuJNE9NuvcJRLPbdXyqAZZLNq7pKVO',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
