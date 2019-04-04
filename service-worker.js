// Thanks to https://qiita.com/poster-keisuke/items/6651140fa20c7aa18474

// キャッシュファイルの指定
var CACHE_NAME = "metronome-pwa-caches";
var urlsToCache = [
	"argentum384.github.io/",
];

// インストール処理
self.addEventListener("install", e => {
	e.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(cache => cache.addAll(urlsToCache))
	);
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener("fetch", e => {
	e.respondWith(
		caches
			.match(e.request)
			.then(res => res ? res : fetch(e.request))
	);
});
