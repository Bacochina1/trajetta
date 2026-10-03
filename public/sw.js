// Trajetta Service Worker v1.0.4
const CACHE_NAME = 'trajetta-static-v4';

const STATIC_ASSETS = [
  '/favicon.ico',
  '/favicon.svg',
  '/icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/trajetta-logo-transparent.png',
];

// Install: pre-cache essential static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA: Non-critical pre-cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. NEVER cache API requests, Stripe webhooks, auth, admin or customer portal endpoints
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin/') ||
    url.pathname.startsWith('/crm/') ||
    request.method !== 'GET'
  ) {
    return; // Pass through directly to network
  }

  // 2. Static Assets (images, fonts, scripts): Cache First with Network Fallback
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Navigation / HTML pages: Network First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const homeCached = await caches.match('/');
        if (homeCached) return homeCached;

        return new Response(
          `<!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Trajetta — Modo Offline</title>
              <style>
                body { background: #060709; color: #F2F1ED; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
                .card { max-width: 400px; background: #0D0F10; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; }
                h1 { font-size: 20px; font-weight: 800; margin-bottom: 12px; }
                p { font-size: 13px; color: #8E9499; line-height: 1.5; margin-bottom: 24px; }
                button { background: #B8FF00; color: #060709; border: none; font-weight: 700; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-size: 13px; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Você está offline</h1>
                <p>O Trajetta precisa de conexão com a internet para sincronizar com seu motor de IA e carregar seus dados mais recentes.</p>
                <button onclick="window.location.reload()">Tentar Novamente</button>
              </div>
            </body>
          </html>`,
          {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          }
        );
      })
    );
  }
});
