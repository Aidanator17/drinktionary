const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const userFunctions = require("../models/userDatabase").userFunctions
const foodFunctions = require("../models/foodDatabase").foodFunctions
const { ensureAuthenticated,ensureAdmin } = require("../middleware/checkAuth");

router.get("/users", async (req, res) => {

  try {
    const users = await prisma.user.findMany()
    return res.json(users)
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong. " + err })
  }
})

router.get("/recipes", async (req, res) => {

  try {
    const recipes = await prisma.recipe.findMany()
    return res.json(recipes)
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong. " + err })
  }
})
router.get("/pantry", async (req, res) => {

  try {
    const items = await prisma.pantryItems.findMany()
    return res.json(items)
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong. " + err })
  }
})

router.get("/display", ensureAdmin, async (req, res) => {
  const users = JSON.parse(await userFunctions.returnUsers())
  const items = JSON.parse(await foodFunctions.returnItems())
  const recipes = JSON.parse(await foodFunctions.returnRecipes())
  let recipeItems = []
  let recipeItems_unique = []
  for (recipe in recipes){
    for (item in recipes[recipe].ingredients){
      recipeItems.push(recipes[recipe].ingredients[item].replace("\r",""))
    }
  }
  for (item in recipeItems){
    if (!recipeItems_unique.includes(recipeItems[item])){
      recipeItems_unique.push(recipeItems[item])
    }
  }
  // console.log(recipeItems_unique)
  items.sort(function(a, b) {
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
  res.render("dbDisplay", {database:users,currentUser:req.user,items,recipeItems_unique})
})

module.exports = router