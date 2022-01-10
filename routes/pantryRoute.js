const express = require("express");
const { ensureAuthenticated } = require("../middleware/checkAuth");
const router = express.Router();
const foodFunctions = require("../models/foodDatabase").foodFunctions
const userFunctions = require("../models/userDatabase").userFunctions

router.get("/add", ensureAuthenticated, async (req, res) => {
    const pantry = JSON.parse(await foodFunctions.returnItems())
    let items = []
    let pPantry = []
    let pPantryNames = []
    for (pItem in req.user.pantry) {
        for (item in pantry) {
            if (req.user.pantry[pItem] == pantry[item].id) {
                pPantry.push(pantry[item])
            }
        }
    }
    // console.log("pPantry:",pPantry)
    for (item in pantry) {
        items.push(pantry[item].name)
    }
    // console.log("items:",items)
    for (item in pPantry) {
        pPantryNames.push(pPantry[item].name)
    }
    // console.log("pPantryNames:",pPantryNames)
    for (item in pPantryNames) {
        for (iitem in items) {
            if (pPantryNames[item] == items[iitem]) {
                items.splice(iitem, 1)
            }
        }
    }
    items.sort();
    // console.log("New items",items)
    res.render("food-pantry/pantryAdd", { currentUser: req.user, items })
})
router.get("/add/no", ensureAuthenticated, async (req, res) => {
    const pantry = JSON.parse(await foodFunctions.returnItems())
    let items = []
    let pPantry = []
    let pPantryNames = []
    for (pItem in req.user.pantry) {
        for (item in pantry) {
            if (req.user.pantry[pItem] == pantry[item].id) {
                pPantry.push(pantry[item])
            }
        }
    }
    // console.log("pPantry:",pPantry)
    for (item in pantry) {
        items.push(pantry[item].name)
    }
    // console.log("items:",items)
    for (item in pPantry) {
        pPantryNames.push(pPantry[item].name)
    }
    // console.log("pPantryNames:",pPantryNames)
    for (item in pPantryNames) {
        for (iitem in items) {
            if (pPantryNames[item] == items[iitem]) {
                items.splice(iitem, 1)
            }
        }
    }
    items.sort();
    // console.log("New items",items)
    res.render("food-pantry/pantryAddno", { currentUser: req.user, items })
})

router.post("/add", ensureAuthenticated, async (req, res) => {
    const pantry = JSON.parse(await foodFunctions.returnItems())
    let PantryNames = []
    for (item in pantry) {
        PantryNames.push(pantry[item].name)
    }
    if (PantryNames.includes(req.body.items)) {
        res.redirect("/pantry/add")
        // console.log(req.body.items)
        const pantry = JSON.parse(await foodFunctions.returnItems())
        let itemid
        for (item in pantry) {
            if (pantry[item].name == req.body.items) {
                itemid = pantry[item].id
            }
        }
        await userFunctions.addPantryItem(itemid, req.user.id)
        console.log(req.user.firstName, req.user.lastName, "added item:", req.body.items)
    }
    else{
        res.redirect("/pantry/add/no")
        console.log(req.user.firstName, req.user.lastName, "failed to add item:", req.body.items)
    }
})

router.get("/view", ensureAuthenticated, async (req, res) => {
    const pantry = JSON.parse(await foodFunctions.returnItems())
    let pPantry = []
    for (pItem in req.user.pantry) {
        for (item in pantry) {
            // console.log(req.user.pantry[pItem],pantry[item].id)
            if (req.user.pantry[pItem] == pantry[item].id) {
                // console.log("Found item")
                pPantry.push(pantry[item])
            }
        }
    }
    pPantry.sort(function (a, b) {
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
    res.render("food-pantry/personalPantry", { currentUser: req.user, pPantry })
})

router.get("/remove/:id", ensureAuthenticated, async (req,res) => {
    let pantry = JSON.parse(await foodFunctions.returnItems())
    let itemName
    for (items in pantry){
        if (pantry[items].id == req.params.id){
            itemName = pantry[items].name
        }
    }
    await userFunctions.removePantryItem(req.user.id,req.params.id)
    console.log(req.user.firstName, req.user.lastName, "removed item:", itemName)
    res.redirect("/pantry/view")
})

module.exports = router