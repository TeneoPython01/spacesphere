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

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1155cc, metalness: 0.6, roughness: 0.4 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0x0044bb, metalness: 0.7, roughness: 0.3 });
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x0d47a1, metalness: 0.5, roughness: 0.5, side: THREE.DoubleSide });
  const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.8 });
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
  const glowMat = new THREE.MeshStandardMaterial({ color: 0xff7700, emissive: 0xff7700, emissiveIntensity: 1.5 });

  // Fuselage - CylinderGeometry default axis is Y; rotation.x = PI/2 aligns it to Z
  const fuselageGeom = new THREE.CylinderGeometry(0.35, 0.4, 8, 10);
  const fuselage = new THREE.Mesh(fuselageGeom, bodyMat);
  fuselage.rotation.x = Math.PI / 2;
  group.add(fuselage);

  // Nose cone - rotation.x = -PI/2 points the cone tip at -Z (forward)
  const noseGeom = new THREE.ConeGeometry(0.35, 2.5, 10);
  const nose = new THREE.Mesh(noseGeom, noseMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = -5.25;
  group.add(nose);

  // Cockpit glass bubble (hemisphere on top, forward)
  const cockpitGeom = new THREE.SphereGeometry(0.4, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
  cockpit.position.set(0, 0.35, -1.5);
  group.add(cockpit);

  // Delta wings via ExtrudeGeometry in local XY, rotated -PI/2 around X to lie flat in XZ
  // After rotation: shape_x → world_x, shape_y → world_(-z), extrude_z → world_y (thickness)
  const wingExtrude = { depth: 0.2, bevelEnabled: false };

  const portShape = new THREE.Shape();
  portShape.moveTo(-0.35, 2);    // forward root (world z = -2)
  portShape.lineTo(-4, 0);       // outer leading tip (world z = 0)
  portShape.lineTo(-3.5, -2);    // outer trailing tip (world z = 2)
  portShape.lineTo(-0.35, -2);   // rear root (world z = 2)
  portShape.closePath();

  const portWing = new THREE.Mesh(new THREE.ExtrudeGeometry(portShape, wingExtrude), wingMat);
  portWing.rotation.x = -Math.PI / 2;
  portWing.position.y = -0.1;
  group.add(portWing);

  const starShape = new THREE.Shape();
  starShape.moveTo(0.35, 2);
  starShape.lineTo(4, 0);
  starShape.lineTo(3.5, -2);
  starShape.lineTo(0.35, -2);
  starShape.closePath();

  const starWing = new THREE.Mesh(new THREE.ExtrudeGeometry(starShape, wingExtrude), wingMat);
  starWing.rotation.x = -Math.PI / 2;
  starWing.position.y = -0.1;
  group.add(starWing);

  // Engine nacelles at rear
  const nacelleGeom = new THREE.CylinderGeometry(0.25, 0.3, 2, 8);

  const leftNacelle = new THREE.Mesh(nacelleGeom, engineMat);
  leftNacelle.rotation.x = Math.PI / 2;
  leftNacelle.position.set(-1.2, -0.3, 3);
  group.add(leftNacelle);

  const rightNacelle = new THREE.Mesh(nacelleGeom, engineMat);
  rightNacelle.rotation.x = Math.PI / 2;
  rightNacelle.position.set(1.2, -0.3, 3);
  group.add(rightNacelle);

  // Engine glow discs
  const glowGeom = new THREE.CircleGeometry(0.22, 8);

  const leftGlow = new THREE.Mesh(glowGeom, glowMat);
  leftGlow.position.set(-1.2, -0.3, 4.1);
  group.add(leftGlow);

  const rightGlow = new THREE.Mesh(glowGeom, glowMat);
  rightGlow.position.set(1.2, -0.3, 4.1);
  group.add(rightGlow);

  return group;
}
