

const express = require("express");

module.exports = function (app, mongoose, utils, config, constants, logger, upload) {
  var bookingCtrl = require("../controllers/booking")(mongoose, utils, config, constants, logger);

  var authenticateToken = require("../auth/bearer").isAuthenticated;
  var bookingRouter = express.Router();


  //api to add booking data
  bookingRouter.post("/", authenticateToken, bookingCtrl.createbooking);


  //api to edit booking data
  bookingRouter.put("/:bookingId", authenticateToken, bookingCtrl.updatebooking);
  
  
  

  //api to list booking data
  bookingRouter.get("/", authenticateToken, bookingCtrl.getbookings);
 

  //api to get details of booking data
  bookingRouter.get("/:bookingId", bookingCtrl.getbooking);


  

  

  app.use("/api/v1/bookings", bookingRouter);
  
};