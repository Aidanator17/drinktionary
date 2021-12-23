const express = require("express");
const router = express.Router();
const userFunctions = require("../models/userDatabase").userFunctions

router.get("/", async (req, res) => {
    // console.log("req.user:",req.user)
    res.render("index", {currentUser:req.user})
})

module.exports = router