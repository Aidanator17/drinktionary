const express = require("express");
const router = express.Router();
const userFunctions = require("../models/userDatabase").userFunctions
const { ensureAuthenticated } = require("../middleware/checkAuth");

router.get("/", async (req, res) => {
    // console.log("req.user:",req.user)
    res.render("index", {currentUser:req.user})
})

router.get("/profile", ensureAuthenticated, async (req, res) => {
    // console.log("req.user:",req.user)
    res.render("profile", {currentUser:req.user})
})

module.exports = router