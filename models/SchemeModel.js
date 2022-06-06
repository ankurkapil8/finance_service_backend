const { async } = require("q");
const connection = require("../config");
//const TableName = "user";
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");

class Scheme extends Model {}
Scheme.init({
  id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement:true },
  user_id: { type: DataTypes.INTEGER, allowNull: true},
  scheme_name: { type: DataTypes.STRING(45), allowNull: true},
  scheme_code:{ type: DataTypes.STRING(45)},
  max_amount:{ type: DataTypes.DOUBLE, allowNull: true },
  min_amount:{ type: DataTypes.DOUBLE, allowNull: true },
  interest_rate:{ type: DataTypes.INTEGER, allowNull: true },
  processing_fee:{ type: DataTypes.INTEGER, allowNull: true },
  EMI_type:{ type: DataTypes.STRING(10), allowNull: true },
  status:{ type: DataTypes.TINYINT }
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'scheme',
  
});
async function createModel(){
  try {
    await Scheme.sync();
    console.log("The table for the Scheme model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
  module.exports = Scheme;

// const { async } = require("q");
// const connection = require("../config");
// const TableName = "scheme";

// function save(data) {
//     return new Promise(function (resolve, reject) {
//         connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
//         if (err) reject(err);
  
//         resolve("data saved successfully!");
//       })
//     })
//   }

//   function getAll(){
//     return new Promise(function (resolve, reject) {
//         connection.query(`SELECT * from ${TableName} ORDER BY id DESC`, (err, result) => {
//         if (err) reject(err);
//       resolve(result);
//       })
//     })

//   }

//   function deleteScheme(id){
//     return new Promise(function (resolve, reject) {
//         var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
//         if (err) reject(err);
//       resolve(` Scheme has been deleted!`);
//       })
//     })

//   }

// module.exports = { save:save,getAll:getAll,deleteScheme:deleteScheme }