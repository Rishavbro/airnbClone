const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment:String,
    rating:{
          type:Number,
          min:1,
          max:5
    },
    createdA:{
        type:Date,
        default:Date.now()
    }
});

let review = mongoose.model("review",reviewSchema);

module.exports = review;