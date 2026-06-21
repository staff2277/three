import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Custom ShaderMaterial reproducing the NodeToy effect:
// Vertex displacement along normals using sin(time * 5.0)
const material = new THREE.ShaderMaterial({
  uniforms: {
    _time: { value: 0.0 },
    ambientLightColor: { value: new THREE.Color(0x404040) },
  },
  vertexShader: /* glsl */ `
    uniform float _time;

    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 objectNormal = normal;
      vec3 transformedNormal = normalMatrix * objectNormal;
      vNormal = normalize(transformedNormal);

      // NodeToy displacement logic:
      // sin(time * 5) pushes vertices along their normals
      float wave = sin(_time * 5.0);
      vec3 displaced = position + normal * wave;

      vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      // Simple lit shading so the mesh is visible
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Basic directional light from camera direction
      float diffuse = max(dot(normal, viewDir), 0.0);

      // Ambient + diffuse
      vec3 color = vec3(0.2) + vec3(1.0) * diffuse;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  lights: false,
});

// Create geometry and mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
camera.position.z = 2;

// Create lights (still useful if you switch to a lit material later)
const light = new THREE.AmbientLight(0x404040, 0.5);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-10, -10, -5);
scene.add(directionalLight);

// Clock for time uniform
const clock = new THREE.Clock();

// Animate
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  // Update time uniform (replaces NodeToyMaterial.tick())
  material.uniforms._time.value = clock.getElapsedTime();

  renderer.render(scene, camera);
}
animate();

// On resize window
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
