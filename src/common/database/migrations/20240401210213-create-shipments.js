'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Shipments', {
      id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      delivery_preferences: {
        type: Sequelize.ENUM('STANDARD','ECO_FRIENDLY'),
        allowNull: false,
        defaultValue: 'STANDARD',
      },
      is_active: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.ENUM('SCHEDULED', 'IN_PROGRESS', 'DELIVERED', 'CANCELED'),
        allowNull: false,
        defaultValue: 'SCHEDULED',
      },
      userId: {
          type: Sequelize.UUID,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Shipments');
  }
};
