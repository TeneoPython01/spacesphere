import * as THREE from 'three';

export function randomInSphere(radius) {
  let v;
  do {
    v = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
  } while (v.lengthSq() > 1);
  return v.multiplyScalar(radius * 0.95);
}

export function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

export function wrappedDistSq(posA, posB, radius) {
  const dDirect = posA.distanceToSquared(posB);
  const posB_antipode = new THREE.Vector3().copy(posB).negate();
  const dWrapped = posA.distanceToSquared(posB_antipode);
  return Math.min(dDirect, dWrapped);
}

export function wrappedDistanceVector(posA, posB, radius) {
  const direct = new THREE.Vector3().subVectors(posA, posB);
  const dDirect = direct.lengthSq();

  const antipode = new THREE.Vector3().copy(posB).negate();
  const wrapped = new THREE.Vector3().subVectors(posA, antipode);
  const dWrapped = wrapped.lengthSq();

  return dDirect < dWrapped ? direct : wrapped;
}

export function elasticCollide(posA, velA, massA, posB, velB, massB, restitution = 0.85) {
  // Use wrapped distance vector for the collision normal
  const n = wrappedDistanceVector(posA, posB).normalize();

  const relVel = new THREE.Vector3().subVectors(velA, velB);
  const vRel = relVel.dot(n);

  // Only collide if approaching
  if (vRel >= 0) return;

  const j = -(1 + restitution) * vRel / (1 / massA + 1 / massB);

  velA.addScaledVector(n, j / massA);
  velB.addScaledVector(n, -j / massB);
}
