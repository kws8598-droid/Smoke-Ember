"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // When a new version of the site takes over, reload once so an open
    // tab stops showing yesterday's pages. Only when a worker was already
    // in control (an update) — never on a first visit with no worker yet.
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    const onControllerChange = () => {
      if (!hadController || reloaded) return;
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    let registration: ServiceWorkerRegistration | undefined;
    let timer: number | undefined;

    // A tab left open (or the installed app left running) never does a full
    // page load, so the browser never checks for a new service worker on
    // its own — that is how a copy gets stuck showing old pages for days.
    // Check whenever the app comes back into view, and once an hour while
    // it sits open. A new version is then picked up and the page reloads
    // to it instead of showing stale pages.
    const checkForUpdate = () => {
      if (registration) registration.update().catch(() => undefined);
    };
    const onVisibilityChange = () => {
      if (!document.hidden) checkForUpdate();
    };

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          registration = reg;
          document.addEventListener("visibilitychange", onVisibilityChange);
          timer = window.setInterval(checkForUpdate, 60 * 60 * 1000);
        })
        .catch(() => undefined);
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, []);

  return null;
}
