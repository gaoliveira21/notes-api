module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('collections', 'color', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('collections', 'color');
  },
};
