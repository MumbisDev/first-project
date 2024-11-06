'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.bulkInsert(
      options, [
      {
        spotId: 1,  // Make sure spotId exists in the Spots table
        userId: 1,  // Make sure userId exists in the Users table
        review: 'Great place! Had a wonderful time during my stay.',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,  // Another review for the same spot
        userId: 2,  // Make sure this userId exists
        review: 'The location was perfect, but the apartment was a bit noisy at night.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,  // Different spotId
        userId: 1,  // Same user as above
        review: 'Amazing views! Totally worth the price.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,  // Another review for the second spot
        userId: 3,  // Make sure userId exists
        review: 'Not bad, but the place was smaller than expected.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // You can add more review entries here
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};
