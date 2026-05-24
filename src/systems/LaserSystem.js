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

  _makeBeam(origin, endpoint, color, opacity) {
    const dir = new THREE.Vector3().subVectors(endpoint, origin);
    const length = dir.length();
    const forward = dir.clone().normalize();

    const geom = new THREE.CylinderGeometry(0.12, 0.12, length, 6);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    const beam = new THREE.Mesh(geom, mat);

    beam.position.copy(origin).addScaledVector(forward, length / 2);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), forward);

    return { mesh: beam, material: mat, timeRemaining: LASER_BEAM_DURATION };
  }

  fire(origin, direction) {
    if (this.cooldownRemaining > 0) return;

    this.lastHitObjects = [];

    const dir = direction.clone().normalize();
    const raycaster = new THREE.Raycaster(origin, dir, 0, LASER_RANGE);

    const meshes = this.collisionSystem.objects
      .map(obj => obj.mesh)
      .filter(mesh => mesh !== undefined);

    const hits = raycaster.intersectObjects(meshes, false);
    let endpoint;

    if (hits.length > 0) {
      const firstHit = hits[0];
      const hitObj = this.collisionSystem.objects.find(obj => obj.mesh === firstHit.object);
      if (hitObj) {
        this.lastHitObjects.push(hitObj);
        endpoint = firstHit.point;
      }
    }

    if (!endpoint) {
      endpoint = origin.clone().addScaledVector(dir, LASER_RANGE);
    }

    const entry = this._makeBeam(
      origin,
      endpoint,
      endpoint === origin ? 0x00ff88 : 0x00ffff,
      hits.length > 0 ? 1.0 : 0.6
    );
    this.scene.add(entry.mesh);
    this.beams.push(entry);

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
