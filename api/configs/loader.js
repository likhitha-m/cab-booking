
"use strict";

var fs = require("fs"); //filesystem module
var multer = require("multer");


module.exports = function (app, mongoose, utils, config, constants, logger, upload) {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, __dirname + '/../uploads');
        },
        filename: function (req, file, cb) {
            console.log(file)
            var fileName = file.originalname;
            //image-20201019
            cb(null, fileName);
        }
    })

    var upload = multer({ storage: storage })
    // Paths
    var modelPath = config.root + "/models";
    var routePath = config.root + "/routes";

    // Bootstrap models
    fs.readdirSync(modelPath).forEach(function (file) {
        console.log("Loading model : " + file);
        require(modelPath + "/" + file + "/schema.js")(mongoose, utils);
    });

    // Bootstrap routes
    fs.readdirSync(routePath).forEach(function (file) {
        console.log("Loading routes : " + file);
        require(routePath + "/" + file)(app, mongoose, utils, config, constants,logger, upload);
    });



};