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

router.get("/personal", ensureAuthenticated, async (req,res) => {
    const recipes = JSON.parse(await foodFunctions.returnRecipes())
    const pantry = JSON.parse(await foodFunctions.returnItems())
    const users = JSON.parse(await userFunctions.returnUsers())
    let userPantry = []
    let userRecipes = []
    for (itemid in req.user.pantry) {
        for (item in pantry){
            if (pantry[item].id == req.user.pantry[itemid]){
                userPantry.push(pantry[item].name)
            }
        }
    }
    for (recipe in recipes){
        let includes = true
        for (ingredient in recipes[recipe].ingredients){
            if (!userPantry.includes(recipes[recipe].ingredients[ingredient].replace("\r",""))){
                includes = false
            }
        }
        if (includes == true){
            userRecipes.push(recipes[recipe])
        }
    }
    const pRecipes_name = userRecipes.sort(function(a, b) {
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
    for (drink in pRecipes_name){
        if (pRecipes_name[drink].difficulty == "easy"){
            easy.push(pRecipes_name[drink])
        }
        else if (pRecipes_name[drink].difficulty == "medium"){
            medium.push(pRecipes_name[drink])
        }
        else if (pRecipes_name[drink].difficulty == "hard"){
            hard.push(pRecipes_name[drink])
        }
        else if (pRecipes_name[drink].difficulty == "veryhard"){
            veryhard.push(pRecipes_name[drink])
        }
        else{
            console.log("??????????????????????????????????????????")
        }
    }
    const pRecipes_diff = easy.concat(medium.concat(hard.concat(veryhard)))
    res.render("recipe/recipePersonal", {recipes_diff:pRecipes_diff,recipes_name:pRecipes_name,currentUser:req.user})
})

router.get("/view/:id", ensureAuthenticated, async (req,res) => {
    const findAmount = (text,drink) =>{
        let startIndex = text.indexOf(drink)-2
        let index = startIndex - 1
        let endIndex
        let amount = ""
        let failsafe1 = 0
        let failsafe2 = 0
        while (true){
            if (failsafe1>500){
                break
            }
          if (text[index] === "("){
            endIndex = index
            break
          }
          index = index - 1
          failsafe1++
        }
        let i = endIndex+1
        while (i<startIndex){
            if (failsafe2>500){
                amount = "FALSE"
                break
            }
          amount = amount+text[i]
          i++
        }
        return amount
      }
    const recipes = JSON.parse(await foodFunctions.returnRecipes())
    let targetRecipe
    for (recipe in recipes){
        if (recipes[recipe].id == req.params.id){
            targetRecipe = recipes[recipe]
            break
        }
    }
    for (item in targetRecipe.ingredients){
        targetRecipe.ingredients[item] = targetRecipe.ingredients[item].replace("\r","")
    }
    let itemsAmount = []
    let text = ""
    for (direction in targetRecipe.directions){
        text = text + " " + targetRecipe.directions[direction]
    }
    for (item in targetRecipe.ingredients){
        itemsAmount.push({
            name:targetRecipe.ingredients[item],
            amount:findAmount(text.toUpperCase(),targetRecipe.ingredients[item].toUpperCase())
        })
    }
    // console.log(itemsAmount)
    res.render("recipe/recipeView",{recipe:targetRecipe,currentUser:req.user,itemsAmount})
})

module.exports = router