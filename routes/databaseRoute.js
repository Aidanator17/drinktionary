const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get("/usersdb", async (req, res) => {

    try {
      const users = await prisma.user.findMany()
      return res.json(users)
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong. "+err })
    }
  })

module.exports = router