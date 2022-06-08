const { async } = require("q");
const connection = require("../config");
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");
const GROUPLOAN = require("./GroupLoanModel");

class AccountCloserModel extends Model {}
AccountCloserModel.init({
  id: { type: DataTypes.INTEGER,primaryKey: true, autoIncrement:true },
  loan_account_no: { type: DataTypes.STRING(45), allowNull: true},
  all_emi_paid: { type: DataTypes.TINYINT},
  paid_emi_count:{ type: DataTypes.INTEGER},
  settled_amount:{ type: DataTypes.DOUBLE, allowNull: false },
  earned_interest:{type: DataTypes.DOUBLE}
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'account_closer',
  
});
AccountCloserModel.belongsTo(GROUPLOAN,{foreignKey:'loan_account_no', constraints: false })
async function createModel(){
  try {
    await AccountCloserModel.sync();
    console.log("The table for the AccountCloserModel model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
  module.exports = AccountCloserModel;
