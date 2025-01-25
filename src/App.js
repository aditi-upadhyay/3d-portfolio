import React, { useState } from "react";
import "./App.css";
import ThreeHome from "./components/Model/ThreeHome";

function App() {
  const [isSlidingUp, setIsSlidingUp] = useState(false); // State for slide-up animation

  const setComponentVisible = () => {
    setIsSlidingUp(true); // Start the slide-up animation
  };

  return (
    <div className="App">
      {isSlidingUp && <ThreeHome />}
      <div className={`loader ${isSlidingUp ? "hidden" : ""}`}>
        <button onClick={setComponentVisible}>Enter</button>
      </div>
    </div>
  );
}

export default App;
