

"use strict";

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;


    /*
     * User Schema
     */
    var UserSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Please enter your name'],
            
        },
        email: {
            type: String,
            // required: [true, 'Please enter your valid email address!!!'],
            // unique: true
        },
        otp: {
            type: Number
        },
        otpExpiry: {
            type: Date
        },
       
        userType: {
            type: String,     //seeker, provider
            enum: ['driver', 'user']
        },
        gender: {
            type: String
        },
        location: {
            type: [Number],
            default: [0, 0]
        },
        profilePic: {
            type: String
        },
        phone: {
            type: String,
            // validate: {
            //     validator: function (v) {
            //         return /\d{3}-\d{3}-\d{4}/.test(v);
            //     },
            //     message: props => `${props.value} is not a valid phone number!`
            // },
            // required: [true, 'User phone number required'],
            // unique: true
        },
        token: {
            type: String
        },
        tokenExpiry: {
            type: Date,
            select: false
        },
        faceBookId: {
            type: String
        },
        googleId: {
            type: String
        },
       


        __v: {
            type: Number,
            select: false
        }
    }, { timestamps: true });
    // UserSchema.index({ email: 1, unique: true });
    UserSchema = require('../../utils/db_queries')(UserSchema);

    return mongoose.model('Users', UserSchema);
};
