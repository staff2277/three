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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const canvas = document.body.appendChild(renderer.domElement);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }),
);

plane.rotation.x = THREE.MathUtils.degToRad(-90);
plane.receiveShadow = true;

/* const particleKnot = new THREE.Points(
  new THREE.TorusKnotGeometry(),
  new THREE.PointsMaterial(),
);

particleKnot.position.y = 1.8;
particleKnot.castShadow = true;
particleKnot.material.size = 0.05;
particleKnot.material.sizeAttenuation = true
 */

const count = 100;
const arr = [];
const arrCol = [];
for (let i = 0; i <= count; i++) {
  let x = i;
  let y = 0;
  const z = i;
  for (let j = 0; j <= count; j++) {
    y = j;
    arr.push(
      (x * 2 - count) * Math.random(),
      (y * 2 - count) * Math.random(),
      (z * 2 - count) * Math.random(),
    );
    arrCol.push(0.5 * Math.random(), Math.random(), Math.random());
  }
}

const pointVerts = new Float32Array(arr);
const colVerts = new Float32Array(arrCol);

const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(pointVerts, 3),
);
pointGeometry.setAttribute("color", new THREE.BufferAttribute(colVerts, 3));

const pointMaterial = new THREE.PointsMaterial();
pointMaterial.size = 0.05;
pointMaterial.vertexColors = true;
console.log();

const particles = new THREE.Points(pointGeometry, pointMaterial);
/*
 *
 *Lighting
 *
 */
const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
const directionalLight = new THREE.DirectionalLight();
directionalLight.position.y = 5;
directionalLight.position.x = 3;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.far = 8;
directionalLight.shadow.radius = 1;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 3);
const dLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera,
);
const axesHelper = new THREE.AxesHelper(10);

const orbitControls = new OrbitControls(camera, renderer.domElement);
/*
 *
 *Scene Objects
 *
 */

scene.add(
  plane,
  // particleKnot,
  ambientlight,
  directionalLight,
  particles,
  axesHelper,
  //dLightHelper,
  //dLightCameraHelper,
);

/*
 *
 *Renderer
 *
 */

function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
}
animate();
