


"use strict"; 
require("dotenv").config();


var env = process.env.NODE_ENV || "development"; // Node.js exposes the current process’s environment variables to the script as an object called process.env.
var config = require("./configs/config"); //loading config 
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');


// Load  modules
var express = require("express"); //nodejs framework which is used to expose the APIS
var app = express(); 
const bodyParser = require("body-parser");
var passport = require('passport');
var cron = require('node-cron');
app.use(passport.initialize());
const mongoose = require("./configs/mongodb"); //mongodb connection
const constants = require("./configs/constants"); //loading constants
var utils = require("./utils/util"); //loading util file
console.log("Entering environment \"" + env + "\"");


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//loading all routes and models
app.use("/images", express.static(__dirname + "/uploads"));
app.use("/docs", express.static(__dirname + "/apidoc"));
var logger = require('logger').createLogger('development.log');
require("./configs/loader")(app, mongoose, utils, config, constants, logger);

// require('./app/routes/note.routes.js')(app);
//server listening to port
//The app.listen() function is used to bind and listen the connections on the specified host and port.
app.listen(config.port, function () {
    console.log("Server Listening to port :", config.port);
});

//exporting app
module.exports = app;