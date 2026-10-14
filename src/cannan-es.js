import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  1000,
);
camera.position.z = 3;

const world = new CANNON.World();
world.gravity = new CANNON.Vec3(0, -9.28, 0);

const canShape = new CANNON.Vec3(0.5, 0.5, 0.5);
const canBox = new CANNON.Box(canShape);
const canBody = new CANNON.Body({
  mass: 1,
  shape: canBox,
});

canBody.position.y = 5;

world.addBody(canBody);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(1, window.devicePixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.update();

const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: "red" }),
);

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 4),
  new THREE.MeshBasicMaterial(),
);

planeMesh.rotation.x = THREE.MathUtils.degToRad(-90);

scene.add(boxMesh, planeMesh);

renderer.render(scene, camera);

function animate() {
  orbitControls.update();
  world.fixedStep();
  boxMesh.position.copy(canBody.position);
  boxMesh.quaternion.copy(canBody.quaternion);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
