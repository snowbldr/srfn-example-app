const passport = require( 'passport' )
const JwtStrategy = require( 'passport-jwt' ).Strategy
const ExtractJwt = require( 'passport-jwt' ).ExtractJwt
const jwt = require( 'jsonwebtoken' )
const { log } = require( '@srfnstack/spliffy' )
const crypto = require( 'crypto' )
if( !process.env.JWT_SECRET ) {
    log.error( 'JWT_SECRET unset, using default secret. This is _extremely_ insecure, set a secret by adding `JWT_SECRET=foo` to $HOME/.srfn-example-app.env.' )
}
if( !process.env.JWT_ISSUER ) {
    log.warning( 'JWT_ISSUER unset, your mother would be disappointed.' )
}
const jwtSecret = process.env.JWT_SECRET || 'bogus_secret'
const jwtValidFor = process.env.JWT_VALID_FOR || '30m'
const issuer = process.env.JWT_ISSUER || 'your mom'

passport.use(
    new JwtStrategy(
        {
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            issuer,
            jsonWebTokenOptions: {
                maxAge: jwtValidFor
            }
        },
        ( jwtPayload, done ) => done(
            null,
            //This is the currently logged in user, it's available on the request in any authenticated controller via request.user
            {
                id: jwtPayload.id,
                username: jwtPayload.username,
                roles: jwtPayload.roles || [],
                sub: jwtPayload.sub,
            }
        )
    ) )

module.exports = {
    init() {
        return passport.initialize()
    },
    secureRandom( length = 16 ) {
        return crypto.randomBytes( Math.ceil( length / 2 ) )
            .toString( 'hex' )
    },
    hashPassword( password, salt ) {
        if( !salt ) {
            throw 'Salt Required'
        }
        const hash = crypto.createHmac( 'sha512', salt )
        hash.update( password )
        return hash.digest( 'hex' )
    },
    requiresAnyRole: ( ...roles ) => {
        return ( req, res, next ) => {
            if( req.user && Array.isArray( req.user.roles ) ) {
                for( let role of roles ) {
                    if( req.user.roles.indexOf( role ) > -1 ) {
                        next()
                        return
                    }
                }
            }
            res.statusCode = 403
            res.statusMessage = 'Forbidden'
            res.end()
        }
    },
    requiresAuthentication: passport.authenticate( 'jwt', { session: false } ),
    createToken( jwtInfo ) {
        return jwt.sign(
            Object.assign( jwtInfo, { iss: issuer, id: jwtInfo.sub } ),
            jwtSecret,
            { expiresIn: jwtValidFor, algorithm: 'HS256' } )
    }
}
