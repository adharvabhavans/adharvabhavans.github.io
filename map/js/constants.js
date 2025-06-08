export const MODES = {
    OVERVIEW: 'Overview',
    EXPLORE: 'Explore'
};

export const DEFAULT_MODE = MODES.OVERVIEW;

export const MOVEMENT_CONFIG = {
    moveSpeed: 0.5,
    speedChange: 0.1,
    minSpeed: 0.1,
    maxSpeed: 2.0
};

export const CAMERA_CONFIG = {
    fov: 75,
    near: 0.1,
    far: 1000,
    defaultHeight: 27,
    topDownHeight: 60,
    minTopDownHeight: 30,
    maxTopDownHeight: 120
};

export const LIGHTING_CONFIG = {
    ambient: {
        color: 0xffffff,
        intensity: 0.6
    },
    directional: {
        color: 0xffffcc,
        intensity: 1.5,
        position: [50, 100, 50]
    },
    hemisphere: {
        skyColor: 0xffffcc,
        groundColor: 0x1a2a6c,
        intensity: 0.4
    }
};

export const SKY_CONFIG = {
    radius: 400,
    segments: 32,
    rings: 15,
    topColor: 0xb3e0ff,
    bottomColor: 0x1a2a6c,
    offset: 33,
    exponent: 0.4
}; 