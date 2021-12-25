const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const userFunctions = require("../models/userDatabase").userFunctions
const { ensureAuthenticated } = require("../middleware/checkAuth");

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

router.get("/display", ensureAuthenticated, async (req, res) => {
  const users = JSON.parse(await userFunctions.returnUsers())
  res.render("dbDisplay", {database:users,currentUser:req.user})
})

module.exports = router