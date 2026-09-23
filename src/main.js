import * as THREE from "three";
import {
  FontLoader,
  TTFLoader,
  OrbitControls,
  TextGeometry,
  Font,
} from "three/examples/jsm/Addons.js";
import { bufferAttribute } from "three/tsl";
import { Mesh, MeshNormalMaterial } from "three/webgpu";

const scene = new THREE.Scene();
const timer = new THREE.Timer();
//Sizes
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const sizes = {
  windowWidth,
  windowHeight,
  aspectRatio: windowWidth / windowHeight,
};

//renderer
const renderer = new THREE.WebGLRenderer();
const canvas = document.body.appendChild(renderer.domElement);
renderer.setSize(sizes.windowWidth, sizes.windowHeight);

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 200);
camera.position.z = 5;

const orbitControls = new OrbitControls(camera, canvas);

//Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(2, 2, 2);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

//Helpers
const axesHelper = new THREE.AxesHelper();

//Text
const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();
const fontData = await ttfLoader.loadAsync("/font/jRobot.ttf");
const jRobotFont = new Font(fontData);
const textGeometry = new TextGeometry("TryTwo", {
  font: jRobotFont,
  size: 2,
  depth: 1,
  curveSegments: 1,
});
const normalMaterial = new MeshNormalMaterial();
const textMesh = new THREE.Mesh(textGeometry, normalMaterial);
textMesh.position.x = -6.8;

//Instanced Meshes
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const count = 30;
const boxInstance = new THREE.InstancedMesh(boxGeometry, normalMaterial, count);

const boxObject = new THREE.Object3D();
for (let i = 0; i < count; i++) {
  boxObject.position.x = (Math.random() - 0.5) * 30;
  boxObject.position.y = (Math.random() - 0.5) * 30;
  boxObject.position.z = (Math.random() - 0.5) * 30;

  boxObject.rotation.x = THREE.MathUtils.degToRad((Math.random() - 0.5) * 360);
  boxObject.rotation.y = THREE.MathUtils.degToRad((Math.random() - 0.5) * 360);
  boxObject.rotation.z = THREE.MathUtils.degToRad((Math.random() - 0.5) * 360);

  boxObject.updateMatrix();

  boxInstance.setMatrixAt(i, boxObject.matrix);
}

const torusGeometry = new THREE.TorusGeometry();
const torusInstance = new THREE.InstancedMesh(
  torusGeometry,
  normalMaterial,
  20,
);
const torusObject = new THREE.Object3D();
for (let i = 0; i < count; i++) {
  torusObject.position.x = (Math.random() - 0.5) * count;
  torusObject.position.y = (Math.random() - 0.5) * count;
  torusObject.position.z = (Math.random() - 0.5) * count;

  torusObject.rotation.x = THREE.MathUtils.degToRad(
    (Math.random() - 0.5) * 360,
  );
  torusObject.rotation.y = THREE.MathUtils.degToRad(
    (Math.random() - 0.5) * 360,
  );
  torusObject.rotation.z = THREE.MathUtils.degToRad(
    (Math.random() - 0.5) * 360,
  );

  torusObject.updateMatrix();

  torusInstance.setMatrixAt(i, torusObject.matrix);
}

//Objects in scene
scene.add(
  directionalLight,
  ambientLight,
  textMesh,
  axesHelper,
  boxInstance,
  torusInstance,
);

//Mouse
const mouse = {
  x: 0,
  y: 0,
};

//Events
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
});

window.addEventListener("resize", (event) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const cameraTarget = new THREE.Vector3();

function animate(tick) {
  requestAnimationFrame(animate);
  const elapsedTime = timer.getElapsed();
  const delta = timer.getDelta();

  cameraTarget.x = mouse.x * 25;
  cameraTarget.y = mouse.y * 10;
  cameraTarget.z = camera.position.z;

  camera.position.lerp(cameraTarget, 0.05);
  camera.lookAt(0, 0, 0);

  timer.update(tick);

  // orbitControls.update();
  renderer.render(scene, camera);
}
animate();
