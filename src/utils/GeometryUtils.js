import * as THREE from 'three';

export function buildDisplacedIcosphere(radius, detail, displacementScale) {
  const geometry = new THREE.IcosahedronGeometry(radius, detail).toNonIndexed();

  const positions = geometry.attributes.position;
  const posArray = positions.array;

  for (let i = 0; i < posArray.length; i += 3) {
    const x = posArray[i];
    const y = posArray[i + 1];
    const z = posArray[i + 2];

    const len = Math.sqrt(x * x + y * y + z * z);
    const nx = x / len;
    const ny = y / len;
    const nz = z / len;

    const displacement = (Math.random() * 2 - 1) * displacementScale;

    posArray[i] += nx * displacement;
    posArray[i + 1] += ny * displacement;
    posArray[i + 2] += nz * displacement;
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0x4a4a52,
    roughness: 0.9,
    metalness: 0.1,
  });

  return { geometry, material };
}

export function buildSatellite() {
  const group = new THREE.Group();

  // Main body
  const bodyGeom = new THREE.BoxGeometry(4, 2, 4);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.8,
    roughness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  group.add(body);

  // Mast
  const mastGeom = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
  const mastMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.9,
    roughness: 0.1,
  });
  const mast = new THREE.Mesh(mastGeom, mastMat);
  mast.position.y = 2.5;
  group.add(mast);

  // Solar panels
  const panelGeom = new THREE.BoxGeometry(5, 0.1, 2);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.7,
    roughness: 0.3,
  });

  const panelLeft = new THREE.Mesh(panelGeom, panelMat);
  panelLeft.position.set(-3, 0, 0);
  group.add(panelLeft);

  const panelRight = new THREE.Mesh(panelGeom, panelMat);
  panelRight.position.set(3, 0, 0);
  group.add(panelRight);

  return group;
}

export function buildEnemyShip() {
  const group = new THREE.Group();

  // Hull - cone pointing forward
  const hullGeom = new THREE.ConeGeometry(1.5, 6, 8);
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x8b2323,
    metalness: 0.6,
    roughness: 0.4,
  });
  const hull = new THREE.Mesh(hullGeom, hullMat);
  hull.rotation.z = Math.PI / 2; // point along -Z
  group.add(hull);

  // Engine nacelle
  const nacelleGeom = new THREE.BoxGeometry(4, 0.5, 2);
  const nacelleMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.8,
    roughness: 0.2,
  });
  const nacelle = new THREE.Mesh(nacelleGeom, nacelleMat);
  nacelle.position.z = -3;
  group.add(nacelle);

  return group;
}

export function buildPlayerShip() {
  const group = new THREE.Group();

  // Main hull - cone pointing forward
  const hullGeom = new THREE.ConeGeometry(1, 5, 8);
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x0066cc,
    metalness: 0.5,
    roughness: 0.5,
  });
  const hull = new THREE.Mesh(hullGeom, hullMat);
  hull.rotation.z = Math.PI / 2; // point along -Z
  group.add(hull);

  // Wings
  const wingGeom = new THREE.BoxGeometry(8, 0.3, 2);
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x004499,
    metalness: 0.4,
    roughness: 0.6,
  });
  const wings = new THREE.Mesh(wingGeom, wingMat);
  wings.position.z = -0.5;
  group.add(wings);

  // Engine exhausts
  const exhaustGeom = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 6);
  const exhaustMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.9,
    roughness: 0.1,
  });

  const exhaustLeft = new THREE.Mesh(exhaustGeom, exhaustMat);
  exhaustLeft.position.set(-1.5, 0, 2.5);
  exhaustLeft.rotation.z = Math.PI / 2;
  group.add(exhaustLeft);

  const exhaustRight = new THREE.Mesh(exhaustGeom, exhaustMat);
  exhaustRight.position.set(1.5, 0, 2.5);
  exhaustRight.rotation.z = Math.PI / 2;
  group.add(exhaustRight);

  return group;
}
