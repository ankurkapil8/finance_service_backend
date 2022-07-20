var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var EmiModel = require('../models/EmiModel');
var GroupLoanModel = require('../models/GroupLoanModel');
const { async } = require("q");
var moment = require('moment');
var verifyToken = require('../util/auth_middleware');
const connection = require("../config");
const { Op } = require("sequelize");
const Member = require("../models/MemberModel");
const MemberGroup = require("../models/MemberGroups");
const UserModel = require("../models/UserModel");
app.post("/calculateEMI", verifyToken, async(req, res, next) => {
    try {
    const joiSchema = Joi.object({
        loan_amount: Joi.required(),
        interest_rate:Joi.required(),
        tenure:Joi.required(),
        loanStartDate:Joi.required(),
        EMI_payout:Joi.required(),
        EMI_type:Joi.required()
      }).unknown(true);  
      const validationResult = joiSchema.validate(req.body, { abortEarly: false });
      if(validationResult.error){
        return res.status(500).json({
          message: validationResult.error.details
        });        
      }
      return res.status(200).json({
        message: calculateEMIFlat(req.body.loan_amount, req.body.tenure, req.body.interest_rate, req.body.EMI_payout, new Date(req.body.loanStartDate), req.body.week, req.body.day)
      });
    }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }

})
  function calculateFirstEmiVillage(week,day,application_date = moment()){
    let currentMonthArrayByDay = {"sunday":[],"monday":[],"tuesday":[],"wednesday":[],"thrusday":[],"friday":[],"saturday":[]};
    let nextMonthArrayByDay = {"sunday":[],"monday":[],"tuesday":[],"wednesday":[],"thrusday":[],"friday":[],"saturday":[]};
    let firstEmiDate = "";
    let monthStartDate = moment(application_date).startOf('month');
    let monthEndDate = moment(application_date).endOf('month');

    let nextMonthStartDate = moment(application_date).add(1, 'month').startOf('month');
    let nextMonthEndDate = moment(application_date).add(1, 'month').endOf('month');
    let dayByNumber = {0:"sunday",1:"monday",2:"tuesday",3:"wednesday",4:"thrusday",5:"friday",6:"saturday"}; 
    
    for(let i=monthStartDate;i<=monthEndDate;i=moment(i).add(1, 'day')){ //list date by day for current month
      currentMonthArrayByDay[dayByNumber[moment(i).day()]].push(i);
    }
    for(let i=nextMonthStartDate;i<=nextMonthEndDate;i=moment(i).add(1, 'day')){ //list date by day for next month
      nextMonthArrayByDay[dayByNumber[moment(i).day()]].push(i);
    }
    let i = (week-1);
    while(i<currentMonthArrayByDay[day].length){ //check in current month
      if(currentMonthArrayByDay[day][i] > application_date){  // Emi can not start from application date, so we are using > operator
        firstEmiDate = currentMonthArrayByDay[day][i];
        break;
      }
      i = i+2;
    }

    if( firstEmiDate == ""){ //because emi date is not available in current month
      i = (week-1);
      while(i<nextMonthArrayByDay[day].length){ // check in next month
        if(nextMonthArrayByDay[day][i] > application_date){  // Emi can not start from application date, so we are using > operator
          firstEmiDate = nextMonthArrayByDay[day][i];
          break;
        }
        i = i+2;
      }
  
    }

    return firstEmiDate;
  }
 function calculateEMIFlat(totalLoan, tenure, interest_rate, EMI_payout, loanDate, week=0, day=""){
   try{
      
  let result = [];
  let totalIntAmount = Math.ceil(totalLoan*interest_rate/100); //total interest
  let intPerTenure =  Math.ceil(totalIntAmount/tenure); // per EMI interest
  let principalPerTenure = Math.ceil(totalLoan/tenure); // per EMI principal
  let outstanding = totalLoan+totalIntAmount;
  //let currentEMI = 0;
  let totalAmount = totalLoan+totalIntAmount;
  let EMIPerTenure = totalAmount/tenure;
  let firstEmiDate = "";
  if(EMI_payout == "village"){
    firstEmiDate = calculateFirstEmiVillage(week, day, loanDate);
  }
  console.log("totalIntAmount ",totalIntAmount);
  console.log("totalLoan ",totalLoan);
  let w = 0
  for(let i=1;i<=tenure;i++){
    //console.log(i);
    if(EMI_payout=="monthly"){
      nextEMIDate = new Date(loanDate.setMonth(loanDate.getMonth()+1))
    }else if(EMI_payout=="weekly"){
      nextEMIDate = new Date(loanDate.setDate(loanDate.getDate() + 1 * 7));
    }else if(EMI_payout=="fortnight"){
      nextEMIDate = new Date(loanDate.setDate(loanDate.getDate()+15))
    }else if(EMI_payout=="village"){
      nextEMIDate = moment(firstEmiDate).add(w, 'weeks');
    }else if(EMI_payout=="daily"){
      nextEMIDate = new Date(loanDate.setDate(loanDate.getDate()+1))
    }
    outstanding = outstanding-EMIPerTenure;
     let emi = {
         "date":moment(nextEMIDate).format("DD-MM-YYYY"),
         "int_amount":intPerTenure,
         "principal":i!=tenure?principalPerTenure:principalPerTenure+outstanding,
         "EMI":EMIPerTenure,
         "outstanding":i!=tenure?outstanding:0,
         "remain_EMI":tenure-i
        }
        result.push(emi);
        w = w+2;
  }
  return result;
  }catch(error){
    console.log(error);
  }
}
app.get("/dueEMIs/:dueDate", verifyToken,async(req, res, next) => {
  try {

      let dueDate = req.params.dueDate?req.params.dueDate:new Date();
      //let filter = `EMI_date = "${dueDate}" AND isPaid=0`;
      let filter = {EMI_date:dueDate,isPaid:0}
      let response = await EmiModel.findAll({where:filter,include: [{
        model: GroupLoanModel,
        on: { '$emi.loan_account_no$' : { [Op.col]: 'group_loan.loan_account_no'}},
        attributes:['loan_account_no','EMI_payout'],
        include:[{
          model:Member,
          attributes:['member_group_id','member_name','member_id','mobile_number'],
          include:[{
            model:MemberGroup,
            attributes:['group_name']
          }]
        }]
    },
    {
      model:UserModel,
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
app.put("/entry", verifyToken, async(req, res, next) => {
  try {
    const joiSchema = Joi.object({
      id: Joi.required(),
    }).unknown(true);  
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if(validationResult.error){
      return res.status(500).json({
        message: validationResult.error.details
      });        
    }
    try{
      let response = await EmiModel.update({isPaid:1},{where:{id:req.body.id}});
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
app.get("/entry/:loanAccountNo", verifyToken, async(req, res, next) => {
  try {
    const joiSchema = Joi.object({
      loanAccountNo: Joi.required(),
    }).unknown(true);  
    const validationResult = joiSchema.validate(req.params, { abortEarly: false });
    if(validationResult.error){
      return res.status(500).json({
        message: validationResult.error.details
      });        
    }

      //let filter = `loan_account_no = "${req.params.loanAccountNo}" AND isPaid=1`;
      let filter = {loan_account_no:req.params.loanAccountNo,isPaid:1}
      let response = await EmiModel.findAll({where:filter,include: [{
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
app.get("/allEmis/:dueDate", verifyToken, async(req, res, next) => {
  try {
      let dueDate = req.params.dueDate?req.params.dueDate:new Date();
      //let filter = `EMI_date = "${dueDate}"`;
      let filter = {EMI_date:dueDate}
      let paidCount = 0;
      let paidAmount = 0;
      let unPaidAmount = 0;
      let notPaidCount = 0;
      let response = await EmiModel.findAll({where:filter,
        include: [{
          model: GroupLoanModel,
          on: { '$emi.loan_account_no$' : { [Op.col]: 'group_loan.loan_account_no'}}
        },{
          model: UserModel,
          attributes:['id','name']
      }]
      });
      response.map((res)=>{
        if(res.isPaid==1){
          paidCount = paidCount+1;
          paidAmount += res.EMI_amount;
        }else{
          notPaidCount = notPaidCount+1;
          unPaidAmount +=res.EMI_amount;
        }
      });
      return res.status(200).json({
          message: response,
          paidCount:paidCount,
          notPaidCount:notPaidCount,
          paidAmount:paidAmount,
          unPaidAmount:unPaidAmount
        });
  }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }
})
app.get("/paidEmi/:month/:year",verifyToken, async(req, res, next) => {
  try {
      let month = req.params.month;
      let year = req.params.year;
      //let response = await EmiModel.getPaidEmiByMonthYear(month, year);
      let response = await EmiModel.findAll({
        where: [connection.where(connection.col("isPaid"),1),connection.where(connection.fn("MONTH", connection.col("EMI_date")), month),connection.where(connection.fn("YEAR", connection.col("EMI_date")), year)],
        include: [{
          model: GroupLoanModel,
          on: { '$emi.loan_account_no$' : { [Op.col]: 'group_loan.loan_account_no'}}
      },{
        model: UserModel,
        attributes:['id','name']
    }]
       
     })

      const totalInt = response.reduce(
        (previousValue, currentValue) => previousValue + currentValue.int_amount,0
      )
      const totalPrincipal = response.reduce(
        (previousValue, currentValue) => previousValue + currentValue.principal,0
      )
      return res.status(200).json({
          records: response,
          total_interest_earned:totalInt,
          total_principal_earned:totalPrincipal
        });
  }catch (error) {
        return res.status(500).json({
          message: error.message
        });
      }
})
app.calculateEMIFlat = calculateEMIFlat;
module.exports = app;