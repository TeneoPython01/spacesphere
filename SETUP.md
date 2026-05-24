# Quick Setup Guide

## Prerequisites

Ensure you have Node.js (v16+) and npm installed.

```bash
node --version
npm --version
```

## Installation & Running

1. Navigate to the spacesphere directory:
```bash
cd c:\Users\TeneoBookUser\source\spacesphere
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will automatically open `http://localhost:3000` in your browser.

## First Time Playing

1. **Click the canvas** to enable flight mode (Pointer Lock)
2. **Move your mouse** to look around (yaw/pitch)
3. **Press W** to thrust forward
4. **Press A/D** to strafe left/right
5. **Press Space** to fire a laser at objects
6. **Press ESC** to release the pointer lock and pause

## Troubleshooting

### "npm command not found"
- Node.js/npm is not installed. Download from https://nodejs.org/

### Black screen / nothing visible
- Wait 2-3 seconds for the scene to load
- Check browser console (F12) for WebGL errors
- Try a different browser (Chrome/Firefox recommended)

### Controls not working
- Make sure pointer lock is enabled (click canvas first)
- Press ESC and click again to re-enable

### Performance is poor (low FPS)
- Reduce object counts in `src/constants.js`:
  - `ASTEROID_COUNT` (default: 75)
  - `DEBRIS_COUNT` (default: 50)
  - `STAR_COUNT` (default: 3000)
- Reload the page after changing constants

## Building for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

## Documentation

- **README.md** - Game features and controls
- **IMPLEMENTATION_NOTES.md** - Architecture and tuning guide
- **src/constants.js** - All adjustable parameters with comments