import * as THREE from 'three';

export const LABEL_INFO = {
    BASKETBALL_COURT: {
        name: 'Basketball Court',
        position: new THREE.Vector2(-15, -15),
        description: 'Outdoor basketball court with 2 hoops, colored floor and modern facilities, for sports activities',
        color: '#00FF00',  // green
        image: '/map/irl_basketball.jpeg' // Optional: path or URL to image
    },
    BHISHMA_BLOCK: {
        name: 'Bhishma Block',
        position: new THREE.Vector2(-15, 10),
        description: 'Main academic block named after Bhishma',
        color: '#00FFFF'
    },
    VYASA_BLOCK: {
        name: 'Vyasa Block',
        position: new THREE.Vector2(15, -60),
        description: 'Academic block named after Vyasa',
        color: '#00FFFF'
    },
    GANDHI_BLOCK: {
        name: 'Gandhi (Nursery) Block',
        position: new THREE.Vector2(-10, -50),
        description: 'Nursery block named after Mahatma Gandhi',
        color: '#00FFFF'
    },
    MUNSHI_AUDITORIUM: {
        name: 'Munshi Auditorium',
        position: new THREE.Vector2(70, 25),
        description: 'Main auditorium for events and gatherings',
        color: '#00FFFF'
    },
    WASHROOM_GIRLS: {
        name: 'Washroom Girls',
        position: new THREE.Vector2(-50, 30),
        description: 'Washroom for girls',
        color: '#FFFF00'
    },
    WASHROOM_BOYS: {
        name: 'Washroom Boys',
        position: new THREE.Vector2(100, 25),
        description: 'Washroom for boys',
        color: '#FFFF00'
    }
}; 