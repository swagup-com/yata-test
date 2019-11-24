import React, { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>+</button>
      <p>{count}</p>
      <button onClick={() => setCount(count - 1)}>-</button>
    </>
  );
};

export default App;
