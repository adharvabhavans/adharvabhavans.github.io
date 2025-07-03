import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { LABEL_INFO } from './constants.js';
import { CAMERA_CONFIG, MODES } from '../constants.js';

export class LabelManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.labels = new Map();
        this.raycaster = new THREE.Raycaster();
        this.cameraController = null;
        
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

    setCameraController(cameraController) {
        this.cameraController = cameraController;
    }

    createLabel(text, xyPosition, className = '', color = 'white') {
        // console.log('Creating label:', text, 'at xz position:', xyPosition);
        
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
            // console.log('intersects with y', intersects[0].point.y);
            yPosition = intersects[0].point.y + 10; // Add some height above the surface
        }
        
        const position = new THREE.Vector3(xyPosition.x, yPosition, xyPosition.y);
        // console.log('Final label position:', position);

        const div = document.createElement('div');
        div.className = `label ${className}`;
        div.textContent = text;
        div.style.color = color;
        div.style.padding = '3px 8px';
        div.style.background = 'rgba(0, 0, 0, 0.6)';
        div.style.borderRadius = '3px';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.fontSize = '14px';
        div.style.pointerEvents = 'auto';
        div.style.userSelect = 'none';
        div.style.zIndex = '9999';
        div.style.textShadow = '0 0 3px rgba(0, 0, 0, 1.0)';
        div.style.transition = 'box-shadow 0.2s, background 0.2s, color 0.2s';
        div.style.cursor = 'pointer';
        div.addEventListener('mouseenter', () => {
            div.style.background = 'rgba(34, 211, 238, 0.4)';
            div.style.boxShadow = '0 0 12px 2px #22d3ee88';
            div.style.color = '#67e8f9';
        });
        div.addEventListener('mouseleave', () => {
            div.style.background = 'rgba(0, 0, 0, 0.6)';
            div.style.boxShadow = '';
            div.style.color = color;
        });
        div.addEventListener('click', (e) => {
            e.stopPropagation();
            showSidebar(text);
        });

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

    update() {
        const currentMode = this.cameraController.getCurrentMode();
        const visible = this.cameraController.getLabelsVisible() && currentMode === MODES.OVERVIEW;

        this.labels.forEach(label => {
            label.element.style.display = visible ? 'block' : 'none';
        });
        if (visible) {
            this.labelRenderer.render(this.scene, this.camera);
        }
    }

    handleResize() {
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}

let sidebarDiv = null;

function showSidebar(labelKey) {
    // Remove existing sidebar if present
    if (sidebarDiv) {
        sidebarDiv.remove();
        sidebarDiv = null;
    }
    const info = Object.values(LABEL_INFO).find(l => l.name === labelKey);
    if (!info) return;
    sidebarDiv = document.createElement('div');
    sidebarDiv.className = 'map-label-sidebar';
    sidebarDiv.setAttribute('data-no-pointer-lock', 'true');
    sidebarDiv.style.pointerEvents = 'auto';
    // Style to match map UI (from createContainer in ui.js)
    sidebarDiv.style.position = 'absolute';
    sidebarDiv.style.top = '70px'; // below mode selector
    sidebarDiv.style.left = '20px';
    sidebarDiv.style.width = '320px';
    sidebarDiv.style.background = 'rgba(0, 0, 0, 0.7)';
    sidebarDiv.style.borderRadius = '5px';
    sidebarDiv.style.color = 'white';
    sidebarDiv.style.fontFamily = 'Arial, sans-serif';
    sidebarDiv.style.padding = '18px 16px 16px 16px';
    sidebarDiv.style.zIndex = '2000';
    sidebarDiv.style.display = 'flex';
    sidebarDiv.style.flexDirection = 'column';
    sidebarDiv.style.gap = '1.2rem';
    sidebarDiv.style.boxShadow = '0 2px 12px 0 rgba(34, 211, 238, 0.12)';
    sidebarDiv.style.maxHeight = '70vh';
    sidebarDiv.style.overflowY = 'auto';
    sidebarDiv.style.border = 'none';
    sidebarDiv.style.transition = 'box-shadow 0.3s, background 0.3s';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '12px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#67e8f9';
    closeBtn.style.fontSize = '1.7rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.transition = 'color 0.2s';
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#22d3ee');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = '#67e8f9');
    closeBtn.addEventListener('click', () => {
        sidebarDiv.remove();
        sidebarDiv = null;
    });
    sidebarDiv.appendChild(closeBtn);

    // Title
    const title = document.createElement('div');
    title.textContent = info.name;
    title.style.fontSize = '1.3rem';
    title.style.fontWeight = 'bold';
    title.style.color = '#67e8f9';
    title.style.marginBottom = '0.3rem';
    sidebarDiv.appendChild(title);

    // Description
    if (info.description) {
        const desc = document.createElement('div');
        desc.innerHTML = info.description.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
        desc.style.fontSize = '1.05rem';
        desc.style.opacity = '0.92';
        sidebarDiv.appendChild(desc);
    }

    // Optional image
    if (info.image) {
        const img = document.createElement('img');
        img.src = info.image;
        img.alt = info.name;
        img.style.display = 'block';
        img.style.margin = '1.2rem auto 0 auto';
        img.style.maxWidth = '90%';
        img.style.maxHeight = '180px';
        img.style.borderRadius = '0.7rem';
        img.style.boxShadow = '0 2px 16px #22d3ee33';
        img.style.objectFit = 'cover';
        sidebarDiv.appendChild(img);
    }

    document.body.appendChild(sidebarDiv);
} 