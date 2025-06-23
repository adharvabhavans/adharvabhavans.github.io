import * as THREE from 'three';
import { LIGHTING_CONFIG } from './constants.js';

export function setupLighting(scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(
        LIGHTING_CONFIG.ambient.color,
        LIGHTING_CONFIG.ambient.intensity
    );
    scene.add(ambientLight);

    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(
        LIGHTING_CONFIG.directional.color,
        LIGHTING_CONFIG.directional.intensity
    );
    sunLight.position.set(...LIGHTING_CONFIG.directional.position);
    sunLight.castShadow = false;
    scene.add(sunLight);

    // Hemisphere light
    const hemiLight = new THREE.HemisphereLight(
        LIGHTING_CONFIG.hemisphere.skyColor,
        LIGHTING_CONFIG.hemisphere.groundColor,
        LIGHTING_CONFIG.hemisphere.intensity
    );
    scene.add(hemiLight);
} 