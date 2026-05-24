import Asteroid from '../entities/Asteroid.js';
import Debris from '../entities/Debris.js';
import Satellite from '../entities/Satellite.js';
import EnemyShip from '../entities/EnemyShip.js';
import {
  ASTEROID_COUNT,
  DEBRIS_COUNT,
  SATELLITE_COUNT,
  ENEMY_COUNT,
} from '../constants.js';

export default class ProceduralGen {
  generate() {
    const asteroids = [];
    const debris = [];
    const satellites = [];
    const enemies = [];

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      asteroids.push(new Asteroid());
    }

    for (let i = 0; i < DEBRIS_COUNT; i++) {
      debris.push(new Debris());
    }

    for (let i = 0; i < SATELLITE_COUNT; i++) {
      satellites.push(new Satellite());
    }

    for (let i = 0; i < ENEMY_COUNT; i++) {
      enemies.push(new EnemyShip());
    }

    return { asteroids, debris, satellites, enemies };
  }
}
