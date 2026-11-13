"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Marks this browser tab as having navigated inside the app. The first
// mount is skipped, so a fresh direct load (shared link, new tab) never
// sets the flag — the Back button then sends the user home instead of
// back to the browser's blank new-tab page, which counts as a history
// entry in a fresh tab and dumps the user out of the site.
export default function NavTracker() {
  const pathname = usePathname();
  const initial = useRef<string | null>(null);

  useEffect(() => {
    if (initial.current === null) {
      initial.current = pathname;
      return;
    }
    if (pathname !== initial.current && typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem("ember:inApp", "1");
      } catch {
        // Storage unavailable (private mode, etc.) — Back falls back to home.
      }
    }
  }, [pathname]);

  return null;
}
