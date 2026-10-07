import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const canvas = document.body.appendChild(renderer.domElement);

/*
 *
 *Lighting
 *
 */
const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
const directionalLight = new THREE.DirectionalLight();

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 3);

const axesHelper = new THREE.AxesHelper(10);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const particleGeometry = new THREE.BufferGeometry();
const vertArray = [];
const vertcolor = [];
const vertCount = 100;

const colorInside = new THREE.Color("#ff6030");
const colorOutside = new THREE.Color("#1b3984");

for (let i = 0; i < vertCount; i++) {
  const radius = i * 0.2;
  const angle = i * 0.2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  vertArray.push(x, 0, z);

  const radiusRatio = Math.min(radius / ((vertCount - 1) * 0.2), 1);
  const mixedColor = colorInside.clone().lerp(colorOutside, radiusRatio);
  vertcolor.push(mixedColor.r, mixedColor.g, mixedColor.b);
}

const particleVerts = new Float32Array(vertArray);
const particleColor = new Float32Array(vertcolor);
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(particleVerts, 3),
);
particleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(particleColor, 3),
);

const particleMaterial = new THREE.PointsMaterial();
particleMaterial.vertexColors = true;
particleMaterial.size = 0.001;
const curveCount = 3;

const particleGroup = new THREE.Group();
for (let i = 1; i <= curveCount; i++) {
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.rotation.y = THREE.MathUtils.degToRad(i * (360 / curveCount));
  particleGroup.add(particles);
}

const groupCount = 100;
const galaxy = new THREE.Group();

for (let i = 0; i < groupCount; i++) {
  const group = particleGroup.clone();
  group.rotation.x = Math.random() * i * 0.01;
  group.rotation.y = Math.random() * i * 0.01;
  group.rotation.z = Math.random() * i * 0.01;

  galaxy.add(group);
}

for (let i = 0; i < 10; i++) {
  const group = galaxy.clone();

  scene.add(group);
}

console.log(galaxy);

/*
 *
 *Scene Objects
 *
 */

scene.add(ambientlight, directionalLight, axesHelper);

/*
 *
 *Renderer
 *
 */
function animate(time) {
  requestAnimationFrame(animate);
  const elapsedTime = time * 0.001;
  orbitControls.update();
  renderer.render(scene, camera);
}
animate();
