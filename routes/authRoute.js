const express = require("express");
const router = express.Router();
const userFunctions = require("../models/userDatabase").userFunctions
const { forwardAuthenticated } = require("../middleware/checkAuth");

router.get("/login", async (req,res)=>{
    console.log(await userFunctions.returnUsers())
    res.render("auth/login")
})

module.exports = router