import * as THREE from 'three';
import { buildSatellite } from '../utils/GeometryUtils.js';
import { randomInRange, randomInSphere } from '../utils/MathUtils.js';
import { SATELLITE_MASS } from '../constants.js';

export default class Satellite {
  constructor(position = null) {
    this.mesh = buildSatellite();
    this.mesh.castShadow = true;

    this.position = this.mesh.position;
    if (position) {
      this.position.copy(position);
    } else {
      this.position.copy(randomInSphere(1000));
    }

    // Random orientation
    this.mesh.rotation.x = Math.random() * Math.PI * 2;
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
    this.mesh.rotation.z = Math.random() * Math.PI * 2;

    this.collisionRadius = 4;
    this.mass = SATELLITE_MASS;

    // Near-zero initial velocity (slow drift)
    this.velocity = new THREE.Vector3(
      randomInRange(-2, 2),
      randomInRange(-2, 2),
      randomInRange(-2, 2)
    );

    this.angularVelocity = new THREE.Vector3(
      randomInRange(-0.2, 0.2),
      randomInRange(-0.2, 0.2),
      randomInRange(-0.2, 0.2)
    );
  }

  update(dt) {
    this.position.addScaledVector(this.velocity, dt);

    const axis = this.angularVelocity.clone().normalize();
    if (axis.length() > 0) {
      const angle = this.angularVelocity.length() * dt;
      this.mesh.rotateOnWorldAxis(axis, angle);
    }
  }
}
