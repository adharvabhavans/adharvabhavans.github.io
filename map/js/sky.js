import * as THREE from 'three';
import { SKY_CONFIG } from './constants.js';

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

export function createSky() {
    const uniforms = {
        topColor: { value: new THREE.Color(SKY_CONFIG.topColor) },
        bottomColor: { value: new THREE.Color(SKY_CONFIG.bottomColor) },
        offset: { value: SKY_CONFIG.offset },
        exponent: { value: SKY_CONFIG.exponent }
    };

    const skyGeo = new THREE.SphereGeometry(SKY_CONFIG.radius, SKY_CONFIG.segments, SKY_CONFIG.rings);
    const skyMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.BackSide
    });

    return new THREE.Mesh(skyGeo, skyMat);
} 