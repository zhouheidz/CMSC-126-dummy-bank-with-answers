const Sequelize = require('sequelize');

const connectionUrl = 'postgres://bankuser:bankpassword@localhost:5432/bankdb';
var database;

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  database = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    logging:  true //false
  });
} else {
  // the application is executed on the local machine
  var database = new Sequelize(connectionUrl);
}

database.sync();
module.exports = database;
