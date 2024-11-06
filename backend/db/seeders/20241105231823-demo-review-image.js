'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(
      options, [
      {
        reviewId: 1,  // Ensure this reviewId exists in the Reviews table
        url: 'https://example.com/images/review1_image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 1,  // Another image for the same review
        url: 'https://example.com/images/review1_image2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 2,  // Another review, so different reviewId
        url: 'https://example.com/images/review2_image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 2,  // Same review, another image
        url: 'https://example.com/images/review2_image2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more review images as needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', null, {});
  },
};
