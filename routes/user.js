const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { route } = require("./listing.js");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("./user/signup")
});


router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new user({
            username:username,
            email:email,
        });
      let registeredUser =  await user.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "welcome to wanderlust")
            res.redirect("/listings");
        })
      
     }catch(e){
        req.flash("error",e.message);
        res.redirect("./signup");
     }    
}));

//LOGIN ROUTE

router.get("/login",(req,res)=>{
    res.render("./user/login")
})

router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),async(req,res)=>{
    req.flash("success","welcome to wanderlust! You are logeed in");
    // if(res.locals.redirectUrl){
    //     res.redirect(res.locals.redirectUrl);
    // }else{
    //     res.redirect("/listings")
    // }
    
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

});

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success","you are logged out!");
            res.redirect("/listings");
        }
    })
})

module.exports = router;