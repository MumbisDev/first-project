"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // Define schema for production only
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Users",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        firstName: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
        email: {
          type: Sequelize.STRING(256),
          allowNull: false,
          unique: true,
        },
        hashedPassword: {
          type: Sequelize.STRING.BINARY,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    const schema =
      process.env.NODE_ENV === "production" ? process.env.SCHEMA : null;

    // Drop tables in correct order - from most dependent to least dependent
    await queryInterface.dropTable({
      tableName: "ReviewImages",
      schema: schema,
      cascade: true,
    });

    await queryInterface.dropTable({
      tableName: "SpotImages",
      schema: schema,
      cascade: true,
    });

    await queryInterface.dropTable({
      tableName: "Reviews",
      schema: schema,
      cascade: true,
    });

    await queryInterface.dropTable({
      tableName: "Bookings",
      schema: schema,
      cascade: true,
    });

    await queryInterface.dropTable({
      tableName: "Spots",
      schema: schema,
      cascade: true,
    });

    await queryInterface.dropTable({
      tableName: "Users",
      schema: schema,
      cascade: true,
    });
  },
};
