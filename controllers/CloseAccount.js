var express = require("express");
const app = express.Router();
const Joi = require('@hapi/joi');
const { async } = require("q");
var AccountCloserModel = require('../models/AccountCloserModel');
var verifyToken = require('../util/auth_middleware');

app.post("/entry", verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      group_loan_id: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    var formatedData = {
      status: 0,
      ...req.body
    }
    try {
      //let response = await MemberModel.create(formatedData);
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
module.exports = app;