import * as THREE from 'three';
import { THRUST_FORCE, MAX_SPEED, VELOCITY_DAMPING, MOUSE_SENSITIVITY } from '../constants.js';

export default class ShipControls {
  constructor(ship, canvas) {
    this.ship = ship;
    this.canvas = canvas;
    this.enabled = false;

    this.keys = new Set();
    this.mouseDelta = new THREE.Vector2(0, 0);

    this.onFire = null;

    // Input listeners
    document.addEventListener('keydown', e => this._onKeyDown(e));
    document.addEventListener('keyup', e => this._onKeyUp(e));
    document.addEventListener('mousemove', e => this._onMouseMove(e));
  }

  _onKeyDown(event) {
    if (!this.enabled) return;
    this.keys.add(event.key.toLowerCase());

    // Fire on Space
    if (event.code === 'Space' && this.onFire) {
      this.onFire();
      event.preventDefault();
    }
  }

  _onKeyUp(event) {
    this.keys.delete(event.key.toLowerCase());
  }

  _onMouseMove(event) {
    if (!this.enabled) return;
    this.mouseDelta.x += event.movementX;
    this.mouseDelta.y += event.movementY;
  }

  update(dt) {
    // Apply mouse look using ship-local axes so feel is consistent regardless of roll
    // Drag right → turn right (yaw around local up, negative = clockwise from above)
    // Drag down → pitch up (pull-stick convention, positive movementY = nose up)
    const yawDelta = -this.mouseDelta.x * MOUSE_SENSITIVITY;
    const pitchDelta = this.mouseDelta.y * MOUSE_SENSITIVITY;

    const yawQuat = new THREE.Quaternion();
    yawQuat.setFromAxisAngle(this.ship.getUpVector(), yawDelta);

    const pitchQuat = new THREE.Quaternion();
    pitchQuat.setFromAxisAngle(this.ship.getRightVector(), pitchDelta);

    const rotationQuat = new THREE.Quaternion();
    rotationQuat.multiplyQuaternions(yawQuat, pitchQuat);

    this.ship.quaternion.multiplyQuaternions(rotationQuat, this.ship.quaternion);

    // Roll (Q/E)
    let rollDelta = 0;
    if (this.keys.has('q')) rollDelta += 2 * dt;
    if (this.keys.has('e')) rollDelta -= 2 * dt;

    if (rollDelta !== 0) {
      const rollQuat = new THREE.Quaternion();
      rollQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rollDelta);
      this.ship.quaternion.multiplyQuaternions(rollQuat, this.ship.quaternion);
    }

    // Reset mouse delta
    this.mouseDelta.set(0, 0);

    // Thrust and strafe
    const thrustDir = this.ship.getForwardVector();
    const rightDir = this.ship.getRightVector();
    const upDir = this.ship.getUpVector();

    let thrustMag = 0;
    if (this.keys.has('w')) thrustMag += THRUST_FORCE;
    if (this.keys.has('s')) thrustMag -= THRUST_FORCE;

    let strafeX = 0;
    if (this.keys.has('a')) strafeX -= THRUST_FORCE;
    if (this.keys.has('d')) strafeX += THRUST_FORCE;

    let strafeY = 0;
    if (this.keys.has(' ')) strafeY += THRUST_FORCE;
    if (this.keys.has('shift')) strafeY -= THRUST_FORCE;

    if (thrustMag !== 0) {
      this.ship.applyThrust(thrustDir, thrustMag * dt);
    }
    if (strafeX !== 0) {
      this.ship.applyThrust(rightDir, strafeX * dt);
    }
    if (strafeY !== 0) {
      this.ship.applyThrust(upDir, strafeY * dt);
    }

    // Clamp speed
    if (this.ship.velocity.length() > MAX_SPEED) {
      this.ship.velocity.normalize().multiplyScalar(MAX_SPEED);
    }

    // Apply damping
    this.ship.velocity.multiplyScalar(VELOCITY_DAMPING);

    // Update ship position
    this.ship.update(dt);
  }
}
