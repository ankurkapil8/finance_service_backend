var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var GroupLoanModel = require('../models/GroupLoanModel');
var MemberModel = require('../models/MemberModel');
var EmiModel = require('../models/EmiModel');
var verifyToken = require('../util/auth_middleware');
const { async } = require("q");
var moment = require('moment');

app.get("/totalReceivedAmount",verifyToken, async(req, res, next) => {
    try {
        let formatedResponse = {};
        let total = 0;
        // let processingFeeData = await DashboardModel.getSumProcessingFee();

        // total = processingFeeData.reduce(function (previous, current) {
        //     return previous + parseFloat(current.amount);
        // }, 0);

        let emiData = await EmiModel.findAll({where:{isPaid:1}});

        total = emiData.reduce(function (previous, current) {
            return previous + parseFloat(current.EMI_amount);
        }, total);

        formatedResponse["total"] = total;
        //formatedResponse["processingFee"] = processingFeeData;
        formatedResponse["emis"] = emiData;
        return res.status(200).json({
            message: formatedResponse
        });
    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    } 
  })
app.get("/totalPaidAmount",verifyToken, async(req, res, next) => {
try {
    let formatedResponse = {};
    let total = 0;
    //let sumExpense = await DashboardModel.getSumExpense();
    // total = sumExpense.reduce(function (previous, current) {
    //     return previous + parseFloat(current.amount);
    // }, 0);

    //let sumPaidLoan = await GroupLoanModel.getSumDisbursedLoan();
    let sumPaidLoan = await GroupLoanModel.findAll({where: {is_disbursed:1},include: [MemberModel],order:[['id','DESC']]});
    total = sumPaidLoan.reduce(function (previous, current) {
        return previous + parseFloat(current.loan_amount);
    }, total);
    formatedResponse["total"] = total;
    //formatedResponse["expenses"] = sumExpense;
    formatedResponse["loan"] = sumPaidLoan;

    return res.status(200).json({
        message: formatedResponse
    });
}catch (error) {
    return res.status(500).json({
        message: error.message
    });
} 
})
app.get('/countActiveInactive',verifyToken, async(req, res, next) => {
    try {
        let formatedResponse = {};
        let activeAccount = 0;
        let inactiveAccount = 0;
        let loanaccounts = await GroupLoanModel.findAll({where:{is_disbursed:1}});
        for(let i=0;i<loanaccounts.length;i++){
            if(loanaccounts.status==1){
                inactiveAccount +=1;
            }else{
                activeAccount+=1;
            }
        }
        formatedResponse["active_accounts"] = activeAccount;
        formatedResponse["inactive_accounts"] = inactiveAccount;
        return res.status(200).json({
            message: formatedResponse
        });
    }catch (error) {
        return res.status(500).json({
            message: error.message
        });
    } 
    })
  module.exports = app;