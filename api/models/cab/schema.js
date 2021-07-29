

"use strict";


module.exports = function (mongoose) {
  var Schema = mongoose.Schema;

 
  var CabSchema = new Schema(
    {
     
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      vehicleNo:{
        type:String
      },
      vehicleType:{
        type:String
      },
     
      location: {
        type: [Number],
        default: [0, 0],
      },
    
      __v: {
        type: Number,
        select: false,
      },
    },
    { timestamps: true }
  );
  CabSchema.index({ location: '2d' });
  CabSchema = require("../../utils/db_queries")(CabSchema);
  return mongoose.model("Cabs", CabSchema);
};
