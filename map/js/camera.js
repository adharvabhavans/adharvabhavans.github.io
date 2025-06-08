import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { MODES, CAMERA_CONFIG, DEFAULT_MODE } from './constants.js';

export class CameraController {
    constructor(camera, domElement, scene) {
        this.camera = camera;
        this.domElement = domElement;
        this.scene = scene;
        this.currentMode = DEFAULT_MODE;
        this.uiController = null;
        this.fpControls = new PointerLockControls(camera, domElement);
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.topDownCamera = {
            position: new THREE.Vector3(0, CAMERA_CONFIG.topDownHeight, 0),
            target: new THREE.Vector3(0, 0, 0)
        };
        this.lastExplorePosition = {
            x: 36,
            z: 22
        };
        this.raycaster = new THREE.Raycaster();
        this.setupFirstPersonCamera();
    }

    setUIController(uiController) {
        this.uiController = uiController;
    }

    setupTopDownCamera() {
        this.fpControls.unlock();
        this.fpControls.enabled = false;
        
        if (this.currentMode === MODES.EXPLORE) {
            this.lastExplorePosition.x = this.camera.position.x;
            this.lastExplorePosition.z = this.camera.position.z;
        }
        
        this.camera.position.set(
            this.lastExplorePosition.x,
            CAMERA_CONFIG.topDownHeight,
            this.lastExplorePosition.z
        );
        this.camera.lookAt(
            this.lastExplorePosition.x,
            0,
            this.lastExplorePosition.z
        );
        this.camera.up.set(0, 1, 0);
        
        this.topDownCamera.position.copy(this.camera.position);
        this.topDownCamera.target.set(
            this.lastExplorePosition.x,
            0,
            this.lastExplorePosition.z
        );
    }

    getTerrainHeight(x, z) {
        // Create a ray from high above the point
        const rayStart = new THREE.Vector3(x, 1000, z);
        const rayEnd = new THREE.Vector3(x, -1000, z);
        this.raycaster.set(rayStart, rayEnd.sub(rayStart).normalize());

        // Get all intersections
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        // Find the highest intersection point
        let highestY = -Infinity;
        for (const intersect of intersects) {
            if (intersect.point.y > highestY) {
                highestY = intersect.point.y;
            }
        }

        // If no intersection found, return default height
        return highestY < -300 ? CAMERA_CONFIG.defaultHeight : highestY;
    }

    setupFirstPersonCamera() {
        this.fpControls.enabled = true;
        
        // Get terrain height at current position
        const terrainHeight = this.getTerrainHeight(
            this.lastExplorePosition.x,
            this.lastExplorePosition.z
        );
        
        // Set camera position with terrain height + 2 meters
        this.camera.position.set(
            this.lastExplorePosition.x,
            terrainHeight + 2,
            this.lastExplorePosition.z
        );
        this.camera.up.set(0, 1, 0);

        // Reset camera rotation to look horizontally
        this.camera.rotation.set(0, 0, 0);
        this.fpControls.getObject().rotation.set(0, 0, 0);
    }

    switchMode(mode) {
        if (mode === this.currentMode) return;
        
        this.currentMode = mode;
        
        if (mode === MODES.OVERVIEW) {
            this.setupTopDownCamera();
        } else {
            this.setupFirstPersonCamera();
        }
    }

    handleMouseDown(event) {
        const touchesUI = event.target.closest('button') ||
            event.target.closest('input[type="range"]') ||
            event.target.closest('[data-no-pointer-lock]');

        if (touchesUI) {
            return;
        }

        if (this.currentMode === MODES.EXPLORE) {
            this.fpControls.lock();
        } else if (this.currentMode === MODES.OVERVIEW) {
            this.isDragging = true;
            this.previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }

    handleMouseMove(event) {
        if (this.currentMode === MODES.OVERVIEW && this.isDragging) {
            const deltaMove = {
                x: event.clientX - this.previousMousePosition.x,
                y: event.clientY - this.previousMousePosition.y
            };

            // Scale move speed based on camera height
            // Higher camera = faster movement, lower camera = slower movement
            const baseMoveSpeed = 0.001;
            const currentHeight = this.topDownCamera.position.y;
            const moveSpeed = baseMoveSpeed * (currentHeight); // Scale with height

            this.topDownCamera.position.x -= deltaMove.x * moveSpeed;
            this.topDownCamera.position.z -= deltaMove.y * moveSpeed;
            this.topDownCamera.target.x = this.topDownCamera.position.x;
            this.topDownCamera.target.z = this.topDownCamera.position.z;

            this.lastExplorePosition.x = this.topDownCamera.position.x;
            this.lastExplorePosition.z = this.topDownCamera.position.z;

            this.previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleWheel(event) {
        if (this.currentMode === MODES.OVERVIEW) {
            // Zoom in/out in top-down mode with proportional speed
            const baseZoomSpeed = 0.02;
            const currentHeight = this.topDownCamera.position.y;
            const zoomSpeed = baseZoomSpeed * (currentHeight / 30); // Speed scales with height
            const delta = -event.deltaY * zoomSpeed;
            this.topDownCamera.position.y = Math.max(
                CAMERA_CONFIG.minTopDownHeight,
                Math.min(CAMERA_CONFIG.maxTopDownHeight, this.topDownCamera.position.y - delta)
            );
            // Update slider value
            this.uiController.updateSliderValue(this.topDownCamera.position.y);
        }
    }

    update() {
        if (this.currentMode === MODES.OVERVIEW) {
            this.camera.position.copy(this.topDownCamera.position);
            this.camera.lookAt(this.topDownCamera.target);
        } else if (this.currentMode === MODES.EXPLORE) {
            this.lastExplorePosition.x = this.camera.position.x;
            this.lastExplorePosition.z = this.camera.position.z;
        }
    }

    getControls() {
        return this.fpControls;
    }

    getCurrentMode() {
        return this.currentMode;
    }

    getTopDownHeight() {
        return this.topDownCamera.position.y;
    }

    setTopDownHeight(height) {
        this.topDownCamera.position.y = height;
    }
} 