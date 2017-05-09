const Sequelize = require('sequelize');

const connectionUrl = 'postgres://bankuser:bankpassword@localhost:5432/bankdb';
const database = new Sequelize(connectionUrl);

database.sync();
module.exports = database;
