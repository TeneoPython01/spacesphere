export default class AISystem {
  constructor(enemies) {
    this.enemies = enemies;
  }

  update(dt) {
    for (const enemy of this.enemies) {
      enemy.update(dt);
    }
  }
}
