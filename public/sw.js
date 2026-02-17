// Self-unregistering service worker
// This file exists to clear any previously registered service workers
// Prevents 404 errors from browsers that cached an old SW registration

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Unregister all service workers
    event.waitUntil(
        self.registration.unregister().then(() => {
            console.log('Service worker unregistered');
        })
    );
});

// Empty fetch handler
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
