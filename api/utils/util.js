/**
 * Project          : Shopping
 * Module           : Utilities
 * Source filename  : utility.js
 * Description      : Utility functions for multiple modules.
 * Author           : Likhitha M 
 * Copyright        : Copyright © 2020, Shopping
 *                     Written under contract by Robosoft Technologies Pvt. Ltd.
 */

"use strict";
var _ = require("lodash");
var jwt = require("jwt-simple");
const async = require("async");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
var otpGenerator = require('otp-generator')
var CryptoJS = require("crypto-js");
var constants = require("./../configs/constants.js");
var config = require("./../configs/config.js");
// var Listicles = mongoose.model('ottplay-v2-listicles');
var fs = require("fs");
const CODE = constants.code;
const MSG = constants.text;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = process.env.MONGO_URL;

// Database Name
// const dbName = 'myproject';
const client = new MongoClient('mongodb://canopus:nodejs@20@ott-watch.robosoftin.com:27023/canopus');
// Use connect method to connect to the server

var servicePath = config.root + "/services/";
var services = {};
fs.readdirSync(servicePath).forEach(function (file) {
    // logger.info("Loading services : " + file);
    services[file] = require(servicePath + file);
});
module.exports = {


    //generic format function for sending error response
    notifyError: function (req, res, httpStatus, code, message, extraMsg) {
        console.log("-----httpStatus", httpStatus, '----code', code, '----message', message.errors, '---extraMsg', extraMsg)
        //setting http status code for response      
        httpStatus = (typeof httpStatus === "undefined") ? 400 : CODE[httpStatus];

        if (!code) {
            code = "ERR";
        }

        if (!message) {
            message = "ERR";
        }
        var errorMsg = MSG[message];
        if (extraMsg) {
            errorMsg = extraMsg + " : " + errorMsg;
        }
        // if (message.errors && message.errors.userType) {
        //     message = message.errors.userType.message
        // }
        // if (message.errors && message.errors.name) {
        //     message = message.errors.name.message;
        // }
        if (message.errors) {
            message = message.message
        }
        res.status(httpStatus)
            .json({
                meta: {
                    code: CODE[code],
                    message: message,
                    timestamp: new Date().toISOString()
                }
            });
    },

    sendCustomError: function (req, res, code, message) {
        //setting http status code for response      
        //
        // httpStatus = (typeof httpStatus === "undefined") ? 400 : CODE[httpStatus];

        // if (!code) {
        //     code = CODE.ERR;
        // }

        // if (!message) {
        //     message = MSG.ERR;
        // }

        res.status(CODE[code])
            .json({
                meta: {
                    code: CODE[code],
                    message: MSG[message],
                    timestamp: new Date().toISOString()
                }
            });
    },


    sendAuthError: function (req, res, code, message) {
        //setting http status code for response      
        //
        // httpStatus = (typeof httpStatus === "undefined") ? 400 : CODE[httpStatus];

        // if (!code) {
        //     code = CODE.ERR;
        // }

        // if (!message) {
        //     message = MSG.ERR;
        // }

        res.status(CODE[code])
            .json({
                meta: {
                    code: CODE[code],
                    message: MSG[message],
                    timestamp: new Date().toISOString()
                }
            });
    },
    //generic format function for sending Success response
    sendResponse: function (req, res, data, code, message, count) {
        // code = (typeof code === "undefined") ? "SUCCESS" : code;
        // httpStatus = (typeof httpStatus === "undefined") ? 200 : CODE[httpStatus];

        var skip;
        var limit;
        res.status(CODE[code]).json({
            meta: {
                code: CODE[code],
                message: MSG[message],
                timestamp: new Date().toISOString()
            },
            pagination: {
                skip: skip,
                limit: limit,
                totalCount: count
            },
            data: data
        });
    },


    sendDBError: function (req, res, err) {
        // console.log("-----err code--------", err.code, err.errmsg)

        if (err && err.code === 11000) {
            return module.exports.sendCustomError(req, res, "CONFLICT", "DB_DUPLICATE", "DB_DUPLICATE");
        } else {
            return module.exports.notifyError(req, res, "HTTP_ERR", "DB_ERR", err);
        }
    },

    sendDBCallbackErrs: function (req, res, err, data) {
        if (err) {
            return module.exports.sendDBError(req, res, err);
        } else {

            if (!data) {
                data = {};
            }
            return module.exports.sendResponse(req, res, "SUCCESS", data, "NO_RECORDS", "NO_RECORDS");
        }
    },


    dbCallbackHandler: function (req, res, data, err) {
        if (!err && data) {
            return module.exports.sendResponse(req, res, "SUCCESS", data);
        } else {
            return module.exports.sendDBCallbackErrs(req, res, err, data);
        }
    },
    encryptPassword: function (password) {
        var ciphertext = CryptoJS.HmacSHA1(password, config.passwordSecret).toString();
        // var ciphertext = CryptoJS.AES.encrypt(password, config.passwordSecret).toString();
        return ciphertext;

    },
    generateToken: function (payload) {
        var token = jwt.encode(payload, config.jwtTokenSecret);
        return token;
    },
    generateRefreshToken: function (payload) {
        payload.isRefresh = true;
        var token = jwt.encode(payload, config.jwtTokenSecret);
        return token;
    },
    generateExpiryTime: function () {
        var currentDate = new Date();
        // console.log(currentDate);
        // console.log(currentDate.getMinutes())
        var tokenExpiry = new Date(currentDate.setMinutes(currentDate.getMinutes() + config.tokenExpiry));
        // currentDate.setd
        // console.log(tokenExpiry);
        return tokenExpiry;

    },
    generateRefreshTokenExpiry: function () {
        var currentDate = new Date();
        // console.log(currentDate);
        // console.log(currentDate.getMinutes())
        var tokenExpiry = new Date(currentDate.setMinutes(currentDate.getMinutes() + config.refreshTokenExpiry));
        // currentDate.setd
        // console.log(tokenExpiry);
        return tokenExpiry;
    },
    verifyToken: function (token, cb) {
        var payload;
        // var payload = jwt.decode(token, config.jwtTokenSecret);
        // return payload;
        try {
            payload = jwt.decode(token, config.jwtTokenSecret);
            cb(null, payload)
            // return payload
        } catch (err) {
            return cb(err, null)
        }
    },
    verifyToken: function (token) {
        var payload;
        // var payload = jwt.decode(token, config.jwtTokenSecret);
        // return payload;
        try {
            payload = jwt.decode(token, config.jwtTokenSecret);
            return payload;
            // cb(null, payload)
            // return payload
        } catch (err) {
            return err;
        }
    },
    generateBearerToken: function () {
        return uuidv4();
    },
    generateOtp: function () {
        var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        return otp;
    },
    generateOtpExpiryTime: function () {
        var currentDate = new Date();
        var otpExpiry = new Date(currentDate.setMinutes(currentDate.getMinutes() + config.otpExpiry));
        return otpExpiry;
    },

    sendMail: function (name, email, otp) {
        console.log("*************")
        services.email.sendMail(name, email, otp, function (err, data) {
            console.log("err", err, "data", data)
        })
    },
    sendSMS: function(phone,otp){
        services.email.sendMail(phone, otp, function (err, data) {
            console.log("err", err, "data", data)
        })
    },

  


};
