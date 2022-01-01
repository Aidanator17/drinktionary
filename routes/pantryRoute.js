const express = require("express");
const { ensureAuthenticated } = require("../middleware/checkAuth");
const router = express.Router();

router.get("/add", ensureAuthenticated, async (req,res)=>{
    res.render("pantryAdd")
})

module.exports = router