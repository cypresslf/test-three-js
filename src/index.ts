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

// Plane
const plane = new THREE.Plane(new THREE.Vector3(1, 1, 1).normalize(), -1);
const planeHelper = new THREE.PlaneHelper(plane, 1, 0xffff00);
scene.add(planeHelper);

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
const basis1Helper = new THREE.ArrowHelper(
  basis1,
  new THREE.Vector3(),
  1,
  0xff0000
);
const basis2Helper = new THREE.ArrowHelper(
  basis2,
  new THREE.Vector3(),
  1,
  0x00ff00
);
scene.add(basis1Helper, basis2Helper);

// Normal vector
const normalHelper = new THREE.ArrowHelper(
  plane.normal,
  plane.normal.clone().multiplyScalar(-plane.constant),
  1,
  0xffff00
);
scene.add(normalHelper);

// Position vector
const planePositionHelper = new THREE.ArrowHelper(
  plane.normal,
  new THREE.Vector3(),
  Math.abs(plane.constant),
  0xffffff,
  0
);
scene.add(planePositionHelper);

// User input event listeners
function updateVectors() {
  normalHelper.setDirection(plane.normal);
  normalHelper.position.copy(
    plane.normal.clone().multiplyScalar(-plane.constant)
  );
  planePositionHelper.setDirection(
    plane.normal.clone().multiplyScalar(-plane.constant).normalize()
  );
  planePositionHelper.setLength(Math.abs(plane.constant), 0);
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
}

planeConstantSlider.value = plane.constant.toString();
planeNormalXSlider.value = plane.normal.x.toString();
planeNormalYSlider.value = plane.normal.y.toString();
planeNormalZSlider.value = plane.normal.z.toString();

planeConstantSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.constant = value;
  updateVectors();
});

planeNormalXSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.x = value;
  plane.normal.normalize();
  updateVectors();
});

planeNormalYSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.y = value;
  plane.normal.normalize();
  updateVectors();
});

planeNormalZSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.z = value;
  plane.normal.normalize();
  updateVectors();
});

renderer.setAnimationLoop(() => renderer.render(scene, camera));
