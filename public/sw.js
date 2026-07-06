const CACHE_NAME = "letters-teacher-v4";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icons/icon-192.svg", "/icons/icon-512.svg"];
const AUDIO_MANIFEST_URL = "/audio/audio-manifest.json";

async function getAudioAssets() {
  const response = await fetch(AUDIO_MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Audio manifest unavailable");
  }

  const manifest = await response.clone().json();
  return {
    response,
    assets: Array.isArray(manifest.entries) ? manifest.entries.map((entry) => entry.path).filter(Boolean) : []
  };
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      const audioManifest = await getAudioAssets();
      await cache.put(AUDIO_MANIFEST_URL, audioManifest.response);
      await cache.addAll(audioManifest.assets);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached ?? caches.match("/index.html")))
  );
});
