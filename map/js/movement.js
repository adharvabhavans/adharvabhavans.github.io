import { MODES, MOVEMENT_CONFIG } from './constants.js';

export class MovementController {
    constructor(cameraController) {
        this.cameraController = cameraController;
        this.currentSpeed = MOVEMENT_CONFIG.moveSpeed;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }

    handleKeyDown(event) {
        if (this.cameraController.getCurrentMode() !== MODES.EXPLORE) return;
        
        switch (event.code) {
            case 'KeyW': this.moveForward = true; break;
            case 'KeyS': this.moveBackward = true; break;
            case 'KeyA': this.moveLeft = true; break;
            case 'KeyD': this.moveRight = true; break;
            case 'Space': this.moveUp = true; break;
            case 'ShiftLeft': this.moveDown = true; break;
        }
    }

    handleKeyUp(event) {
        if (this.cameraController.getCurrentMode() !== MODES.EXPLORE) return;
        
        switch (event.code) {
            case 'KeyW': this.moveForward = false; break;
            case 'KeyS': this.moveBackward = false; break;
            case 'KeyA': this.moveLeft = false; break;
            case 'KeyD': this.moveRight = false; break;
            case 'Space': this.moveUp = false; break;
            case 'ShiftLeft': this.moveDown = false; break;
        }
    }

    handleWheel(event) {
        if (this.cameraController.getCurrentMode() === MODES.EXPLORE) {
            if (event.deltaY < 0) {
                this.currentSpeed = Math.min(
                    this.currentSpeed + MOVEMENT_CONFIG.speedChange,
                    MOVEMENT_CONFIG.maxSpeed
                );
            } else {
                this.currentSpeed = Math.max(
                    this.currentSpeed - MOVEMENT_CONFIG.speedChange,
                    MOVEMENT_CONFIG.minSpeed
                );
            }
            console.log('Current speed:', this.currentSpeed);
        }
    }

    update() {
        const controls = this.cameraController.getControls();
        if (this.cameraController.getCurrentMode() !== MODES.EXPLORE || !controls.isLocked) return;
        
        const delta = 1;
        if (this.moveForward) controls.moveForward(this.currentSpeed * delta);
        if (this.moveBackward) controls.moveForward(-this.currentSpeed * delta);
        if (this.moveLeft) controls.moveRight(-this.currentSpeed * delta);
        if (this.moveRight) controls.moveRight(this.currentSpeed * delta);
        if (this.moveUp) controls.getObject().position.y += this.currentSpeed * delta;
        if (this.moveDown) controls.getObject().position.y -= this.currentSpeed * delta;
    }
}