import { useState } from "react";

export default function ToggleCount() {
  const [count, setCount] = useState(0); // inferred as number

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked Count: {count} times
    </button>
  );
}