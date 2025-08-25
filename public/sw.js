const CACHE_VERSION = "v2";
const IMAGE_CACHE = `image-cache-${CACHE_VERSION}`;
const META_CACHE = `image-meta-${CACHE_VERSION}`;

// 캐시 정책
const MAX_ENTRIES = 300; // LRU 상한
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7일 TTL
const REVALIDATE_MIN_INTERVAL_MS = 60 * 1000; // 최소 재검증 간격 60초

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
          .filter((key) =>
            (key.startsWith("image-cache-") && key !== IMAGE_CACHE) ||
            (key.startsWith("image-meta-") && key !== META_CACHE)
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

function isCacheableResponse(response) {
  if (!response) return false;
  if (!(response.status === 200)) return false;
  // opaque는 용량/정책 통제가 어려워 제외
  if (response.type === "opaque") return false;
  // Cache-Control 검사
  const cacheControl = response.headers.get("Cache-Control") || "";
  const isNoStore = /(^|,)\s*no-store\s*(,|$)/i.test(cacheControl);
  const isPrivate = /(^|,)\s*private\s*(,|$)/i.test(cacheControl);
  if (isNoStore || isPrivate) return false;
  return true;
}

async function openCaches() {
  const dataCache = await caches.open(IMAGE_CACHE);
  const metaCache = await caches.open(META_CACHE);
  return { dataCache, metaCache };
}

function metaKeyFor(request) {
  // 요청 URL을 메타키로 직접 사용 (정확히 일치)
  return new Request(`${new URL(request.url).href}::meta`, { method: "GET" });
}

async function readMeta(metaCache, request) {
  try {
    const metaRes = await metaCache.match(metaKeyFor(request));
    if (!metaRes) return null;
    return await metaRes.json();
  } catch {
    return null;
  }
}

async function writeMeta(metaCache, request, meta) {
  const body = JSON.stringify(meta);
  const res = new Response(body, {
    headers: { "Content-Type": "application/json" },
  });
  try {
    await metaCache.put(metaKeyFor(request), res);
  } catch (err) {
    // 메타 캐시도 용량 초과 가능성: 실패는 무시
  }
}

async function enforceCacheLimits() {
  const { dataCache, metaCache } = await openCaches();
  const requests = await dataCache.keys();
  const now = Date.now();

  // TTL 기반 제거
  await Promise.all(
    requests.map(async (req) => {
      const meta = await readMeta(metaCache, req);
      if (meta && typeof meta.updatedAt === "number") {
        if (now - meta.updatedAt > MAX_AGE_MS) {
          await dataCache.delete(req).catch(() => {});
          await metaCache.delete(metaKeyFor(req)).catch(() => {});
        }
      }
    })
  );

  // LRU 상한 적용
  const remaining = await dataCache.keys();
  if (remaining.length <= MAX_ENTRIES) return;
  const metas = await Promise.all(
    remaining.map(async (req) => ({
      req,
      meta: (await readMeta(metaCache, req)) || {},
    }))
  );
  metas.sort((a, b) => {
    const la = a.meta.lastAccessed || 0;
    const lb = b.meta.lastAccessed || 0;
    return la - lb; // 오래 안 쓴 것부터 제거
  });
  const toDelete = metas.slice(0, Math.max(0, metas.length - MAX_ENTRIES));
  await Promise.all(
    toDelete.map(async ({ req }) => {
      await dataCache.delete(req).catch(() => {});
      await metaCache.delete(metaKeyFor(req)).catch(() => {});
    })
  );
}

async function safePut(cache, request, response) {
  try {
    await cache.put(request, response);
    return true;
  } catch (err) {
    // 용량 초과 시 정리 후 1회 재시도
    try {
      await enforceCacheLimits();
      await cache.put(request, response);
      return true;
    } catch {
      return false;
    }
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // GET 요청이 아니고 이미지 요청도 아니라면 후속처리하지 않음
  if (request.method !== "GET") return;
  if (!isImageRequest(request)) return;

  event.respondWith(
    (async () => {
      const { dataCache, metaCache } = await openCaches();
      const cached = await dataCache.match(request, {
        // 성능을 위해 Vary는 무시 (CDN의 Vary 헤더로 인한 캐시 미스 방지)
        ignoreVary: true,
        // 쿼리 파라미터별 캐시 분리 유지
        ignoreSearch: false,
      });
      const now = Date.now();
      const meta = (await readMeta(metaCache, request)) || {};

      // 네트워크 요청과 캐시 저장
      const makeRevalidate = async () => {
        const headers = new Headers();
        // 조건부 요청 헤더 설정 (가능한 경우)
        if (cached) {
          const etag = cached.headers.get("ETag");
          const lastModified = cached.headers.get("Last-Modified");
          if (etag) headers.set("If-None-Match", etag);
          if (lastModified) headers.set("If-Modified-Since", lastModified);
        }
        try {
          const response = await fetch(new Request(request, { headers }));
          if (response.status === 304 && cached) {
            // 변경 없음: 메타만 갱신
            await writeMeta(metaCache, request, {
              updatedAt: now,
              lastAccessed: now,
            });
            return cached;
          }
          if (isCacheableResponse(response)) {
            const ok = await safePut(dataCache, request, response.clone());
            if (ok) {
              await writeMeta(metaCache, request, {
                updatedAt: now,
                lastAccessed: now,
              });
              await enforceCacheLimits();
            }
          }
          return response.clone();
        } catch {
          return cached;
        }
      };

      // Stale-while-revalidate: 캐시가 있으면 바로 반환하고 백그라운드에서 업데이트(최신화)
      if (cached) {
        // 접근 시각(LRU) 갱신 - 비차단 처리
        event.waitUntil(
          writeMeta(metaCache, request, {
            updatedAt: typeof meta.updatedAt === "number" ? meta.updatedAt : now,
            lastAccessed: now,
          })
        );
        // 재검증 쓰로틀: 마지막 업데이트 이후 최소 간격이 지나면 재검증 수행
        const shouldRevalidate =
          typeof meta.updatedAt !== "number" ||
          now - meta.updatedAt >= REVALIDATE_MIN_INTERVAL_MS;
        if (shouldRevalidate) {
          event.waitUntil(makeRevalidate());
        }
        return cached;
      }

      // No cache: go to network, fallback to cache if it exists
      const network = await makeRevalidate();
      return network || cached || Response.error();
    })()
  );
});
