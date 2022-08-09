import { h1, section } from '/lib/fnelements.mjs'
import { fnlink } from '/lib/fnroute.mjs'

export default () => section(
    {
        style: {
            width: '100%',
            'text-align': 'center',
            padding: '50px'
        }
    },
    h1( '404 Not Found' ),
    fnlink({to: '/'}, 'Return Home')
)
