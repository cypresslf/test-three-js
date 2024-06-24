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

// Plane
const plane = new THREE.Plane(new THREE.Vector3(1, 1, 1).normalize(), -1);
const centerOf = (plane: THREE.Plane) =>
  plane.normal.clone().multiplyScalar(-plane.constant);
const planeCenter = centerOf(plane);

// Basis vectors that comprise a 2D coordinate system on the plane
const basis1 = new THREE.Vector3();
const basis2 = new THREE.Vector3();
basis1
  .crossVectors(
    plane.normal,
    Math.abs(plane.normal.x) > Math.abs(plane.normal.y)
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0)
  )
  .normalize();
basis2.crossVectors(plane.normal, basis1).normalize();
const basis1Helper = new THREE.ArrowHelper(basis1, planeCenter, 1, 0xff0000);
const basis2Helper = new THREE.ArrowHelper(basis2, planeCenter, 1, 0x00ff00);
scene.add(basis1Helper, basis2Helper);

// Position vector
const planePositionHelper = new THREE.ArrowHelper(
  plane.normal,
  new THREE.Vector3(),
  Math.abs(plane.constant) + 1,
  0x5555ff,
  ARROW_SIZE
);
scene.add(planePositionHelper);

// Dynamic list of points
const points: THREE.Vector2[] = [];

// User input event listeners
function updateScene() {
  const planeCenter = centerOf(plane);
  planePositionHelper.setDirection(planeCenter.clone().normalize());
  planePositionHelper.setLength(Math.abs(plane.constant) + 1, ARROW_SIZE);
  basis1
    .crossVectors(
      plane.normal,
      Math.abs(plane.normal.x) > Math.abs(plane.normal.y)
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0)
    )
    .normalize();
  basis2.crossVectors(plane.normal, basis1).normalize();
  basis1Helper.setDirection(basis1);
  basis2Helper.setDirection(basis2);
  basis1Helper.position.copy(planeCenter);
  basis2Helper.position.copy(planeCenter);
}

planeConstantSlider.value = plane.constant.toString();
planeNormalXSlider.value = plane.normal.x.toString();
planeNormalYSlider.value = plane.normal.y.toString();
planeNormalZSlider.value = plane.normal.z.toString();

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

renderer.setAnimationLoop(() => renderer.render(scene, camera));
