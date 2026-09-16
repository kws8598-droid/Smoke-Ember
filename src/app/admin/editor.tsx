"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Row = { slug: string; data: Record<string, unknown> | null };

export default function AdminEditor({ recipes, tips }: { recipes: Row[]; tips: Row[] }) {
  const [tab, setTab] = useState<"recipes" | "tips">("recipes");
  const rows = tab === "recipes" ? recipes : tips;
  const table = tab === "recipes" ? "recipes" : "wisdom";
  const [slug, setSlug] = useState(rows[0]?.slug ?? "");
  const current = useMemo(() => rows.find((r) => r.slug === slug), [rows, slug]);
  const [title, setTitle] = useState(String(current?.data?.title ?? ""));
  const [summary, setSummary] = useState(String(current?.data?.summary ?? ""));
  const [json, setJson] = useState(JSON.stringify(current?.data ?? {}, null, 2));
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  function pick(nextSlug: string) {
    const row = rows.find((r) => r.slug === nextSlug);
    setSlug(nextSlug);
    setTitle(String(row?.data?.title ?? ""));
    setSummary(String(row?.data?.summary ?? ""));
    setJson(JSON.stringify(row?.data ?? {}, null, 2));
    setMsg("");
  }

  function switchTab(next: "recipes" | "tips") {
    setTab(next);
    const list = next === "recipes" ? recipes : tips;
    pick(list[0]?.slug ?? "");
  }

  async function save() {
    setBusy(true);
    setMsg("");
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(json) as Record<string, unknown>;
    } catch {
      setBusy(false);
      setMsg("JSON is invalid.");
      return;
    }
    data.title = title;
    data.summary = summary;
    data.slug = slug;
    const supabase = createClient();
    const { error } = await supabase.from(table).upsert({ slug, data }, { onConflict: "slug" });
    setBusy(false);
    setMsg(error ? error.message : "Saved.");
  }

  return (
    <section className="mt-10">
      <div className="flex gap-2">
        <button
          className={`rounded-md px-3 py-1.5 text-sm ${tab === "recipes" ? "bg-[#c45c26] text-[#0c0907]" : "border border-white/15"}`}
          onClick={() => switchTab("recipes")}
        >
          Recipes ({recipes.length})
        </button>
        <button
          className={`rounded-md px-3 py-1.5 text-sm ${tab === "tips" ? "bg-[#c45c26] text-[#0c0907]" : "border border-white/15"}`}
          onClick={() => switchTab("tips")}
        >
          Tips ({tips.length})
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <ul className="max-h-[70vh] space-y-1 overflow-auto text-sm">
          {rows.map((r) => (
            <li key={r.slug}>
              <button
                className={`w-full rounded px-2 py-1 text-left ${r.slug === slug ? "bg-white/10" : "text-white/70"}`}
                onClick={() => pick(r.slug)}
              >
                {String(r.data?.title ?? r.slug)}
              </button>
            </li>
          ))}
        </ul>

        <div className="space-y-4">
          <label className="block text-sm">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Summary
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Full record
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              rows={18}
              className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs"
            />
          </label>
          <button
            disabled={busy || !slug}
            onClick={save}
            className="rounded-md bg-[#c45c26] px-4 py-2 font-medium text-[#0c0907] disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save to Supabase"}
          </button>
          {msg ? <p className="text-sm text-white/70">{msg}</p> : null}
        </div>
      </div>
    </section>
  );
}
