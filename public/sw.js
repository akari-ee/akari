const CACHE_VERSION = "v1";
const IMAGE_CACHE = `image-cache-${CACHE_VERSION}`;

const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
];

self.addEventListener("install", (event) => {
  console.log("Installing service worker...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Activating new service worker...");
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) => key.startsWith("image-cache-") && key !== IMAGE_CACHE
          )
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

function isImageRequest(request) {
  try {
    const url = new URL(request.url);
    if (request.destination === "image") return true;
    return IMAGE_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
  } catch {
    return false;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (!isImageRequest(request)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(IMAGE_CACHE);
      const cached = await cache.match(request, {
        ignoreVary: true,
        ignoreSearch: true,
      });
      const fetchAndCache = fetch(request)
        .then(async (response) => {
          // Cache successful and opaque cross-origin responses
          if (
            response &&
            (response.status === 200 || response.type === "opaque")
          ) {
            try {
              await cache.put(request, response.clone());
            } catch {}
          }
          return response.clone();
        })
        .catch(() => cached);

      // Stale-while-revalidate: return cached first if available, then update in background
      if (cached) {
        event.waitUntil(fetchAndCache);
        return cached;
      }

      // No cache: go to network, fallback to cache if it exists
      const network = await fetchAndCache;
      return network || cached || Response.error();
    })()
  );
});
