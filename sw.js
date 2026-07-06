// Beauty Routine App – Service Worker
const CACHE = 'beauty-routine-v25';
const ASSETS = [
  '/app.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/fonts.css',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/cozyvibe-icon.png',
  '/fonts/poppins-400.woff2',
  '/fonts/poppins-400-ext.woff2',
  '/fonts/poppins-600.woff2',
  '/fonts/poppins-600-ext.woff2',
  '/fonts/poppins-700.woff2',
  '/fonts/poppins-700-ext.woff2',
  '/fonts/dancing-script-600.woff2',
  '/fonts/dancing-script-600-ext.woff2',
  '/fonts/dancing-script-700.woff2',
  '/fonts/dancing-script-700-ext.woff2',
  '/fonts/exo2-700.woff2',
  '/fonts/exo2-700-ext.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // HTML-Dateien: immer zuerst vom Netzwerk laden (network-first)
  // → Nutzer sehen sofort Updates, ohne Cache löschen zu müssen
  // → Bei kein Internet: Fallback auf gecachte Version
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/produkt-der-woche.js')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(e.request).then(cached => cached || caches.match('/app.html'))
        )
    );
    return;
  }

  // Fonts, CSS, JS: aus Cache laden (schnell) – cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() => caches.match('/app.html'));
    })
  );
});
