import React from 'react';

export default function SimpleInput() {
        const [input, setInput] = React.useState('')
        const [items, setItems] = React.useState([])
        const [editingIndex, setEditingIndex] = React.useState(null)

        function handleSubmit(e) {
            e.preventDefault()

            if (!input.trim()) return

            if (editingIndex !== null) {
                // update existing item
                setItems ((prev) => {
                    prev.map((item, i)=> (i === editingIndex ? input : item))
                })
                setEditingIndex(null)
            } else {
                // add new item
                setItems(prev => [...prev, input])
            }

            setInput('')
        }

        function handleEdit(index) {
            setInput(items[index])
            setEditingIndex(index)
        }

        return (
            <>
                <form onSubmit={handleSubmit}>
                    <input value ={input} onChange={e => setInput(e.target.value)} placeholder="Enter the item" />
                    <button type="submit">
                        {editingIndex !== null ? 'Update' : 'Add'}
                    </button>
                </form>

                <ul>  
                    {items.map((item, index) => ( // Do not use index as key in production, this form does not have delete functionality, so it is fine for this demo
                        <li key={index}>
                            {item}
                            <button onClick={() => handleEdit(index)}>
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
            </>
         );
        }
