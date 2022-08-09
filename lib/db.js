const redish = require( '@srfnstack/redish' )
const redis = require( 'redis' )

const client = redis.createClient( { host: process.env.ARDB_SERVICE_HOST || 'localhost', port: 16379 } )
client.on( 'error', console.error )
const db = redish.createDb( client )
module.exports = {db, close: client.end.bind(client)}