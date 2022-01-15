const express = require("express");
const router = express.Router();
const userFunctions = require("../models/userDatabase").userFunctions
const foodFunctions = require("../models/foodDatabase").foodFunctions
const { ensureAuthenticated, ensureAdmin } = require("../middleware/checkAuth");

router.get("/", async (req, res) => {
    // console.log("req.user:",req.user)
    res.render("index", { currentUser: req.user })
})

router.get("/profile", ensureAuthenticated, async (req, res) => {
    // console.log("req.user:",req.user)
    res.render("profile", { currentUser: req.user })
})

router.get("/addItem", ensureAdmin, async (req, res) => {
    res.render("food-pantry/addItem", { currentUser: req.user })
})

router.post("/addItem", ensureAdmin, async (req, res) => {
    res.redirect("/addItem")
    foodFunctions.addItem(req.body.name, req.body.imageURL)
})

router.get("/addRecipe", ensureAdmin, async (req, res) => {
    res.render("food-pantry/addRecipe", { currentUser: req.user })
})

router.post("/addRecipe", ensureAdmin, async (req, res) => {
    res.redirect("/addRecipe")
    let ingredients = String(req.body.ingredients).split("\n")
    let directions = String(req.body.directions).split("\n")
    foodFunctions.addRecipe(req.body.name, req.body.imageURL, directions, req.body.difficulty, ingredients)
})

router.get('/sessions', ensureAdmin, async (req, res) => {
    const users = JSON.parse(await userFunctions.returnUsers())
    const store = req.sessionStore;

    store.all((error, sessions) => {
        if (error) {
            console.log(error);
        } else {
            console.log(sessions);
            res.render('sessions', {
                currentUser: req.user,
                sessions,
                users
            });
        }
    });
})

router.get("/sessions/revoke/:id", (req, res) => {
    const store = req.sessionStore;
    let sid = req.params.id
    store.destroy(sid, (error) => {
        if (error) {
            console.log(error);
        }
    });
    res.redirect("/sessions");
});

module.exports = router