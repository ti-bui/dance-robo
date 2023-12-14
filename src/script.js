import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

THREE.ColorManagement.enabled = false;

// Loaders
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

const particlesTexture = textureLoader.load("/textures/particles/4.png");

// Models
let mixer = null;

gltfLoader.load("/models/BrainStem/glTF/BrainStem.gltf", (gltf) => {
  gltf.scene.scale.set(4, 4, 4);
  gltf.scene.position.x = -1;
  gltf.scene.position.y = -1;

  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
});

// Debug
// const gui = new GUI();

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
const ambientLight = new THREE.AmbientLight("#white", 0.5);
ambientLight.position.set(1, 10, 1);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight("#9572f7", 10);
directionalLight1.position.set(10, 5.083, 0);

scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight("#4400ff", 10);
directionalLight2.position.set(-10, 9.754, 0);
scene.add(directionalLight2);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(5.329, 2.299, 9.306);
scene.add(camera);

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

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 15, 15),
  new THREE.MeshStandardMaterial({
    flatShading: true,
    metalness: 0.6,
  })
);
sphere.position.y = 9;
scene.add(sphere);

// Plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: "#3d44ff" })
);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;
scene.add(plane);

// Galaxy
const particlesGeometry = new THREE.BufferGeometry();
const count = 2000;
const positions = new Float32Array(count * 3);

for (let i = 0; i <= count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 30;
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

//Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
});

particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particlesTexture;
particlesMaterial.alphaTest = 0.01;
particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
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

  if (mixer != null) {
    mixer.update(deltaTime * 0.5);
  }

  renderer.render(scene, camera);

  camera.position.x = Math.PI + Math.sin(elapsedTime * 0.5) * 5;
  camera.position.y = Math.PI + Math.sin(elapsedTime * 0.5) * 2;

  directionalLight1.position.x = -Math.PI * (Math.sin(elapsedTime * 0.5) * 5);
  directionalLight2.position.x = Math.PI * (Math.sin(elapsedTime * 0.5) * 5);

  sphere.rotation.y = elapsedTime;

  window.requestAnimationFrame(tick);
};

tick();
