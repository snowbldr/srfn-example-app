import { style } from './lib/fnelements.mjs'
import { modRouter, pathState, setRootPath } from './lib/fnroute.mjs'
import menuFrame from './part/menuFrame.js'
import four0h4 from './part/four0h4.js'

import centerFrame from './part/centerFrame.js'
import { goToLogin, initAuth, isAuthenticated } from './fn/auth.js'

setRootPath( '/' )

let appStyle = style( `

body {
margin: 0;
padding: 0;
}

` )


initAuth().then( () =>

document.body.append(
    appStyle,
    modRouter(
        {
            routePath: '/ui',
            
            frame: ( route, module ) => {
                if( module.requiresAuth && pathState().currentRoute !== '/login' && !isAuthenticated() ) {
                    goToLogin()
                    return 'redirecting...'
                } else {
                    return isAuthenticated() ? menuFrame(route) : centerFrame(route)
                }
            },
            
            onerror: e => {
                console.error( e )
                
                return isAuthenticated() ? menuFrame(four0h4()) : centerFrame(four0h4())
                
            }
        } )
    )

)

