const mongoose= require("mongoose");

const Schema = mongoose.Schema;
let review = require("./review.js");
let user = require("./user.js")

const listingSchema = new Schema({
    title:{
        type: String,
        required : true
    } ,
    description: String,

    image:{
        type: String,
        default: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
        set: (v) => v ==="" ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        : v,
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

