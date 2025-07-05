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

export const MODE_CONTENT = {
    [MODES.OVERVIEW]: `
        <div style="font-size: 0.9rem; line-height: 1.4;">
            <div style="font-weight: bold; color: #67e8f9; margin-bottom: 0.5rem;">Overview Mode</div>
            <div style="opacity: 0.9;">
                • Click/drag/swipe to move around<br>
                • Scroll or use slider to zoom in/out<br>
                • Click the labels for info<br><br>

                In this mode, you can view the
                school and locations from above.
            </div>
        </div>
    `,
    [MODES.EXPLORE]: `
        <div style="font-size: 0.9rem; line-height: 1.4;">
            <div style="font-weight: bold; color: #67e8f9; margin-bottom: 0.5rem;">Explore Mode</div>
            <div style="opacity: 0.9;">
                • Click anywhere to get started
                • Use <b>W, A, S, D</b> keys to move<br>
                • Use <b>Space</b> to go up and <b>Shift</b> to go down<br>
                • Move mouse to look around<br>
                • Press <b>Escape</b> to unlock your mouse<br>
                • Scroll or use slider for movement speed<br><br>
                
                Experience the campus in 3D!
                Feel free to explore the buildings and their interiors!
            </div>
        </div>
    `
};