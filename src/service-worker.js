/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

const RUNTIME_CACHE = 'poke-cache-v1';

self.skipWaiting();
clientsClaim();

// 👇 Esto es lo que necesita CRA para el build
precacheAndRoute(self.__WB_MANIFEST || []);

// 👇 Caché runtime similar a tu SW “manual”
registerRoute(
  ({ request }) => ['document', 'script', 'style'].includes(request.destination),
  new StaleWhileRevalidate({ cacheName: RUNTIME_CACHE })
);
