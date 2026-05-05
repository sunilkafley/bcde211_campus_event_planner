import React from 'react'
import { type JSX } from "react/jsx-runtime"

export default function ToggleMessage(): JSX.Element {
    const [visible, setVisible] = React.useState(false)

    function clickEventHandler(): void {
        setVisible(v => !v)
    }   

    return (
        <>
            <button onClick={clickEventHandler}>
                {visible ? 'Hi' : 'Bye'} The message
            </button>

            {visible && <p>This is the message</p>}
        </>
    )
}     
