import * as THREE from "three";

const scene = new THREE.Scene();

const sizes = {
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  aspectRatio: windowWidth / windowHeight,
};

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 1, 200);
camera.position.z = 3;

//Mesh
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: "green" });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.windowWidth, sizes.windowHeight);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
