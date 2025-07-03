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
        description: 'Academic block containing:\n\n- Classes 9-12\n- Labs for different subjects\n- New Computer Lab\n- Principal\'s office, school office and other offices',
        color: '#00FFFF'
    },
    VYASA_BLOCK: {
        name: 'Vyasa Block',
        position: new THREE.Vector2(15, -60),
        description: 'Academic block containing:\n\n- Mainly lower classes\n- Old computer lab\n- Library\n- Honesty Store\n- PE Room',
        color: '#00FFFF'
    },
    GANDHI_BLOCK: {
        name: 'Gandhi (Nursery) Block',
        position: new THREE.Vector2(-10, -50),
        description: 'Nursery block, containing smaller classes as well as a few other departments.',
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