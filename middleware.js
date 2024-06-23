const Listing = require("./models/listing")

module.exports.isLoggedin = (req,res,next)=>{
    // console.log(req);
   // console.log(req.path, "..", req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you nedd to be logged in");
       return res.redirect("/login");
    }
        next();
    
};


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
        
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!currUser && listing.owner._id.equals( res.locals.currUser._id)){
        req.flash("err","you are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
    }else{
        next()
    }
}