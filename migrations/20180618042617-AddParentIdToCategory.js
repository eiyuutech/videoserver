const dbName = 'categories';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    dbName,
    'parent_id',
    {
      type: Sequelize.INTEGER,
      allowNull: true,
    }
  ),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn(dbName, 'parent_id')
};
