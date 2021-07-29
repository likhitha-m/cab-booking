

const express = require("express");
const passport = require("passport");
module.exports = function (app, mongoose, utils, config, constants,logger, upload) {
    app.use(passport.initialize());
    var cabCtrl = require("../controllers/cab")(mongoose, utils, config, constants,logger);
    // require("../auth/bearer");
    var authenticateToken = require("../auth/bearer").isAuthenticated;

    var cabRouter = express.Router();


    //api to add cab data
    cabRouter.post("/", cabCtrl.createCab);



    //api to edit cab data
    cabRouter.put("/:cabId", cabCtrl.updateCab);

    //api to list cab data
    cabRouter.get("/", authenticateToken, cabCtrl.getCabs);

    //api to get details of cab data
    cabRouter.get("/:cabId", cabCtrl.getCab);





    app.use("/api/v1/cabs", cabRouter);
};