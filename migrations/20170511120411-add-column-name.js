'use strict';

module.exports = {
  up: function (migration, Sequelize) {
    migration.addColumn ('users', 'name', {
      type: Sequelize.STRING
    });

  },
  down: function (migration, Sequelize) {
    migration.removeColumn ('users', 'name');
  }
};
