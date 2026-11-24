"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function InstallAppButton() {
  const [mounted, setMounted] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInstalled(isStandalone());
    if (isStandalone()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!mounted || installed) return null;

  return (
    <div className="bg-ember text-cream">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-center sm:justify-between sm:text-left">
        <p className="text-sm font-semibold">Get Smoke and Ember on your phone — free.</p>
        <button
          type="button"
          onClick={async () => {
            if (installEvent) {
              await installEvent.prompt();
              await installEvent.userChoice;
              setInstallEvent(null);
            } else {
              setShowHelp((v) => !v);
            }
          }}
          className="rounded-full bg-cream px-4 py-1.5 text-sm font-bold text-ink hover:bg-white"
        >
          Install App
        </button>
      </div>
      {showHelp && (
        <p className="mx-auto max-w-6xl px-4 pb-3 text-center text-xs leading-relaxed text-cream/90 sm:text-left">
          Android: tap the &#8942; menu in Chrome, then &ldquo;Install app&rdquo; or &ldquo;Add to Home
          screen&rdquo;. iPhone: tap Share, then &ldquo;Add to Home Screen&rdquo;.
        </p>
      )}
    </div>
  );
}
