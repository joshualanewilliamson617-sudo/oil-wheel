# Oil Wheel — installable app

The app itself is still one file: `index.html`. Everything else in this folder
is there so your phone can install it like a real app.

| File | What it's for |
|---|---|
| `index.html` | The whole app (every feature from `oil-wheel.html`, plus a smoother tilt sensor, an **Install app** button and laptop keys). |
| `manifest.webmanifest` | The app's "ID card": its name, colours, icons, and "portrait only" so the screen doesn't spin when you flip. |
| `sw.js` | A background helper that saves a copy so the app opens with no internet. |
| `icon-*.png`, `apple-touch-icon.png`, `favicon-32.png` | The app icon at different sizes (home screen, browser tab). |
| `serve.ps1` | A tiny web server for testing on this PC (`http://localhost:8766`). |

## Controls
- **Phone:** flip the phone over. The oil follows real gravity. Shake it and the oil sloshes.
- **Laptop:** the **Flip ↻** button, or Space / F / ↑ / ↓. **R** resets.

## Putting it online
Upload **everything in this folder** (not the folder itself) to a GitHub repository
and turn on GitHub Pages. The tilt sensor only works on an `https://` address.
