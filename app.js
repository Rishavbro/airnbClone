const express = require('express');
const methodOverride = require('method-override')
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { stat } = require('fs');
const {listingSchema} = require("./schema.js");

app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
     throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
//INDEX ROUTE
app.get("/",(req,res)=>{
    res.send("Hi I am root");
})

app.get("/listings",wrapAsync (async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index",{allListing})
}));

//POST ROUTE , create route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new")
 });
 
 app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
 
    const newListing = new Listing(req.body.listing);
   await newListing.save()
    res.redirect("/listings");
 }));

//SHOW ROUTE
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show",{listing})
}));



//EDIT ROUTE , UPDATE ROUTE
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    res.render("./listings/edit",{data});
}));


app.patch("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

}));

//DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//NO ROUTES FOUND 
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found"))
})

//Error handler
app.use((err,req,res,next)=>{
    let{statusCode = 500,message = "some error occured"} = err;
    // res.status(statusCode).send(message);
    res.render("./listings/error",{message})
})

app.listen(8080);