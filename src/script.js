import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// Loaders
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

// Models
let mixer = null;

gltfLoader.load("/models/BrainStem/glTF/BrainStem.gltf", (gltf) => {
  gltf.scene.scale.set(4, 4, 4);
  gltf.scene.position.x = -1;
  gltf.scene.position.y = -1;
  gltf.scene.castShadow = true;
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
});

// Debug
const gui = new GUI();

// Scene
const scene = new THREE.Scene();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
ambientLight.position.set(1, 10, 1);
// ambientLight.scale.set(2, 2, 2);
scene.add(ambientLight);

gui.add(ambientLight.position, "x", -10, 10, 0.001);
gui.add(ambientLight.position, "y", -10, 20, 0.001);
gui.add(ambientLight.position, "z", -10, 10, 0.001);

const directionalLight1 = new THREE.DirectionalLight("blue", 10);
directionalLight1.position.set(10, 5.083, 0);

scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight("purple", 3);
directionalLight2.position.set(-10, 9.754, 0);
scene.add(directionalLight2);

// Light Helpers

const directionalLightHelper1 = new THREE.DirectionalLightHelper(
  directionalLight1,
  5
);
// scene.add(directionalLightHelper1);

const directionalLightHelper2 = new THREE.DirectionalLightHelper(
  directionalLight2,
  5
);
// scene.add(directionalLightHelper2);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(5.329, 2.299, 9.306);
// camera.rotation.set(-0.571, 6.356, 0);
scene.add(camera);

gui.add(camera.position, "x").min(-10).max(10).step(0.001).name("cameraX");
gui.add(camera.position, "y").min(-10).max(20).step(0.001).name("cameraY");
gui.add(camera.position, "z").min(-10).max(20).step(0.001).name("cameraZ");

gui
  .add(camera.rotation, "x")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("cameraRotateX");
gui
  .add(camera.rotation, "y")
  .min(-10)
  .max(20)
  .step(0.001)
  .name("cameraRotateY");
gui
  .add(camera.rotation, "z")
  .min(-10)
  .max(20)
  .step(0.001)
  .name("cameraRotateZ");

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls;
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ metalness: 1 })
);
// sphere.scale.set(0, 0, 0);
sphere.position.y = 9;
scene.add(sphere);

// Plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial()
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;
scene.add(plane);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  controls.update();

  //   floor.rotation.z = elapsedTime * 0.5;

  if (mixer != null) {
    mixer.update(deltaTime * 0.5);
  }

  renderer.render(scene, camera);

  camera.position.x = Math.PI + Math.sin(elapsedTime * 0.5) * 5;
  camera.position.y = Math.PI + Math.sin(elapsedTime * 0.5) * 2;
  //   camera.position.z = Math.sin(elapsedTime * 0.5) * 5;

  //   directionalLight1.position.y = Math.PI * (Math.sin(elapsedTime * 0.5) * 5);
  directionalLight1.position.x = -Math.PI * (Math.sin(elapsedTime * 0.5) * 5);
  directionalLight2.position.x = Math.PI * (Math.sin(elapsedTime * 0.5) * 5);
  //   directionalLight1.position.x = Math.sin(elapsedTime * 0.5) * 10;

  window.requestAnimationFrame(tick);
};

tick();
