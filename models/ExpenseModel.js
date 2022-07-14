const { async } = require("q");
const connection = require("../config");
//const TableName = "user";
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");
const { DATEONLY } = require("sequelize");

class Expense extends Model {}
Expense.init({
  id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement:true },
  expense_type: { type: DataTypes.STRING(45), allowNull: true},
  amount: { type: DataTypes.DOUBLE, allowNull: true},
  date_of_expense:{type:DATEONLY},
  status:{ type: DataTypes.INTEGER },
  user_id:{ type: DataTypes.INTEGER }
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'expense',
  // hooks: {
  //   beforeFind: (expense, options) => {
  //     console.log(expense,options)
  //     expense.where.user_id = 1;
  //   }}
});
async function createModel(){
  try {
    await Expense.sync();
    console.log("The table for the Expense model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
  module.exports = Expense;
// const { async } = require("q");
// const connection = require("../config");
// const TableName = "expenses";

// function save(data) {
//   console.log(data);
//     return new Promise(function (resolve, reject) {
//         connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
//         if (err) reject(err);
  
//         resolve("data saved successfully!");
//       })
//     })
//   }

//   function getAll(filter = "1=1"){
//     return new Promise(function (resolve, reject) {
//         connection.query(`SELECT * from ${TableName} WHERE ${filter} ORDER BY created_at DESC`, (err, result) => {
//         if (err) reject(err);
//       resolve(result);
//       })
//     })

//   }

//   function deleteExpense(id){
//     return new Promise(function (resolve, reject) {
//         var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
//         if (err) reject(err);
//       resolve(` Expense has been deleted!`);
//       })
//     })

//   }
//   function update(record, id){
//     return new Promise(function (resolve, reject) {
//       connection.config.queryFormat = function (query, values) {
//         if (!values) return query;
//         return query.replace(/\:(\w+)/g, function (txt, key) {
//           if (values.hasOwnProperty(key)) {
//             return this.escape(values[key]);
//           }
//           return txt;
//         }.bind(this));
//       };    
//       let qry=connection.query(`UPDATE ${TableName} SET expense_type=:expense_type, amount=:amount, date_of_expense=:date_of_expense WHERE id=${id}`,record, (err, result) => {
//      console.log(qry.sql);
//       if (err) reject(err);
//     resolve("Expense has been updated!");
//     })
//   })
//   }
  
// module.exports = {save:save,getAll:getAll,deleteExpense:deleteExpense,update:update}