/* 서비스워커 원본 — tools/build_pwa.py 가 버전·목록을 채워 sw.js 를 만든다. 직접 sw.js 를 고치지 말 것. */
const CACHE = "syd-mel-rain-ba7c522ee6";
const RUNTIME = "syd-mel-runtime";
const PRECACHE = [
 "./",
 "index.html",
 "style.css",
 "app.js",
 "trip.js",
 "places.js",
 "photos.js",
 "map.js",
 "manifest.webmanifest",
 "fonts/hahmlet.woff2",
 "fonts/overpass.woff2",
 "fonts/pretendard.woff2",
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "icons/icon.svg",
 "img/cover-S.webp",
 "img/d1-hero-S.webp",
 "img/d1-manly-S.webp",
 "img/d1-paddys-S.webp",
 "img/d1-qvb-S.webp",
 "img/d1-rocks-S.webp",
 "img/d10-benthanh-S.webp",
 "img/d10-bitexco-S.webp",
 "img/d10-hero-S.webp",
 "img/d10-nguyenhue-S.webp",
 "img/d10-palace-S.webp",
 "img/d10-postoffice-S.webp",
 "img/d10-thienhau-S.webp",
 "img/d11-hero-S.webp",
 "img/d2-coastal-S.webp",
 "img/d2-fish-S.webp",
 "img/d2-hero-S.webp",
 "img/d2-icebergs-S.webp",
 "img/d3-featherdale-S.webp",
 "img/d3-hero-S.webp",
 "img/d3-railway-S.webp",
 "img/d3-seacliff-S.webp",
 "img/d3-skyway-S.webp",
 "img/d4-eden-S.webp",
 "img/d4-hero-S.webp",
 "img/d4-lakes-S.webp",
 "img/d4-tilba-S.webp",
 "img/d5-apollo-S.webp",
 "img/d5-arch-S.webp",
 "img/d5-hero-S.webp",
 "img/d5-koala-S.webp",
 "img/d5-lorne-S.webp",
 "img/d6-gibson-S.webp",
 "img/d6-hero-S.webp",
 "img/d6-lochard-S.webp",
 "img/d6-maits-S.webp",
 "img/d7-dandenong-S.webp",
 "img/d7-hero-S.webp",
 "img/d7-penguin-S.webp",
 "img/d7-wallaby-S.webp",
 "img/d8-arcade-S.webp",
 "img/d8-exhibition-S.webp",
 "img/d8-hero-S.webp",
 "img/d8-library-S.webp",
 "img/d8-qvm-S.webp",
 "img/d8-shrine-S.webp",
 "img/d9-flinders-S.webp",
 "img/d9-hero-S.webp",
 "img/d9-laneway-S.webp"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;

  // 페이지 자체: 온라인이면 최신, 끊기면 저장본
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("index.html")));
    return;
  }

  // 일정·숙소 데이터와 화면 코드는 온라인일 때 최신본을 우선한다.
  if (/\.(?:js|css)$/.test(url.pathname)) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // 큰 사진: 온라인이면 받아서 보관, 끊기면 보관본 → 없으면 폰용 작은 사진으로 대체
  if (/\/img\/.+-L\.webp$/.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(RUNTIME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(url.pathname.replace(/-L\.webp$/, "-S.webp").replace(/^.*\/img\//, "img/"))))
    );
    return;
  }

  // 나머지: 저장본을 먼저 보여주고 뒤에서 새 버전 확인
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
