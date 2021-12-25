const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
let sites = ['https://drinkdictionary.herokuapp.com', 'http://localhost:8000']
let sitenum = 1

const foodFunctions = {
    returnItems: async () => {
        return fetch(sites[sitenum] + '/db/pantry').then(function (res) {
            return res.text();
        }).then(function (body) {
            return body
        })
    },
    returnRecipes: async () => {
        return fetch(sites[sitenum] + '/db/recipes').then(function (res) {
            return res.text();
        }).then(function (body) {
            return body
        })
    },
    addItem: async (name,imageURL) => {
        try {
            const user = await prisma.pantryItems.create({
                data: { name, imageURL }
            });
            console.log("Added item:",name)
        } catch (err) {
            console.log("ADD-ITEM ERROR:", err)
        }
    }
}

module.exports = { foodFunctions }