const { async } = require("q");
const connection = require("../config");
//const TableName = "user";
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");
const MemberGroups = require("./MemberGroups");
class Member extends Model {}
Member.init({
  member_id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement:true },
  member_name: { type: DataTypes.STRING(45), allowNull: false},
  gender: { type: DataTypes.STRING(45), allowNull: true},
  date_of_birth:{ type: DataTypes.DATEONLY},
  age:{ type: DataTypes.INTEGER, allowNull: true },
  marital_status: { type: DataTypes.STRING(45), allowNull: true},
  mobile_number: { type: DataTypes.STRING(45), allowNull: true},
  email_id: { type: DataTypes.STRING(45), allowNull: true},
  member_group_id: { type: DataTypes.STRING(45), allowNull: false},
  email_id: { type: DataTypes.STRING(45), allowNull: true},
  image: { type: DataTypes.STRING(200), allowNull: true},
  aadhar_card: { type: DataTypes.STRING(45), allowNull: true},
  pan_card_number: { type: DataTypes.STRING(45), allowNull: true},
  driving_license_number: { type: DataTypes.STRING(45), allowNull: true},
  voter_id_number: { type: DataTypes.STRING(45), allowNull: true},
  ration_card_number: { type: DataTypes.STRING(45), allowNull: true},
  ration_card_number: { type: DataTypes.STRING(45), allowNull: true},
  enrollment_date: { type: DataTypes.DATE, allowNull: true},
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  bank_account: { type: DataTypes.STRING(45), allowNull: true },
  bank_ifsc_code: { type: DataTypes.STRING(45), allowNull: true },
  bank_account_holder: { type: DataTypes.STRING(45), allowNull: true },
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'member',
  
});
Member.belongsTo(MemberGroups,{foreignKey:{name:'member_group_id',allowNull: false},constraints:false})
async function createModel(){
  try {
    await Member.sync();
    console.log("The table for the Member model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
  module.exports = Member;



// const { async } = require("q");
// const connection = require("../config");
// const TableName = "member_details";

// function save(data) {
//     return new Promise(function (resolve, reject) {
//         let query = connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
//           console.log(query.sql);
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

// function deleteMember(member_id){
//   return new Promise(function (resolve, reject) {
//       var query=connection.query(`DELETE from ${TableName} WHERE member_id = ?`,[member_id], (err, result) => {
//       console.log(query.sql);
//         if (err) reject(err);
//     resolve(`Member ID ${member_id} has been deleted!`);
//     })
//   })
// }

// function update(record, member_id){
//   return new Promise(function (resolve, reject) {
//     connection.config.queryFormat = function (query, values) {
//       if (!values) return query;
//       return query.replace(/\:(\w+)/g, function (txt, key) {
//         if (values.hasOwnProperty(key)) {
//           return this.escape(values[key]);
//         }
//         return txt;
//       }.bind(this));
//     };    
//     let qry=connection.query(`UPDATE ${TableName} SET bank_account_holder=:bank_account_holder, bank_ifsc_code=:bank_ifsc_code, bank_account=:bank_account, ration_card_number=:ration_card_number, voter_id_number=:voter_id_number, driving_license_number=:driving_license_number, pan_card_number=:pan_card_number, aadhar_number=:aadhar_number, member_group_id=:member_group_id, email_id=:email_id, mobile_number=:mobile_number, marital_status=:marital_status, age=:age, gender=:gender, enrollment_date=:enrollment_date, date_of_birth=:date_of_birth, member_name=:member_name, image=:image WHERE member_id=${member_id}`,record, (err, result) => {
//    console.log(qry.sql);
//     if (err) reject(err);
//   resolve("Member has been updated!");
//   })
// })
// }
// module.exports = {getAll:getAll,save:save,deleteMember:deleteMember,update:update};


