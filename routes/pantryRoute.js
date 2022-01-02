const express = require("express");
const { ensureAuthenticated } = require("../middleware/checkAuth");
const router = express.Router();
const foodFunctions = require("../models/foodDatabase").foodFunctions

router.get("/add", ensureAuthenticated, async (req,res)=>{
    const pantry = JSON.parse(await foodFunctions.returnItems())
    let items = []
    let pPantry = []
    let pPantryNames = []
    for (pItem in req.user.pantry){
        for (item in pantry){
            if (req.user.pantry[pItem]==pantry[item].id){
                pPantry.push(pantry[item])
            }
        }
    }
    for (item in pantry){
        items.push(pantry[item].name)
    }
    for (item in pPantry){
        pPantryNames.push(pPantry[item].name)
    }
    for (item in pPantryNames){
        items.splice(pPantryNames[item])
    }
    console.log(items)
    res.render("food-pantry/pantryAdd",{currentUser:req.user,items})
})

router.get("/view", ensureAuthenticated, async (req,res)=>{
    const pantry = JSON.parse(await foodFunctions.returnItems())
    let pPantry = []
    for (pItem in req.user.pantry){
        for (item in pantry){
            // console.log(req.user.pantry[pItem],pantry[item].id)
            if (req.user.pantry[pItem]==pantry[item].id){
                // console.log("Found item")
                pPantry.push(pantry[item])
            }
        }
    }
    pPantry.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
    res.render("food-pantry/personalPantry",{currentUser:req.user,pPantry})
})

module.exports = router