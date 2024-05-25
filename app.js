const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))

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
app.get("/listing",async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index",{allListing})
});

app.listen(8080);