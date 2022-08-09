const { colors, appUrl } = require( '../../../lib/apiConstants.js' )
const { getUser, getUserAuth, patchUserAuth } = require( '../../../lib/userdb.js' )
const sendmail = require( 'sendmail' )
const uuid = require( 'uuid' ).v4
const mjml2html = require( 'mjml' )
let sendMailConfig
if( process.env.ENVIRONMENT === 'production' ) {
    sendMailConfig = {}
} else {
    sendMailConfig = {
        devHost: 'localhost',
        devPort: 25
    }
}
const promisify = fn => async function() {
    return new Promise( ( resolve, reject ) => fn( ...arguments, ( err, reply ) => err ? reject( err ) : resolve( reply ) ) )
}

const send = promisify( sendmail( sendMailConfig ) )


const generateEmail = ( resetLink ) => mjml2html( `
    <mjml>
      <mj-body background-color="${colors.tealWhite}">
        <mj-section>
          <mj-column>
            <mj-text  font-style="italic"
                      font-size="20px"
                      align="center"
                      color="#626262">
              Reset Your Password
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#f0f0f0">
            <mj-column>
                <mj-text>
                    <p>If you did not click forgot password, ignore this email.</p>
                    <p>Click the following link to reset your password.</p>
                    <p><a href="${resetLink}">${resetLink}</a></p>
                </mj-text>
            </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
` ).html

async function createResetLink( username ) {
    let userAuth = await getUserAuth( username )
    if( !userAuth ) {
        throw {
            statusCode: 404,
            statusMessage: 'User Not Found'
        }
    }
    const resetId = uuid()
    await patchUserAuth( { username, resetId, resetAt: new Date() } )
    return `${appUrl}/resetPassword?username=${encodeURIComponent(username)}&resetId=${resetId}`
}

module.exports = {
    POST: async ( { body: { username } } ) => {
        let user
        if( username ) {
            user = await getUser( username )
            if( !user ) {
                throw {
                    statusCode: 404,
                    statusMessage: "user not found"
                }
            }
        } else {
            throw {
                statusCode: 400,
                statusMessage: 'Username must be provided'
            }
        }

        const resetLink = await createResetLink( username )

        return send(
            {
                from: 'system@srfn-example-app.com',
                to: user.email,
                subject: 'srfn-example-app - Forgot Password',
                html: generateEmail( resetLink )
            }
        )

    }
}
