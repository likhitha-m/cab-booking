
'use strict';

var config = require('../../configs/config');
var twilio = require('twilio');
var accountSid = config.twilio.ACC_SID; // Your Account SID from www.twilio.com/console  
var authToken = config.twilio.TOKEN;   // Your Auth Token from www.twilio.com/console 



//TODO: get this from config  file
module.exports = (function () {
    // var client = new twilio(accountSid, authToken);
    /**
     * Send SMS to specified recepients with specified body
     * @param  {String}         body        Email body
     * @param  {String List}    recepients  Recepients (To, Cc and Bcc) to send the email to
     * @param  {Function}       callback    Callback function
     */
    function sendSMS(message, toNumber, callback) {

        
        client.messages.create({
            body: message,
            to: '+' + toNumber,  // Text this number
            from: config.twilio.FROM 
        }, function (err, message) {
            console.log("err--------------------")
            console.log(err)
            console.log("message-----------------");
            console.log(message);
            console.log("successful")
            
        });
    };
    return {
        sendSMS: sendSMS
    };
}());