import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MODES, CAMERA_CONFIG } from './js/constants.js';
import { createSky } from './js/sky.js';
import { setupLighting } from './js/lighting.js';
import { CameraController } from './js/camera.js';
import { MovementController } from './js/movement.js';

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

// Mode selector UI
const modeSelector = document.createElement('div');
modeSelector.style.position = 'fixed';
modeSelector.style.top = '20px';
modeSelector.style.left = '20px';
modeSelector.style.zIndex = '1000';
modeSelector.style.background = 'rgba(0, 0, 0, 0.7)';
modeSelector.style.padding = '10px';
modeSelector.style.borderRadius = '5px';
modeSelector.style.color = 'white';
modeSelector.style.fontFamily = 'Arial, sans-serif';
modeSelector.style.userSelect = 'none';

function createModeButton(mode) {
    const button = document.createElement('button');
    button.textContent = mode;
    button.style.margin = '0 5px';
    button.style.padding = '5px 10px';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.background = mode === MODES.EXPLORE ? '#00ced1' : '#333';
    button.style.color = 'white';
    button.disabled = mode === MODES.EXPLORE;
    button.style.opacity = mode === MODES.EXPLORE ? '0.7' : '1';
    button.style.cursor = mode === MODES.EXPLORE ? 'default' : 'pointer';
    
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cameraController.switchMode(mode);
        updateUI();
    });
    return button;
}

function updateUI() {
    modeSelector.querySelectorAll('button').forEach(button => {
        const isSelected = button.textContent === cameraController.getCurrentMode();
        button.style.background = isSelected ? '#00ced1' : '#333';
        button.disabled = isSelected;
        button.style.opacity = isSelected ? '0.7' : '1';
        button.style.cursor = isSelected ? 'default' : 'pointer';
    });
}

// Initialize controllers
const cameraController = new CameraController(camera, document.body, scene);
const movementController = new MovementController(cameraController);

// Add mode buttons
Object.values(MODES).forEach(mode => modeSelector.appendChild(createModeButton(mode)));
document.body.appendChild(modeSelector);

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