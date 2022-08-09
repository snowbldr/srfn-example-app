const { saveUser } = require( '../../../lib/userdb.js' )
module.exports = {
    POST: async( { body } ) => saveUser( body )
}
