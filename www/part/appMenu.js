import { div } from '/lib/fnelements.mjs'
import { colors } from '../fn/constants.js'
import { fnlink } from '/lib/fnroute.mjs'
import { fnstate } from '/lib/fntags.mjs'
import { clearAuth } from '../fn/auth.js'

const menu = () => div(
    {
        style: {
            display: menuShowing.bindStyle( () => menuShowing() ? 'flex' : 'none' ),
            position: 'absolute',
            background: 'white',
            width: '145px',
            height: '140px',
            top: '-20px',
            left: '-20px',
            'padding-top': '45px',
            'font-size': '20px',
            'z-index': -1,
            'box-shadow': `0px 0px 1px 0px ${colors.grey}`,
            'border-radius': '2px',
            'flex-direction': 'column',
            'align-items': 'center',
            'justify-content': 'space-evenly'
        },
        onclick: toggleMenu
    },
    menuItem( '/home', 'Home' ),
    
    menuItem( '/login', 'Log Out', clearAuth )
    
)

const menuItem = ( to, linkText, onclick ) =>
    fnlink(
        {
            to,
            style: {
                'text-decoration': 'none',
                color: 'inherit'
            },
            onmouseenter: ( e ) => {
                e.target.style.color = colors.green
                e.target.style[ 'text-decoration' ] = 'underline'
            },
            onmouseleave: ( e ) => {
                e.target.style.color = 'inherit'
                e.target.style[ 'text-decoration' ] = 'none'
            },
            onclick: e => {
                toggleMenu()
                typeof onclick === 'function' && onclick( e )
            }
        },
        linkText
    )

const toggleMenu = () => menuShowing( !menuShowing() )

const menuIcon = () => div(
    {
        style: {
            cursor: 'pointer'
        },
        onclick: toggleMenu
    },
    bar(),
    bar(),
    bar()
)


const bar = () => div(
    {
        style: {
            width: '33px',
            height: '4px',
            'margin-bottom': '5px',
            'border-radius': '3px',
            position: 'relative',

            background: colors.darkGrey
        }
    }
)

let menuShowing = fnstate( false )

let clickMe = () => div(
    {
        style: {
            display: menuShowing.bindStyle( () => menuShowing() ? 'block' : 'none' ),
            width: '100vw',
            height: '100vh',
            background: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            'z-index': -2
        },
        onclick: toggleMenu
    }
)

export default () => div(
    {
        style: {
            position: 'absolute',
            left: 0,
            'user-select': 'none'
        }
    },
    clickMe,
    menuIcon,
    menu
)
