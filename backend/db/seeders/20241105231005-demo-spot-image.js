'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(
      options, [
      {
        spotId: 1, // Make sure this spotId exists in the Spots table
        url: 'https://example.com/images/spot1_image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1, // Same spot, different image
        url: 'https://example.com/images/spot1_image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2, // Different spot
        url: 'https://example.com/images/spot2_image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2, // Same spot, another image
        url: 'https://example.com/images/spot2_image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more sample spot images as needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', null, {});
  },
};
