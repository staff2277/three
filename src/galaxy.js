import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as dat from "lil-gui";

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

const gui = new dat.GUI();
const parameters = {
  vertCount: 300,
  radiusMultiplier: 0.2,
  angleMultiplier: 0.2,
  curveCount: 3,
  groupCount: 300,
  particleSize: 0.01,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};

let particleGeometry = null;
let particleMaterial = null;
const galaxy = new THREE.Group();

const generateGalaxy = () => {
  // Destroy old galaxy parts
  while(galaxy.children.length > 0){ 
    const child = galaxy.children[0];
    galaxy.remove(child); 
  }
  if (particleGeometry !== null) particleGeometry.dispose();
  if (particleMaterial !== null) particleMaterial.dispose();

  particleGeometry = new THREE.BufferGeometry();
  const vertArray = [];
  const vertcolor = [];

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.vertCount; i++) {
    const radius = i * parameters.radiusMultiplier;
    const angle = i * parameters.angleMultiplier;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    vertArray.push(x, 0, z);

    const maxRadius = (parameters.vertCount - 1) * parameters.radiusMultiplier;
    const radiusRatio = maxRadius > 0 ? Math.min(radius / maxRadius, 1) : 0;
    const mixedColor = colorInside.clone().lerp(colorOutside, radiusRatio);
    vertcolor.push(mixedColor.r, mixedColor.g, mixedColor.b);
  }

  const particleVerts = new Float32Array(vertArray);
  const particleColor = new Float32Array(vertcolor);
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particleVerts, 3)
  );
  particleGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(particleColor, 3)
  );

  particleMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: parameters.particleSize
  });

  const particleGroup = new THREE.Group();
  for (let i = 1; i <= parameters.curveCount; i++) {
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.rotation.y = THREE.MathUtils.degToRad(i * (360 / parameters.curveCount));
    particleGroup.add(particles);
  }

  const partGroup = [];
  for (let i = 0; i < parameters.groupCount; i++) {
    const group = particleGroup.clone();
    group.rotation.y = Math.random() * i * 0.01;
    group.rotation.z = Math.random() * i * 0.001;
    partGroup.push(group);
  }

  for (let i = 0; i < partGroup.length; i++) {
    const group = partGroup[i];
    group.position.x = Math.random() * i * 0.005;
    group.position.y = Math.random() * i * 0.005;
    group.position.z = Math.random() * i * 0.005;
    galaxy.add(group);
  }
};

generateGalaxy();

gui.add(parameters, 'vertCount').min(10).max(1000).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'radiusMultiplier').min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'angleMultiplier').min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'curveCount').min(1).max(10).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'groupCount').min(10).max(1000).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'particleSize').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

/*
 *
 *Scene Objects
 *
 */

scene.add(ambientlight, directionalLight, /* axesHelper */ galaxy);

/*
 *
 *Renderer
 *
 */
function animate(time) {
  requestAnimationFrame(animate);
  const elapsedTime = time * 0.001;
  galaxy.rotation.y += 0.001;
  orbitControls.update();
  renderer.render(scene, camera);
}
animate();
