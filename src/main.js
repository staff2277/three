import * as THREE from "three";
import {
  WebGPURenderer,
  MeshStandardNodeMaterial,
  MeshPhysicalNodeMaterial,
} from "three/webgpu";
import { positionLocal, normalLocal, sin, time, attribute } from "three/tsl";
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
let geometry = new THREE.SphereGeometry(2, 124, 124).toNonIndexed();
geometry.computeVertexNormals();

const hoverArray = new Float32Array(geometry.attributes.position.count);
geometry.setAttribute("hover", new THREE.BufferAttribute(hoverArray, 1));

// Create TSL Node Materials
let material = new MeshStandardNodeMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  roughness: 0.4,
  color: 0x000000,
  metalness: 0,
});

const coreColor = new THREE.Color(0x0382e7);

let wireframeMaterial = new MeshStandardNodeMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  wireframe: true,
  color: 0x000000,
  emissive: coreColor,
  emissiveIntensity: 5.0,
});

// TSL: Displace face along normal based on hover attribute
const hoverAttr = attribute("hover");
const positionOffset = positionLocal.add(normalLocal.mul(hoverAttr));

// Calculate mix factor: 0.0 when not hovering in the bumped area (<0.25), 1.0 when bumped (>0.35)
const wireframeMix = hoverAttr.sub(0.25).mul(10.0).clamp(0.0, 1.0);

// Apply to solid material
material.positionNode = positionOffset;
material.opacityNode = wireframeMix.oneMinus();

// Apply to wireframe material
wireframeMaterial.positionNode = positionOffset;
wireframeMaterial.opacityNode = wireframeMix;

// Create meshes
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
scene.add(wireframeMesh);

// Create power core
const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
const coreMaterial = new THREE.MeshStandardMaterial({
  color: coreColor,
  emissive: coreColor,
  emissiveIntensity: 50.0,
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
const light = new THREE.AmbientLight(coreColor, 0.5); // soft white light
scene.add(light);
/* 
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-10, -10, -5);
scene.add(directionalLight); */

// Raycaster setup
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-100, -100);

window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

let hoverStrength = 0.0;

// Animate using renderer.setAnimationLoop
function animate() {
  //mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
  controls.update();

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObject(mesh);

  let isHovered = intersects.length > 0;
  let localPoint = new THREE.Vector3();
  if (isHovered) {
    localPoint.copy(intersects[0].point);
    mesh.worldToLocal(localPoint);
  }

  // Smoothly track hover state
  hoverStrength += ((isHovered ? 1.0 : 0.0) - hoverStrength) * 0.1;

  // Calculate pulse based on time (1 beat per 3 seconds)
  const timeNow = performance.now() / 1000.0;
  const pulseFreq = (2 * Math.PI) / 3.0; // One full sine cycle every 3 seconds
  // pulse value between 0.0 and 1.0
  const pulse = (Math.sin(timeNow * pulseFreq) + 1.0) * 0.5;

  // 1. Core mesh scales up and down like a pulsing heart
  const pulseScale = 1.0 + pulse * 0.3 * hoverStrength;
  coreMesh.scale.set(pulseScale, pulseScale, pulseScale);

  // 3. Core color changes dynamically in shade with the pulse
  const highlightColor = new THREE.Color(0xffffff);
  coreMaterial.color.copy(coreColor).lerp(highlightColor, pulse * 0.6 * hoverStrength);
  coreMaterial.emissive.copy(coreColor).lerp(highlightColor, pulse * 0.6 * hoverStrength);
  coreLight.intensity = 1000 * (1.0 + pulse * 0.5 * hoverStrength);

  const hoverAttribute = mesh.geometry.attributes.hover;
  const positions = mesh.geometry.attributes.position.array;
  const radius = 0.4;

  for (let i = 0; i < hoverAttribute.count; i += 3) {
    let target0 = 0.0;
    let target1 = 0.0;
    let target2 = 0.0;

    if (isHovered) {
      // 2. Individual faces move along the normal in tune with pulse
      let target = 0.2 + pulse * 0.15; // Add pulse to base displacement

      // Calculate center of this face
      const cx =
        (positions[i * 3] + positions[(i + 1) * 3] + positions[(i + 2) * 3]) /
        3;
      const cy =
        (positions[i * 3 + 1] +
          positions[(i + 1) * 3 + 1] +
          positions[(i + 2) * 3 + 1]) /
        3;
      const cz =
        (positions[i * 3 + 2] +
          positions[(i + 1) * 3 + 2] +
          positions[(i + 2) * 3 + 2]) /
        3;

      // Distance from face center to mouse intersection point
      const dist = Math.sqrt(
        (cx - localPoint.x) ** 2 +
          (cy - localPoint.y) ** 2 +
          (cz - localPoint.z) ** 2,
      );

      if (dist < radius) {
        const falloff = Math.cos((dist / radius) * (Math.PI / 2)); // smooth circular falloff
        target += 0.5 * falloff; // +0.5 units higher
      }

      // Add a unique tilt to each vertex of the face to make it look non-flat
      // We use the face index 'i' to seed a pseudo-random-looking tilt
      const tiltStrength = 0.08;
      target0 = target + Math.sin(i * 12.34) * tiltStrength;
      target1 = target + Math.sin(i * 12.34 + 2.0) * tiltStrength;
      target2 = target + Math.sin(i * 12.34 + 4.0) * tiltStrength;
    }

    hoverAttribute.array[i] += (target0 - hoverAttribute.array[i]) * 0.1;
    hoverAttribute.array[i + 1] +=
      (target1 - hoverAttribute.array[i + 1]) * 0.1;
    hoverAttribute.array[i + 2] +=
      (target2 - hoverAttribute.array[i + 2]) * 0.1;
  }
  hoverAttribute.needsUpdate = true;

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
