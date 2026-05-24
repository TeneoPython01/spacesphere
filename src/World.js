import { WORLD_RADIUS } from './constants.js';

export default class World {
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
    for (const obj of this.objects) {
      // Apply spherical wrapping: if object exits sphere, teleport to antipodal point
      const pos = obj.position;
      const distSq = pos.lengthSq();
      const radiusSq = WORLD_RADIUS * WORLD_RADIUS;

      if (distSq > radiusSq) {
        // Antipodal teleport: opposite side of sphere
        pos.negate();
      }
    }
  }
}
