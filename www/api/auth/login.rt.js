const { createToken, hashPassword } = require( '../../../lib/apiAuth.js' )
const { getUser, getUserAuth, patchUserAuth } = require( '../../../lib/userdb.js' )
const max_failedLogins = 10
const auto_unlock_ms = 24 * 60 * 60 * 1000

module.exports = {
    POST: async ( { body: { body } } ) => {
        let { username, password } = JSON.parse( Buffer.from( body, 'base64' ).toString() )
        if( !username || !password ) {
            throw {
                statusCode: 400,
                statusMessage: 'Username and Password are required'
            }
        }
        username = username.toLowerCase()

        let user = await getUser(username)
        if( !user ) {
            throw {
                statusCode: 401,
                statusMessage: 'Login Failed'
            }
        }

        let userAuth = await getUserAuth(username)
        if( !userAuth ) {
            throw {
                statusCode: 401,
                statusMessage: 'Login Failed'
            }
        }

        if( userAuth.lockedAt && new Date().getTime() < userAuth.lockedAt.getTime() + auto_unlock_ms ) {
            throw { statusCode: 401, statusMessage: 'User is locked.' }
        }
        if( !userAuth.salt || !userAuth.passwordHash ) {
            //this user has never had a password set
            throw { statusCode: 401, statusMessage: 'Login Failed' }
        }

        const incoming = hashPassword( password, userAuth.salt )

        if( incoming !== userAuth.passwordHash ) {
            if( typeof userAuth.failedLogins !== 'number'){
                userAuth.failedLogins = 0
            }
            if( userAuth.failedLogins >= max_failedLogins ) {
                await patchUserAuth({username: userAuth.username, failedLogins: userAuth.failedLogins + 1, lockedAt: new Date()})
                throw { statusCode: 401, statusMessage: 'Too many failed attempts, user locked.' }
            } else {
                await patchUserAuth({username: userAuth.username, failedLogins: userAuth.failedLogins + 1})
                throw { statusCode: 401, statusMessage: 'Login Failed.' }
            }
        }

        if( userAuth.locked_at || userAuth.failedLogins > 0 ) {
            await patchUserAuth({username: userAuth.username, failedLogins: 0, lockedAt: null})
        }
        return { token: createToken( { sub: username, username, roles: user.roles } ) }
    }
}
