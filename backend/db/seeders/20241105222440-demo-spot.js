'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots"
    await queryInterface.bulkInsert(
      options, [
      {
        ownerId: 1, // Replace with a valid owner ID from your Users table
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Sunny Apartment',
        description: 'A beautiful sunny apartment in the heart of SF.',
        price: 150.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2, // Replace with a valid owner ID from your Users table
        address: '456 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Cozy Cottage',
        description: 'A cozy cottage with an ocean view.',
        price: 200.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3, // Replace with a valid owner ID from your Users table
        address: '122 Sun St',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Cozy Cottage',
        description: 'A cozy cottage with an ocean view.',
        price: 200.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      // Add more entries as needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
  },
};

