import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three/webgpu";
import { time, positionLocal, vec3, sin } from "three/tsl";

const width = window.innerWidth;
const height = window.innerHeight;

/* Camera and Orbit Controls */

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGPURenderer();
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

camera.position.z = 5;

/* Box */

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshStandardNodeMaterial({
  color: 0x00ff00,
  roughness: 0.7,
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

/* Cylinder */

const cylinderGeometry = new THREE.CylinderGeometry(0.7, 0.7, 1.5, 32);
const cylinderMaterial = new THREE.MeshStandardNodeMaterial({
  color: 0xff3333,
  roughness: 0.4,
});

const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.rotation.x = THREE.MathUtils.degToRad(90);
cylinder.position.z = 0.5;

/* knob */
const knobGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
const knobMaterial = new THREE.MeshStandardNodeMaterial({
  color: 0xf0f000,
});
const knob = new THREE.Mesh(knobGeometry, knobMaterial);
knob.rotation.x = THREE.MathUtils.degToRad(90);
knob.position.set(0.6, 0.6, 1.1);

/* speaker */
const speaker = new THREE.Group();
speaker.add(box);
speaker.add(cylinder);
speaker.add(knob);
scene.add(speaker);

/* Lighting */

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 8, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

/* tsl */
const pulse = sin(time.mul(10)).mul(0.2).add(1);

const localPosition = positionLocal;

const displacePosition = vec3(
  localPosition.x.mul(pulse),
  localPosition.y.mul(pulse),
  localPosition.z,
);

cylinderMaterial.positionNode = displacePosition;

renderer.setAnimationLoop(animate);
renderer.setSize(width, height);
const clock = new THREE.Clock();
document.body.appendChild(renderer.domElement);

function animate() {
  orbitControls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
