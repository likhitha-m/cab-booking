

"use strict";

module.exports = function (mongoose, utils, config, constants, logger) {
  var Bookings = mongoose.model("Bookings");

  var Cabs = mongoose.model("Cabs");
  var bookingCtrl = {};
//create booking 
  bookingCtrl.createbooking = async (req, res) => {
    console.log("====");
    try {
      if (req.user) {
        let bookingObj = {},
          query = {};
        if (req.body.cab) {
          bookingObj.cab = req.body.cab;
          query.cab = req.body.cab;
        }
        bookingObj.user = req.user._id;
        console.log(bookingObj);
        let cab = await Cabs.getDataById(bookingObj.cab);
        console.log(cab);
        if (!cab) {
          return utils.sendCustomError(req, res, "HTTP_ERR", "JOB_NOT_EXISTS");
        } else {
          if (req.body.rideTime) {
            bookingObj.rideTime = req.body.rideTime;
            query.rideTime = req.body.rideTime;
          }
        }
        if (req.body.pickUpLocation) {
          bookingObj.pickUpLocation = req.body.pickUpLocation;
        }
        if (req.body.dropLocation) {
          bookingObj.dropLocation = req.body.dropLocation;
        }
        console.log(bookingObj);
        let bookingData = await Bookings.getData(bookingObj);
        console.log("bookingData", bookingData);
        if (bookingData) {
          return utils.sendCustomError(req, res, "HTTP_ERR", "DATA_EXISTS");
        } else {
          console.log("000000");
          let data = await Bookings.addData(bookingObj);
          return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
        }
      } else {
        return utils.sendAuthError(
          req,
          res,
          "NOT_AUTHERIZED",
          "NOT_AUTHERIZED"
        );
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };

  bookingCtrl.getbooking = function (req, res) {
    bookings.getbookingById(req.params.bookingId, function (err, data) {
      if (err || !data) {
        return utils.sendCustomError(req, res, "HTTP_ERR", "BRAND_NOT_EXISTS");
      } else {
        return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
      }
    });
  };
//get list of bookings with respect to status
  bookingCtrl.getbookings = async (req, res) => {
    try {
      if (req.user) {
        var queryObj = {};
        queryObj.query = {};
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

        if (req.query.status) {
          queryObj.query.status = req.query.status;
          //if status is done --- past bookings
          //if status is cancelled -- fetch cancelled bookings
        }
        // }

        // queryObj.selectFields = "title description location";
        queryObj.populate = [
          { path: "cab", populate: { path: "driver", select: "name phone" } },
          //   { path: "job", select: "title" },
        ];
        console.log(queryObj);
        let bookings = await Bookings.getLists(queryObj);
        let count = bookings.length;
        return utils.sendResponse(
          req,
          res,
          bookings,
          "SUCCESS",
          "SUCCESS",
          count
        );
      } else {
        return utils.sendAuthError(
          req,
          res,
          "NOT_AUTHERIZED",
          "NOT_AUTHERIZED"
        );
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };

  //update booking
  bookingCtrl.updatebooking = async (req, res)=> {
    try {
      if (req.user) {
        var bookingObj = {};
        var queryObj = {
          _id: req.params.bookingId,
        };

        if (req.body.status) {
          bookingObj.status = req.body.status;
        }
        let booking = await Bookings.updateData(queryObj, bookingObj);
        return utils.sendResponse(req, res, booking, "SUCCESS", "SUCCESS");
      } else {
        return utils.sendAuthError(
          req,
          res,
          "NOT_AUTHERIZED",
          "NOT_AUTHERIZED"
        );
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };

  return bookingCtrl;
};
