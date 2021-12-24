const { json } = require('express');
const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
let sites = ['https://drinkdictionary.herokuapp.com', 'http://localhost:8000']
let sitenum = 1

const returnUsersO = async () => {
    return fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
        return res.text();
    }).then(function (body) {
        return body
    })
}


const userFunctions = {
    returnUsers: async () => {
        return fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
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
        let imageURL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        let pantry = []
        try{
            const user = await prisma.user.create({
                data:{ firstName, lastName, email, password, method, role, imageURL, pantry }
            });
        } catch (err) {
            console.log("REGISTER ERROR:",err)
        }
    }
}

module.exports = { userFunctions }