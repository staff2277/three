import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();

//Sizes
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const sizes = {
  windowWidth,
  windowHeight,
  aspectRatio: windowWidth / windowHeight,
};

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 1, 200);
camera.position.z = 3;

//Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "yellow" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.windowWidth, sizes.windowHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Controls
//const orbitControls = new OrbitControls(camera, renderer.domElement);

const mouse = {
  x: 0,
  y: 0,
};
//Events
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.windowWidth) * 2 - 1;
  mouse.y = (e.clientY / sizes.windowHeight) * -2 + 1;
});

const targetPosition = new THREE.Vector3();
function animate() {
  requestAnimationFrame(animate);
  targetPosition.set(mouse.x * 3, mouse.y * 3, camera.position.z);
  camera.position.lerp(targetPosition, 0.05);
  camera.lookAt(mesh.position);
  camera.updateProjectionMatrix();
  // orbitControls.update();

  renderer.render(scene, camera);
}
animate();

renderer.render(scene, camera);
const canvas = document.body.appendChild(renderer.domElement);
