const mongoose= require("mongoose");

const Schema = mongoose.Schema;
let review = require("./review.js");
let user = require("./user.js");
const { fileLoader } = require("ejs");

const listingSchema = new Schema({
    title:{
        type: String,
        required : true
    } ,
    description: String,

    image:{
      url:String,
      filename:String
    } ,
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in : listing.reviews}})
    }
});

const Listing = mongoose.model("Listing",listingSchema);



module.exports = Listing;

