"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ADMIN = "kmkj05@yahoo.com";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email || user.email.toLowerCase() !== ADMIN) {
      setBusy(false);
      setError("Reset session missing. Request a new reset link.");
      return;
    }
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-white/40">Pit office</p>
      <h1 className="mt-2 font-display text-4xl italic">Set password</h1>
      <p className="mt-3 text-sm text-white/70">Choose a password for the admin account. It is not stored in the app.</p>
      <form onSubmit={save} className="mt-8 space-y-4">
        <label className="block text-sm">
          New password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-[#c45c26]"
          />
        </label>
        <label className="block text-sm">
          Confirm password
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-[#c45c26]"
          />
        </label>
        <button
          disabled={busy}
          className="w-full rounded-md bg-[#c45c26] px-4 py-2 font-medium text-[#0c0907] disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </main>
  );
}
