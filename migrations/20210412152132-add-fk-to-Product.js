"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "UserId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });
    /**
     * Add altering commands here.
     *
     * Example:
     */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "UserId");
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  },
};
