"use client";
import { useEffect, useState } from "react";

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferred, setDeferred] = useState<any>(null);

  useEffect(() => {
    // Already running as the installed app — nothing to do.
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((window.navigator as any).standalone) return;
    try {
      if (localStorage.getItem("se-install-dismissed")) return;
    } catch {}
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    setVisible(true);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem("se-install-dismissed", "1");
    } catch {}
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setCanInstall(false);
    dismiss();
  };

  const inFacebook = /FBAN|FBAV|FB_IAB/i.test(navigator.userAgent);

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-ember/40 bg-bark p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg italic text-cream">Get the app on your home screen</p>
          {canInstall ? (
            <p className="mt-1 text-sm text-parchment/80">
              One tap and Smoke &amp; Ember lives on your phone like a real app.
            </p>
          ) : (
            <p className="mt-1 text-sm text-parchment/80">
              {inFacebook
                ? "Tap the ⋮ menu up top, open this in Chrome, then tap ⋮ → Add to Home screen."
                : "Tap your browser's menu (⋮) → Add to Home screen."}
            </p>
          )}
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-xl text-subtle hover:text-cream">
          ×
        </button>
      </div>
      {canInstall && (
        <button
          onClick={install}
          className="mt-3 w-full rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ember-hot"
        >
          Install the app
        </button>
      )}
    </div>
  );
}
