

"use strict";


module.exports = function (mongoose) {
  var Schema = mongoose.Schema;


  var BookingSchema = new Schema(
    {
     

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      cab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cabs",
      },
      status: {
        type: String,
        default: "confirmed", //shortlisted , rejected,
        enum: ["confirmed", "cancelled", "done"],
      },
      pickUpLocation: {
        type: [Number],
        default: [0, 0],
      },
      dropLocation: {
        type: [Number],
        default: [0, 0],
      },
      rideTime: {
        type: Date,
      },
    
      __v: {
        type: Number,
        select: false,
      },
    },
    { timestamps: true }
  );

  BookingSchema = require("../../utils/db_queries")(BookingSchema);
  return mongoose.model("Bookings", BookingSchema);
};
