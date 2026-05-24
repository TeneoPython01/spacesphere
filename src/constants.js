// World dimensions
export const WORLD_RADIUS = 1000;

// Object counts
export const STAR_COUNT = 3000;
export const ASTEROID_COUNT = 75;
export const DEBRIS_COUNT = 50;
export const SATELLITE_COUNT = 10;
export const ENEMY_COUNT = 7;

// Physics
export const COLLISION_RESTITUTION = 0.85;
export const SHIP_MASS = 5;
export const DEBRIS_MASS = 2;
export const SATELLITE_MASS = 15;
export const ENEMY_MASS = 5;
export const ASTEROID_MASS_RANGE = [20, 80];

// Thrust and speed
export const THRUST_FORCE = 40;
export const MAX_SPEED = 120;
export const VELOCITY_DAMPING = 0.99; // per frame

// Mouse sensitivity
export const MOUSE_SENSITIVITY = 0.004;

// Laser
export const LASER_BEAM_DURATION = 0.18;
export const LASER_COOLDOWN = 0.3;
export const LASER_RANGE = 5000;

// UI
export const MINIMAP_SIZE = 120;
export const MINIMAP_RANGE = 1000; // maps world radius to minimap
