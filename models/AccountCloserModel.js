const { async } = require("q");
const connection = require("../config");
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");

class AccountCloserModel extends Model {}
AccountCloserModel.init({
  id: { type: DataTypes.INTEGER,primaryKey: true, autoIncrement:true },
  group_loan_id: { type: DataTypes.INTEGER, allowNull: false},
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
AccountCloserModel.belongsTo(GROUPLOAN,{foreignKey:'group_loan_id', constraints: false })
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
