import * as THREE from "three";

// DOM elements
const planeConstantSlider = document.querySelector<HTMLInputElement>(
  "input#plane-constant"
)!;
const planeNormalXSlider = document.querySelector<HTMLInputElement>(
  "input#plane-normal-x"
)!;
const planeNormalYSlider = document.querySelector<HTMLInputElement>(
  "input#plane-normal-y"
)!;
const planeNormalZSlider = document.querySelector<HTMLInputElement>(
  "input#plane-normal-z"
)!;
const canvas = document.querySelector("canvas")!;

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const ARROW_SIZE = 0.2;

// Initialize the state
const plane = new THREE.Plane(new THREE.Vector3(1, 1, 1).normalize(), -1);
const points = [] as THREE.Vector2[];

// Initialize the DOM elements
planeConstantSlider.value = plane.constant.toString();
planeNormalXSlider.value = plane.normal.x.toString();
planeNormalYSlider.value = plane.normal.y.toString();
planeNormalZSlider.value = plane.normal.z.toString();

// Initialize the scene
const zAxis = new THREE.ArrowHelper(undefined, undefined, undefined, 0x5555ff);
const xAxis = new THREE.ArrowHelper(undefined, undefined, 1, 0xff0000);
const yAxis = new THREE.ArrowHelper(undefined, undefined, 1, 0x00ff00);
scene.add(zAxis, xAxis, yAxis);

// Update the scene
function updateScene() {
  const planeCenter = plane.normal.clone().multiplyScalar(-plane.constant);
  const basis1 = new THREE.Vector3()
    .crossVectors(
      plane.normal,
      Math.abs(plane.normal.x) > Math.abs(plane.normal.y)
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0)
    )
    .normalize();
  const basis2 = new THREE.Vector3()
    .crossVectors(plane.normal, basis1)
    .normalize();

  zAxis.setLength(Math.abs(plane.constant) + 1, ARROW_SIZE);
  zAxis.setDirection(planeCenter.clone().normalize());
  xAxis.setDirection(basis1);
  yAxis.setDirection(basis2);
  xAxis.position.copy(planeCenter);
  yAxis.position.copy(planeCenter);
}

// Add event listeners
planeConstantSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.constant = value;
  updateScene();
});

planeNormalXSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.x = value;
  plane.normal.normalize();
  updateScene();
});

planeNormalYSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.y = value;
  plane.normal.normalize();
  updateScene();
});

planeNormalZSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.z = value;
  plane.normal.normalize();
  updateScene();
});

canvas.addEventListener("click", (e) => {
  // add a point to the scene at the intersection of the plane and the ray
  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.05),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(
    new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    ),
    camera
  );
  const intersection = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersection);
  point.position.copy(intersection);
  scene.add(point);
});

updateScene();
renderer.setAnimationLoop(() => renderer.render(scene, camera));
