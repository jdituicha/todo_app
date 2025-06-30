// service-worker.js

// Nombre de la caché para esta versión de la PWA
const CACHE_NAME = 'todo-app-v1';

// Archivos que queremos cachear para que la app funcione offline (básico)
const urlsToCache = [
  './',
  './index.html',
  './assets/css/style.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  // Añade las rutas de tus iconos aquí
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './assets/icons/maskable_icon.png'
  // Si tienes otros JS o imágenes que quieras que estén offline, añádelos aquí
];

// Evento: Install (cuando el Service Worker se registra por primera vez)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cacheando archivos esenciales.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento: Fetch (intercepta las solicitudes de red)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el recurso está en caché, lo devuelve
        if (response) {
          return response;
        }
        // Si no está en caché, lo busca en la red
        return fetch(event.request);
      })
  );
});

// Evento: Activate (cuando el Service Worker se activa y toma el control)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});