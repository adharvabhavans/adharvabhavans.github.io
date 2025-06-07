import { MODES, MOVEMENT_CONFIG, CAMERA_CONFIG } from './constants.js';

export class UIController {
    constructor(cameraController, movementController) {
        this.cameraController = cameraController;
        this.movementController = movementController;
        this.createModeSelector();
        this.createSlider();
    }

    createContainer() {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.zIndex = '1000';
        container.style.background = 'rgba(0, 0, 0, 0.7)';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.color = 'white';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.userSelect = 'none';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '0px';
        return container;
    }

    createModeSelector() {
        this.modeSelector = this.createContainer();
        this.modeSelector.style.top = '20px';
        this.modeSelector.style.left = '20px';

        Object.values(MODES).forEach(mode => {
            this.modeSelector.appendChild(this.createModeButton(mode));
        });

        document.body.appendChild(this.modeSelector);
    }

    createModeButton(mode) {
        const button = document.createElement('button');
        button.textContent = mode;
        button.style.margin = '0 5px';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.background = mode === MODES.EXPLORE ? '#00ced1' : '#333';
        button.style.color = 'white';
        button.disabled = mode === MODES.EXPLORE;
        button.style.opacity = mode === MODES.EXPLORE ? '0.7' : '1';
        button.style.cursor = mode === MODES.EXPLORE ? 'default' : 'pointer';
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.cameraController.switchMode(mode);
            this.updateUI();
        });
        return button;
    }

    createSlider() {
        // Create container for slider and label
        const sliderContainer = this.createContainer();
        sliderContainer.style.top = '0';
        sliderContainer.style.left = '100%';
        sliderContainer.style.marginLeft = '10px';
        sliderContainer.style.cursor = 'default';
        sliderContainer.style.gap = '0px';
        sliderContainer.dataset.noPointerLock = 'true';

        // Match height with mode selector
        const modeSelectorHeight = this.modeSelector.getBoundingClientRect().height;
        sliderContainer.style.height = `${modeSelectorHeight}px`;
        sliderContainer.style.boxSizing = 'border-box';

        // Create label
        this.sliderLabel = document.createElement('span');
        this.sliderLabel.style.minWidth = '80px';
        this.updateSliderLabel();

        // Create slider
        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.style.width = '100px';
        this.slider.style.height = '4px';
        this.slider.style.webkitAppearance = 'none';
        this.slider.style.background = '#333';
        this.slider.style.borderRadius = '2px';
        this.slider.style.outline = 'none';
        this.slider.style.cursor = 'pointer';
        this.slider.style.accentColor = '#00ced1';
        this.slider.style.marginLeft = '-15px';

        // Set initial value and range
        this.updateSliderRange();

        // Add event listener
        this.slider.addEventListener('input', () => this.handleSliderChange());

        // Add elements to container
        sliderContainer.appendChild(this.sliderLabel);
        sliderContainer.appendChild(this.slider);

        // Add container to mode selector
        this.modeSelector.appendChild(sliderContainer);
    }

    updateSliderLabel() {
        const mode = this.cameraController.getCurrentMode();
        this.sliderLabel.textContent = mode === MODES.EXPLORE ? 'Speed:' : 'Zoom:';
    }

    updateSliderRange() {
        const mode = this.cameraController.getCurrentMode();
        if (mode === MODES.EXPLORE) {
            this.slider.min = MOVEMENT_CONFIG.minSpeed;
            this.slider.max = MOVEMENT_CONFIG.maxSpeed;
            this.slider.step = MOVEMENT_CONFIG.speedChange;
            this.slider.value = this.movementController.getCurrentSpeed();
        } else {
            this.slider.min = CAMERA_CONFIG.minTopDownHeight;
            this.slider.max = CAMERA_CONFIG.maxTopDownHeight;
            this.slider.step = 1;
            this.slider.value = this.cameraController.getTopDownHeight();
        }
    }

    handleSliderChange() {
        const mode = this.cameraController.getCurrentMode();
        if (mode === MODES.EXPLORE) {
            this.movementController.setSpeed(parseFloat(this.slider.value));
        } else {
            // Invert the value back for overview mode
            const max = parseFloat(this.slider.max);
            const min = parseFloat(this.slider.min);
            const invertedValue = max - (parseFloat(this.slider.value) - min);
            this.cameraController.setTopDownHeight(invertedValue);
        }
    }

    updateSliderValue(value) {
        const mode = this.cameraController.getCurrentMode();
        if (mode === MODES.TOP_DOWN) {
            // Invert the value for overview mode
            const max = parseFloat(this.slider.max);
            const min = parseFloat(this.slider.min);
            this.slider.value = max - (value - min);
        } else {
            this.slider.value = value;
        }
    }

    updateUI() {
        // Update mode buttons
        this.modeSelector.querySelectorAll('button').forEach(button => {
            const isSelected = button.textContent === this.cameraController.getCurrentMode();
            button.style.background = isSelected ? '#00ced1' : '#333';
            button.disabled = isSelected;
            button.style.opacity = isSelected ? '0.7' : '1';
            button.style.cursor = isSelected ? 'default' : 'pointer';
        });

        // Update slider
        this.updateSliderLabel();
        this.updateSliderRange();
    }
} 