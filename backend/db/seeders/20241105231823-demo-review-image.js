"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://example.com/images/review1_image1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 1,
        url: "https://example.com/images/review1_image2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 2,
        url: "https://example.com/images/review2_image1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: 2,
        url: "https://example.com/images/review2_image2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkDelete(options, null, {});

    if (options.schema) {
      await queryInterface.sequelize.query(
        `ALTER SEQUENCE "${options.schema}"."ReviewImages_id_seq" RESTART WITH 1;`
      );
    } else {
      const dbType = queryInterface.sequelize.getDialect();

      if (dbType === "sqlite") {
        await queryInterface.sequelize.query(
          `UPDATE sqlite_sequence SET seq = 0 WHERE name = 'ReviewImages';`
        );
      } else if (dbType === "mysql") {
        await queryInterface.sequelize.query(
          `ALTER TABLE ReviewImages AUTO_INCREMENT = 1;`
        );
      } else if (dbType === "postgres") {
        await queryInterface.sequelize.query(
          `ALTER SEQUENCE "ReviewImages_id_seq" RESTART WITH 1;`
        );
      }
    }
  },
};
