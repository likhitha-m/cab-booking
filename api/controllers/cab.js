"use strict";

module.exports = function (mongoose, utils, config, constants, logger) {
  var Cabs = mongoose.model("Cabs");
  var Users = mongoose.model("Users");
  var cabCtrl = {};

  cabCtrl.createCab = async function (req, res) {
    try {
      var cabObj = {};
      if (req.body.driver) {
        cabObj.driver = req.body.driver;
      }

      if (req.body.location) {
        cabObj.location = req.body.location;
      }
      if (req.query.vehicleNo) {
        cabObj.vehicleNo = req.query.vehicleNo;
      }
      if (req.query.vehicleType) {
        cabObj.vehicleNo = req.query.vehicleNo;
      }
      var query = {};
      query.driver = req.body.driver;
      query.vehicleNo = req.body.vehicleNo;
      let cabData = await Cabs.getData(query);
      if (cabData) {
        return utils.sendCustomError(req, res, "CONFLICT", "DATA_EXISTS");
      } else {
        let data = await Cabs.addData(cabObj);
        return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };

  cabCtrl.getCab = async function (req, res) {
    try {
      let cab = await Cabs.getDataById(req.params.cabId);

      if (err || !cab) {
        return utils.sendCustomError(req, res, "HTTP_ERR", "BRAND_NOT_EXISTS");
      } else {
        return utils.sendResponse(req, res, cab, "SUCCESS", "SUCCESS");
      }
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };

  cabCtrl.getCabs = async (req, res) => {
    try {
      let query = {};
      if (req.query.lat && req.query.long) {
        let lat = +req.query.lat;
        let long = +req.query.long;
        var radius = config.defaultParams.radius;
        if (req.query.radius) {
          radius = +req.query.radius;
        }
        query.location = {
          $geoWithin: { $centerSphere: [[long, lat], radius / 6378.1] },
        };
      }
      let queryObj = {
        query: query,
      };
      queryObj.options = {};
      if (req.query.limit) {
        queryObj.options.limit = JSON.parse(req.query.limit);
      }
      if (req.query.skip) {
        queryObj.options.skip = JSON.parse(req.query.skip);
      }
      console.log(JSON.stringify(queryObj));
      let cabs = await Cabs.getLists(queryObj);
      let count = cabs.length;
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

      return utils.sendResponse(req, res, cabs, "SUCCESS", "SUCCESS", count);
    } catch (error) {
      return utils.sendDBCallbackErrs(req, res, error, null);
    }
  };
  cabCtrl.updateCab = async (req, res) => {
    try {
      if (req.user) {
        var cabObj = {};
        var queryObj = {
          _id: req.params.cabId,
        };
        if (req.body.driver) {
          cabObj.driver = req.body.driver;
        }

        if (req.body.location) {
          cabObj.location = req.body.location;
        }
        if (req.query.vehicleNo) {
          cabObj.vehicleNo = req.query.vehicleNo;
        }
        if (req.query.vehicleType) {
          cabObj.vehicleNo = req.query.vehicleNo;
        }
        let cab = await Cabs.updateData(queryObj, cabObj);

        Cabs.getCab(queryObj, function (err, cab) {
          if (err || !cab) {
            return utils.sendCustomError(
              req,
              res,
              "HTTP_ERR",
              "DATA_NOT_EXISTS"
            );
          } else {
            if (req.body.title) {
              cabObj.title = req.body.title;
            }
            if (req.body.description) {
              cabObj.description = req.body.description;
            }

            if (req.body.location) {
              cabObj.location = req.body.location;
            }

            Cabs.updateCabById(req.params.cabId, cabObj, function (err, data) {
              if (err || !data) {
                return utils.sendCustomError(
                  req,
                  res,
                  "HTTP_ERR",
                  "BRAND_NOT_EXISTS"
                );
              } else {
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
              }
            });
          }
        });
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

  return cabCtrl;
};
