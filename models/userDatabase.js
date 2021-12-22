const fetch = require('node-fetch');
let sites = ['https://drinkdictionary.herokuapp.com', 'http://localhost:8000']
let sitenum = 1
const userModel = {}
const database = {}

const userFunctions = {
    returnUsers: async () => {
        return fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(function (body){
            return body
        })
    }
}

module.exports = { userModel, database, userFunctions }