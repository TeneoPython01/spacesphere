import * as THREE from 'three';
import { WORLD_RADIUS, MINIMAP_SIZE } from './constants.js';
import World from './World.js';
import PlayerShip from './entities/PlayerShip.js';
import StarField from './entities/StarField.js';
import ProceduralGen from './systems/ProceduralGen.js';
import CollisionSystem from './systems/CollisionSystem.js';
import LaserSystem from './systems/LaserSystem.js';
import AISystem from './systems/AISystem.js';
import ShipControls from './controls/ShipControls.js';
import HUD from './ui/HUD.js';
import Minimap from './ui/Minimap.js';

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.running = false;
    this.pointerLocked = false;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010208);
    this.scene.fog = new THREE.FogExp2(0x010208, 0.00005);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      8000
    );

    // Clock
    this.clock = new THREE.Clock();

    // Initialize systems and entities
    this._initLighting();
    this._initPlayer();
    this._initStarField();
    this._initWorld();
    this._initSystems();
    this._initInput();

    // Handle window resize
    window.addEventListener('resize', () => this._onWindowResize());
  }

  _initLighting() {
    // Ambient light - cold deep space
    const ambientLight = new THREE.AmbientLight(0x111827, 0.15);
    this.scene.add(ambientLight);

    // Directional light - distant sun
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5000, 3000, 2000);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 8000;
    sunLight.shadow.camera.left = -3000;
    sunLight.shadow.camera.right = 3000;
    sunLight.shadow.camera.top = 3000;
    sunLight.shadow.camera.bottom = -3000;
    this.scene.add(sunLight);

    this.sunLight = sunLight;
  }

  _initPlayer() {
    this.playerShip = new PlayerShip();
    this.scene.add(this.playerShip.mesh);

    // Attach camera as child of ship (cockpit view)
    this.playerShip.mesh.add(this.camera);
    this.camera.position.set(0, 3, 10);
    this.camera.lookAt(new THREE.Vector3(0, 0, -100));
  }

  _initStarField() {
    this.starField = new StarField();
    this.scene.add(this.starField.mesh);
  }

  _initWorld() {
    // Create World tracker
    this.world = new World();
    this.world.register(this.playerShip);

    // Create all procedural objects
    this.procGen = new ProceduralGen();
    const { asteroids, debris, satellites, enemies } = this.procGen.generate();

    this.asteroids = asteroids;
    this.debris = debris;
    this.satellites = satellites;
    this.enemies = enemies;

    // Add all to scene and world
    for (const asteroid of asteroids) {
      this.scene.add(asteroid.mesh);
      this.world.register(asteroid);
    }
    for (const debrisItem of debris) {
      this.scene.add(debrisItem.mesh);
      this.world.register(debrisItem);
    }
    for (const sat of satellites) {
      this.scene.add(sat.mesh);
      this.world.register(sat);
    }
    for (const enemy of enemies) {
      this.scene.add(enemy.mesh);
      this.world.register(enemy);
    }
  }

  _initSystems() {
    // Collision system
    this.collisionSystem = new CollisionSystem();
    this.collisionSystem.register(this.playerShip);
    for (const asteroid of this.asteroids) {
      this.collisionSystem.register(asteroid);
    }
    for (const debrisItem of this.debris) {
      this.collisionSystem.register(debrisItem);
    }
    for (const sat of this.satellites) {
      this.collisionSystem.register(sat);
    }
    for (const enemy of this.enemies) {
      this.collisionSystem.register(enemy);
    }

    // Laser system
    this.laserSystem = new LaserSystem(this.scene, this.collisionSystem);

    // AI system
    this.aiSystem = new AISystem(this.enemies);

    // Controls
    this.controls = new ShipControls(this.playerShip, this.canvas);
    this.controls.onFire = () => this._fireLaser();

    // HUD
    this.hud = new HUD(this.playerShip);

    // Minimap
    this.minimap = new Minimap(
      document.getElementById('minimap-xy'),
      document.getElementById('minimap-xz'),
      document.getElementById('minimap-yz')
    );
    this.minimap.addObject(this.playerShip, 'ship');
    for (const asteroid of this.asteroids) {
      this.minimap.addObject(asteroid, 'asteroid');
    }
    for (const debrisItem of this.debris) {
      this.minimap.addObject(debrisItem, 'debris');
    }
    for (const sat of this.satellites) {
      this.minimap.addObject(sat, 'satellite');
    }
    for (const enemy of this.enemies) {
      this.minimap.addObject(enemy, 'enemy');
    }
  }

  _initInput() {
    // Pointer lock
    document.addEventListener('pointerlockchange', () => this._onPointerLockChange());
    document.addEventListener('mozpointerlockchange', () => this._onPointerLockChange());

    this.canvas.addEventListener('click', () => this._requestPointerLock());

    // ESC to release
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.exitPointerLock();
      }
    });
  }

  _requestPointerLock() {
    this.canvas.requestPointerLock =
      this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
    this.canvas.requestPointerLock();
  }

  _onPointerLockChange() {
    this.pointerLocked =
      document.pointerLockElement === this.canvas ||
      document.mozPointerLockElement === this.canvas;

    const overlay = document.getElementById('pointer-lock-overlay');
    if (this.pointerLocked) {
      overlay.classList.add('hidden');
      this.controls.enabled = true;
    } else {
      overlay.classList.remove('hidden');
      this.controls.enabled = false;
    }
  }

  _fireLaser() {
    const forward = this.playerShip.getForwardVector();
    // Fire from nose tip (~7 units ahead of ship center)
    const origin = this.playerShip.mesh.position.clone().addScaledVector(forward, 7);
    this.laserSystem.fire(origin, forward);

    // Destroy hit objects in minimap and world/collision tracking
    const destroyed = this.laserSystem.lastHitObjects;
    for (const obj of destroyed) {
      this.scene.remove(obj.mesh);
      this.world.unregister(obj);
      this.collisionSystem.unregister(obj);
      this.minimap.removeObject(obj);
    }
  }

  _onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  start() {
    this.running = true;
    this._loop();
  }

  _loop = () => {
    requestAnimationFrame(this._loop);

    if (!this.running) return;

    const dt = Math.min(this.clock.getDelta(), 0.1);

    // Update systems in order
    if (this.pointerLocked) {
      this.controls.update(dt);
    }
    this.collisionSystem.update(dt);
    this.aiSystem.update(dt);
    this.laserSystem.update(dt);
    this.world.update(dt);
    this.starField.update(this.camera);

    // Update HUD
    this.hud.update(dt);
    this.minimap.draw();

    // Render
    this.renderer.render(this.scene, this.camera);
  };
}
