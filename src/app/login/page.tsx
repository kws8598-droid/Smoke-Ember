"use client";

import { FormEvent, Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PRODUCTION_EMAIL_REDIRECT } from "@/lib/supabase/redirect";

function LoginInner() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendLink(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: PRODUCTION_EMAIL_REDIRECT,
      },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-white/40">Pit office</p>
      <h1 className="mt-2 font-display text-4xl italic">Admin login</h1>
      <p className="mt-3 text-sm text-white/70">Sign-in link. Allowed admins only.</p>

      {!sent ? (
        <form onSubmit={sendLink} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-[#c45c26]"
            />
          </label>
          <button
            disabled={busy}
            className="w-full rounded-md bg-[#c45c26] px-4 py-2 font-medium text-[#0c0907] disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send sign-in link"}
          </button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-white/70">
          Link sent to {email}. Open the newest email and tap Sign in. Ignore older messages.
        </p>
      )}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="px-4 py-16">Loading…</main>}>
      <LoginInner />
    </Suspense>
  );
}
