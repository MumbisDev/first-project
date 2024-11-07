"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: "2024-11-10",
        endDate: "2024-11-15",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2024-11-20",
        endDate: "2024-11-25",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2024-12-01",
        endDate: "2024-12-05",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkDelete(options, null, {});

    if (options.schema) {
      await queryInterface.sequelize.query(
        `ALTER SEQUENCE "${options.schema}"."Bookings_id_seq" RESTART WITH 1;`
      );
    } else {
      const dbType = queryInterface.sequelize.getDialect();

      if (dbType === "sqlite") {
        await queryInterface.sequelize.query(
          `UPDATE sqlite_sequence SET seq = 0 WHERE name = 'Bookings';`
        );
      } else if (dbType === "mysql") {
        await queryInterface.sequelize.query(
          `ALTER TABLE Bookings AUTO_INCREMENT = 1;`
        );
      } else if (dbType === "postgres") {
        await queryInterface.sequelize.query(
          `ALTER SEQUENCE "Bookings_id_seq" RESTART WITH 1;`
        );
      }
    }
  },
};
