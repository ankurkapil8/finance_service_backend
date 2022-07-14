var express = require("express");
var app = express();
const router = express.Router();
const db = require("../config");
const UserModel = require("../models/UserModel");
// var sendObj = require("../util/sendMail")
const { encrypt,decrypt} = require('../util/crypto'); 
const Joi = require('@hapi/joi');
var jwt = require('jsonwebtoken');
const { async } = require("q");
const { Op } = require("sequelize");
const connection = require("../config");
//app.set('superSecret', "kanbafood");
require('dotenv').config()
router.post("/registration", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      username: Joi.required(),
      name: Joi.required(),
      role: Joi.required(),
      password: Joi.required().messages({
        'any.required': `"password" is a required field`
      }),
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    let hashpassword = encrypt(req.body.password);
    console.log(hashpassword);
    req.body["password"] = hashpassword;
    var newUser = {
      created_at: new Date().getTime(),
      status: 0,
      ...req.body
    }
    try {
      let response = await UserModel.create(newUser);
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

})

router.post("/login", async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      username: Joi.required(),
      password: Joi.required().messages({
        'any.required': `"password" is a required field`
      }),
    });
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    try{
      
      let response = {};
      let token = "";
       //response = await UserModel.findOne(req.body);
       response = await UserModel.findOne({ where: { username: req.body.username}});
       if(response!=null){
            if(decrypt(response.password)!=req.body.password)
              response = null;
        }
      if(response!=null){
         token = jwt.sign({username:response.username,password:response.password,role:response.role,id:response.id}, process.env.JWT_SECRET, { expiresIn: '2h' }); //set jwt token
      }
          return res.status(200).json({
            message: response!=null?"User login successfully!":"Username or password wrong!",
            jwtToken: token,
            record: response!=null?response:{}
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
})
// router.post("/submitInquery", (req, res, next) => {
//   try {
//     var inqueryModel = new InqueryModel(req.body);
//     inqueryModel.save(function (err) {
//       if (err) {
//         return res.status(500).json({
//           message: err
//         });
//       } else {
//         sendObj.sendMail(req.body, "inquery").then(res => {
//           console.log(res);
//         }).catch(err => {
//           console.log(err);
//         })

//         return res.status(200).json({
//           message: "Data submited successfully"
//         });
//       }
//     })

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message
//     });
//   }
// })
router.get("/userList", async(req, res, next) => {
  try {

    let response = await UserModel.findAll({where: {
      username: {[Op.ne]: 'admin'}
    }});
    return res.status(200).json({
      message: response,
    });    
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});  
router.delete("/deleteUser/:id", async(req, res, next) => {
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
  
      //let response = await UserModel.deleteUser(req.params.id);
      let response = await User.destroy({
        where: {
          id: req.params.id
        }
      });
      return res.status(200).json({
          message: response
        });

    }catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
})

router.put("/changePassword", async(req, res, next) => {
  try {
    const joiSchema = Joi.object({
      password: Joi.string().required(),
      id:Joi.required()
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    let hashpassword = encrypt(req.body.password);
    console.log(hashpassword);
    req.body["password"] = hashpassword;
    let response = await UserModel.update({password:req.body.password},{where:{id:req.body.id}});
    //let response = await UserModel.changePassword(req.body.password,req.body.id);
    return res.status(200).json({
      message: response
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

router.put("/changeRole", async(req, res, next) => {
  try {
    const joiSchema = Joi.object({
      role: Joi.string().required(),
      id:Joi.required()
    }).unknown(true);
    const validationResult = joiSchema.validate(req.body, { abortEarly: false });
    if (validationResult.error) {
      return res.status(500).json({
        message: validationResult.error.details
      });
    }
    //let response = await UserModel.changeRole(req.body.role,req.body.id);
    let response = await UserModel.update({role:req.body.role},{where:{id:req.body.id}});
    return res.status(200).json({
      message: response
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;