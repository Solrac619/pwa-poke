/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

// CRA requiere esto
self.skipWaiting();
clientsClaim();

// ⚠️ ESTA ES LA LÍNEA OBLIGATORIA EN CRA
precacheAndRoute(self.__WB_MANIFEST);

// Cache runtime (opcional)
registerRoute(
  ({ request }) =>
    ["document", "script", "style", "image", "font"].includes(
      request.destination
    ),
  new StaleWhileRevalidate({
    cacheName: "runtime-cache",
  })
);
