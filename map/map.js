import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MODES, CAMERA_CONFIG } from './js/constants.js';
import { createSky } from './js/sky.js';
import { setupLighting } from './js/lighting.js';
import { CameraController } from './js/camera.js';
import { MovementController } from './js/movement.js';
import { UIController } from './js/ui.js';

// Scene setup
const scene = new THREE.Scene();

// Add sky
const sky = createSky();
scene.add(sky);

// Setup lighting
setupLighting(scene);

// Camera setup
const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    window.innerWidth / window.innerHeight,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far
);
camera.position.set(36, CAMERA_CONFIG.defaultHeight, 22);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize controllers
const cameraController = new CameraController(camera, document.body, scene);
const movementController = new MovementController(cameraController);
const uiController = new UIController(cameraController, movementController);

// Event listeners
document.addEventListener('keydown', (e) => movementController.handleKeyDown(e));
document.addEventListener('keyup', (e) => movementController.handleKeyUp(e));
document.addEventListener('wheel', (e) => {
    movementController.handleWheel(e);
    cameraController.handleWheel(e);
});
document.addEventListener('mousedown', (e) => cameraController.handleMouseDown(e));
document.addEventListener('mousemove', (e) => cameraController.handleMouseMove(e));
document.addEventListener('mouseup', () => cameraController.handleMouseUp());

// Animation loop
function animate() {
    cameraController.update();
    movementController.update();
    renderer.render(scene, camera);
}

// Load 3D model
const loader = new GLTFLoader();
loader.load('school.glb', (gltf) => {
    const root = gltf.scene;
    
    root.traverse((node) => {
        if (node.isMesh) {
            if (node.material) {
                node.material.flatShading = false;
                node.material.normalScale.set(2, 2);
                node.material.roughness = 0.7;
                node.material.metalness = 0.2;
            }
        }
    });
    
    scene.add(root);
});

// Start animation loop
renderer.setAnimationLoop(animate);