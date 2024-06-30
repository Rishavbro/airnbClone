
const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index",{allListing})
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new")
 }


 module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    // console.log(listing)
    if(!listing){
        req.flash("error","The listing doesn't exist");
       return res.redirect("/listings");
    }
    res.render("./listings/show",{listing})
}

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image =[url,filename];
   await newListing.save();
   req.flash("success","new listing added");
    res.redirect("/listings");
 }

 module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
     if(!data){        
    res.redirect("/listings");
     }else{
        res.render("./listings/edit",{data});
     }
   
}


module.exports.renderUpdateForm = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing updated");
    res.redirect(`/listings/${id}`);

}


module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}