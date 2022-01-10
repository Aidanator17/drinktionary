const express = require("express");
const { ensureAuthenticated } = require("../middleware/checkAuth");
const router = express.Router();
const foodFunctions = require("../models/foodDatabase").foodFunctions
const userFunctions = require("../models/userDatabase").userFunctions

router.get("/", ensureAuthenticated, async (req,res) => {
    const recipes = JSON.parse(await foodFunctions.returnRecipes())
    console.log(recipes)
    res.redirect("/")
})

router.get("/all", ensureAuthenticated, async (req,res) => {
    const recipes = JSON.parse(await foodFunctions.returnRecipes())
    const recipes_name = recipes.sort(function(a, b) {
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
    let easy = []
    let medium = []
    let hard = []
    let veryhard = []
    for (drink in recipes_name){
        if (recipes[drink].difficulty == "easy"){
            easy.push(recipes[drink])
        }
        else if (recipes[drink].difficulty == "medium"){
            medium.push(recipes[drink])
        }
        else if (recipes[drink].difficulty == "hard"){
            hard.push(recipes[drink])
        }
        else if (recipes[drink].difficulty == "veryhard"){
            veryhard.push(recipes[drink])
        }
        else{
            console.log("??????????????????????????????????????????")
        }
    }
    const recipes_diff = easy.concat(medium.concat(hard.concat(veryhard)))
    
    res.render("recipe/recipeAll",{recipes_name,recipes_diff,currentUser:req.user})
})

module.exports = router