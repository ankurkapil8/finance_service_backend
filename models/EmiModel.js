const { async } = require("q");
const connection = require("../config");
//const TableName = "user";
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");
const Member = require("./MemberModel");
const GROUPLOAN = require("./GroupLoanModel");
const UserModel = require("./UserModel");
class Emi extends Model {}
Emi.init({
  id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement:true },
  loan_account_no: { type: DataTypes.STRING(45), allowNull: true},
  int_amount:{ type: DataTypes.DOUBLE, allowNull: true },
  principal:{ type: DataTypes.DOUBLE, allowNull: true },
  EMI_amount:{ type: DataTypes.DOUBLE, allowNull: true },
  outstanding:{ type: DataTypes.DOUBLE, allowNull: true },
  isPaid:{ type: DataTypes.TINYINT },
  EMI_date:{ type: DataTypes.DATEONLY, allowNull: true },
  remain_EMI:{ type: DataTypes.INTEGER, allowNull: true },
  user_id:{ type: DataTypes.INTEGER},
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'emi',
  
});
Emi.belongsTo(GROUPLOAN,{foreignKey:'loan_account_no', constraints: false })
Emi.belongsTo(UserModel,{foreignKey:'user_id', constraints: false })
async function createModel(){
  try {
    await Emi.sync();
    console.log("The table for the Emi model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
  module.exports = Emi;
// const { async } = require("q");
// const connection = require("../config");
// const TableName = "EMIs";

// function save(data) {
//     return new Promise(function (resolve, reject) {
//         let qry = connection.query(`INSERT INTO ${TableName} (loan_account_no, int_amount, principal, EMI_amount, outstanding, EMI_date, remain_EMI) values ?`, [data], (err, result) => {
//         console.log(qry.sql);
//           if (err) reject(err);
//         resolve("EMIs has been created!");
//       })
//     })
//   }
//   function getAll(filter = "1=1"){
//     return new Promise(function (resolve, reject) {
//       let query=connection.query(`SELECT emi.*,loan.*,member.*,village.village_name,village.week,village.day,emi.id as emi_id, emi.EMI_amount as EMI_amount from EMIs as emi 
//       INNER JOIN loan_applications as loan  
//       ON (emi.loan_account_no = loan.loan_account_no)
//       INNER JOIN member_details as member 
//       ON (member.member_id=loan.member_id) 
//       LEFT JOIN village
//       ON (village.id=loan.village_id)
//       WHERE ${filter}`, (err, result) => {
//         console.log(query.sql);
//       if (err) reject(err);
//       resolve(result);
//     })
//     })
//   }
//   function update(id){
//     return new Promise(function (resolve, reject) {   
//       let qry=connection.query(`UPDATE ${TableName} SET isPaid=1 WHERE id=${id}`, (err, result) => {
//       console.log(qry.sql);
//       if (err) reject(err);
//       resolve("payment has been recorded!");
//       })
//     })
//   }
//   function getEmiData(filter){
//     return new Promise(function (resolve, reject) {
//       let query=connection.query(`SELECT * FROM ${TableName} WHERE ${filter}`, (err, result) => {
//         console.log(query.sql);
//       if (err) reject(err);
//       resolve(result);
//     })
//     })
//   }
//   function getPaidEmiByMonthYear(month, year){
//     return new Promise(function (resolve, reject) {
//       let query=connection.query(`SELECT * FROM ${TableName} WHERE MONTH(EMI_date)=${month} and YEAR(EMI_date)=${year}`, (err, result) => {
//         console.log(query.sql);
//       if (err) reject(err);
//       resolve(result);
//     })
//     })
//   }

//   module.exports = {save:save, getAll:getAll, update:update, getEmiData:getEmiData, getPaidEmiByMonthYear:getPaidEmiByMonthYear};
