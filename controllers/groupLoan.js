var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var GroupLoanModel = require('../models/GroupLoanModel');
var EmiModel = require('../models/EmiModel');
var MemberModel = require('../models/MemberModel');
const { async } = require("q");
var EMIs = require("./EMIs");
const { date } = require("@hapi/joi");
var moment = require('moment');
var verifyToken = require('../util/auth_middleware');
const connection = require("../config");
const MemberGroup = require("../models/MemberGroups");
const Member = require("../models/MemberModel");
const UserModel = require("../models/UserModel");
// add loan application
app.post("/applyGroupLoan", verifyToken, async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        application_date: Joi.required(),
        member_id:Joi.required(),
        scheme_id:Joi.required(),
        interest_rate:Joi.required(),
        loan_amount:Joi.required(),
        // EMI_amount:Joi.required(),
        EMI_payout:Joi.required(),
        tenure:Joi.required(),
        village:Joi.alternatives().conditional('EMI_payout', {is:"village", then:Joi.required()}),
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      var formatedData = {
        status:0,
        is_approved:0,
        is_disbursed:0,
        ...req.body
      }
      try{
        let response = await GroupLoanModel.create(formatedData);
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
  app.post("/approveLoan", verifyToken, async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        id: Joi.required(),
        actionType:Joi.required()
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        await GroupLoanModel.update({is_approved:req.body.actionType},{where:{id:req.body.id}})
        //let response = await GroupLoanModel.approveLoan(req.body.id, req.body.actionType);
        return res.status(200).json({
            message: req.body.actionType==1?"Loan has been approved. Loan will show for disburse!":"Loan has been rejected!"
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
  // disburse loan
  app.post("/disburseLoan", verifyToken, async(req, res, next) => {
    try {
      const joiSchema = Joi.object({
        id: Joi.required(),
        actionType:Joi.required(),
        disburseDate:Joi.required()
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      try{
        let EMIsDates = [];
        let formatedEmis = [];
        let disburseDate = moment(req.body.disburseDate).format("yyyy-MM-DD")
        //console.log(disburseDate);
        let response = await connection.query('CALL disburseLoan(:id, :actionType, :disburseDate)', 
        {replacements: { id: req.body.id, actionType: req.body.actionType, disburseDate: disburseDate, }})
  
        //let response = await GroupLoanModel.disburseLoan(req.body.id, req.body.actionType, disburseDate);
        //console.log(response[0]);
        if(req.body.actionType == 1){
          //console.log("in action");
            EMIsDates = EMIs.calculateEMIFlat(
              response[0].loan_amount,
              response[0].tenure,
              response[0].interest_rate,
              response[0].EMI_payout,
              new Date(req.body.disburseDate),
              0,
              ""
              );
              //console.log(EMIsDates);
            EMIsDates.map(emi=>{
              let loanDate = emi.date;
              loanDate = loanDate.split("-");
              loanDate = new Date(`${loanDate[2]}-${loanDate[1]}-${loanDate[0]}`);
              formatedEmis.push({
                "loan_account_no":response[0].loan_account_no,
                "int_amount":emi.int_amount,
                "principal":emi.principal,
                "EMI_amount":emi.EMI,
                "outstanding":emi.outstanding,
                "EMI_date":loanDate,
                "remain_EMI":emi.remain_EMI,
                "user_id":response[0].user_id,
                "isPaid":0
            });
            });
            console.log(formatedEmis);
            let emiResponse = await EmiModel.bulkCreate(formatedEmis);
  
        }
        return res.status(200).json({
          message: req.body.actionType==1?"Loan has been disbused!":"Loan has been rejected!"
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
  app.get("/entry/:filter", verifyToken, async(req, res, next) => {
    try{
      console.log(typeof parseInt(req.params.filter));
      let filter = {};
        switch (req.params.filter) {
          case "pendingApproval":
            filter ={is_approved:0};
            break;
            case "pendingDisburse":
              filter ={is_approved:1,is_disbursed:0};
              //filter = "is_approved=1 AND is_disbursed=0";
              break;
              case "all":
                filter = {}
                break;
            default:
              filter = {id:req.params.filter}
              //`loan.id=${req.params.filter}`;
            break;
        }
        let response = await GroupLoanModel.findAll({where: filter,include: [{
          model:Member,
          include: [{
            model:MemberGroup,
            attributes:['group_name']
          }]
        },{
          model: UserModel,
          attributes:['id','name']
      }]
      });
        return res.status(200).json({
            message: response
          });

      }catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  });
  
  module.exports = app;