"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PRODUCTION_RESET_REDIRECT } from "@/lib/supabase/redirect";

const ADMIN = "kmkj05@yahoo.com";

function LoginInner() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (email.trim().toLowerCase() !== ADMIN) {
      setError("This account is not an administrator.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  async function sendReset() {
    setError("");
    setNotice("");
    if (email.trim().toLowerCase() !== ADMIN) {
      setError("This account is not an administrator.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: PRODUCTION_RESET_REDIRECT,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setNotice("Reset link sent. Use only the newest email.");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-white/40">Pit office</p>
      <h1 className="mt-2 font-display text-4xl italic">Admin login</h1>
      <p className="mt-3 text-sm text-white/70">Email and password. Allowed admins only.</p>

      <form onSubmit={signIn} className="mt-8 space-y-4">
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
        <label className="block text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-[#c45c26]"
          />
        </label>
        <button
          disabled={busy}
          className="w-full rounded-md bg-[#c45c26] px-4 py-2 font-medium text-[#0c0907] disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <button type="button" onClick={sendReset} disabled={busy} className="mt-4 w-full text-sm text-white/50">
        Create or reset password
      </button>
      {notice ? <p className="mt-4 text-sm text-white/70">{notice}</p> : null}
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
