/* 英语赛事看板 · Service Worker（模板）
   —— 由 _sw_build.py 把 index.html 的内容指纹填进下面的 BUILD 变量后写成 sw.js，请勿直接改 sw.js。

   策略：
     · 导航请求  → 缓存优先（打开即见，App 秒开手感）+ 后台静默拉新
     · 同源静态  → 缓存优先 + 后台静默拉新
     · 跨域请求  → 不插手，交给网络
     · 断网      → 回落到缓存里的 index.html（整站是一个自包含 HTML，缓存它＝缓存整个应用）
   更新：
     · 首次安装直接接管（免去"还要再刷一次"）
     · 版本更新时停在 waiting，由页面提示用户后发 SKIP_WAITING 再切换
*/

var BUILD = "b0fc968228641";
var CACHE = "eec-shell-" + BUILD;

var CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/shot-wide.png",
  "./assets/shot-narrow.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      /* 逐个塞，个别 404 不至于让整次安装失败 */
      return Promise.all(CORE.map(function (u) {
        return c.add(u).catch(function () {});
      }));
    }).then(function () {
      /* 首次安装（此前没有活跃 SW）直接接管；更新则留在 waiting 等页面确认 */
      if (!self.registration.active) return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* 页面点了"立即更新"才会走到这里 */
self.addEventListener("message", function (e) {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;   /* 跨域不插手 */

  /* 导航统一归到一个缓存键，避免 "./" 与 "./index.html" 两份 */
  var isNav = req.mode === "navigate";
  var key = isNav ? "./index.html" : req;

  e.respondWith(
    caches.match(key).then(function (hit) {
      var fromNet = fetch(req).then(function (r) {
        if (r && r.status === 200 && (r.type === "basic" || r.type === "default")) {
          var cp = r.clone();
          caches.open(CACHE).then(function (c) { c.put(key, cp); }).catch(function () {});
        }
        return r;
      });

      if (hit) {
        fromNet.catch(function () {});     /* 后台拉新，失败无所谓 */
        return hit;                        /* 秒开 */
      }
      return fromNet.catch(function () {
        return caches.match("./index.html");   /* 断网兜底 */
      });
    })
  );
});
