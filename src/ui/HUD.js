export default class HUD {
  constructor(playerShip) {
    this.playerShip = playerShip;
    this.speedReadout = document.getElementById('speed-readout');
  }

  update(dt) {
    const speed = this.playerShip.velocity.length();
    this.speedReadout.textContent = `Speed: ${speed.toFixed(1)}`;
  }
}
