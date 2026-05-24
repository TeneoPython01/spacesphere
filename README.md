# Spacesphere - 3D Space Flight Game

A browser-based 3D space flight game built with Three.js. Fly your spaceship through a procedurally generated spherical universe with asteroids, satellites, debris, and enemy ships.

## Features

- **Full 6-DoF Flight**: Control your ship in all three axes with mouse-look and keyboard controls
- **Spherical World**: The universe wraps at boundaries — exit one side and re-enter at the antipodal point
- **Procedural Generation**: Asteroids, debris, satellites, enemy ships, and a star field all generated at startup
- **Elastic Collision Physics**: Collide with objects and watch physics interactions unfold
- **Laser Weapon**: Fire beams that destroy objects in their path (Space to fire)
- **3 Minimaps**: Real-time radar showing your position from three orthogonal perspectives (XY, XZ, YZ)
- **Enemy AI**: Other ships wander and drift through space

## Controls

- **Mouse**: Look around (yaw/pitch) — click canvas to enable flight mode
- **W/S**: Thrust forward/backward
- **A/D**: Strafe left/right
- **Space**: Strafe up
- **Shift**: Strafe down
- **Q/E**: Roll left/right
- **Space** (when locked): Fire laser
- **ESC**: Release pointer lock

## Getting Started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Opens automatically at `http://localhost:3000`.

## Build

```bash
npm run build
```

Outputs to `dist/` for deployment.

## Architecture

- **Game.js**: Main orchestrator and game loop
- **controls/ShipControls.js**: Input handling with Pointer Lock API
- **entities/**: PlayerShip, Asteroid, Debris, Satellite, EnemyShip, StarField
- **systems/**: CollisionSystem (elastic physics), LaserSystem (raycasting), AISystem (enemy behavior)
- **ui/**: HUD (speed readout), Minimap (3-view radar)
- **utils/**: Math utilities and procedural geometry builders

## Tech Stack

- **Three.js** for 3D rendering
- **Vite** for development and bundling
- Vanilla JavaScript (ES modules)
