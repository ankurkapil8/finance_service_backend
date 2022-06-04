var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var MemberGroupModel = require('../models/MemberGroups');
const { async } = require("q");
var verifyToken = require('../util/auth_middleware');
app.post("/entry", verifyToken, async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        group_name: Joi.required(),
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      const groupCode = `${req.body.group_name}_${new Date().getTime()}`;
      var formatedData = {
        group_code:groupCode,
        status:0,
        ...req.body
      }
      try{
        let response = await MemberGroupModel.create(formatedData);
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

  app.get("/entry", verifyToken, async(req, res, next) => {
    try{
        let response = await MemberGroupModel.findAll();
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })

  app.delete("/entry/:group_code", verifyToken, async(req, res, next) => {
    try{
        const joiSchema = Joi.object({
            group_code: Joi.required(),
          }).unknown(true);  
          const validationResult = joiSchema.validate(req.params, { abortEarly: false });
          if(validationResult.error){
            return res.status(500).json({
              message: validationResult.error.details
            });        
          }
    
        let response = await MemberGroupModel.destroy({where:{group_code:req.params.group_code} });
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  })

  app.get("/memberByGroupCode/:group_code", verifyToken, async(req, res, next) => {
    try{
      const joiSchema = Joi.object({
        group_code: Joi.required(),
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.params, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }

        let response = await MemberGroupModel.findOne({where:{group_code:req.params.group_code} });
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