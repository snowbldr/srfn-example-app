import { button, div, form, h1, h2, input, p } from '/lib/fnelements.mjs'
import { sendForgotPassword } from '../fn/auth.js'
import notify from '../part/notify.js'
import { fnstate } from '/lib/fntags.mjs'
import { fnlink } from '/lib/fnroute.mjs'


export default () => {
    const formValid = fnstate( false )

    const usernameInput = input( {
                                  id: 'username',
                                  type: 'text',
                                  placeholder: 'Username',
                                  minLength: 1,
                                  oninput: () =>
                                      formValid( usernameInput.checkValidity() )
                              } )

    const emailSent = () => div(
        h1( 'Password Reset Email Sent' ),
        p( { style: 'font-size:20px;' }, 'To: ', usernameInput.value ),
        p( 'Check your email for a link to reset your password.' ),
        p(fnlink({to: '/login'}, 'Login'))
    )

    const resetForm = form(
        {
            style: {
                display: 'flex',
                'justify-content': 'center',
                'flex-direction': 'column'
            },
            onsubmit: e => {
                e.preventDefault()
                sendForgotPassword( usernameInput.value )
                    .then( () => {
                        resetForm.replaceWith( emailSent() )
                    } )
                    .catch( e => {
                        console.error( e )
                        notify( 'Reset Email Send Failed.' )
                    } )
            }
        },
        h2( 'Request Password Reset' ),
        p( 'Enter your username to request a password reset' ),
        usernameInput,
        formValid.bindAs(
            button(
                {
                    style:{padding: 0},
                    id: 'login-button',
                    type: 'submit',
                    disabled: !formValid()
                },
                'Reset Password'
            ),
            ( resetButton ) => resetButton.disabled = !formValid()
        )
    )
    return resetForm
}
