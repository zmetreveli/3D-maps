import { useState, useEffect } from "react";
import ThreeScene from "./ThreeScene";
import BabylonScene from "./BabylonScene";
import { parseHeightMap } from "./utils/parseHeightMap";

// Mapa por defecto por si falla el fetch o mientras carga
const DEFAULT_MAP: number[][] = [
  [0, 1, 2, 1, 0],
  [1, 2, 3, 2, 1],
  [0, 1, 4, 1, 0],
  [1, 2, 3, 2, 1],
  [0, 1, 2, 1, 0],
];

const App: React.FC = () => {
  const [engine, setEngine] = useState<"three" | "babylon">("three");
  const [heightMap, setHeightMap] = useState<number[][]>(DEFAULT_MAP);

  useEffect(() => {
    // importante: el archivo debe estar en public/maps/...
    fetch("/maps/MGDS_HIMALAYA_OCEAN1_XXL.fdf")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        const map = parseHeightMap(text);
        setHeightMap(map);
      })
      .catch((err) => {
        console.error("Error loading height map:", err);
        // si falla, se queda con DEFAULT_MAP
      });
  }, []);

  return (
    <div className="app-root">
      <header className="top-bar">
        <div className="logo">3D FDF Playground</div>
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
        {engine === "three" ? (
          <ThreeScene heightMap={heightMap} />
        ) : (
          <BabylonScene heightMap={heightMap} />
        )}
      </main>
    </div>
  );
};

export default App;
