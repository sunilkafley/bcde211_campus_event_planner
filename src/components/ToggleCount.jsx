import React from 'react';

export default function ToggleCount() {
    const [count, setCount] = React.useState(0)

    function handleClick() {
        setCount(c => c + 1)
    }

    return (
        <>
            <button onClick={handleClick}>
                Clicked Count: {count} times
            </button>
        </>
    )
}     
