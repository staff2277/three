import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const sizes = {
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
};
let aspectRatio = sizes.windowWidth / sizes.windowHeight;

//Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 200);
camera.position.z = 3;
/* const camera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  1,
  200,
); */
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (move) => {
  cursor.x = (move.clientX / window.innerWidth) * 2 - 1;
  cursor.y = (move.clientY / window.innerHeight) * -2 + 1;
});

//Mesh
/* const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: "green" });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh); */

//BufferGeometry
const geometry = new THREE.BufferGeometry();
const vertexPositions = new Float32Array([
  0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
]);
geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(vertexPositions, 3),
);
const material = new THREE.MeshBasicMaterial({
  color: "yellow",
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.windowWidth, sizes.windowHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const controls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

function animate(timeStamp) {
  requestAnimationFrame(animate);
  controls.update();
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}
animate();

//Events
window.addEventListener("resize", () => {
  sizes.windowWidth = window.innerWidth;
  sizes.windowHeight = window.innerHeight;
  aspectRatio = sizes.windowWidth / sizes.windowHeight;
  camera.aspect = sizes.windowWidth / sizes.windowHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.windowWidth, sizes.windowHeight);
});
let canvas = renderer.domElement;
window.addEventListener("dblclick", () => {
  if (document.fullscreenElement === canvas) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

document.body.appendChild(renderer.domElement);
