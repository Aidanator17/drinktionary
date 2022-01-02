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
    res.render("food-pantry/addItem", {currentUser:req.user})
})

router.post("/addItem", ensureAuthenticated, async (req,res)=>{
    res.redirect("/addItem")
    foodFunctions.addItem(req.body.name,req.body.imageURL)
})

router.get("/addRecipe", ensureAuthenticated, async (req,res)=>{
    res.render("food-pantry/addRecipe", {currentUser:req.user})
})

router.post("/addRecipe",ensureAuthenticated, async (req,res)=>{
    res.redirect("/addRecipe")
    let ingredients = String(req.body.ingredients).split("\n")
    let directions = String(req.body.directions).split("\n")
    foodFunctions.addRecipe(req.body.name,req.body.imageURL,directions,req.body.difficulty,ingredients)
})

module.exports = router