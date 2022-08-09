#!/usr/bin/env node
const os = require('os')
const path = require('path')
require( 'dotenv' ).config( { path: path.join(os.homedir(),'.srfn-example-app.env') } )
let spliffy = require( '@srfnstack/spliffy' )
const { log } = spliffy
const helmet = require('helmet')


    const auth = require( './lib/apiAuth.js' )


const deployMode = process.env.DEPLOY_MODE || 'dev'

spliffy(
    {
        routeDir: __dirname + '/www',
        cacheStatic: deployMode !== 'dev',
        
        middleware: [helmet(),auth.init()],
        
        decodeQueryParameters: true,
        resolveWithoutExtension: '.js',
        notFoundRoute: '/index.html',
        nodeModuleRoutes:{
            files: [
                {
                    modulePath: '@srfnstack/fntags/src/fntags.mjs',
                    urlPath: 'fntags.mjs'
                },
                {
                    modulePath: '@srfnstack/fntags/src/fnroute.mjs',
                    urlPath: 'fnroute.mjs'
                },
                {
                    modulePath: '@srfnstack/fntags/src/fnelements.mjs',
                    urlPath: 'fnelements.mjs'
                }
            ]
        },
        errorTransformer: ( err, refId ) => {
            if( !err.statusCode || err.statusCode === 500 ) {
                log.error( `Obfuscating 500 error. Original was ${err.statusMessage}. refId: ${refId}` )
                err.statusMessage = `Something Went Wrong... ${refId}`
            }
            return err
        }
    }
)
