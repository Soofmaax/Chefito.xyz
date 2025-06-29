// This service worker is managed by next-pwa
// You can customize it by modifying this file

// Cache name
const CACHE_NAME = 'chefito-cache-v1';

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/recipes',
  '/about',
  '/offline.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('chefito-') && cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip browser-extension requests
  if (event.request.url.includes('/extension/')) {
    return;
  }

  // Skip Chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // API requests - network only
  if (event.request.url.includes('/api/')) {
    return;
  }

  // For navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // For other requests - stale-while-revalidate
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response immediately
        if (cachedResponse) {
          // Fetch new version in background
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Update cache
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
              return networkResponse;
            })
            .catch(() => cachedResponse);
          
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Cache the network response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            // For image requests, return a placeholder
            if (event.request.destination === 'image') {
              return caches.match('/icon-192x192.png');
            }
            
            // For other requests, return nothing
            return new Response('', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        const url = event.notification.data.url;
        
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});