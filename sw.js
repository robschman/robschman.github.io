// Beauty Routine App – Service Worker
const CACHE = 'beauty-routine-v55';
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
  '/fonts/exo2-700-ext.woff2',
  '/fonts/cozy/cozy-fonts.css',
  '/fonts/cozy/cf-2.woff2',
  '/fonts/cozy/cf-6.woff2',
  '/fonts/cozy/cf-8.woff2',
  '/fonts/cozy/cormorant-700.woff2',
  '/fonts/cozy/bodoni-moda-700.woff2'
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
  const isNavigation = e.request.mode === 'navigate';
  // Auch Verzeichnis-URLs wie /blog/ und /en/ zählen als HTML-Navigation
  const isHTML = isNavigation
    || url.pathname.endsWith('.html')
    || url.pathname.endsWith('/')
    || url.pathname.endsWith('/produkt-der-woche.js')
    || url.pathname.startsWith('/tipps/');   // Nu-Skin-Tipps: immer frisch

  // HTML/Navigationen: immer zuerst vom Netzwerk (network-first)
  // → Nutzer sehen sofort Updates, ohne Cache löschen zu müssen
  // → Bei kein Internet: Fallback auf gecachte Version
  if (isHTML) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(e.request, { ignoreSearch: true })
            .then(cached => cached || caches.match('/app.html'))
        )
    );
    return;
  }

  // Fonts, CSS, JS: aus Cache laden (schnell) – cache-first.
  // ignoreSearch:true → gecachtes /style.css trifft die Anfrage /style.css?v=2.2 usw.
  // KEIN app.html-Fallback für Assets (sonst käme HTML statt CSS/JS zurück).
  // Seit 22.11.2026: zuerst die GENAU passende Fassung (mit ?v=…) suchen. Fehlt sie,
  // frisch vom Netz holen und merken. Vorher lieferte ignoreSearch nach einem Update
  // noch die alte style.css/app.js aus, die neue Optik kam erst beim zweiten Öffnen.
  // Nur ohne Internet wird auf eine ältere Fassung zurückgegriffen.
  e.respondWith(
    caches.match(e.request).then(exact => {
      if (exact) return exact;
      return fetch(e.request)
        .then(response => {
          if (response.ok && url.origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(e.request, { ignoreSearch: true }));
    })
  );
});
