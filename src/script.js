import gsap from "gsap";
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
mesh.rotation.x = Math.PI * 0.25;
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  100
);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const tick = () => {
  // Render
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  //   camera.position.y = cursor.y * 3;
  //   camera.lookAt(mesh.position);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

const gui = new GUI({ width: 300, title: "Nice debug UI" });
gui.hide();
window.addEventListener("keydown", (event) => {
  if (event.key == "h") gui.show(gui._hidden);
});
const cubeTweaks = gui.addFolder("Awesome cube");

cubeTweaks.add(mesh.position, "y", -3, 3, 0.01).name("elevation");
const myObject = {
  myVariable: 1337,
};
cubeTweaks.add(myObject, "myVariable");
cubeTweaks.add(mesh, "visible");
cubeTweaks.add(material, "wireframe");
const debugObject = {};
debugObject.color = "#3a6ea6";
cubeTweaks.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});
debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};
debugObject.subdivision = 2;
cubeTweaks
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });
gui.add(debugObject, "spin");
