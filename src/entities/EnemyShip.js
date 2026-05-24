import * as THREE from 'three';
import { buildEnemyShip } from '../utils/GeometryUtils.js';
import { randomInRange, randomInSphere } from '../utils/MathUtils.js';
import { ENEMY_MASS } from '../constants.js';

export default class EnemyShip {
  constructor(position = null) {
    this.mesh = buildEnemyShip();
    this.mesh.castShadow = true;

    this.position = this.mesh.position;
    if (position) {
      this.position.copy(position);
    } else {
      // Spawn away from origin
      let pos = randomInSphere(1000);
      while (pos.length() < 200) {
        pos = randomInSphere(1000);
      }
      this.position.copy(pos);
    }

    this.quaternion = this.mesh.quaternion;
    this.collisionRadius = 3;
    this.mass = ENEMY_MASS;

    // Initial velocity
    this.velocity = new THREE.Vector3(
      randomInRange(-20, 20),
      randomInRange(-20, 20),
      randomInRange(-20, 20)
    );

    // AI wandering
    this.wanderTimer = randomInRange(3, 8);
    this.wanderTargetVelocity = this.velocity.clone();
    this.wanderSpeed = randomInRange(5, 20);
  }

  update(dt) {
    // Update position
    this.position.addScaledVector(this.velocity, dt);

    // Wander AI
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      // Pick new wander direction
      this.wanderTargetVelocity = new THREE.Vector3(
        randomInRange(-1, 1),
        randomInRange(-1, 1),
        randomInRange(-1, 1)
      ).normalize().multiplyScalar(this.wanderSpeed);
      this.wanderTimer = randomInRange(3, 8);
    }

    // Lerp velocity toward target
    this.velocity.lerp(this.wanderTargetVelocity, 0.02);

    // Orient to face velocity direction
    const dir = this.velocity.clone().normalize();
    if (dir.length() > 0.1) {
      const lookTarget = new THREE.Vector3().copy(this.position).add(dir);
      this.mesh.lookAt(lookTarget);
    }
  }
}
