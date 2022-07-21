const { async } = require("q");
const connection = require("../config");
//const TableName = "user";
const { decrypt} = require('../util/crypto'); 
const { Model, DataTypes, Deferrable } = require("sequelize");
const UserModel = require("./UserModel");

class Village extends Model {}
Village.init({
  id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true },
  village_code: { type: DataTypes.STRING(45), allowNull: true},
  village_name: { type: DataTypes.STRING(45), allowNull: true},
  village_address:{ type: DataTypes.STRING(100)},
  user_id:{ type: DataTypes.DOUBLE, allowNull: true },
}, {
  sequelize: connection,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'village',
  
});
Village.belongsTo(UserModel,{foreignKey:'user_id', constraints: false })

async function createModel(){
  try {
    await Village.sync();
    console.log("The table for the Village model was just (re)created!");
      
  } catch (error) {
    console.log(error);    
  }
  
}
createModel();
  module.exports = Village;