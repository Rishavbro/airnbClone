const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js")

main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }

  app.get("/testlisting",async (req,res)=>{
    let sampleListing = new Listing({
        title: "my new villa",
        description: "Bye the beach",
        price : 12000,
        location: "goa",
        country: "India"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("succesfull test")

    
  })

app.listen(8080);