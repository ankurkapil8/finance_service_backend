var Q = require('q');
var mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const { async } = require('q');
const logger = require('./util/logger');
require('dotenv').config()
// var connection = mysql.createConnection({
//   host     : process.env.DATABASE_HOST,
//   user     : process.env.DATABASE_USER,
//   password : process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME
// });
 
// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
 
//   console.log('mysql connected as id ' + connection.threadId);
// });
const connection = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql'
});

async function makeConnection(){ 
  try {
    await connection.authenticate();
    console.log('Connection has been established successfully.');
    logger.log({
      level: 'info',
      message: 'Connection has been established successfully.'
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    logger.log({
      level: 'error',
      message: error
    });
  } 
}
makeConnection();
module.exports = connection;
require('./models/UserModel');
require('./models/MemberGroups');
require('./models/MemberModel');
require('./models/SchemeModel');
require('./models/GroupLoanModel');
require('./models/EmiModel');
require('./models/AccountCloserModel');