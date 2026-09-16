"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-white/40">Pit office</p>
      <h1 className="mt-2 font-display text-4xl italic">Admin login</h1>
      <p className="mt-3 text-sm text-white/70">Email code. Allowed admins only.</p>

      {!sent ? (
        <form onSubmit={sendCode} className="mt-8 space-y-4">
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
            {busy ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-8 space-y-4">
          <p className="text-sm text-white/60">Code sent to {email}</p>
          <label className="block text-sm">
            Code
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-[#c45c26]"
            />
          </label>
          <button
            disabled={busy}
            className="w-full rounded-md bg-[#c45c26] px-4 py-2 font-medium text-[#0c0907] disabled:opacity-50"
          >
            {busy ? "Checking…" : "Sign in"}
          </button>
          <button type="button" className="w-full text-sm text-white/50" onClick={() => setSent(false)}>
            Use a different email
          </button>
        </form>
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
