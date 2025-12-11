// ThreeScene.tsx
import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const SPACING = 0.7;

export type ThreeSceneProps = {
  heightMap: number[][];
  autoRotate?: boolean;
  rotationSpeed?: number;
  heightScale?: number;
  backgroundColor?: string;
  fogNear?: number;
  fogFar?: number;
};

type WireTerrainProps = {
  heightMap: number[][];
  autoRotate: boolean;
  rotationSpeed: number;
  heightScale: number;
};

function buildWireGeometry(heightMap: number[][], heightScale: number) {
  const rows = heightMap.length;
  const cols = heightMap[0]?.length ?? 0;

  const positions: number[] = [];
  const colors: number[] = [];

  const color = new THREE.Color();

  // Para normalizar alturas (0..1)
  let minH = Infinity;
  let maxH = -Infinity;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const h = heightMap[i][j];
      if (h < minH) minH = h;
      if (h > maxH) maxH = h;
    }
  }
  const range = maxH - minH || 1;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j - cols / 2) * SPACING;
      const z = (i - rows / 2) * SPACING;
      const y = heightMap[i][j] * heightScale;

      // Altura normalizada 0..1
      const hNorm = (heightMap[i][j] - minH) / range;
      // Gradiente azul → verde → amarillo
      color.setHSL(0.55 - hNorm * 0.25, 1, 0.55);

      // Horizontal →
      if (j < cols - 1) {
        const x2 = (j + 1 - cols / 2) * SPACING;
        const y2 = heightMap[i][j + 1] * heightScale;

        positions.push(x, y, z, x2, y2, z);
        // un color por vértice (2 vértices = 2 colores)
        colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
      }

      // Vertical ↓
      if (i < rows - 1) {
        const z2 = (i + 1 - rows / 2) * SPACING;
        const y2 = heightMap[i + 1][j] * heightScale;

        positions.push(x, y, z, x, y2, z2);
        colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  return geometry;
}

// 🔹 Vive dentro del <Canvas>
const WireTerrain: React.FC<WireTerrainProps> = ({
  heightMap,
  autoRotate,
  rotationSpeed,
  heightScale,
}) => {
  const geom = useMemo(
    () => buildWireGeometry(heightMap, heightScale),
    [heightMap, heightScale]
  );

  const lineRef = useRef<THREE.LineSegments | null>(null);

  // Liberar geometría al desmontar
  useEffect(() => {
    return () => {
      geom.dispose();
    };
  }, [geom]);

  useFrame(() => {
    if (!lineRef.current || !autoRotate) return;
    lineRef.current.rotation.y += rotationSpeed;
  });

  return (
    <lineSegments ref={lineRef} geometry={geom}>
      <lineBasicMaterial vertexColors linewidth={1} />
    </lineSegments>
  );
};

// 🔹 Crea el Canvas y la escena 3D
const ThreeScene: React.FC<ThreeSceneProps> = ({
  heightMap,
  autoRotate = true,
  rotationSpeed = 0.0025,
  heightScale = 0.4,
  backgroundColor = "#020617",
  fogNear = 5,
  fogFar = 25,
}) => {
  return (
    <Canvas
      className="canvas-full"
      camera={{ position: [4, 4, 7], fov: 45, near: 0.1, far: 100 }}
    >
      {/* Fondo + niebla */}
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[backgroundColor, fogNear, fogFar]} />

      {/* Luces */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 8, 6]} intensity={1.1} />
      <directionalLight position={[-3, 6, -4]} intensity={0.6} />

      {/* Terreno */}
      <WireTerrain
        heightMap={heightMap}
        autoRotate={autoRotate}
        rotationSpeed={rotationSpeed}
        heightScale={heightScale}
      />

      {/* Cámara interactiva */}
      <OrbitControls enableDamping />
    </Canvas>
  );
};

export default ThreeScene;
