import { flexCenteredCol, style } from '/lib/fnelements.mjs'
import { colors } from '../fn/constants.js'

document.body.appendChild( style( { id: 'auth-frame-style' }, `
    .auth-frame * {
        width: 100%;
        text-align: center;
    }

    .auth-frame button, .auth-frame input {
        width: 100%;
        margin: 5px 0;
    }

` ) )

export default ( ...children ) => flexCenteredCol(
    {
        class: 'auth-frame',
        style: {
            background: colors.tealWhite,
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            'justify-content': 'center'
        }
    },
    flexCenteredCol(
        {
            style: {
                'max-width': '300px',
                height: '250px',
                margin: 'auto',
                'z-index': 1,
                'justify-content': 'space-evenly'
            }
        },
        ...children
    )
)
