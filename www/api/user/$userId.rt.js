const { getUser, deleteUser } = require( '../../../lib/userdb.js' )
module.exports = {
    GET: async( { req, url: { pathParameters: { userId } } } ) => {
        //only allow non admins to read their own user
        if(!req.user.roles.includes('admin') && req.user.id !== userId){
            return {
                statusCode: 403,
                statusMessage: 'Forbidden'
            }
        }
        return getUser( userId )
    },
    DELETE: async ( { req, url: { pathParameters: { userId } } } ) => {
        if(req.user.id === userId){
            throw 'you cannot delete yourself.'
        }
        return deleteUser( userId )
    }
}
