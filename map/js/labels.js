import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { MODES, CAMERA_CONFIG } from './constants.js';

export class LabelManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.labels = new Map();
        this.raycaster = new THREE.Raycaster();
        
        // Create CSS2D renderer
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'fixed';
        this.labelRenderer.domElement.style.top = '0';
        this.labelRenderer.domElement.style.left = '0';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        this.labelRenderer.domElement.style.zIndex = '9999';
        document.body.appendChild(this.labelRenderer.domElement);
    }

    createLabel(text, xyPosition, className = '') {
        console.log('Creating label:', text, 'at xz position:', xyPosition);
        
        // Create a ray from high above the point
        const rayStart = new THREE.Vector3(xyPosition.x, 1000, xyPosition.y);
        const rayDirection = new THREE.Vector3(0, -1, 0);
        this.raycaster.set(rayStart, rayDirection);
        
        // Get all meshes in the scene
        const meshes = [];
        this.scene.traverse((object) => {
            if (object.isMesh) {
                meshes.push(object);
            }
        });
        
        // Find the intersection point
        const intersects = this.raycaster.intersectObjects(meshes);
        let yPosition = CAMERA_CONFIG.defaultHeight; // Default height if no intersection found
        
        if (intersects.length > 0) {
            console.log('intersects with y', intersects[0].point.y);
            yPosition = intersects[0].point.y + 10; // Add some height above the surface
        }
        
        const position = new THREE.Vector3(xyPosition.x, yPosition, xyPosition.y);
        console.log('Final label position:', position);

        const div = document.createElement('div');
        div.className = `label ${className}`;
        div.textContent = text;
        div.style.color = 'white';
        div.style.padding = '3px 8px';
        div.style.background = 'rgba(0, 0, 0, 0.6)';
        div.style.borderRadius = '3px';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.fontSize = '14px';
        div.style.pointerEvents = 'none';
        div.style.userSelect = 'none';
        div.style.zIndex = '9999';
        div.style.textShadow = '0 0 3px rgba(0, 0, 0, 1.0)';

        const label = new CSS2DObject(div);
        label.position.copy(position);
        this.scene.add(label);
        this.labels.set(text, label);
        return label;
    }

    removeLabel(text) {
        const label = this.labels.get(text);
        if (label) {
            this.scene.remove(label);
            this.labels.delete(text);
        }
    }

    update(currentMode) {
        if (currentMode === MODES.OVERVIEW) {
            this.labelRenderer.render(this.scene, this.camera);
        }
    }

    handleResize() {
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }
} 