"use strict";

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.bulkInsert(options, [
      {
        firstName: "Bob",
        lastName: "Bobert",
        email: "demo@user.io",
        username: "Demo-lition",
        hashedPassword: bcrypt.hashSync("password"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        email: "user1@user.io",
        username: "FakeUser1",
        hashedPassword: bcrypt.hashSync("password2"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Laura",
        lastName: "Michaels",
        email: "user2@user.io",
        username: "FakeUser2",
        hashedPassword: bcrypt.hashSync("password3"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    await queryInterface.bulkDelete(options, null, {});

    if (options.schema) {
      await queryInterface.sequelize.query(
        `ALTER SEQUENCE "${options.schema}"."Users_id_seq" RESTART WITH 1;`
      );
    } else {
      const dbType = queryInterface.sequelize.getDialect();

      if (dbType === "sqlite") {
        await queryInterface.sequelize.query(
          `UPDATE sqlite_sequence SET seq = 0 WHERE name = 'Users';`
        );
      } else if (dbType === "mysql") {
        await queryInterface.sequelize.query(
          `ALTER TABLE Users AUTO_INCREMENT = 1;`
        );
      } else if (dbType === "postgres") {
        await queryInterface.sequelize.query(
          `ALTER SEQUENCE "Users_id_seq" RESTART WITH 1;`
        );
      }
    }
  },
};
