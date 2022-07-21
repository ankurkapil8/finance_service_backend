var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var VillageModel = require('../models/VillageModel');
var UserModel = require('../models/UserModel');
const { async } = require("q");
const verifyToken = require("../util/auth_middleware");

app.post("/entry", verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      village_name: Joi.required(),
      village_code: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    try {
      let response = await VillageModel.create(req.body);
      return res.status(200).json({
        message: response
      });

    } catch (error) {
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

app.get("/entry/:id",verifyToken, async (req, res, next) => {
  try {
    let filter = {};
    console.log(req.params)
    if (req.params.id != "all") {
      filter = { id: req.params.id }
    }

    let response = await VillageModel.findAll({
      where: filter, include: [{
        model: UserModel,
        attributes: ['id', 'name']
      }]
    });
    return res.status(200).json({
      message: response
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})

app.delete("/entry/:id",verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      id: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.params, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }

    let response = await VillageModel.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      message: response
    });

  } catch (error) {
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
     let response = await VillageModel.update({
      village_code:req.body.village_code,
      village_name:req.body.village_name,
      village_address:req.body.village_address,
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