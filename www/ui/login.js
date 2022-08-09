import { button, div, form, h1, input } from '/lib/fnelements.mjs'
import { doLogin, isAuthenticated } from '../fn/auth.js'
import { fnlink, goTo } from '/lib/fnroute.mjs'
import centerFrame from '../part/centerFrame.js'

export default () => {
    if( isAuthenticated() ) {
        goTo( '/', null, true )
    }

    const passwordInput = input( {
                                     id: 'password',
                                     type: 'password',
                                     placeholder: 'Password'
                                 } )
    const usernameInput = input( {
                                     id: 'username',
                                     type: 'text',
                                     placeholder: 'Username'
                                 } )
    return centerFrame(
        h1( 'srfn-example-app' ),
        form(
            {
                style: {
                    display: 'flex',
                    'justify-content': 'center',
                    'flex-direction': 'column'
                },
                onsubmit: e => {
                    e.preventDefault()
                    try{
                        doLogin( usernameInput.value, passwordInput.value )
                    } finally {
                        passwordInput.value = ''
                    }
                }
            },
            usernameInput,
            passwordInput,
            button(
                {
                    id: 'login-button',
                    type: 'submit',
                    style: {
                        padding: 0
                    }
                },
                'Login'
            )
        ),
        div( { style: 'width: 100%; text-align: center;' }, fnlink( { to: '/forgotPassword' }, 'Forgot Password?' ) )
    )
}
