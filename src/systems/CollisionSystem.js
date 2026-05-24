import { elasticCollide, wrappedDistSq } from '../utils/MathUtils.js';
import { WORLD_RADIUS, COLLISION_RESTITUTION } from '../constants.js';

export default class CollisionSystem {
  constructor() {
    this.objects = [];
  }

  register(obj) {
    this.objects.push(obj);
  }

  unregister(obj) {
    const idx = this.objects.indexOf(obj);
    if (idx !== -1) {
      this.objects.splice(idx, 1);
    }
  }

  update(dt) {
    const n = this.objects.length;

    // Broad phase: O(n^2) sphere collision check
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = this.objects[i];
        const b = this.objects[j];

        const distSq = wrappedDistSq(a.position, b.position, WORLD_RADIUS);
        const minDistSq = (a.collisionRadius + b.collisionRadius) ** 2;

        if (distSq < minDistSq) {
          // Collision detected
          elasticCollide(
            a.position,
            a.velocity,
            a.mass,
            b.position,
            b.velocity,
            b.mass,
            COLLISION_RESTITUTION
          );

          // Separate objects to prevent sticking
          const dist = Math.sqrt(distSq);
          const overlap = a.collisionRadius + b.collisionRadius - dist;
          if (overlap > 0) {
            const dir = b.position.clone().sub(a.position).normalize();
            const sep = overlap / 2 + 0.01;
            a.position.addScaledVector(dir, -sep);
            b.position.addScaledVector(dir, sep);
          }
        }
      }
    }
  }
}
