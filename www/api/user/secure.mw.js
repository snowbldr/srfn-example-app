const { requiresAuthentication, requiresAnyRole } = require( '../../../lib/apiAuth.js' )
const requiresRoles = [requiresAnyRole( 'admin')]

module.exports = {
    middleware: {
        POST: requiresRoles,
        PUT: requiresRoles,
        PATCH: requiresRoles,
        DELETE: requiresRoles,
        ALL: [requiresAuthentication]
    }
}
