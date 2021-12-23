const express = require("express");
const router = express.Router();
const userFunctions = require("../models/userDatabase").userFunctions
const { forwardAuthenticated } = require("../middleware/checkAuth");
const passport = require("../middleware/passport");

router.get("/login", forwardAuthenticated, async (req, res) => {
    // console.log(await userFunctions.returnUsers())
    res.render("auth/login")
})

router.post("/login", (req, res) => {
    passport.authenticate('local', function (err, user, info) {
        // console.log("authenticate user:",user)
        if (!user) {
            // console.log("ERROR", user, err);
            return res.redirect('/auth/login');
        }
        else {
            req.logIn(user, (err) => {
                // console.log("authroute error:",err)
            })
            // console.log(user);
            res.redirect("/")
        }

    })(req, res);
});

router.get("/register", forwardAuthenticated, async (req,res)=>{
    res.render("auth/register")
})

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/auth/login");
});
module.exports = router