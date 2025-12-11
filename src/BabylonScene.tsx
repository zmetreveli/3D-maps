import { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

const SPACING = 0.7;
const HEIGHT_SCALE = 0.4;

type BabylonSceneProps = {
  heightMap: number[][];
};

const BabylonScene: React.FC<BabylonSceneProps> = ({ heightMap }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new BABYLON.Engine(canvas, true);

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.01, 0.02, 0.07, 1);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 4,
      Math.PI / 3,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    const rows = heightMap.length;
    const cols = heightMap[0].length;

    const lines: BABYLON.Vector3[][] = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j - cols / 2) * SPACING;
        const z = (i - rows / 2) * SPACING;
        const y = heightMap[i][j] * HEIGHT_SCALE;

        if (j < cols - 1) {
          lines.push([
            new BABYLON.Vector3(x, y, z),
            new BABYLON.Vector3(
              (j + 1 - cols / 2) * SPACING,
              heightMap[i][j + 1] * HEIGHT_SCALE,
              z
            ),
          ]);
        }

        if (i < rows - 1) {
          lines.push([
            new BABYLON.Vector3(x, y, z),
            new BABYLON.Vector3(
              x,
              heightMap[i + 1][j] * HEIGHT_SCALE,
              (i + 1 - rows / 2) * SPACING
            ),
          ]);
        }
      }
    }

    const mesh = BABYLON.MeshBuilder.CreateLineSystem(
      "terrain",
      { lines },
      scene
    );
    mesh.color = new BABYLON.Color3(0.06, 0.65, 0.99);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());

    return () => {
      engine.dispose();
      scene.dispose();
    };
  }, [heightMap]);

  return <canvas ref={canvasRef} className="canvas-full" />;
};

export default BabylonScene;
