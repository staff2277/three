import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  200,
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const canvas = document.body.appendChild(renderer.domElement);

const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: "yellow" }),
);
box1.position.set(-3, 2, 0);

const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: "blue" }),
);
box2.position.set(0, 0, 0);
const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: "green" }),
);
box3.position.set(3, -2, 0);

scene.add(box1, box2, box3);

renderer.render(scene, camera);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
//animate()
