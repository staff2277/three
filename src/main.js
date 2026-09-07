import * as THREE from "three";

//SCENE
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const scene = new THREE.Scene();

//MESH

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

//CAMERA

const camera = new THREE.PerspectiveCamera(
  75,
  windowWidth / windowHeight,
  1,
  1000,
);

camera.position.z = 3;

//RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(windowWidth, windowHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(windowWidth, windowHeight);
});

//ANIMATION
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
