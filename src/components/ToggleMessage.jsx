import React from 'react';

export default function ToggleMessage() {
    const [visible, setVisible] = React.useState(false)

    function clickEventHandler() {
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
