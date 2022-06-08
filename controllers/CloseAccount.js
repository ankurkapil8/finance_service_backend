var express = require("express");
const app = express.Router();
const Joi = require('@hapi/joi');
const { async } = require("q");
var AccountCloserModel = require('../models/AccountCloserModel');
var verifyToken = require('../util/auth_middleware');
const Emi = require("../models/EmiModel");
const GROUPLOAN = require("../models/GroupLoanModel");
const emiController = require("./EMIs");
app.get("/calculateSattleAmount", verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      loan_account_no: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    let paidCount = 0;
    let unPaidCount = 0;
    try {
      let emiRecords = await Emi.findAll({where:{loan_account_no:req.body.loan_account_no}});
      for(obj of emiRecords){
        if(obj.isPaid==1){
          paidCount +=1;
        }else{
          unPaidCount +=1;
        }
      }
      let satllementEmis = paidCount+3; // we are taking next 3 emis interest
      if(satllementEmis>emiRecords.length){
        satllementEmis = emiRecords.length
      }
      let totalPrincipal = emiRecords.reduce(function (previous, current) {
        return previous + parseFloat(current.principal);
    }, 0);
      let earnedInterest = emiRecords[0].int_amount*satllementEmis;
      let response = {};
      response['records'] = emiRecords;
      response ['settled_amount'] = totalPrincipal+earnedInterest;
      response ['earned_interest'] = earnedInterest;
      response ['paid_emi_count'] = paidCount;
      response ['all_emi_paid'] = paidCount==emiRecords.length?1:0;
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
app.post("/closeLoanAccout", verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      loan_account_no: Joi.required(),
      all_emi_paid: Joi.required(),
      paid_emi_count: Joi.required(),
      settled_amount: Joi.required(),
      earned_interest: Joi.required()
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    // let paidCount = 0;
    // let unPaidCount = 0;
    try {
      await AccountCloserModel.create(req.body);
      await GROUPLOAN.update({status:1},{where:{loan_account_no:req.body.loan_account_no}})
      return res.status(200).json({
        message: 'Account close successfully!'
      });
    } catch (error) {
      return res.status(500).json({
        message: error
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})
module.exports = app;