/*
 * Plant Care Companion — service worker
 * Tiene l'app disponibile anche senza rete.
 * Autore: Edoardo Giangrandi — © 2026, licenza MIT
 */

const VERSIONE = "piante-v1";
const GUSCIO = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon-180.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSIONE).then((c) => c.addAll(GUSCIO)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((chiavi) => Promise.all(chiavi.filter((k) => k !== VERSIONE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((salvata) =>
      salvata ||
      fetch(e.request)
        .then((r) => {
          if (r && r.status === 200 && r.type === "basic") {
            const copia = r.clone();
            caches.open(VERSIONE).then((c) => c.put(e.request, copia));
          }
          return r;
        })
        .catch(() => caches.match("./index.html"))
    )
  );
});
