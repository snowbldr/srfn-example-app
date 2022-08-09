import { div, flexCenteredCol, flexCenteredRow, h2 } from '/lib/fnelements.mjs'
import { colors } from '../fn/constants.js'
import appMenu from './appMenu.js'

export default function( ...children ){
    return flexCenteredCol(
        {
            style: {
                'min-width': '300px'
            }
        },
        flexCenteredRow(
            {
                style: {
                    width: '100%',
                    height: '40px',
                    'padding-top': '5px',
                    'margin-bottom': '10px',
                    'z-index': 10,
                    background: colors.lightGreen,
                    'justify-content': 'center',
                    'box-shadow': `0 0 5px 0 ${colors.grey}`
                }
            },
            flexCenteredRow(
                {
                    style: {
                        position: 'relative',
                        'max-width': '750px',
                        'width': '87%',
                        'justify-content': 'center'
                    }
                },
                appMenu,
                h2( {
                        style: {
                            margin: 0,
                            'z-index': -2,
                            'user-select': 'none'
                        }
                    },
                    'srfn-example-app'
                )
            )
        ),
        div(
            {
                style: {
                    'padding-top': '5px',
                    'max-width': '750px',
                    'width': '97vw',
                    'text-align': 'center',
                    'min-height': '420px'
                }
            },
            ...children
        )
    )
}