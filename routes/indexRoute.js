const express = require("express");
const router = express.Router();
const userFunctions = require("../models/userDatabase").userFunctions
const foodFunctions = require("../models/foodDatabase").foodFunctions
const { ensureAuthenticated } = require("../middleware/checkAuth");

router.get("/", async (req, res) => {
    // console.log("req.user:",req.user)
    res.render("index", {currentUser:req.user})
})

router.get("/profile", ensureAuthenticated, async (req, res) => {
    // console.log("req.user:",req.user)
    res.render("profile", {currentUser:req.user})
})

router.get("/addItem", ensureAuthenticated, async (req,res)=>{
    res.render("addItem", {currentUser:req.user})
})

router.post("/addItem", ensureAuthenticated, async (req,res)=>{
    res.redirect("/addItem")
    foodFunctions.addItem(req.body.name,req.body.imageURL)
})

module.exports = router