const express = require("express");
const { isAuthenticated } = require("./../auth/bearer");
const faceBookAuthenticate = require("./../auth/bearer").faceBookAuthenticate;
const googleAuthenticate = require("../auth/bearer").googleAuthenticate;
// const { isAuthenticated } = require("./../auth/bearer");
module.exports = function (app, mongoose, utils, config, constants, logger, upload) {
    var userCtrl = require("../controllers/user")(mongoose, utils, config, constants, logger);

 
    var userRouter = express.Router();
  
//login using phone
    userRouter.post("/login", userCtrl.loginUser);


    //api to edit user data
    userRouter.put("/:userId", isAuthenticated, userCtrl.updateUser);

    //api to list user data
    userRouter.get("/", isAuthenticated, userCtrl.getUsers);


    //api to get details of user data
    userRouter.get("/:userId", userCtrl.getUser);


    //api to delete details of user data
    userRouter.delete("/:userId", isAuthenticated, userCtrl.deleteUser);

    //send otp
    userRouter.post("/sendOtp", userCtrl.sendOtp);
    //api to verify theotp
    userRouter.post("/verifyOtp", userCtrl.verifyOtp);
    //facebook login
    userRouter.post("/facebookLogin", faceBookAuthenticate, userCtrl.socialLogin);
    //google login
    userRouter.post("/googleLogin", googleAuthenticate, userCtrl.socialLogin);

    //add phone
    userRouter.post("/addPhone", isAuthenticated, userCtrl.addPhone);
   

    app.use("/api/v1/users", userRouter);
  

};
