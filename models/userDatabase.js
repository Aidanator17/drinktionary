const { json } = require('express');
const fetch = require('node-fetch');
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

}

module.exports = { userFunctions }