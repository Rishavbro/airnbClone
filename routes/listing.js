const express = require("express");
const router  = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        // console.log(error);
     throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

 
//INDEX ROUTE


router.get("/",wrapAsync (async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index",{allListing})
}));

//POST ROUTE , create route
router.get("/new",(req,res)=>{
    res.render("./listings/new")
 });
 
 router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
 
    const newListing = new Listing(req.body.listing);
   await newListing.save();
   req.flash("success","new listing added");
    res.redirect("/listings");
 }));

//SHOW ROUTE
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","The listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("./listings/show",{listing})
}));



//EDIT ROUTE , UPDATE ROUTE
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
     if(!data){        
    res.redirect("/listings");
    res.render("./listings/edit",{data});
}}));


router.patch("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing updated");
    res.redirect(`/listings/${id}`);

}));

//DELETE ROUTE
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}));

module.exports = router;