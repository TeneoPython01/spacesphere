import * as THREE from 'three';
import { STAR_COUNT } from '../constants.js';

export default class StarField {
  constructor() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Random position in large sphere around origin
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2000 + Math.random() * 2000; // 2000-4000 units away

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Random color (white to bluish)
      const color = new THREE.Color().setHSL(
        Math.random() * 0.1 + 0.55, // hue: blue-ish
        Math.random() * 0.3,
        Math.random() * 0.5 + 0.5 // brightness
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      sizeAttenuation: true,
    });

    this.mesh = new THREE.Points(geometry, material);
  }

  update(camera) {
    // Follow camera so stars always surround the player
    this.mesh.position.copy(camera.position);
  }
}
