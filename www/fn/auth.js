//TODO: create fnauth
import { fnstate } from '/lib/fntags.mjs'
import { apiGet, apiPost } from './api.js'
import notify from '../part/notify.js'
import { goTo, pathState } from '/lib/fnroute.mjs'
import { br, span } from '/lib/fnelements.mjs'

export const isAuthenticated = fnstate( false )
export const userLoaded = fnstate( false )
export const user = fnstate( null )
const tokenKey = 'auth_token'

let token = sessionStorage.getItem( tokenKey )

const loadUser = async () => {

    let jwtInfo = JSON.parse( atob( token.split( '.' )[1] ) )
    try {
        let fetchedUser = await apiGet( `/api/user/${jwtInfo.sub}` )
        user( fetchedUser )
        isAuthenticated( true )
    } catch( e ) {
        console.error( e )
        if( isAuthenticated() ) {
            isAuthenticated( false )
        }
        //invalid token
        token = null
        sessionStorage.removeItem( tokenKey )
    } finally {
        userLoaded( true )
    }
    forwardAfterLogin()
}

export function hasAnyRole( ...roles ) {
    if( userLoaded() && Array.isArray( user().roles ) ) {
        for( let role of roles ) {
            if( user().roles.indexOf( role ) > -1 ) {
                return true
            }
        }
    }

    return false
}

function forwardAfterLogin() {
    if( pathState().currentRoute === '/login' ) {
        const urlParams = new URLSearchParams( window.location.search )
        let returnTo = urlParams.get( 'returnTo' )
        if( returnTo ) {
            goTo( returnTo, null, true )
        } else {
            goTo( '/', null, true )
        }
    }
}

export async function initAuth() {
    if( !token ) {
        isAuthenticated( false )
        userLoaded( true )
    } else {
        await loadUser()
    }
}


export function addAuthHeader( headers ) {
    return Object.assign(
        {
            authorization: 'Bearer ' + token,
        },
        headers
    )
}

export async function doLogin( username, password ) {
    try {
        const res = await apiPost( '/api/auth/login', { body: btoa( JSON.stringify( { username, password } ) ) } )
        if( !res.token ) {
            notify( span( 'Login Failed', br(), 'Please try again.' ) )
            return false
        } else {
            setToken( res.token )
            await loadUser()
            return true
        }
    } catch( e ) {
        console.log( e )
        notify( e.statusText.replace( / refId.*/, '' ) )
        return false
    }
}

const setToken = ( newToken ) => {
    token = newToken
    sessionStorage.setItem( tokenKey, newToken )
    if( !isAuthenticated() ) {
        isAuthenticated( true )
    }
}

export async function resetPassword( { username, resetId }, password ) {
    await apiPost( '/api/auth/resetPassword', { username, resetId, password } )
}

export async function sendForgotPassword( username ) {
    await apiPost( '/api/auth/sendForgotPassword', { username } )
}

export function clearAuth() {
    isAuthenticated( false )
    sessionStorage.removeItem( tokenKey )
    goToLogin()
}

export function goToLogin() {
    goTo( `/login${pathState().currentRoute !== '/' ? `?returnTo=${encodeURIComponent( pathState().currentRoute )}` : ''}` )
}

/* Timeout / Keep Alive */
let lastRefresh = 0
let refreshEvery = 10 * 60 * 1000 //10 minutes
let timeout = refreshEvery * 1.5 //the timeout must be longer than the refresh interval
let loginTimeout
let keepAliveActive = false
const timeoutListeners = []

export function addTimeoutListener( listener ) {
    if( typeof listener !== 'function' ) {
        throw 'listener must be a function'
    }
    timeoutListeners.push( listener )
    return () => {
        let idx = timeoutListeners.indexOf( listener )
        if( idx > -1 ) {
            timeoutListeners.splice( idx, 1 )
        }
    }
}

let keepAlive = () => {
    if( isAuthenticated() && userLoaded() && ( !keepAliveActive || new Date().getTime() > lastRefresh + refreshEvery ) ) {
        keepAliveActive = true
        lastRefresh = new Date().getTime()
        if( loginTimeout ) {
            clearTimeout( loginTimeout )
        }
        loginTimeout = setTimeout( () => {
            keepAliveActive = false
            for( let listener of timeoutListeners ) {
                listener()
            }
            clearAuth()
        }, timeout )
        apiGet( '/api/auth/refresh' ).then( res => {
            setToken( res.token )
        } )
    }
}
isAuthenticated.subscribe( () => {
    if( isAuthenticated() && !keepAliveActive ) {
        keepAlive()
        document.addEventListener( 'mousemove', keepAlive )
        document.addEventListener( 'click', keepAlive )
        document.addEventListener( 'touchstart', keepAlive )
        document.addEventListener( 'input', keepAlive )
    } else if( !isAuthenticated() && keepAliveActive ) {
        clearTimeout( loginTimeout )
        document.removeEventListener( 'mousemove', keepAlive )
        document.removeEventListener( 'click', keepAlive )
        document.removeEventListener( 'touchstart', keepAlive )
        document.removeEventListener( 'input', keepAlive )
        keepAliveActive = false
    }
} )

