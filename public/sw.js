const CACHE_NAME = "vca-pwa-cache-v1";

self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activating.");
    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // A fetch handler is required by Chrome to trigger the install prompt.
    // We just pass the request to the network to ensure everything functions normally.
    event.respondWith(fetch(event.request));
});
