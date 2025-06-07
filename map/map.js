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
movementController.setUIController(uiController);
cameraController.setUIController(uiController);

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

// Handle window resize and orientation change
const handleResize = () => {
    console.log("resize: handleResize");
    
    // Get the actual viewport size
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    // Get device pixel ratio
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Update camera aspect ratio
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    // Update renderer size with pixel ratio
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    
    // Force canvas to fill viewport
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
};

// Initial resize
handleResize();

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
    console.log("resize: orientationchange");
    // Add a small delay to ensure the orientation change is complete
    setTimeout(handleResize, 300);
});

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
    // Set up first person camera after model is loaded
    cameraController.setupFirstPersonCamera();
});

// Start animation loop
renderer.setAnimationLoop(animate);