const { requiresAuthentication } = require( '../../../lib/apiAuth.js' )
const { createToken } = require( '../../../lib/apiAuth.js' )
module.exports = {
    middleware: [requiresAuthentication],
    GET: ( { req } ) => ( { token: createToken( req.user ) } )
}
