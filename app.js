const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))

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
app.get("/listings",async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index",{allListing})
});

//SHOW ROUTE
app.get("/listing/:id", async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show",{listing})
});

//POST ROUTE
app.get("/listings/new",(req,res)=>{
   res.render("./listings/new")
});

app.post("/listings",async (req,res)=>{
   
   const newListing = new Listing(req.body.listing);
  await newListing.save()
   res.redirect("/listings");
})

app.listen(8080);