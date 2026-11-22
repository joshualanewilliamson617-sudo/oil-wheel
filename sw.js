/* Oil Wheel service worker: a small helper the browser runs in the background.
 *
 * Its only job is to keep a copy of the app on the phone so the installed app
 * opens even with no internet.
 *  - The app page is NETWORK FIRST: when you're online you always get the newest
 *    version, and that copy is saved for offline use.
 *  - Icons and the manifest are CACHE FIRST: they rarely change.
 *
 * If you change the icons, bump CACHE (v1 -> v2) so phones pick up the new ones.
 */
const CACHE = 'oil-wheel-v1';
const PAGE  = './index.html';
const CORE  = [
  './', PAGE, './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './apple-touch-icon.png', './favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    /* one at a time: a single missing file must not stop the install */
    await Promise.all(CORE.map(u => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');

  if (isPage) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const copy = fresh.clone();
          caches.open(CACHE).then(c => c.put(PAGE, copy)).catch(() => {});
        }
        return fresh;
      } catch (err) {
        const hit = await caches.match(PAGE);
        return hit || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try { return await fetch(req); }
    catch (err) { return (await caches.match(req)) || Response.error(); }
  })());
});
