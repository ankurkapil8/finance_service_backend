var Q = require('q');
var mysql = require('mysql');
require('dotenv').config()
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
var connection = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('mysql connected as id ' + connection.threadId);
});
module.exports = connection;
//require('./models/CategoryModel');
//require('./models/UserModel');
//require('./models/FinanceModel');
//require('./models/OrderModel');
//require('./models/ProductModel');
//require('./models/ShoppingCartModel');
//add other models here.
