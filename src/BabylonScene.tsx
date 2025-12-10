import { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

// Usamos el mismo mapa para que veas que son equivalentes
const HEIGHT_MAP: number[][] = [
  [0, 1, 2, 1, 0],
  [1, 2, 3, 2, 1],
  [0, 1, 4, 1, 0],
  [1, 2, 3, 2, 1],
  [0, 1, 2, 1, 0],
];

const SPACING = 0.7;
const HEIGHT_SCALE = 0.4;

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.01, 0.02, 0.07, 1);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 3,
      Math.PI / 3,
      8,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.9;

    // Construir el "wireframe" como un LineSystem
    const rows = HEIGHT_MAP.length;
    const cols = HEIGHT_MAP[0].length;
    const lines: BABYLON.Vector3[][] = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j - cols / 2) * SPACING;
        const z = (i - rows / 2) * SPACING;
        const y = HEIGHT_MAP[i][j] * HEIGHT_SCALE;

        // Horizontal →
        if (j < cols - 1) {
          const x2 = (j + 1 - cols / 2) * SPACING;
          const z2 = z;
          const y2 = HEIGHT_MAP[i][j + 1] * HEIGHT_SCALE;
          lines.push([
            new BABYLON.Vector3(x, y, z),
            new BABYLON.Vector3(x2, y2, z2),
          ]);
        }

        // Vertical ↓
        if (i < rows - 1) {
          const x2 = x;
          const z2 = (i + 1 - rows / 2) * SPACING;
          const y2 = HEIGHT_MAP[i + 1][j] * HEIGHT_SCALE;
          lines.push([
            new BABYLON.Vector3(x, y, z),
            new BABYLON.Vector3(x2, y2, z2),
          ]);
        }
      }
    }

    const lineSystem = BABYLON.MeshBuilder.CreateLineSystem(
      "terrain",
      { lines },
      scene
    );
    lineSystem.color = new BABYLON.Color3(0.06, 0.65, 0.99);

    scene.onBeforeRenderObservable.add(() => {
      const dt = engine.getDeltaTime() / 1000;
      lineSystem.rotation.y += 0.4 * dt;
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-full" />;
};

export default BabylonScene;
