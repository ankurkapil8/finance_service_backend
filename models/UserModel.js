const { async } = require("q");
const connection = require("../config");
//const TableName = "user";
const { decrypt, encrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");

class User extends Model {}
User.init({
  id: { type: DataTypes.INTEGER,primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(45), allowNull: false},
  password: { type: DataTypes.STRING(100), allowNull: false},
  name: { type: DataTypes.STRING(45), allowNull: true },
  phone:{ type: DataTypes.STRING(45), allowNull: true },
  role:{ type: DataTypes.STRING(45), allowNull: true },
  status:{ type: DataTypes.BOOLEAN}
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'users',
  hooks:{
    afterFind: (user, options) => {
      if(Array.isArray(user)){
        user.forEach((val,i)=>{
          val.dataValues.password=decrypt(val.dataValues.password)
        });
      }
    },
  }
});
async function createModel(){
  try {
    await User.sync();
    console.log("The table for the User model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
//  function save(data) {
//   console.log(data);
//     return new Promise(async function (resolve, reject) {
//       try {
//         const res = await User.create(data);
//         resolve("data saved successfully!",res.id);
//       } catch (error) {
//         reject(error);
//       }
//     })
//   }
//   function findOne(data){
//     return new Promise(function (resolve, reject) {
//         var qe = connection.query(`SELECT * from ${TableName} WHERE username = ?`,[data.username], (err, result,fields) => {
//         if (err) reject(err);

//         if(result[0] !=undefined){
//           if(decrypt(result[0].password)!=data.password)
//             result = [];
//         }
//       resolve(result);
//       })
//     })

//   }

//   function getAll(filter = "1=1"){
//     return new Promise(function (resolve, reject) {
//         connection.query(`SELECT * from ${TableName} WHERE ${filter}`, (err, result) => {
//         if (err) reject(err);
//       resolve(result);
//       })
//     })
//   }
//   function deleteUser(id){
//     return new Promise(function (resolve, reject) {
//         var query=connection.query(`DELETE from ${TableName} WHERE id = ?`,[id], (err, result) => {
//         if (err) reject(err);
//       resolve(`User has been deleted!`);
//       })
//     })

//   }

//   function changePassword(newPassword,id){
//     return new Promise(function (resolve, reject) {
//       var query=connection.query(`UPDATE ${TableName} SET password = ? WHERE id = ?`,[newPassword, id], (err, result) => {
//       if (err) reject(err);
//       resolve(`Password has been changed!`);
//     })
//     })
//   }
//   function changeRole(role,id){
//     return new Promise(function (resolve, reject) {
//       var query=connection.query(`UPDATE ${TableName} SET role = ? WHERE id = ?`,[role, id], (err, result) => {
//       if (err) reject(err);
//       resolve(`Role has been changed!`);
//     })
//     })
//   }

  //  module.exports = { save:save,findOne:findOne, getAll:getAll, deleteUser:deleteUser, changePassword:changePassword, changeRole:changeRole}
  module.exports = User;