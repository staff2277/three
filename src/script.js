import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  200,
);
camera.position.z = 5;

/* 
*
Renderer
*
*/

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const canvas = document.body.appendChild(renderer.domElement);

/*
 *
 *Boxes
 *
 */

const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: "yellow" }),
);
box1.position.set(-3, 0, 0);

const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: "blue" }),
);
box2.position.set(0, 0, 0);
const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: "green" }),
);
box3.position.set(3, 0, 0);

/*
 *
 *Scene objects
 *
 */

/*
 *
 *Raycaster
 *
 */
const raycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-4, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

/* raycaster.set(rayOrigin, rayDirection);
const intersect = raycaster.intersectObject(box1); */

const arrowHelper = new THREE.ArrowHelper(
  rayDirection,
  rayOrigin,
  10,
  "#FF0000",
);
//console.log(intersect);

scene.add(box1, box2, box3, arrowHelper);
function animate(time) {
  const elapsedTime = time * 0.001;
  requestAnimationFrame(animate);
  box1.position.y = Math.sin(elapsedTime) * 2;
  box2.position.y = Math.sin(elapsedTime * 0.5) * 2;
  box3.position.y = Math.sin(elapsedTime * 0.3) * 2;

  raycaster.set(rayOrigin, rayDirection);
  const intersect = raycaster.intersectObjects([box1, box2, box3]);
  if (intersect.length === 0) {
    box1.material.color = new THREE.Color("yellow");
    box2.material.color = new THREE.Color("blue");
    box3.material.color = new THREE.Color("green");
  } else if (intersect.length > 0) {
    const numberOfObjects = intersect.length / 2;
    for (let i = 0; i < numberOfObjects; i++) {
      let j = i * 2;
      intersect[j].object.material.color = new THREE.Color("red");
    }
  }

  renderer.render(scene, camera);
}
animate();

renderer.render(scene, camera);
