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

  // 현재 설치된 새로운 서비스 워커가 바로 활성화되도록 강제
  // 기존 워커를 기다리지 않고 즉시 activate 상태로 넘어감.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Activating new service worker...");
  
  // waitUntil: 비동기 작업이 끝날 때 까지 기다림
  // 최신 버전이 아닌 이미지 캐시를 삭제 -> 기존 캐시 정리
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

      // 활성화된 서비스 워커가 현재 열려 있는 모든 페이지 탭을 즉시 제어하도록 하는 메서드
      // 모든 기존 페이지가 새 워커로 즉시 제어권 전환
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

  // GET 요청이 아니고 이미지 요청도 아니라면 후속처리하지 않음
  if (request.method !== "GET") return;
  if (!isImageRequest(request)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(IMAGE_CACHE);
      const cached = await cache.match(request, {
        ignoreVary: true, // Vary 헤더 무시
        ignoreSearch: true, // 쿼리 스트링 무시
      });

      // 네트워크 요청과 캐시 저장
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

      // Stale-while-revalidate: 캐시가 있으면 바로 반환하고 백그라운드에서 업데이트(최신화)
      if (cached) {
        // TODO: 재검증이 필요한지 플로우 확인 후 수정
        event.waitUntil(fetchAndCache); // 원본이 바뀐 경우를 고려해서 네트워크 요청 -> 신선도 보장
        return cached;
      }

      // No cache: go to network, fallback to cache if it exists
      const network = await fetchAndCache;
      return network || cached || Response.error();
    })()
  );
});
