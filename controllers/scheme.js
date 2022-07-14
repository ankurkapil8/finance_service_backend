var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var SchemeModel = require('../models/SchemeModel');
const { async } = require("q");
const verifyToken = require("../util/auth_middleware");

app.post("/entry",verifyToken,async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        scheme_name: Joi.required(),
        scheme_code: Joi.required(),
        max_amount: Joi.required(),
        interest_rate:Joi.required(),
        EMI_type:Joi.required()
      }).unknown(true); 

      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      const created_at = new Date().getTime();
      var formatedData = {
        created_at:created_at,
        status:0,
        ...req.body
      }
      try{
        let response = await SchemeModel.create(formatedData);
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

  app.get("/entry",verifyToken,async(req, res, next) => {
    try{
        let response = await SchemeModel.findAll({where:{}});
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
        let response = await SchemeModel.destroy({where:{id:req.params.id}});
        return res.status(200).json({
            message: response
          });
      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })

  module.exports = app;