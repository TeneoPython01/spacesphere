# Spacesphere Implementation Notes

## Project Status: Complete

All core features have been implemented. The game is ready to run with `npm install && npm run dev`.

## File Structure Summary

```
spacesphere/
├── index.html              # Entry point with canvas and HUD overlay
├── style.css               # Fullscreen canvas + minimap styling
├── package.json            # Dependencies: three, vite
├── vite.config.js          # Vite config (port 3000)
├── src/
│   ├── main.js             # Entry script
│   ├── Game.js             # Main orchestrator
│   ├── constants.js        # All tunable parameters
│   ├── World.js            # Spherical wrapping logic
│   ├── controls/ShipControls.js         # 6-DoF input + pointer lock
│   ├── entities/           # Object definitions
│   │   ├── PlayerShip.js
│   │   ├── Asteroid.js
│   │   ├── Debris.js
│   │   ├── Satellite.js
│   │   ├── EnemyShip.js
│   │   └── StarField.js
│   ├── systems/            # Game systems
│   │   ├── ProceduralGen.js        # Object spawning
│   │   ├── CollisionSystem.js      # Elastic physics
│   │   ├── LaserSystem.js          # Raycasting + beam visual
│   │   └── AISystem.js             # Enemy wander AI
│   ├── ui/                 # User interface
│   │   ├── HUD.js          # Speed readout
│   │   └── Minimap.js      # 3-view radar
│   └── utils/              # Helpers
│       ├── MathUtils.js    # Physics helpers
│       └── GeometryUtils.js # Mesh builders
```

## Key Implementation Details

### Spherical World Wrapping (World.js)
- Objects checked each frame: if `position.length() > WORLD_RADIUS`, negate position
- Teleports object to antipodal point while keeping velocity intact
- Stars track camera position instead of wrapping

### Elastic Collision (CollisionSystem.js)
- O(n²) broad-phase sphere check using wrapped distance
- Uses impulse-based elastic collision formula
- Separation push prevents overlap sticking

### Laser System (LaserSystem.js)
- Uses Three.js Raycaster for instant hit detection
- Creates visible beam mesh that fades out
- Tracks cooldown (0.3 seconds)
- Automatically removes destroyed objects from all tracking

### Controls (ShipControls.js)
- Pointer Lock API for mouse capture (click to enable)
- Quaternion-based orientation (no gimbal lock)
- Incremental rotation accumulation per frame
- Velocity damping for space-like feel (0.99 per frame)

### Minimaps (Minimap.js)
- 3 canvas elements (XY, XZ, YZ) 
- Draw circle boundary representing sphere cross-section
- Objects rendered as distinct shapes: ship=triangle, asteroid=circle, etc.

## Constants to Tune

Edit `src/constants.js` to adjust:
- `WORLD_RADIUS`: Size of play space (default: 1000)
- Object counts: `ASTEROID_COUNT`, `DEBRIS_COUNT`, etc.
- Physics: `THRUST_FORCE`, `MAX_SPEED`, `VELOCITY_DAMPING`
- Laser: `LASER_COOLDOWN`, `LASER_BEAM_DURATION`
- Minimap: `MINIMAP_SIZE`

## Potential Enhancements

See the plan file for 20 enhancement ideas including:
- Enemy AI combat mode
- Shield/health system
- Asteroid mining
- Gravity well / black hole
- Wormholes
- Procedural planet
- Space station
- Weapon upgrades
- Particle explosions
- Spatial audio
- Nebula fog regions
- Multiplayer
- Leaderboards
- Gamepad support
- Multiple camera modes

## Debugging Tips

- Open browser console (F12) for any errors
- Check `constants.js` if performance is poor (reduce object counts)
- Check `ShipControls.js` if controls feel sluggish (adjust `MOUSE_SENSITIVITY`)
- Check collision feel by adjusting `COLLISION_RESTITUTION` (0.0 = no bounce, 1.0 = full bounce)
- Check minimap visibility by adjusting canvas background color in `style.css`

## Next Steps After Implementation

1. Test in multiple browsers for WebGL compatibility
2. Optimize if frame rate drops (consider spatial hashing for collision)
3. Add missing features from enhancement list as desired
4. Consider mobile support (touch controls, gamepad detection)
5. Deploy to netlify/vercel for sharing