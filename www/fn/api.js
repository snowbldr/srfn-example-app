
import { addAuthHeader, clearAuth, isAuthenticated, user } from './auth.js'

import notify from '../part/notify.js'
import { goTo } from '/lib/fnroute.mjs'

function addDefaultHeaders( headers ) {
    const newHeaders = Object.assign(
        {
            accept: 'application/json',
            'content-type': 'application/json'
        },
        headers
    )

    
    return addAuthHeader(newHeaders)
    
}

export async function request( path, method, body, headers ) {
    return fetch( path, {
        method,
        body: body ? JSON.stringify( body ) : body,
        headers: headers || {}
    } )
        .then( res => {
            if( res.status / 100 !== 2 ) {
                
                if( isAuthenticated() && res.status === 401 ) {
                    clearAuth()
                    throw res
                }
                
                if( res.status === 404 ) {
                    goTo( '/404' )
                    return
                }
                console.error( 'Non-OK request: ', res.statusText )
                let err = new Error( `Non-OK request(${res.status}) : ${res.statusText}` )
                err.status = res.status
                err.statusText = res.statusText
                return res.blob().then( errBody => {
                    try {
                        err.body = JSON.parse( errBody.toString() )
                    } catch( e ) {
                        err.body = errBody
                    }
                    throw err
                } )
            } else {
                return res.blob().then( body => {
                    let contentType = (res.headers.get( 'content-type' ) || '').toLowerCase();
                    if( body && contentType.includes( 'json' ) ) {
                        return body.text().then(txt => txt && JSON.parse(txt))
                    } else if( body && contentType.includes('text') ) {
                        return body.text()
                    } else {
                        return body
                    }
                } )

            }
        } )
        .then( r => r || '' )
        .catch( err => {
            if( err.status >= 500 ) {
                notify( 'Something Broke...' )
            }
            throw err
        } )
}

export async function apiGet( path, headers ) {
    return await request( path, 'GET', null, addDefaultHeaders( headers ) )
}

export async function apiPost( path, body, headers ) {
    return await request( path, 'POST', body, addDefaultHeaders( headers ) )
}

