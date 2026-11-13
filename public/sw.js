const CACHE_NAME = "smoke-ember-offline-v4";
const PRECACHE_URLS = ["/", "/manifest.webmanifest", "/ember.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => undefined)
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Pages, photos and the recipe catalog change at the same URL (a swapped
  // photo, a new section on a page), so the browser's HTTP cache must not
  // answer those from an old copy. "reload" forces a real network fetch and
  // the fresh copy is stored in the offline cache. If the network fails,
  // the cached copy is served instead, so offline still works. Hashed
  // bundles (_next/static) never change at the same URL, so they keep
  // normal caching.
  const bustCache =
    request.mode === "navigate" ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/api/");

  event.respondWith(
    fetch(request, bustCache ? { cache: "reload" } : undefined)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => undefined);
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const home = await caches.match("/");
          if (home) return home;
        }
        return Response.error();
      })
  );
});
