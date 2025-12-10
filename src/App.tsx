import { useState } from "react";
import ThreeScene from "./ThreeScene";
import BabylonScene from "./BabylonScene";

const App: React.FC = () => {
  const [engine, setEngine] = useState<"three" | "babylon">("three");

  return (
    <div className="app-root">
      <header className="top-bar">
        <div className="logo">3D Playground</div>
        <div className="tabs">
          <button
            className={engine === "three" ? "tab active" : "tab"}
            onClick={() => setEngine("three")}
          >
            Three.js
          </button>
          <button
            className={engine === "babylon" ? "tab active" : "tab"}
            onClick={() => setEngine("babylon")}
          >
            Babylon.js
          </button>
        </div>
      </header>

      <main className="content">
        {engine === "three" ? <ThreeScene /> : <BabylonScene />}
      </main>
    </div>
  );
};

export default App;
