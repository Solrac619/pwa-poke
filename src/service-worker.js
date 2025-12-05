/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

const RUNTIME_CACHE = 'poke-cache-v1';

// 👉 Reemplazo necesario para sonar: usar globalThis
globalThis.skipWaiting();
clientsClaim();

// 👉 Precarga generada automáticamente por CRA
precacheAndRoute(globalThis.__WB_MANIFEST || []);

// 👉 Cache runtime (documentos, JS, CSS)
registerRoute(
  ({ request }) =>
    ['document', 'script', 'style'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: RUNTIME_CACHE,
  })
);
