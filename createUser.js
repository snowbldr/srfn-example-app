#!/usr/bin/env node
// A simple admin utility for creating users in the app
const { prompt } = require( 'enquirer' )
const { getUser, saveUser, saveUserAuth } = require('./lib/userdb.js')
const { close } = require('./lib/db.js')
const { secureRandom, hashPassword } = require( './lib/apiAuth.js' )
async function run() {

    const config = await prompt( [
        {
            type: 'input',
            name: 'username',
            message: "Enter username for user:"
        },
        {
            type: 'input',
            name: 'email',
            message: "Enter user's email:"
        },
        {
            type: 'password',
            name: 'password',
            default: false,
            message: "Enter user's password:"
        },
        {
            type: 'confirm',
            name: 'isAdmin',
            default: false,
            message: "Make user admin?"
        },
    ] )

    const existing = await getUser(config.username)
    if(existing){
        console.error(`Username: ${config.username} already exists!`)
        const response = await prompt([
            {
                type: 'confirm',
                name: 'continue',
                default: false,
                message: "Replace existing user and continue?"
            }
        ])
        if(!response.continue){
            return
        }
    }

    const salt = secureRandom()
    try {
        await saveUser( { username: config.username, email: config.email, roles: config.isAdmin ? ['admin'] : [] } )
        await saveUserAuth( { username: config.username, salt, passwordHash: hashPassword( config.password, salt ) } )
    } catch( e ) {
        console.error("Failed to save user", e)
    }
}

run().then(()=>console.log("User created!")).finally(()=>{
    return close(true)
})