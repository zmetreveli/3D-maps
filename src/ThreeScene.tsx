import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Mapa de alturas de ejemplo (luego puedes cambiarlo / hacerlo más grande)
const HEIGHT_MAP: number[][] = [
  [0, 1, 2, 1, 0],
  [1, 2, 3, 2, 1],
  [0, 1, 4, 1, 0],
  [1, 2, 3, 2, 1],
  [0, 1, 2, 1, 0],
];

const SPACING = 0.7; // distancia entre puntos en X y Z
const HEIGHT_SCALE = 0.4; // escala de la altura (Y)

// Construye una geometría de lineSegments a partir del mapa (como FDF)
function buildWireGeometry() {
  const rows = HEIGHT_MAP.length;
  const cols = HEIGHT_MAP[0].length;

  const positions: number[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j - cols / 2) * SPACING;
      const z = (i - rows / 2) * SPACING;
      const y = HEIGHT_MAP[i][j] * HEIGHT_SCALE;

      // Segmento horizontal (→) hacia j+1
      if (j < cols - 1) {
        const x2 = (j + 1 - cols / 2) * SPACING;
        const z2 = z;
        const y2 = HEIGHT_MAP[i][j + 1] * HEIGHT_SCALE;

        positions.push(x, y, z, x2, y2, z2);
      }

      // Segmento vertical (↓) hacia i+1
      if (i < rows - 1) {
        const x2 = x;
        const z2 = (i + 1 - rows / 2) * SPACING;
        const y2 = HEIGHT_MAP[i + 1][j] * HEIGHT_SCALE;

        positions.push(x, y, z, x2, y2, z2);
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

const WireTerrain: React.FC = () => {
  const geometry = useMemo(() => buildWireGeometry(), []);
  const lineRef = useRef<THREE.LineSegments | null>(null);

  // Pequeña rotación suave (solo para que se vea vivo)
  useFrame(() => {
    if (!lineRef.current) return;
    lineRef.current.rotation.y += 0.002;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#0ea5e9" linewidth={1} />
    </lineSegments>
  );
};

const ThreeScene: React.FC = () => {
  return (
    <Canvas className="canvas-full" camera={{ position: [4, 4, 6], fov: 50 }}>
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 8, 6]} intensity={1.2} />
      <WireTerrain />
      <OrbitControls enableDamping />
    </Canvas>
  );
};

export default ThreeScene;
