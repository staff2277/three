import "./style.css";
import * as THREE from "three";

/**
 * Debug
 */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
let meshDistance = 6;
const material = new THREE.MeshNormalMaterial();

const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
torus.position.x = 3;

const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
cone.position.x = -3;
cone.position.y = -meshDistance * 1;

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material,
);
torusKnot.position.x = 3;
torusKnot.position.y = -meshDistance * 2;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const deviceHeight = 0;

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  deviceHeight = (sizes.height / sizes.height) * 8;
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
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 11;

scene.add(camera, torus, cone, torusKnot);

const meshes = [torus, cone, torusKnot];

/* meshes.map((mesh) => {
  mesh.position.y *= meshDistance;
  console.log(mesh);

  scene.add(mesh);
});
 */
const scroll = {};
scroll.y = window.scrollY;

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  scroll.y = (-y / sizes.height) * meshDistance;
  console.log(scroll);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  camera.position.y = scroll.y;
  // Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);

  // Call tick again on the next frame
};

tick();
