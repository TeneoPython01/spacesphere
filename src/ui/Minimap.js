import { WORLD_RADIUS, MINIMAP_SIZE } from '../constants.js';

export default class Minimap {
  constructor(canvasXY, canvasXZ, canvasYZ) {
    this.canvases = [
      { canvas: canvasXY, axes: 'xy', label: 'XY (Z-axis)' },
      { canvas: canvasXZ, axes: 'xz', label: 'XZ (Y-axis)' },
      { canvas: canvasYZ, axes: 'yz', label: 'YZ (X-axis)' },
    ];

    this.objects = [];

    // Set canvas sizes
    for (const c of this.canvases) {
      c.width = MINIMAP_SIZE;
      c.height = MINIMAP_SIZE;
    }
  }

  addObject(obj, type) {
    this.objects.push({ obj, type });
  }

  removeObject(obj) {
    this.objects = this.objects.filter(o => o.obj !== obj);
  }

  draw() {
    for (const canvasInfo of this.canvases) {
      const canvas = canvasInfo.canvas;
      const ctx = canvas.getContext('2d');
      const axes = canvasInfo.axes;

      const w = canvas.width;
      const h = canvas.height;

      // Clear
      ctx.fillStyle = 'rgba(10, 10, 20, 0.9)';
      ctx.fillRect(0, 0, w, h);

      // Draw border circle
      ctx.strokeStyle = 'rgba(0, 255, 200, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();

      // Draw objects
      for (const { obj, type } of this.objects) {
        const pos = obj.position;
        let mapX, mapY;

        // Project based on axis pair
        if (axes === 'xy') {
          mapX = (pos.x / WORLD_RADIUS) * (w / 2) + w / 2;
          mapY = (pos.y / WORLD_RADIUS) * (h / 2) + h / 2;
        } else if (axes === 'xz') {
          mapX = (pos.x / WORLD_RADIUS) * (w / 2) + w / 2;
          mapY = (pos.z / WORLD_RADIUS) * (h / 2) + h / 2;
        } else {
          // yz
          mapX = (pos.y / WORLD_RADIUS) * (w / 2) + w / 2;
          mapY = (pos.z / WORLD_RADIUS) * (h / 2) + h / 2;
        }

        // Clamp to visible area
        if (mapX < 0 || mapX > w || mapY < 0 || mapY > h) {
          continue;
        }

        ctx.save();
        ctx.translate(mapX, mapY);

        if (type === 'ship') {
          // White triangle pointing in yaw direction
          ctx.fillStyle = '#ffffff';
          ctx.rotate(obj.mesh.rotation.order === 'YXZ' ? 0 : 0); // simplify for now
          ctx.beginPath();
          ctx.moveTo(0, -6);
          ctx.lineTo(-4, 4);
          ctx.lineTo(4, 4);
          ctx.closePath();
          ctx.fill();
        } else if (type === 'asteroid') {
          // Gray circle, size proportional to radius
          ctx.fillStyle = '#888888';
          const r = Math.min(6, Math.max(2, obj.radius ? obj.radius / 5 : 4));
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'debris') {
          // White tiny dot
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'satellite') {
          // Cyan square
          ctx.fillStyle = '#00ffff';
          ctx.fillRect(-2, -2, 4, 4);
        } else if (type === 'enemy') {
          // Red circle
          ctx.fillStyle = '#ff4444';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }
  }
}
