

"use strict";

var _ = require("lodash");

var config = {
    //environments
    //local
    //development
    //staging
    //uat
    //production  
    local: {
        mongo: {
            dbURL: process.env.MONGO_URL,
            options: {
                db: {
                    native_parser: true  //native_parser {Boolean, default:false}, use c++ bson parser.
                },
                // user: process.env.MONGODBAuthUser, //get username from .env
                // pass: process.env.MONGODBAuthPass, //get password from .env
                // auth: {   //authenticate db
                //     authdb: "admin"
                // }
            },
        },
        root: require("path").normalize(__dirname + "/.."), //getting the root path of the project folder
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        imageUrl: 'localhost:4000/images/',
    
        tokenExpiry: 60,
      
        otpExpiry: 5,
        defaultParams: {
            radius: 20,
            chunkSize: 2
        },
       
        twilio:{
            ACC_SID:89328932,
            TOKEN:22893823239
        },
        facebook: {
            appId: '376504556736668',
            appSecret: 'dcdea76b856258f6f5455f2af141e8af'
        },
        google: {
            clientId: "321295520785-4qg71efq6g9p8nnrt1pnfg5ki9sa5gav.apps.googleusercontent.com",
            clientSecret: "eEpQO0wuIT7YnDDadwR6L_jC"
        },
       


    },

    development: {
        mongo: {
            dbURL: process.env.MONGO_URL,
            options: {
                db: {
                    native_parser: true  //native_parser {Boolean, default:false}, use c++ bson parser.
                },
                // user: process.env.MONGODBAuthUser, //get username from .env
                // pass: process.env.MONGODBAuthPass, //get password from .env
                // auth: {   //authenticate db
                //     authdb: "admin"
                // }
            },
        },
        root: require("path").normalize(__dirname + "/.."), //getting the root path of the project folder
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        imageUrl: 'localhost:4000/images/',
    
        tokenExpiry: 60,
      
        otpExpiry: 5,
        defaultParams: {
            radius: 20,
            chunkSize: 2
        },
       
        twilio:{
            ACC_SID:89328932,
            TOKEN:22893823239
        },
        facebook: {
            appId: '376504556736668',
            appSecret: 'dcdea76b856258f6f5455f2af141e8af'
        },
        google: {
            clientId: "321295520785-4qg71efq6g9p8nnrt1pnfg5ki9sa5gav.apps.googleusercontent.com",
            clientSecret: "eEpQO0wuIT7YnDDadwR6L_jC"
        },


    },

    staging: {
        mongo: {
            dbURL: process.env.MONGO_URL,
            options: {
                db: {
                    native_parser: true  //native_parser {Boolean, default:false}, use c++ bson parser.
                },
                // user: process.env.MONGODBAuthUser, //get username from .env
                // pass: process.env.MONGODBAuthPass, //get password from .env
                // auth: {   //authenticate db
                //     authdb: "admin"
                // }
            },
        },
        root: require("path").normalize(__dirname + "/.."), //getting the root path of the project folder
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        imageUrl: 'localhost:4000/images/',
    
        tokenExpiry: 60,
      
        otpExpiry: 5,
        defaultParams: {
            radius: 20,
            chunkSize: 2
        },
       
        twilio:{
            ACC_SID:89328932,
            TOKEN:22893823239
        },
        facebook: {
            appId: '376504556736668',
            appSecret: 'dcdea76b856258f6f5455f2af141e8af'
        },
        google: {
            clientId: "321295520785-4qg71efq6g9p8nnrt1pnfg5ki9sa5gav.apps.googleusercontent.com",
            clientSecret: "eEpQO0wuIT7YnDDadwR6L_jC"
        },



    },
    uat: {
        mongo: {
            dbURL: process.env.MONGO_URL,
            options: {
                db: {
                    native_parser: true  //native_parser {Boolean, default:false}, use c++ bson parser.
                },
                // user: process.env.MONGODBAuthUser, //get username from .env
                // pass: process.env.MONGODBAuthPass, //get password from .env
                // auth: {   //authenticate db
                //     authdb: "admin"
                // }
            },
        },
        root: require("path").normalize(__dirname + "/.."), //getting the root path of the project folder
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        imageUrl: 'localhost:4000/images/',
    
        tokenExpiry: 60,
      
        otpExpiry: 5,
        defaultParams: {
            radius: 20,
            chunkSize: 2
        },
       
        twilio:{
            ACC_SID:89328932,
            TOKEN:22893823239
        },
        facebook: {
            appId: '376504556736668',
            appSecret: 'dcdea76b856258f6f5455f2af141e8af'
        },
        google: {
            clientId: "321295520785-4qg71efq6g9p8nnrt1pnfg5ki9sa5gav.apps.googleusercontent.com",
            clientSecret: "eEpQO0wuIT7YnDDadwR6L_jC"
        },


    },
    production: {
        mongo: {
            dbURL: process.env.MONGO_URL,
            options: {
                db: {
                    native_parser: true  //native_parser {Boolean, default:false}, use c++ bson parser.
                },
                // user: process.env.MONGODBAuthUser, //get username from .env
                // pass: process.env.MONGODBAuthPass, //get password from .env
                // auth: {   //authenticate db
                //     authdb: "admin"
                // }
            },
        },
        root: require("path").normalize(__dirname + "/.."), //getting the root path of the project folder
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        imageUrl: 'localhost:4000/images/',
    
        tokenExpiry: 60,
      
        otpExpiry: 5,
        defaultParams: {
            radius: 20,
            chunkSize: 2
        },
       
        twilio:{
            ACC_SID:89328932,
            TOKEN:22893823239
        },
        facebook: {
            appId: '376504556736668',
            appSecret: 'dcdea76b856258f6f5455f2af141e8af'
        },
        google: {
            clientId: "321295520785-4qg71efq6g9p8nnrt1pnfg5ki9sa5gav.apps.googleusercontent.com",
            clientSecret: "eEpQO0wuIT7YnDDadwR6L_jC"
        },

    }
};

module.exports = (function () {
    var env = process.env.NODE_ENV || "development";


    return _.merge(config[env]);
})();
