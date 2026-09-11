import * as THREE from "three";

const scene = new THREE.Scene();

const sizes = {
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
};
let aspectRatio = sizes.windowWidth / sizes.windowHeight;

//Camera
//const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 200);
const camera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  1,
  200,
);
camera.position.z = 5;

//Mesh
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: "green" });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.windowWidth, sizes.windowHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
window.addEventListener("resize", () => {
  sizes.windowWidth = window.innerWidth;
  sizes.windowHeight = window.innerHeight;
  aspectRatio = sizes.windowWidth / sizes.windowHeight;
  /* camera.aspect = sizes.windowWidth / sizes.windowHeight; */
  camera.left = -1 * aspectRatio;
  camera.right = 1 * aspectRatio;
  camera.top = 1;
  camera.bottom = -1;

  camera.updateProjectionMatrix();
  renderer.setSize(sizes.windowWidth, sizes.windowHeight);
  renderer.render(scene, camera);
});

document.body.appendChild(renderer.domElement);
