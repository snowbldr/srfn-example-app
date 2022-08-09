import { button, div, flexCol, form, h2, input } from '/lib/fnelements.mjs'
import notify from '../part/notify.js'
import { resetPassword } from '../fn/auth.js'
import { goTo } from '/lib/fnroute.mjs'
import { fnstate } from '/lib/fntags.mjs'
import centerFrame from '../part/centerFrame.js'
import { colors } from '../fn/constants.js'


const getResetData = () => {
    const urlParams = new URLSearchParams( window.location.search )
    const resetId = urlParams.get( 'resetId' )
    const username = decodeURIComponent(urlParams.get( 'username' ))
    if( !resetId || !username) {
        goTo( '/login' )
        return {}
    }

    return {username, resetId}
}

const formError = ( ...children ) => flexCol(
    {
        style: {
            width: '100%',
            height: '50px',
            'text-align': 'center',
            color: colors.red,
            'justify-content': 'center'
        }
    },
    ...children
)


export default () => {
    const formValid = fnstate( false )
    const passwordsMatch = fnstate( true )
    const passwordGood = fnstate( true )

    const meetsRequirements = password => password && password.length > 8 && password.match( '[0-9]' ) && password.toLowerCase().match( '[a-z]' )

    const checkValid = () => {
        passwordsMatch( confirmPasswordInput.value === newPasswordInput.value )
        passwordGood( meetsRequirements( newPasswordInput.value ) )
        formValid(
            confirmPasswordInput.checkValidity()
            && newPasswordInput.checkValidity()
            && passwordsMatch()
            && passwordGood()
        )
    }

    const newPasswordInput = input( {
                                        id: 'new-password',
                                        type: 'password',
                                        placeholder: 'New Password',
                                        oninput: checkValid
                                    } )
    const confirmPasswordInput = input( {
                                            id: 'confirm-password',
                                            type: 'password',
                                            placeholder: 'Confirm Password',
                                            oninput: checkValid
                                        } )
    const resetForm = form(
        {
            style: {
                display: 'flex',
                'justify-content': 'center',
                'flex-direction': 'column'
            },
            onsubmit: e => {
                e.preventDefault()
                resetPassword( getResetData(), newPasswordInput.value )
                    .then( success )
                    .catch( e => {
                        console.error(e)
                        notify( 'Reset Failed...' )
                    })
            }
        },
        h2( 'Reset Password' ),
        newPasswordInput,
        confirmPasswordInput,
        button(
            {
                id: 'reset-password-button',
                type: 'submit',
                style: {
                    padding: 0
                }
            },
            'Change Password'
        ),

        formError( passwordsMatch.bindAs( () => passwordsMatch() ? '' : 'Passwords do not match.' ) ),
        formError( passwordGood.bindAs( () => passwordGood() ? '' : 'Password must be at least 8 characters and have a letter and a number.' ) )
    )

    const success = () => {
        const counter = fnstate( 2 )
        setTimeout( () => goTo( '/login' ), 2000 )

        const int = setInterval( () => {
            if( counter() > 0 ) {
                counter( counter() - 1 )
            } else {
                clearInterval( int )
            }
        }, 1000 )
        resetForm.replaceWith(
            div(
                h2( 'Password Changed Successfully' ),
                div( 'Redirecting in ', counter.bindAs( () => counter() ) )
            )
        )
    }

    return centerFrame(
        resetForm
    )
}
