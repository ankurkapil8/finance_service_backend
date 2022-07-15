// const { async } = require("q");
// const connection = require("../config");
// const TableName = "processing_fee";

// function save(data) {
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

//   function deleteProcessingFee(id){
//     return new Promise(function (resolve, reject) {
//         var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
//         if (err) reject(err);
//       resolve(` Fee has been deleted!`);
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
//       let qry=connection.query(`UPDATE ${TableName} SET particular=:particular, amount=:amount, date_of_processing=:date_of_processing WHERE id=${id}`,record, (err, result) => {
//      console.log(qry.sql);
//       if (err) reject(err);
//     resolve("fee has been updated!");
//     })
//   })
//   }

// module.exports = {save:save,getAll:getAll,deleteProcessingFee:deleteProcessingFee,update:update}

const { async } = require("q");
const connection = require("../config");
//const TableName = "user";
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");
const { DATEONLY } = require("sequelize");
const UserModel = require("./UserModel");
class ProcessingFee extends Model {}
ProcessingFee.init({
  id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement:true },
  particular: { type: DataTypes.STRING(45), allowNull: true},
  amount: { type: DataTypes.DOUBLE, allowNull: true},
  date_of_processing:{type:DATEONLY},
  user_id:{ type: DataTypes.INTEGER }
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'processing_fee',
  
});
ProcessingFee.belongsTo(UserModel,{foreignKey:'user_id', constraints: false })
async function createModel(){
  try {
    await ProcessingFee.sync();
    console.log("The table for the ProcessingFee model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
  module.exports = ProcessingFee;