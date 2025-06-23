import { MODES, MOVEMENT_CONFIG } from './constants.js';

export class MovementController {
    constructor(cameraController) {
        this.cameraController = cameraController;
        this.uiController = null;
        this.currentSpeed = MOVEMENT_CONFIG.moveSpeed;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.previousTime = performance.now();
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
            this.uiController.updateSliderValue(this.currentSpeed);
        }
    }

    update() {
        const time = performance.now();
        const delta = (time - this.previousTime) / 1000;
        
        const actualSpeed = (Math.pow(this.currentSpeed, 3) * 7.0) + 5.0;
                
        const controls = this.cameraController.getControls();
        if (this.cameraController.getCurrentMode() !== MODES.EXPLORE || !controls.isLocked) return;
        
        if (this.moveForward) controls.moveForward(actualSpeed * delta);
        if (this.moveBackward) controls.moveForward(-actualSpeed * delta);
        if (this.moveLeft) controls.moveRight(-actualSpeed * delta);
        if (this.moveRight) controls.moveRight(actualSpeed * delta);
        if (this.moveUp) controls.getObject().position.y += actualSpeed * delta;
        if (this.moveDown) controls.getObject().position.y -= actualSpeed * delta;
        
        this.previousTime = time;
    }

    getCurrentSpeed() {
        return this.currentSpeed;
    }

    setSpeed(speed) {
        this.currentSpeed = speed;
    }

    setUIController(uiController) {
        this.uiController = uiController;
    }
}