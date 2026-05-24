import * as THREE from 'three';
import { randomInRange, randomInSphere } from '../utils/MathUtils.js';
import { DEBRIS_MASS } from '../constants.js';

export default class Debris {
  constructor(position = null) {
    // Random geometric fragment
    const choice = Math.floor(Math.random() * 3);
    let geometry;

    if (choice === 0) {
      geometry = new THREE.BoxGeometry(
        randomInRange(0.5, 1.5),
        randomInRange(0.5, 1.5),
        randomInRange(0.5, 1.5)
      );
    } else if (choice === 1) {
      geometry = new THREE.CylinderGeometry(
        randomInRange(0.3, 0.8),
        randomInRange(0.3, 0.8),
        randomInRange(0.8, 2),
        6
      );
    } else {
      geometry = new THREE.TorusGeometry(
        randomInRange(0.5, 1),
        randomInRange(0.2, 0.5),
        8,
        6
      );
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.2,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.position = this.mesh.position;
    if (position) {
      this.position.copy(position);
    } else {
      this.position.copy(randomInSphere(1000));
    }

    this.collisionRadius = 1;
    this.mass = DEBRIS_MASS;

    // Higher initial velocity
    this.velocity = new THREE.Vector3(
      randomInRange(-15, 15),
      randomInRange(-15, 15),
      randomInRange(-15, 15)
    );

    this.angularVelocity = new THREE.Vector3(
      randomInRange(-2, 2),
      randomInRange(-2, 2),
      randomInRange(-2, 2)
    );
  }

  update(dt) {
    this.position.addScaledVector(this.velocity, dt);

    const axis = this.angularVelocity.clone().normalize();
    const angle = this.angularVelocity.length() * dt;
    const dq = new THREE.Quaternion();
    dq.setFromAxisAngle(axis, angle);
    this.mesh.quaternion.multiplyQuaternions(dq, this.mesh.quaternion);
  }
}
