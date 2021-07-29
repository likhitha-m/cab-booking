
"use strict";


module.exports = function (mongoose, utils, config, constants, logger) {
  var Users = mongoose.model("Users");
  var userCtrl = {};

 
  //login through phone
  userCtrl.loginUser = async function (req, res) {
    try {
      var query = {};
      query.phone = req.body.phone;
    
      let data = await Users.getData(query);
   
      var addQuery = {
        phone: req.body.phone,
        otp: utils.generateOtp(),
        otpExpiry: utils.generateOtpExpiryTime(),
      };
      if (!data) {
        let user = await Users.addData(addQuery);
        //Implemented sendSMS but commented this line code since twilio account credentials are needed
        //   await utils.sendSMS(user.phone, user.otp);
        return utils.sendResponse(req, res, user, "SUCCESS", "SUCCESS");
      } else {
        let user = await Users.updateData({ phone: req.body.phone }, addQuery);
        return utils.sendResponse(req, res, user, "SUCCESS", "SUCCESS");
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };
  //social login
  userCtrl.socialLogin = async function (req, res) {
    try {
      if (req.user) {
        var token = await utils.generateBearerToken();
        var tokenExpiry = await utils.generateExpiryTime();
        var updateObj = {
          token: token,
          tokenExpiry: tokenExpiry,
        };
        if (req.body.userType) {
          updateObj.userType = req.body.userType;
        }
        if (req.body.phone) {
          updateObj.phone = req.body.phone;
        }
        if (req.body.location) {
          updateObj.location = req.body.location;
        }
        let user = await Users.updateDataById(req.user._id, updateObj);
        return utils.sendResponse(req, res, user, "SUCCESS", "SUCCESS");
      } else {
        return utils.sendCustomError(req, res, "HTTP_ERR", "USER_NOT_EXISTS");
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };
//get user details
  userCtrl.getUser = async function (req, res) {
    try {
      let data = await Users.getDataById(req.params.userId);
      if (!data) {
        return utils.sendCustomError(req, res, "HTTP_ERR", "USER_NOT_EXISTS");
      } else {
        return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };
//list all users
  userCtrl.getUsers = async function (req, res) {
    try {
      var queryObj = {};
      queryObj.query = {};
      if (req.query.name) {
        queryObj.query.name = req.query.name;
      }
      console.log(queryObj);
      queryObj.options = {};
      if (req.query.limit) {
        queryObj.options.limit = JSON.parse(req.query.limit);
      }
      if (req.query.skip) {
        queryObj.options.skip = JSON.parse(req.query.skip);
      }
      if (req.query.sortField && req.query.sortOrder) {
        console.log(
          "------------------sortField",
          req.query.sortField,
          req.query.sortOrder
        );
        var sortField = req.query.sortField;
        var sortOrder = req.query.sortOrder;
        queryObj.options.sort = { [`${sortField}`]: JSON.parse(sortOrder) };
      }
      // }
      if (req.query.searchText) {
        queryObj.query.name = { $regex: req.query.searchText, $options: "i" };
      }
     
      let data = await Users.getLists(queryObj);
      let count = await Users.getCount(queryObj.query);
      return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS", count);
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };
  //update user details
  userCtrl.updateUser = async function (req, res) {
    try {
      var userObj = {};

      if (req.body.name) {
        userObj.name = req.body.name;
      }
      if (req.body.location) {
        userObj.location = req.body.location;
      }
      let data = await Users.updateDataById(req.params.userId, userObj);
      if (!data) {
        return utils.sendCustomError(req, res, "HTTP_ERR", "DATA_NOT_EXISTS");
      } else {
        return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };
//delete user by id
  userCtrl.deleteUser = async function (req, res) {
    try {
      let data = await Users.removeDataById(req.params.userId);
      if (!data) {
        return utils.sendCustomError(req, res, "HTTP_ERR", "DATA_NOT_EXISTS");
      } else {
        return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };


 //send otp 
  userCtrl.sendOtp = async function (req, res) {
    try {
      if (!req.body.phone) {
        return utils.sendCustomError(req, res, "BAD_PARAMS", "PARAMS_MISSING");
      }
      var query = {};
      query.phone = req.body.phone;
     
      var updateQuery = {
        emailVerificationCode: utils.generateOtp(),
        otpExpiry: utils.generateOtpExpiryTime(),
      };
      user = await Users.updateData(query, updateQuery);
      await utils.sendMail(user.name, user.email, user.emailVerificationCode);
      return utils.sendResponse(req, res, user, "SUCCESS", "SUCCESS");
 
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };
  //add phone number
  userCtrl.addPhone = async function (req, res) {
    console.log(req.user);
    try {
      if (!req.body.phone) {
        return utils.sendCustomError(req, res, "BAD_PARAMS", "PARAMS_MISSING");
      }
      var updateQuery = {
        phone: req.body.phone,
        otp: utils.generateOtp(),
        otpExpiry: utils.generateOtpExpiryTime(),
      };
      let user = await Users.updateDataById(req.user._id, updateQuery);
      //Implemented sendSMS but commented this line code since twilio account credentials are needed
      //   await utils.sendSMS(user.phone, user.otp);
      return utils.sendResponse(req, res, user, "SUCCESS", "SUCCESS");
      // }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };
  //verify otp
  userCtrl.verifyOtp = async function (req, res) {
    try {
      if (!req.body.phone) {
        return utils.sendCustomError(req, res, "BAD_PARAMS", "PARAMS_MISSING");
      }
      var query = {};
      query.phone = req.body.phone;
      query.otp = req.body.otp;
      let user = await Users.getData(query);
      if (!user) {
        return utils.sendCustomError(req, res, "HTTP_ERR", "DATA_NOT_EXISTS");
      } else {
        if (user.otpExpiry >= new Date()) {
          let token = await utils.generateBearerToken();
          let tokenExpiry = await utils.generateExpiryTime();
          let updateQuery = {
            otp: "",
            otpExpiry: "",
            token: token,
            tokenExpiry: tokenExpiry,
          };
          user = await Users.updateData(query, updateQuery);
          if (!user) {
            return utils.sendCustomError(
              req,
              res,
              "HTTP_ERR",
              "DATA_NOT_EXISTS"
            );
          } else {
            return utils.sendResponse(req, res, user, "SUCCESS", "SUCCESS");
          }
        } else {
          return utils.sendCustomError(req, res, "HTTP_ERR", "OTP_EXPIRED");
        }
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };


  return userCtrl;
};
