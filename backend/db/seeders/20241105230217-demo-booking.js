'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkInsert(
      options, [
      {
        spotId: 1,  // Ensure this spotId exists in your Spots table
        userId: 1,  // Ensure this userId exists in your Users table
        startDate: '2024-11-10',
        endDate: '2024-11-15',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,  // Ensure this spotId exists
        userId: 2,  // Ensure this userId exists
        startDate: '2024-11-20',
        endDate: '2024-11-25',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,  // Ensure this spotId exists
        userId: 3,  // Ensure this userId exists
        startDate: '2024-12-01',
        endDate: '2024-12-05',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more sample bookings as needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bookings', null, {});
  },
};
