"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (process.env.NODE_ENV === "production") {
      await queryInterface.sequelize.query(
        `CREATE SCHEMA IF NOT EXISTS ${process.env.SCHEMA};`
      );
    }
  },

  async down(queryInterface, Sequelize) {
    if (process.env.NODE_ENV === "production") {
      await queryInterface.sequelize.query(
        `DROP SCHEMA IF EXISTS ${process.env.SCHEMA} CASCADE;`
      );
    }
  },
};
