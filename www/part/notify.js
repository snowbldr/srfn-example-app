import { div, flexCenteredCol } from '/lib/fnelements.mjs'

export default ( message, notifyTime = 5000 ) => {
    let notification = flexCenteredCol(
        {
            style: {
                position: 'fixed',
                bottom: '20px',
                right: 0,
                left: 0,
                margin: 'auto',
                width: '30vw',
                padding: '10px',
                'min-width': '300px',
                background: 'white',
                border: `solid 1px grey`,
                'text-align': 'center',
                'justify-content': 'center',
                'font-size': '20px',
                'z-index': 10000,
                'border-radius': '8px'
            }
        },
        message,
        div(
            {
                style: {
                    position: 'absolute',
                    top: 0,
                    right: '8px',
                    cursor:'pointer',
                    'font-size': '18px'
                },
                onclick: () => notification.remove()
            },
            'x'
        )
    )

    document.body.append( notification )
    notification.animate(
        [
            { offset: 0, opacity: 1 },
            { offset: 0.8, opacity: 1 },
            { opacity: 0 }
        ],
        notifyTime
    )

    notification.style.opacity = '0'
    setTimeout( () => notification.remove(), notifyTime )
}
