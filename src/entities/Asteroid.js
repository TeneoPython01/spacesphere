import * as THREE from 'three';
import { buildDisplacedIcosphere } from '../utils/GeometryUtils.js';
import { randomInRange, randomInSphere } from '../utils/MathUtils.js';
import { ASTEROID_MASS_RANGE } from '../constants.js';

export default class Asteroid {
  constructor(position = null) {
    const radius = randomInRange(5, 25);
    const { geometry, material } = buildDisplacedIcosphere(radius, 2, radius * 0.3);

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.position = this.mesh.position;
    if (position) {
      this.position.copy(position);
    } else {
      this.position.copy(randomInSphere(1000));
    }

    this.radius = radius;
    this.collisionRadius = radius;

    // Mass proportional to volume (radius^3)
    this.mass = (radius / 5) * (ASTEROID_MASS_RANGE[1] - ASTEROID_MASS_RANGE[0]) + ASTEROID_MASS_RANGE[0];

    // Physics
    this.velocity = new THREE.Vector3(
      randomInRange(-8, 8),
      randomInRange(-8, 8),
      randomInRange(-8, 8)
    );

    this.angularVelocity = new THREE.Vector3(
      randomInRange(-0.5, 0.5),
      randomInRange(-0.5, 0.5),
      randomInRange(-0.5, 0.5)
    );
  }

  update(dt) {
    // Update position from velocity
    this.position.addScaledVector(this.velocity, dt);

    // Update rotation from angular velocity
    const axis = this.angularVelocity.clone().normalize();
    const angle = this.angularVelocity.length() * dt;
    const dq = new THREE.Quaternion();
    dq.setFromAxisAngle(axis, angle);
    this.mesh.quaternion.multiplyQuaternions(dq, this.mesh.quaternion);
  }
}
