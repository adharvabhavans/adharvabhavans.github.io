import { MODES, CAMERA_CONFIG } from './constants.js';

export class PinchZoomController {
    constructor(cameraController, uiController) {
        this.cameraController = cameraController;
        this.uiController = uiController;

        this.isPinching = false;
        this.initialDistance = 0;
        this.initialHeight = 0;
        this.currentTouches = [];
        
        this.setupEventListeners();
    }

    // Helper function to adapt touch events to mouse events for camera controller
    adaptTouchEventToMouse(touchEvent, type) {
        // Only handle single touch
        if (touchEvent.touches.length > 1 && type !== 'touchend') return null;
        const touch = (type === 'touchend') ? touchEvent.changedTouches[0] : touchEvent.touches[0];
        return {
            clientX: touch.clientX,
            clientY: touch.clientY,
            target: touchEvent.target,
            preventDefault: () => touchEvent.preventDefault(),
            isTouch: true,
        };
    }

    setupEventListeners() {
        // Touch start - handle both single touch and pinch
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                this.handlePinchStart(e);
            } else if (e.touches.length === 1) {
                // Handle single touch for camera drag
                const mouseEvent = this.adaptTouchEventToMouse(e, 'touchstart');
                if (mouseEvent) this.cameraController.handleMouseDown(mouseEvent);
            }
        }, { passive: false });

        // Touch move - handle both single touch and pinch
        document.addEventListener('touchmove', (e) => {
            if (this.isPinching && e.touches.length === 2) {
                e.preventDefault();
                this.handlePinchMove(e);
            } else if (e.touches.length === 1 && !this.isPinching) {
                // Handle single touch for camera drag
                const mouseEvent = this.adaptTouchEventToMouse(e, 'touchmove');
                if (mouseEvent) this.cameraController.handleMouseMove(mouseEvent);
            }
        }, { passive: false });

        // Touch end - handle both single touch and pinch
        document.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                this.isPinching = false;
            }
            if (e.touches.length === 0) {
                // Handle single touch end for camera drag
                this.cameraController.handleMouseUp();
            }
        }, { passive: false });
    }

    handlePinchStart(e) {
        // Only enable pinch zoom in Overview mode
        if (this.cameraController.getCurrentMode() !== MODES.OVERVIEW) {
            return;
        }

        this.isPinching = true;
        this.currentTouches = Array.from(e.touches);
        this.initialDistance = this.getDistance(this.currentTouches[0], this.currentTouches[1]);
        this.initialHeight = this.cameraController.getTopDownHeight();
    }

    handlePinchMove(e) {
        if (!this.isPinching || e.touches.length !== 2) {
            return;
        }

        const currentTouches = Array.from(e.touches);
        const currentDistance = this.getDistance(currentTouches[0], currentTouches[1]);
        
        // Calculate zoom factor based on distance change
        const zoomFactor = currentDistance / this.initialDistance;
        
        // Apply zoom to camera height
        const newHeight = this.initialHeight / zoomFactor;
        
        // Clamp height to valid range
        const clampedHeight = Math.max(
            CAMERA_CONFIG.minTopDownHeight,
            Math.min(CAMERA_CONFIG.maxTopDownHeight, newHeight)
        );
        
        // Update camera height smoothly
        this.cameraController.setTopDownHeight(clampedHeight);
        this.uiController.updateSliderValue(this.cameraController.topDownCamera.position.y);
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Method to check if currently pinching (for other controllers to use)
    isCurrentlyPinching() {
        return this.isPinching;
    }

    // Cleanup method
    destroy() {
        // Remove event listeners if needed
        this.isPinching = false;
    }
} 