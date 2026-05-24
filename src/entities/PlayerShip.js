import * as THREE from 'three';
import { buildPlayerShip } from '../utils/GeometryUtils.js';
import { SHIP_MASS } from '../constants.js';

export default class PlayerShip {
  constructor() {
    this.mesh = buildPlayerShip();
    this.position = this.mesh.position;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.quaternion = this.mesh.quaternion;
    this.mass = SHIP_MASS;
    this.collisionRadius = 2;

    // Rotation state
    this.angularVelocity = new THREE.Vector3(0, 0, 0);
  }

  getForwardVector() {
    // Ship points along -Z in local space
    return new THREE.Vector3(0, 0, -1).applyQuaternion(this.quaternion);
  }

  getRightVector() {
    // Ship right is +X in local space
    return new THREE.Vector3(1, 0, 0).applyQuaternion(this.quaternion);
  }

  getUpVector() {
    // Ship up is +Y in local space
    return new THREE.Vector3(0, 1, 0).applyQuaternion(this.quaternion);
  }

  applyThrust(direction, magnitude) {
    this.velocity.addScaledVector(direction, magnitude);
  }

  update(dt) {
    // Update position from velocity
    this.position.addScaledVector(this.velocity, dt);
  }
}
