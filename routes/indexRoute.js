const express = require("express");
const router = express.Router();
const userFunctions = require("../models/userDatabase").userFunctions

router.get("/", async (req, res) => {
    let users = JSON.parse(await userFunctions.returnUsers())
    res.render("index", {currentUser:users[0]})
})

module.exports = router