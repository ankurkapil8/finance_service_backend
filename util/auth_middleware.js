const jwt = require("jsonwebtoken");
const connection = require("../config");
require('dotenv').config()
const config = process.env;
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    if(decoded && decoded.role.toLowerCase()!="admin" && decoded.role!="checker"){
      console.log("add hook")
      connection.addHook('beforeFindAfterOptions', 'notifyUsers',(instance,options) => {
        console.log(instance.where);
        if(Array.isArray(instance.where)){
          const modl = instance.model.toString().split(" ");
          instance.where.push(connection.where(connection.col(modl[1].toLowerCase()+".user_id"),decoded.id))
        }else{
          instance.where.user_id=decoded.id;
        }
        //console.log("add hook",connection.);
      });
      connection.addHook('afterQuery', (model,option) => {
        console.log("remove hook")
        connection.removeHook("beforeFindAfterOptions","notifyUsers");
      })
    }

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
module.exports = verifyToken;