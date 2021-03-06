const { json } = require('express');
const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
let sites = ['https://drinkdictionary.herokuapp.com', 'http://localhost:8000']
let sitenum = 1

const returnUsersO = async () => {
    return fetch(sites[sitenum] + '/db/users').then(function (res) {
        return res.text();
    }).then(function (body) {
        return body
    })
}


const userFunctions = {
    returnUsers: async () => {
        return fetch(sites[sitenum] + '/db/users').then(function (res) {
            return res.text();
        }).then(function (body) {
            return body
        })
    },
    findOne: async (email) => {
        var users = JSON.parse(await returnUsersO())
        // console.log(users)
        const user = users.find((user) => user.email === email);
        if (user) {
            return user;
        }
        return new Error(`Couldn't find user with email: ${email}`);
    },
    findById: async (id) => {
        var users = JSON.parse(await returnUsersO())
        // console.log(users)
        const user = users.find((user) => user.id === id);
        if (user) {
            return user;
        }
        return new Error(`Couldn't find user with email: ${id}`);
    },
    register_local: async (firstName, lastName, email, password) => {
        let method = "local"
        let role = "user"
        let imageURL = "https://i.imgur.com/kbYQ4sU.png"
        let pantry = []
        try {
            const user = await prisma.user.create({
                data: { firstName, lastName, email, password, method, role, imageURL, pantry }
            });
        } catch (err) {
            console.log("REGISTER ERROR:", err)
        }
    },
    addPantryItem: async (item, id) => {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        user.pantry.push(item)
        const updateUser = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
              pantry: user.pantry,
            },
          })
    },
    removePantryItem: async (userID, itemID) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userID,
            },
        })
        for (item in user.pantry){
            if (user.pantry[item] == itemID){
                user.pantry.splice(item, 1)
            }
        }
        const updateUser = await prisma.user.update({
            where: {
                id: userID,
            },
            data: {
              pantry: user.pantry,
            },
          })
    }
}

module.exports = { userFunctions }