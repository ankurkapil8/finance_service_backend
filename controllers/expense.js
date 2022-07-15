var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var ExpenseModel = require('../models/ExpenseModel');
var UserModel = require('../models/UserModel');
const { async } = require("q");
var verifyToken = require('../util/auth_middleware');
app.post("/entry",verifyToken, async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        amount: Joi.required(),
        date_of_expense: Joi.required(),
        expense_type: Joi.required(),

      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      //const groupCode = `${req.body.group_name}_${new Date().getTime()}`;
      // const created_at = new Date().getTime();
      // var formatedData = {
      //   // created_at:created_at,
      //   status:0,
      //   ...req.body
      // }
      try{
        let response = await ExpenseModel.create(req.body);
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
  
    }

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
  
    }
  
  });

  app.get("/entry/:id",verifyToken, async(req, res, next) => {
    try{
      let filter = {};
      console.log(req.params)
      if(req.params.id!="all"){
        filter = {id:req.params.id}
      }

        let response = await ExpenseModel.findAll({where:filter,include: [{
          model: UserModel,
          attributes:['id','name']
      }]});
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })

  app.delete("/entry/:id",verifyToken, async(req, res, next) => {
    try{
        const joiSchema = Joi.object({
            id: Joi.required(),
          }).unknown(true);  
          const validationResult = joiSchema.validate(req.params, { abortEarly: false });
          if(validationResult.error){
            return res.status(500).json({
              message: validationResult.error.details
            });        
          }
    
        let response = await ExpenseModel.destroy({where:{id:req.params.id}});
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })
  
  app.put("/entry/:id",verifyToken, async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        id: Joi.required(),
        }).unknown(true);  
        const validationResult = joiSchema.validate(req.params, { abortEarly: false });
        if(validationResult.error){
          return res.status(500).json({
            message: validationResult.error.details
          });        
        }
      try{
       // let response = await ExpenseModel.update(req.body, req.params.id);
       let response = await ExpenseModel.update({
        expense_type:req.body.expense_type,
        amount:req.body.amount,
        date_of_expense:req.body.date_of_expense
      },{where:{id:req.params.id}});

        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
  
    }

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
  
    }
  
  });

  module.exports = app;