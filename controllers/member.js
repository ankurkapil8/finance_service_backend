var express = require("express");
const app = express.Router();
const appE = express();
const Joi = require('@hapi/joi');
var MemberModel = require('../models/MemberModel');
const { async } = require("q");
var GroupLoanModel = require('../models/GroupLoanModel');
const multer = require('multer')
var verifyToken = require('../util/auth_middleware');
const Member = require("../models/MemberModel");
const UserModel = require("../models/UserModel");

app.get("/entry/:member_id", verifyToken, async (req, res, next) => {
  try {
    let filter = {};
    console.log(req.params)
    if (req.params.member_id != "all") {
      //filter = `member_id= ${req.params.member_id}`
      filter = {member_id:req.params.member_id}
    }
    let response = await MemberModel.findAll({where:filter,include: [{
      model: UserModel,
      attributes:['id','name']
  }]});
    return res.status(200).json({
      message: response
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})
app.post("/entry", verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      enrollment_date: Joi.required(),
      member_name: Joi.required(),
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
      let response = await MemberModel.create(formatedData);
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
app.delete("/entry/:member_id", verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      member_id: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.params, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }

    let response = await MemberModel.destroy({where:{member_id:req.params.member_id}});
    return res.status(200).json({
      message: response
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})

app.put("/entry/:member_id", verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      member_id: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.params, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    try {
      // let updateField = "";

      // for (const key of Object.keys(req.body)) {
      //   updateField = updateField+` "${key}"="${req.body[key]}",`;
      // }
      // console.log(updateField);       {password:req.body.password},{where:{member_id:req.body.member_id}} 
      let response = await MemberModel.update(req.body, {where:{member_id:req.params.member_id}});
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

app.get("/loanByMember/:member_id", verifyToken, async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      member_id: Joi.required(),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.params, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    //let filter = `loan.member_id=${req.params.member_id}`
    let filter ={member_id:req.params.member_id}
    let response = await GroupLoanModel.findAll({where:filter,include:[Member]});
    return res.status(200).json({
      message: response
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage });
app.post('/image-upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  //const image = req.image;
  const response = {
    message: 'File uploaded successfully.',
    image: req.file
  }
  return res.status(200).json({
    message: response
  });

});

module.exports = app;