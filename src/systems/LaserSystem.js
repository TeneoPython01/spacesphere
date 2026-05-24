import * as THREE from 'three';
import { LASER_BEAM_DURATION, LASER_COOLDOWN, LASER_RANGE } from '../constants.js';

export default class LaserSystem {
  constructor(scene, collisionSystem) {
    this.scene = scene;
    this.collisionSystem = collisionSystem;
    this.beams = [];
    this.cooldownRemaining = 0;
    this.lastHitObjects = [];
  }

  fire(origin, direction) {
    if (this.cooldownRemaining > 0) return;

    this.lastHitObjects = [];

    const raycaster = new THREE.Raycaster(origin, direction.normalize(), 0, LASER_RANGE);

    // Get all collidable meshes
    const meshes = this.collisionSystem.objects
      .map(obj => obj.mesh)
      .filter(mesh => mesh !== undefined);

    const hits = raycaster.intersectObjects(meshes, false);

    if (hits.length > 0) {
      const firstHit = hits[0];
      const hitObj = this.collisionSystem.objects.find(obj => obj.mesh === firstHit.object);

      if (hitObj) {
        this.lastHitObjects.push(hitObj);
        const hitPoint = firstHit.point;

        // Create visual beam
        const beamLength = origin.distanceTo(hitPoint);
        const beamGeom = new THREE.CylinderGeometry(0.15, 0.15, beamLength, 8);
        const beamMat = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          transparent: true,
          opacity: 1,
        });

        const beam = new THREE.Mesh(beamGeom, beamMat);

        // Position beam between origin and hit point
        const midpoint = new THREE.Vector3()
          .addVectors(origin, hitPoint)
          .multiplyScalar(0.5);
        beam.position.copy(midpoint);

        // Orient beam along ray direction
        const up = new THREE.Vector3(0, 1, 0);
        const forward = direction.clone().normalize();
        if (Math.abs(up.dot(forward)) > 0.99) {
          up.set(1, 0, 0);
        }
        const right = up.clone().cross(forward).normalize();
        const newUp = forward.clone().cross(right).normalize();
        const mat = new THREE.Matrix4();
        mat.makeBasis(right, newUp, forward.clone().negate());
        beam.quaternion.setFromRotationMatrix(mat);

        this.scene.add(beam);

        this.beams.push({
          mesh: beam,
          material: beamMat,
          timeRemaining: LASER_BEAM_DURATION,
        });
      }
    } else {
      // Create a long beam that reaches LASER_RANGE
      const beamGeom = new THREE.CylinderGeometry(0.1, 0.1, LASER_RANGE, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        transparent: true,
        opacity: 0.6,
      });

      const beam = new THREE.Mesh(beamGeom, beamMat);
      const midpoint = origin
        .clone()
        .addScaledVector(direction.normalize(), LASER_RANGE / 2);
      beam.position.copy(midpoint);

      const up = new THREE.Vector3(0, 1, 0);
      const forward = direction.clone().normalize();
      if (Math.abs(up.dot(forward)) > 0.99) {
        up.set(1, 0, 0);
      }
      const right = up.clone().cross(forward).normalize();
      const newUp = forward.clone().cross(right).normalize();
      const mat = new THREE.Matrix4();
      mat.makeBasis(right, newUp, forward.clone().negate());
      beam.quaternion.setFromRotationMatrix(mat);

      this.scene.add(beam);

      this.beams.push({
        mesh: beam,
        material: beamMat,
        timeRemaining: LASER_BEAM_DURATION,
      });
    }

    this.cooldownRemaining = LASER_COOLDOWN;
  }

  update(dt) {
    // Update cooldown
    this.cooldownRemaining -= dt;

    // Update beams
    const beamsToRemove = [];
    for (let i = 0; i < this.beams.length; i++) {
      const beam = this.beams[i];
      beam.timeRemaining -= dt;

      // Fade out
      beam.material.opacity = Math.max(0, beam.timeRemaining / LASER_BEAM_DURATION);

      if (beam.timeRemaining <= 0) {
        this.scene.remove(beam.mesh);
        beam.mesh.geometry.dispose();
        beam.material.dispose();
        beamsToRemove.push(i);
      }
    }

    // Remove expired beams
    for (let i = beamsToRemove.length - 1; i >= 0; i--) {
      this.beams.splice(beamsToRemove[i], 1);
    }
  }
}
