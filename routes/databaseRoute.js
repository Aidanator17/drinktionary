const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const userFunctions = require("../models/userDatabase").userFunctions
const { ensureAuthenticated } = require("../middleware/checkAuth");

router.get("/usersdb", async (req, res) => {

  try {
    const users = await prisma.user.findMany()
    return res.json(users)
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong. " + err })
  }
})

router.get("/display", ensureAuthenticated, async (req, res) => {
  const users = JSON.parse(await userFunctions.returnUsers())
  res.render("dbDisplay", {database:users,currentUser:req.user})
})

module.exports = router