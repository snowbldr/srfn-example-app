const { secureRandom, hashPassword } = require( '../../../lib/apiAuth.js' )
const { getUserAuth, patchUserAuth } = require( '../../../lib/userdb.js' )
const meetsRequirements = password => password
    && password.length > 8
    && password.match( '[0-9]' )
    && password.toLowerCase().match( '[a-z]' )

module.exports = {
    POST: async( { body: { username, resetId, password } } ) => {
        let userAuth = await getUserAuth(username)
        if(userAuth.resetId !== resetId) {
            throw {
                statusCode: 404,
                statusMessage: 'Reset not found'
            }
        }

        if( new Date().getTime() > userAuth.resetAt.getTime() + 15 * 60 * 1000 ) {
            throw {
                statusCode: 400,
                statusMessage: 'Reset Link is Expired.'
            }
        }
        if( !meetsRequirements( password ) ) {
            throw {
                statusCode: 400,
                statusMessage: 'Password must be at least 8 characters and have a letter and a number.'
            }
        }

        let salt
        if( !userAuth.salt ) {
            salt = secureRandom()
            await patchUserAuth({ username, salt })
        } else {
            salt = userAuth.salt
        }

        await patchUserAuth(
            {
                username,
                resetId: null,
                resetAt: null,
                lockedAt: null,
                failedLogins: 0,
                passwordHash: hashPassword( password, salt )
            }
        )
    }
}
