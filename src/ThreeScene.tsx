import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const SPACING = 0.7;
const HEIGHT_SCALE = 0.4;

type ThreeSceneProps = {
  heightMap: number[][];
};

type WireTerrainProps = {
  heightMap: number[][];
};

function buildWireGeometry(heightMap: number[][]) {
  const rows = heightMap.length;
  const cols = heightMap[0]?.length ?? 0;

  const positions: number[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j - cols / 2) * SPACING;
      const z = (i - rows / 2) * SPACING;
      const y = heightMap[i][j] * HEIGHT_SCALE;

      // Horizontal →
      if (j < cols - 1) {
        const x2 = (j + 1 - cols / 2) * SPACING;
        const y2 = heightMap[i][j + 1] * HEIGHT_SCALE;
        positions.push(x, y, z, x2, y2, z);
      }

      // Vertical ↓
      if (i < rows - 1) {
        const z2 = (i + 1 - rows / 2) * SPACING;
        const y2 = heightMap[i + 1][j] * HEIGHT_SCALE;
        positions.push(x, y, z, x, y2, z2);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  return geometry;
}

// 🔹 ESTE componente vive *dentro* del <Canvas> y aquí sí usamos useFrame
const WireTerrain: React.FC<WireTerrainProps> = ({ heightMap }) => {
  const geom = useMemo(() => buildWireGeometry(heightMap), [heightMap]);
  const lineRef = useRef<THREE.LineSegments | null>(null);

  // Rotación suave
  useFrame(() => {
    if (!lineRef.current) return;
    lineRef.current.rotation.y += 0.0025;
  });

  return (
    <lineSegments ref={lineRef} geometry={geom}>
      <lineBasicMaterial color="#0ea5e9" />
    </lineSegments>
  );
};

// 🔹 Este componente solo crea el Canvas y mete WireTerrain dentro
const ThreeScene: React.FC<ThreeSceneProps> = ({ heightMap }) => {
  return (
    <Canvas className="canvas-full" camera={{ position: [4, 4, 7], fov: 45 }}>
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 8, 6]} intensity={1.2} />

      <WireTerrain heightMap={heightMap} />

      <OrbitControls enableDamping />
    </Canvas>
  );
};

export default ThreeScene;
