import { MODES, MODE_CONTENT, MOVEMENT_CONFIG, CAMERA_CONFIG, DEFAULT_MODE } from './constants.js';

export class UIController {
    constructor(cameraController, movementController) {
        this.cameraController = cameraController;
        this.movementController = movementController;
        this.createModeSelector();
        this.createSlider();
        this.createLabelToggle();
        this.createInfoBox();
        this.updateUI();
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
        button.style.background = mode === DEFAULT_MODE ? '#00ced1' : '#333';
        button.style.color = 'white';
        button.disabled = mode === DEFAULT_MODE;
        button.style.opacity = mode === DEFAULT_MODE ? '0.7' : '1';
        button.style.cursor = mode === DEFAULT_MODE ? 'default' : 'pointer';
        
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
        this.sliderContainer = sliderContainer;
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
        if (mode === MODES.OVERVIEW) {
            // Invert the value for overview mode
            const max = parseFloat(this.slider.max);
            const min = parseFloat(this.slider.min);
            this.slider.value = max - (value - min);
        } else {
            this.slider.value = value;
        }
    }

    createInfoBox() {
        this.infoBox = document.createElement('div');
        this.infoBox.style.position = 'absolute';
        this.infoBox.style.bottom = '20px';
        this.infoBox.style.right = '20px';
        this.infoBox.style.width = '280px';
        this.infoBox.style.background = 'rgba(0, 0, 0, 0.7)';
        this.infoBox.style.borderRadius = '5px';
        this.infoBox.style.color = 'white';
        this.infoBox.style.fontFamily = 'Arial, sans-serif';
        this.infoBox.style.padding = '16px';
        this.infoBox.style.zIndex = '1000';
        this.infoBox.style.boxShadow = '0 2px 12px 0 rgba(34, 211, 238, 0.12)';
        this.infoBox.style.border = '1px solid rgba(34, 211, 238, 0.2)';
        this.infoBox.style.transition = 'box-shadow 0.3s, background 0.3s';
        this.infoBox.setAttribute('data-no-pointer-lock', 'true');
        
        // Add hover effect
        this.infoBox.addEventListener('mouseenter', () => {
            this.infoBox.style.boxShadow = '0 4px 20px 0 rgba(34, 211, 238, 0.25)';
            this.infoBox.style.background = 'rgba(0, 0, 0, 0.8)';
        });
        this.infoBox.addEventListener('mouseleave', () => {
            this.infoBox.style.boxShadow = '0 2px 12px 0 rgba(34, 211, 238, 0.12)';
            this.infoBox.style.background = 'rgba(0, 0, 0, 0.7)';
        });

        // Create help button (collapsed state)
        this.helpButton = document.createElement('div');
        this.helpButton.textContent = '?';
        this.helpButton.style.position = 'absolute';
        this.helpButton.style.bottom = '20px';
        this.helpButton.style.right = '20px';
        this.helpButton.style.width = '50px';
        this.helpButton.style.height = '50px';
        this.helpButton.style.background = 'rgba(0, 0, 0, 0.7)';
        this.helpButton.style.borderRadius = '50%';
        this.helpButton.style.color = '#67e8f9';
        this.helpButton.style.fontFamily = 'Arial, sans-serif';
        this.helpButton.style.fontSize = '1.5rem';
        this.helpButton.style.fontWeight = 'bold';
        this.helpButton.style.display = 'flex';
        this.helpButton.style.alignItems = 'center';
        this.helpButton.style.justifyContent = 'center';
        this.helpButton.style.zIndex = '1000';
        this.helpButton.style.boxShadow = '0 2px 12px 0 rgba(34, 211, 238, 0.12)';
        this.helpButton.style.border = '1px solid rgba(34, 211, 238, 0.2)';
        this.helpButton.style.transition = 'box-shadow 0.3s, background 0.3s, transform 0.2s';
        this.helpButton.style.cursor = 'pointer';
        this.helpButton.setAttribute('data-no-pointer-lock', 'true');
        this.helpButton.style.display = 'none'; // Start hidden

        // Add hover effect to help button
        this.helpButton.addEventListener('mouseenter', () => {
            this.helpButton.style.boxShadow = '0 4px 20px 0 rgba(34, 211, 238, 0.25)';
            this.helpButton.style.background = 'rgba(0, 0, 0, 0.8)';
            this.helpButton.style.transform = 'scale(1.1)';
        });
        this.helpButton.addEventListener('mouseleave', () => {
            this.helpButton.style.boxShadow = '0 2px 12px 0 rgba(34, 211, 238, 0.12)';
            this.helpButton.style.background = 'rgba(0, 0, 0, 0.7)';
            this.helpButton.style.transform = 'scale(1)';
        });

        // Click help button to expand
        this.helpButton.addEventListener('click', () => {
            this.expandInfoBox();
        });

        document.body.appendChild(this.infoBox);
        document.body.appendChild(this.helpButton);
    }

    updateInfoBox() {
        const currentMode = this.cameraController.getCurrentMode();
        
        // Create close button
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
        closeBtn.setAttribute('data-no-pointer-lock', 'true');
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#22d3ee');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = '#67e8f9');
        closeBtn.addEventListener('click', () => {
            this.collapseInfoBox();
        });

        // Set content with close button
        this.infoBox.innerHTML = MODE_CONTENT[currentMode] || '';
        this.infoBox.appendChild(closeBtn);
    }

    collapseInfoBox() {
        this.infoBox.style.display = 'none';
        this.helpButton.style.display = 'flex';
    }

    expandInfoBox() {
        this.helpButton.style.display = 'none';
        this.infoBox.style.display = 'block';
        this.updateInfoBox(); // Re-add close button
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

        // Update info box
        this.updateInfoBox();

        if (this.cameraController.getCurrentMode() === MODES.EXPLORE) {
            this.labelToggle.style.display = 'none';
        } else {
            this.labelToggle.style.display = 'flex';
        }
    }

    createLabelToggle() {
        const container = this.createContainer();
        container.style.marginLeft = '187px';
        container.style.paddingTop = '13px';
        container.style.paddingBottom = '13px';

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.id = 'labelToggle';
        toggle.checked = true;
        toggle.style.marginRight = '8px';
        toggle.style.verticalAlign = 'middle';

        const label = document.createElement('label');
        label.htmlFor = 'labelToggle';
        label.textContent = 'Labels';
        label.style.color = 'white';
        label.style.fontFamily = 'Arial, sans-serif';
        label.style.fontSize = '14px';
        label.style.verticalAlign = 'middle';

        container.appendChild(toggle);
        container.appendChild(label);

        toggle.addEventListener('change', (e) => {
            this.cameraController.setLabelsVisible(e.target.checked);
        });

        this.sliderContainer.appendChild(container);

        this.labelToggle = container;
    }
} 