import { Canvas } from "@react-three/fiber";
import ReactDOM from "react-dom/client";
import { ACESFilmicToneMapping } from "three";
import Experience from "./Experience";
import "./style.css";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <Canvas
    gl={{
      antialias: true,
      toneMapping: ACESFilmicToneMapping,
    }}
    camera={{ fov: 45, near: 0.1, far: 200, position: [3, 2, 6] }}
  >
    <Experience />
  </Canvas>
);
