import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);
});

const rgbeLoader = new RGBELoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
// HDR (RGBE) equirectangular
// rgbeLoader.load("/environmentMaps/Background.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });
// const exrLoader = new EXRLoader();
// exrLoader.load("/environmentMaps/nvidiaCanvas-4k.exr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });

const textureLoader = new THREE.TextureLoader();
// const environmentMap = textureLoader.load(
//   "/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg"
// );
// environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// environmentMap.colorSpace = THREE.SRGBColorSpace;
// scene.background = environmentMap;
// scene.environment = environmentMap;
// scene.environmentIntensity = 4;
// rgbeLoader.load("/environmentMaps/2/2k.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = environmentMap;

//   // Skybox
//   const skybox = new GroundedSkybox(environmentMap, 15, 70);
//   //   skybox.material.wireframe = true;
//   skybox.position.y = 15;
//   scene.add(skybox);
// });
// scene.environmentIntensity = 1;

/**
 * Real time environment map
 */
// Base environment map
const environmentMap = textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg"
);
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;

scene.background = environmentMap;
// Holy donut
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    color: 0xaaaaaa,
  })
);
holyDonut.layers.enable(1);
holyDonut.position.y = 3.5;
scene.add(holyDonut);

// Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.FloatType,
});
scene.environment = cubeRenderTarget.texture;

// Cube camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);

/**
 * Environment map
 */
// LDR cube texture
// const environmentMap = cubeTextureLoader.load([
//   "/environmentMaps/0/px.png",
//   "/environmentMaps/0/nx.png",
//   "/environmentMaps/0/py.png",
//   "/environmentMaps/0/ny.png",
//   "/environmentMaps/0/pz.png",
//   "/environmentMaps/0/nz.png",
// ]);
// scene.background = environmentMap;
// scene.environment = environmentMap;

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: 0xaaaaaa,
  })
);
torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

// scene.background = environmentMap;
scene.environmentIntensity = 1;
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;

gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Real time environment map
  if (holyDonut) {
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2;
    cubeCamera.update(renderer, scene);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
