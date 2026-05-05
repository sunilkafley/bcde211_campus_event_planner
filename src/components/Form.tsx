import React from "react";

export default function SimpleInput() {
  const [input, setInput] = React.useState<string>("");
  const [items, setItems] = React.useState<string[]>([]);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim()) return;

    if (editingIndex !== null) {
      //  update existing item
      setItems((prev) =>
        prev.map((item, i) => (i === editingIndex ? input : item))
      );
      setEditingIndex(null);
    } else {
      //  add new item
      setItems((prev) => [...prev, input]);
    }

    setInput("");
  }

  function handleEdit(index: number) {
    setInput(items[index]);
    setEditingIndex(index);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter the item"
        />
        <button type="submit">
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </form>

      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => handleEdit(index)}>Edit</button>
          </li>
        ))}
      </ul>
    </>
  );
}