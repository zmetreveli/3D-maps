import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Mapa de alturas de ejemplo (luego puedes cambiarlo / hacerlo más grande)
const HEIGHT_MAP: number[][] = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 10, 10, 10, 10, 10, 0],
  [0, 0, 0, 0, 10, 0, 0],
  [0, 0, 0, 10, 0, 0, 0],
  [0, 0, 10, 0, 0, 0, 0],
  [0, 10, 10, 10, 10, 10, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const SPACING = 0.7; // distancia entre puntos en X y Z
const HEIGHT_SCALE = 0.124; // escala de la altura (Y)

// Colores para el degradado (HEX a THREE.Color)
const COLOR_START = new THREE.Color("#0ea5e9"); // Azul claro
const COLOR_END = new THREE.Color("#1e40af"); // Azul oscuro

// Construye una geometría de lineSegments a partir del mapa (como FDF)
function buildWireGeometry() {
  const rows = HEIGHT_MAP.length;
  const cols = HEIGHT_MAP[0].length;

  const positions: number[] = [];
  const colors: number[] = []; // Array para almacenar los colores de los vértices
  const tempColor = new THREE.Color();

  // Función auxiliar para calcular el color basado en la altura normalizada
  const getColorForHeight = (heightValue: number) => {
    // Normalizamos la altura: asumiendo que el rango de altura es de 0 a 10
    const normalizedHeight = heightValue / 10;
    // Interpola el color entre COLOR_START y COLOR_END
    tempColor.lerpColors(COLOR_START, COLOR_END, normalizedHeight);
    return [tempColor.r, tempColor.g, tempColor.b];
  };

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j - cols / 2) * SPACING;
      const z = (i - rows / 2) * SPACING;
      const y = HEIGHT_MAP[i][j] * HEIGHT_SCALE;
      const currentColor = getColorForHeight(HEIGHT_MAP[i][j]);

      // Segmento horizontal (→) hacia j+1
      if (j < cols - 1) {
        const x2 = (j + 1 - cols / 2) * SPACING;
        const z2 = z;
        const y2 = HEIGHT_MAP[i][j + 1] * HEIGHT_SCALE;
        const nextColor = getColorForHeight(HEIGHT_MAP[i][j + 1]);

        positions.push(x, y, z, x2, y2, z2);
        // Empuja el color del punto de inicio y del punto final
        colors.push(...currentColor, ...nextColor);
      }

      // Segmento vertical (↓) hacia i+1
      if (i < rows - 1) {
        const x2 = x;
        const z2 = (i + 1 - rows / 2) * SPACING;
        const y2 = HEIGHT_MAP[i + 1][j] * HEIGHT_SCALE;
        const nextColor = getColorForHeight(HEIGHT_MAP[i + 1][j]);

        positions.push(x, y, z, x2, y2, z2);
        // Empuja el color del punto de inicio y del punto final
        colors.push(...currentColor, ...nextColor);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  // Añade el nuevo atributo 'color' a la geometría
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

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
      <lineBasicMaterial
        // ¡Importante! Elimina el color fijo y activa vertexColors
        // color="#0ea5e9"
        linewidth={1}
        vertexColors={true} // Usa los colores definidos en la geometría
      />
    </lineSegments>
  );
};

const ThreeScene: React.FC = () => {
  return (
    // Se ha ajustado el fondo a un color oscuro para que contraste mejor el degradado
    <Canvas className="canvas-full" camera={{ position: [4, 4, 6], fov: 50 }}>
      <color attach="background" args={["#0f172a"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 8, 6]} intensity={1.2} />
      <WireTerrain />
      <OrbitControls enableDamping />
    </Canvas>
  );
};

export default ThreeScene;
