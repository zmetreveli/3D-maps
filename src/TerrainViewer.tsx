// TerrainViewer.tsx
import React, { useState } from "react";
import ThreeScene from "./ThreeScene";

// Ejemplo simple de heightMap (cámbialo por el tuyo real)
const SAMPLE_HEIGHTMAP: number[][] = [
  [0, 0.2, 0.4, 0.2, 0],
  [0.2, 0.5, 0.8, 0.5, 0.2],
  [0.4, 0.8, 1.0, 0.8, 0.4],
  [0.2, 0.5, 0.8, 0.5, 0.2],
  [0, 0.2, 0.4, 0.2, 0],
];

type PresetKey = "island" | "valley" | "ridge";

const PRESETS: Record<PresetKey, number[][]> = {
  island: SAMPLE_HEIGHTMAP,
  valley: [
    [1, 0.8, 0.6, 0.8, 1],
    [0.8, 0.5, 0.3, 0.5, 0.8],
    [0.6, 0.3, 0, 0.3, 0.6],
    [0.8, 0.5, 0.3, 0.5, 0.8],
    [1, 0.8, 0.6, 0.8, 1],
  ],
  ridge: [
    [0, 0.2, 0.6, 0.2, 0],
    [0, 0.3, 0.8, 0.3, 0],
    [0, 0.4, 1.0, 0.4, 0],
    [0, 0.3, 0.8, 0.3, 0],
    [0, 0.2, 0.6, 0.2, 0],
  ],
};

const TerrainViewer: React.FC = () => {
  const [preset, setPreset] = useState<PresetKey>("island");
  const [heightScale, setHeightScale] = useState(0.4);
  const [rotationSpeed, setRotationSpeed] = useState(0.0025);
  const [autoRotate, setAutoRotate] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#020617");
  const [fogNear, setFogNear] = useState(5);
  const [fogFar, setFogFar] = useState(25);

  const currentHeightMap = PRESETS[preset];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 320px) 1fr",
        height: "100vh",
        background: "#020617",
        color: "white",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Panel lateral de controles */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRight: "1px solid rgba(148, 163, 184, 0.4)",
          background:
            "radial-gradient(circle at top, rgba(56,189,248,0.1), transparent 60%)",
        }}
      >
        <h1
          style={{
            fontSize: "1.3rem",
            fontWeight: 600,
            marginBottom: "0.75rem",
          }}
        >
          3D Terrain Viewer
        </h1>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            marginBottom: "1.25rem",
          }}
        >
          Interactive wireframe terrain generated from a heightmap. Controls on
          the left, 3D scene on the right.
        </p>

        {/* Presets */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "0.8rem", color: "#cbd5f5" }}>
            Terrain preset
          </label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as PresetKey)}
            style={{
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.35rem 0.5rem",
              background: "#020617",
              color: "white",
              borderRadius: "0.5rem",
              border: "1px solid #1f2937",
              fontSize: "0.85rem",
            }}
          >
            <option value="island">Island</option>
            <option value="valley">Valley</option>
            <option value="ridge">Ridge</option>
          </select>
        </div>

        {/* Height scale */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "0.8rem", color: "#cbd5f5" }}>
            Height scale: {heightScale.toFixed(2)}
          </label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={heightScale}
            onChange={(e) => setHeightScale(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        {/* Rotation speed */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "0.8rem", color: "#cbd5f5" }}>
            Rotation speed: {rotationSpeed.toFixed(4)}
          </label>
          <input
            type="range"
            min={0}
            max={0.01}
            step={0.0005}
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: "0.35rem", fontSize: "0.8rem" }}>
            <label>
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                style={{ marginRight: "0.35rem" }}
              />
              Auto rotate
            </label>
          </div>
        </div>

        {/* Fog controls */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "0.8rem", color: "#cbd5f5" }}>
            Fog near: {fogNear.toFixed(0)}
          </label>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={fogNear}
            onChange={(e) => setFogNear(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.8rem", color: "#cbd5f5" }}>
            Fog far: {fogFar.toFixed(0)}
          </label>
          <input
            type="range"
            min={fogNear + 5}
            max={60}
            step={1}
            value={fogFar}
            onChange={(e) => setFogFar(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        {/* Background color */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{ fontSize: "0.8rem", color: "#cbd5f5", display: "block" }}
          >
            Background color
          </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={{
              marginTop: "0.35rem",
              width: "3rem",
              height: "2rem",
              padding: 0,
              borderRadius: "0.5rem",
              border: "1px solid #1f2937",
              background: "transparent",
            }}
          />
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={() => {
            setPreset("island");
            setHeightScale(0.4);
            setRotationSpeed(0.0025);
            setAutoRotate(true);
            setBackgroundColor("#020617");
            setFogNear(5);
            setFogFar(25);
          }}
          style={{
            marginTop: "0.5rem",
            width: "100%",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.75rem",
            border: "1px solid #38bdf8",
            background:
              "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(8,47,73,0.8))",
            color: "white",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Reset view
        </button>
      </div>

      {/* Canvas 3D */}
      <div style={{ position: "relative" }}>
        <ThreeScene
          heightMap={currentHeightMap}
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          heightScale={heightScale}
          backgroundColor={backgroundColor}
          fogNear={fogNear}
          fogFar={fogFar}
        />
      </div>
    </div>
  );
};

export default TerrainViewer;
