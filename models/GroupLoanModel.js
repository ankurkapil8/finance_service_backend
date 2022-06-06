const { async } = require("q");
const connection = require("../config");
//const TableName = "user";
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");
const Member = require("./MemberModel");
const Scheme = require("./SchemeModel");

class GROUPLOAN extends Model {}
GROUPLOAN.init({
  id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement:true },
  loan_account_no: { type: DataTypes.STRING(45), allowNull: true},
  scheme_id: { type: DataTypes.INTEGER, allowNull: true},
  member_id:{ type: DataTypes.INTEGER},
  village_id:{ type: DataTypes.INTEGER, allowNull: true },
  user_id:{ type: DataTypes.INTEGER, allowNull: true },
  application_date:{ type: DataTypes.DATEONLY, allowNull: true },
  EMI_payout:{ type: DataTypes.STRING(45), allowNull: true },
  EMI_type:{ type: DataTypes.STRING(45), allowNull: true },
  address:{ type: DataTypes.STRING(100) },
  tenure:{ type: DataTypes.INTEGER, allowNull: true },
  interest_rate:{ type: DataTypes.INTEGER, allowNull: true },
  loan_amount:{ type: DataTypes.DOUBLE, allowNull: true },
  EMI_amount:{ type: DataTypes.DOUBLE, allowNull: true },
  co_borrower_name:{ type: DataTypes.STRING(45), allowNull: true },
  co_borrower_aadhar_card:{ type: DataTypes.STRING(45), allowNull: true },
  co_borrower_pan_card:{ type: DataTypes.STRING(45), allowNull: true },
  co_borrower_ele_bill:{ type: DataTypes.STRING(45), allowNull: true },
  co_borrower_relationship:{ type: DataTypes.STRING(45), allowNull: true },
  is_approved:{ type: DataTypes.TINYINT },
  is_disbursed:{ type: DataTypes.TINYINT },
  status:{ type: DataTypes.TINYINT },
  disburse_date:{ type: DataTypes.DATEONLY,allowNull: true },
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'group_loan',
  
});
GROUPLOAN.belongsTo(Member,{foreignKey:{name:'member_id',allowNull: false},constraints:false})
GROUPLOAN.belongsTo(Scheme,{foreignKey:{name:'scheme_id',allowNull: false},constraints:false})
async function createModel(){
  try {
    await GROUPLOAN.sync();
    console.log("The table for the GROUPLOAN model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
  module.exports = GROUPLOAN;

// const { async } = require("q");
// const connection = require("../config");
// const TableName = "loan_applications";

// function save(data) {
//     return new Promise(function (resolve, reject) {
//         let qry = connection.query(`INSERT INTO ${TableName} SET ?`, data, (err, result) => {
//         if (err) reject(err);
//             console.log(qry.sql);
//         resolve("Loan Application has been created. Loan will show for approval!");
//       })
//     })
//   }
//   function getAll(filter = "1=1"){
//     return new Promise(function (resolve, reject) {
//         let query=connection.query(`SELECT loan.*,member.*,village.village_name,village.week,village.day from ${TableName} as loan 
//         INNER JOIN member_details as member 
//         ON (loan.member_id=member.member_id )
//         LEFT JOIN village 
//         ON(loan.village_id = village.id) 
//         WHERE ${filter} ORDER BY id DESC`, (err, result) => {
//         console.log(query.sql);
//         if (err) reject(err);
//       resolve(result);
//       })
//     })

//   }

//   function approveLoan(id, actionType){
//     return new Promise(function (resolve, reject) {
//         let qry=connection.query(`UPDATE ${TableName} SET is_approved=? WHERE id=?`,[actionType, id], (err, result) => {
//        console.log(qry.sql);
//         if (err) reject(err);
//       resolve(actionType==1?"Loan has been approved. Loan will show for disburse!":"Loan has been rejected!");
//       })
//     })
//   }

//   function disburseLoan(id, actionType,disburseDate){
//     return new Promise(function (resolve, reject) {
//         let qry=connection.query(`CALL disburseLoan(?, ?, ?);`,[id,actionType,disburseDate], (err, result) => {
//        console.log(qry.sql);
//         if (err) reject(err);
//       resolve(result);
//       })
//     })
//   }

// module.exports = {save:save, getAll:getAll,approveLoan:approveLoan,disburseLoan:disburseLoan};


