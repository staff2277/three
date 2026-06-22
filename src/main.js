import * as THREE from "three";
import {
  WebGPURenderer,
  MeshStandardNodeMaterial,
  MeshPhysicalNodeMaterial,
} from "three/webgpu";
import { positionLocal, normalLocal, sin, time } from "three/tsl";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

new RGBELoader().load("/sunny.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = new THREE.Color(0x000000);
  scene.environment = texture;
});

scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

// Create WebGPURenderer (required for TSL nodes)
const renderer = new WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Create geometry - make it non-indexed so faces separate, and compute flat normals
let geometry = new THREE.IcosahedronGeometry(1, 2).toNonIndexed();
geometry.computeVertexNormals();

// Create TSL Node Material
let material = new MeshStandardNodeMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  roughness: 0.4,
  color: 0x000000,
  metalness: 0,
});

// TSL: Move all faces uniformly in sync
const displacementAmount = sin(time.mul(5.0)).mul(0.5).add(0.5); // scaled by 0.2 for better aesthetics

// Move all vertices along their normals. Since they are non-indexed, they separate!
material.positionNode = positionLocal.add(normalLocal.mul(displacementAmount));

// Create mesh
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Create power core
const coreGeometry = new THREE.SphereGeometry(0.7, 32, 16);
const coreColor = new THREE.Color(0xff26ff);
const coreMaterial = new THREE.MeshStandardMaterial({
  color: coreColor,
  emissive: coreColor,
  emissiveIntensity: 10.0,
  roughness: 0.0,
  metalness: 0,
});
const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(coreMesh);

// Add PointLight for the core
const coreLight = new THREE.PointLight(coreColor, 1000, 100);
scene.add(coreLight);

camera.position.z = 4;

// Create lights
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);
/* 
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-10, -10, -5);
scene.add(directionalLight); */

// Animate using renderer.setAnimationLoop
function animate() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  controls.update();
  renderer.renderAsync(scene, camera);
}
renderer.setAnimationLoop(animate);

// On resize window
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
