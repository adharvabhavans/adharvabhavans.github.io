import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();

// Sky gradient
const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
`;

const uniforms = {
    topColor: { value: new THREE.Color(0xb3e0ff) }, // Brighter sky blue
    bottomColor: { value: new THREE.Color(0x1a2a6c) }, // Deep ocean blue
    offset: { value: 33 },
    exponent: { value: 0.4 } // Lower exponent makes the gradient more biased towards top color
};

const skyGeo = new THREE.SphereGeometry(400, 32, 15);
const skyMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.BackSide
});

const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Reduced ambient light
scene.add(ambientLight);

// Directional light (sun)
const sunLight = new THREE.DirectionalLight(0xffffcc, 1.5); // Increased intensity
sunLight.position.set(50, 100, 50);
sunLight.castShadow = false;
scene.add(sunLight);

// Add hemisphere light for better ambient lighting
const hemiLight = new THREE.HemisphereLight(0xffffcc, 0x1a2a6c, 0.4); // Reduced intensity
scene.add(hemiLight);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(36, 27, 22);

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

const MODES = {
    TOP_DOWN: 'Overview',
    EXPLORE: 'Explore'
};

const modes = [MODES.TOP_DOWN, MODES.EXPLORE];
let currentMode = MODES.EXPLORE;

function createModeButton(mode) {
    const button = document.createElement('button');
    button.textContent = mode;
    button.style.margin = '0 5px';
    button.style.padding = '5px 10px';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.background = currentMode === mode ? '#00ced1' : '#333';
    button.style.color = 'white';
    button.disabled = currentMode === mode;
    button.style.opacity = currentMode === mode ? '0.7' : '1';
    button.style.cursor = currentMode === mode ? 'default' : 'pointer';
    
    // Prevent pointer lock when clicking the button
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchMode(mode);
    });
    return button;
}

modes.forEach(mode => modeSelector.appendChild(createModeButton(mode)));
document.body.appendChild(modeSelector);

// Controls setup
const fpControls = new PointerLockControls(camera, document.body);
scene.add(fpControls.getObject());

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let topDownCamera = {
    position: new THREE.Vector3(0, 50, 0),
    target: new THREE.Vector3(0, 0, 0)
};

// Store last explore mode position
let lastExplorePosition = {
    x: 36,
    z: 22
};

function setupTopDownCamera() {
    // Disable first person controls
    fpControls.unlock();
    fpControls.enabled = false;
    
    // Store current explore position before switching
    if (currentMode === MODES.EXPLORE) {
        lastExplorePosition.x = camera.position.x;
        lastExplorePosition.z = camera.position.z;
    }
    
    // Set up top-down view while maintaining x/z position
    camera.position.set(lastExplorePosition.x, 50, lastExplorePosition.z);
    camera.lookAt(lastExplorePosition.x, 0, lastExplorePosition.z);
    camera.up.set(0, 1, 0);
    
    // Update the top-down camera state
    topDownCamera.position.copy(camera.position);
    topDownCamera.target.set(lastExplorePosition.x, 0, lastExplorePosition.z);
}

function setupFirstPersonCamera() {
    // Enable first person controls
    fpControls.enabled = true;
    
    // Restore last explore position
    camera.position.set(lastExplorePosition.x, 27, lastExplorePosition.z);
    camera.up.set(0, 1, 0);
}

function switchMode(mode) {
    if (mode === currentMode) return;
    
    currentMode = mode;
    
    // Update UI
    modeSelector.querySelectorAll('button').forEach(button => {
        const isSelected = button.textContent === mode;
        button.style.background = isSelected ? '#00ced1' : '#333';
        button.disabled = isSelected;
        button.style.opacity = isSelected ? '0.7' : '1';
        button.style.cursor = isSelected ? 'default' : 'pointer';
    });

    // Switch camera setup
    if (mode === MODES.TOP_DOWN) {
        setupTopDownCamera();
    } else {
        setupFirstPersonCamera();
    }
}

function onMouseDown(event) {
    // Only handle pointer lock if we're in Explore mode and the click wasn't on a button
    if (currentMode === MODES.EXPLORE && !event.target.closest('button')) {
        fpControls.lock();
    } else if (currentMode === MODES.TOP_DOWN) {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
}

function onMouseMove(event) {
    if (currentMode === MODES.TOP_DOWN && isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        // Move camera in the direction of the drag
        const moveSpeed = 0.1;
        topDownCamera.position.x -= deltaMove.x * moveSpeed;
        topDownCamera.position.z -= deltaMove.y * moveSpeed;
        topDownCamera.target.x = topDownCamera.position.x;
        topDownCamera.target.z = topDownCamera.position.z;

        // Update last explore position during top-down movement
        lastExplorePosition.x = topDownCamera.position.x;
        lastExplorePosition.z = topDownCamera.position.z;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
}

function onMouseUp() {
    isDragging = false;
}

// Movement configuration
const moveSpeed = 0.5;
const speedChange = 0.1;
const minSpeed = 0.1;
const maxSpeed = 2.0;

// Movement state
let currentSpeed = moveSpeed;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

// Event handlers
function onKeyDown(event) {
    if (currentMode !== MODES.EXPLORE) return;
    
    switch (event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
        case 'Space': moveUp = true; break;
        case 'ShiftLeft': moveDown = true; break;
    }
}

function onKeyUp(event) {
    if (currentMode !== MODES.EXPLORE) return;
    
    switch (event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
        case 'Space': moveUp = false; break;
        case 'ShiftLeft': moveDown = false; break;
    }
}

function onWheel(event) {
    if (currentMode === MODES.EXPLORE) {
        if (event.deltaY < 0) {
            currentSpeed = Math.min(currentSpeed + speedChange, maxSpeed);
        } else {
            currentSpeed = Math.max(currentSpeed - speedChange, minSpeed);
        }
        console.log('Current speed:', currentSpeed);
    } else if (currentMode === MODES.TOP_DOWN) {
        // Zoom in/out in top-down mode with proportional speed
        const baseZoomSpeed = 0.02;
        const currentHeight = topDownCamera.position.y;
        const zoomSpeed = baseZoomSpeed * (currentHeight / 30); // Speed scales with height
        const delta = -event.deltaY * zoomSpeed;
        topDownCamera.position.y = Math.max(30, Math.min(120, topDownCamera.position.y - delta));
    }
}

// Movement update
function updateMovement() {
    if (currentMode !== MODES.EXPLORE || !fpControls.isLocked) return;
    
    const delta = 1;
    if (moveForward) fpControls.moveForward(currentSpeed * delta);
    if (moveBackward) fpControls.moveForward(-currentSpeed * delta);
    if (moveLeft) fpControls.moveRight(-currentSpeed * delta);
    if (moveRight) fpControls.moveRight(currentSpeed * delta);
    if (moveUp) fpControls.getObject().position.y += currentSpeed * delta;
    if (moveDown) fpControls.getObject().position.y -= currentSpeed * delta;
}

// Animation loop
function animate() {
    if (currentMode === MODES.TOP_DOWN) {
        // Update camera position and orientation for top-down mode
        camera.position.copy(topDownCamera.position);
        camera.lookAt(topDownCamera.target);
    } else if (currentMode === MODES.EXPLORE) {
        updateMovement();
        // Update last explore position during movement
        lastExplorePosition.x = camera.position.x;
        lastExplorePosition.z = camera.position.z;
    }
    
    renderer.render(scene, camera);
}

// Event listeners
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('wheel', onWheel);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);

// Load 3D model
const loader = new GLTFLoader();
loader.load('school.glb', (gltf) => {
    const root = gltf.scene;
    
    // Traverse all meshes in the model
    root.traverse((node) => {
        if (node.isMesh) {
            // Enhance normal-based shading
            if (node.material) {
                node.material.flatShading = false;
                node.material.normalScale.set(2, 2); // Increase normal map intensity
                node.material.roughness = 0.7; // Increase roughness for more contrast
                node.material.metalness = 0.2; // Reduce metalness for more diffuse look
            }
        }
    });
    
    scene.add(root);
});

// Start animation loop
renderer.setAnimationLoop(animate);