import * as THREE from "three";

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

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const plane = new THREE.Plane(new THREE.Vector3(1, 1, 1).normalize(), -1);
const planeHelper = new THREE.PlaneHelper(plane, 1, 0xffff00);
scene.add(planeHelper);

const normalHelper = new THREE.ArrowHelper(
  plane.normal,
  plane.normal.clone().multiplyScalar(-plane.constant),
  1,
  0xffff00
);
scene.add(normalHelper);

const planePositionHelper = new THREE.ArrowHelper(
  plane.normal,
  new THREE.Vector3(0, 0, 0),
  Math.abs(plane.constant),
  0xffffff,
  0
);
scene.add(planePositionHelper);

camera.position.z = 5;

function animate() {
  renderer.render(scene, camera);
}

function updateArrow() {
  normalHelper.setDirection(plane.normal);
  normalHelper.position.copy(
    plane.normal.clone().multiplyScalar(-plane.constant)
  );
  planePositionHelper.setDirection(
    plane.normal.clone().multiplyScalar(-plane.constant).normalize()
  );
  planePositionHelper.position.set(0, 0, 0);
  planePositionHelper.setLength(Math.abs(plane.constant), 0);
}

planeConstantSlider.value = plane.constant.toString();
planeNormalXSlider.value = plane.normal.x.toString();
planeNormalYSlider.value = plane.normal.y.toString();
planeNormalZSlider.value = plane.normal.z.toString();

planeConstantSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.constant = value;
  updateArrow();
});

planeNormalXSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.x = value;
  plane.normal.normalize();
  updateArrow();
});

planeNormalYSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.y = value;
  plane.normal.normalize();
  updateArrow();
});

planeNormalZSlider.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  plane.normal.z = value;
  plane.normal.normalize();
  updateArrow();
});

renderer.setAnimationLoop(animate);
