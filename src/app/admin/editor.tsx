"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { recipes as builtinRecipes } from "@/lib/data";
import { applyOverride, unwrapOverride, type RecipeOverrideRow } from "@/lib/live";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, RECIPE_IMAGE_BUCKET } from "@/lib/supabase/admin";
import type { IngredientGroup, Recipe, Step } from "@/lib/types";

type Draft = {
  title: string;
  summary: string;
  story: string;
  protein: string;
  region: string;
  servings: string;
  hoursMin: string;
  hoursMax: string;
  wood: string;
  pitTemp: string;
  finish: string;
  image: string;
  ingredients: IngredientGroup[];
  steps: Step[];
};

function toDraft(recipe: Recipe): Draft {
  return {
    title: recipe.title || "",
    summary: recipe.summary || "",
    story: recipe.story || "",
    protein: recipe.protein || "",
    region: recipe.region || "",
    servings: recipe.servings || "",
    hoursMin: String(recipe.hours?.min ?? ""),
    hoursMax: String(recipe.hours?.max ?? ""),
    wood: recipe.wood || "",
    pitTemp: recipe.pitTemp || "",
    finish: recipe.finish || "",
    image: recipe.image || "",
    ingredients: (recipe.ingredients || []).map((g) => ({
      group: g.group || "",
      items: [...(g.items || [])],
    })),
    steps: (recipe.steps || []).map((s) => ({ title: s.title || "", body: s.body || "" })),
  };
}

function fromDraft(base: Recipe, draft: Draft): Recipe {
  const min = Number(draft.hoursMin);
  const max = Number(draft.hoursMax);
  return {
    ...base,
    title: draft.title.trim(),
    summary: draft.summary,
    story: draft.story,
    protein: draft.protein.trim(),
    region: draft.region.trim(),
    servings: draft.servings.trim(),
    hours: {
      min: Number.isFinite(min) ? min : base.hours.min,
      max: Number.isFinite(max) ? max : base.hours.max,
    },
    wood: draft.wood.trim(),
    pitTemp: draft.pitTemp.trim(),
    finish: draft.finish.trim(),
    image: draft.image,
    ingredients: draft.ingredients
      .map((g) => ({
        group: g.group.trim(),
        items: g.items.map((item) => item.trim()).filter(Boolean),
      }))
      .filter((g) => g.group || g.items.length),
    steps: draft.steps
      .map((s) => ({ title: s.title.trim(), body: s.body.trim() }))
      .filter((s) => s.title || s.body),
    slug: base.slug,
  };
}

const fieldClass =
  "mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-base outline-none focus:border-[#c45c26]";
const labelClass = "block text-sm text-white/80";

export default function AdminEditor({
  overrides,
  tableRecipes,
}: {
  overrides: RecipeOverrideRow[];
  tableRecipes: { slug: string; data: Record<string, unknown> | null }[];
}) {
  const catalog = useMemo(() => {
    const map = new Map<string, Recipe>();
    for (const recipe of builtinRecipes) map.set(recipe.slug, recipe);
    for (const row of tableRecipes) {
      const patch = unwrapOverride({ slug: row.slug, data: row.data });
      const current = map.get(row.slug);
      if (current && patch) map.set(row.slug, applyOverride(current, patch));
    }
    for (const row of overrides) {
      const patch = unwrapOverride(row);
      const current = map.get(row.slug);
      if (current && patch) map.set(row.slug, applyOverride(current, patch));
    }
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [overrides, tableRecipes]);

  const [query, setQuery] = useState("");
  const [slug, setSlug] = useState(catalog[0]?.slug ?? "");
  const current = catalog.find((r) => r.slug === slug) ?? catalog[0];
  const [draft, setDraft] = useState<Draft>(() => toDraft(current ?? catalog[0]));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((r) =>
      `${r.title} ${r.slug} ${r.protein} ${r.region} ${r.summary}`.toLowerCase().includes(q)
    );
  }, [catalog, query]);

  function pick(nextSlug: string) {
    const row = catalog.find((r) => r.slug === nextSlug);
    if (!row) return;
    setSlug(nextSlug);
    setDraft(toDraft(row));
    setFile(null);
    setPreview("");
    setMsg("");
    setSaved(false);
  }

  function setField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function uploadImage(supabase: ReturnType<typeof createClient>, nextSlug: string, imageFile: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      throw new Error("Use a JPEG, PNG, WebP, or GIF image.");
    }
    if (imageFile.size > MAX_IMAGE_BYTES) {
      throw new Error("Image must be 8 MB or smaller.");
    }
    const ext =
      imageFile.type === "image/png"
        ? "png"
        : imageFile.type === "image/webp"
          ? "webp"
          : imageFile.type === "image/gif"
            ? "gif"
            : "jpg";
    const path = `${nextSlug}-${Date.now()}.${ext}`;
    await supabase.storage.createBucket(RECIPE_IMAGE_BUCKET, {
      public: true,
      fileSizeLimit: MAX_IMAGE_BYTES,
      allowedMimeTypes: [...ALLOWED_IMAGE_TYPES],
    });
    const { error } = await supabase.storage.from(RECIPE_IMAGE_BUCKET).upload(path, imageFile, {
      cacheControl: "3600",
      upsert: true,
      contentType: imageFile.type,
    });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(RECIPE_IMAGE_BUCKET).getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  }

  async function save() {
    if (!current) return;
    setBusy(true);
    setMsg("");
    setSaved(false);
    try {
      const supabase = createClient();
      const next = fromDraft(current, draft);
      if (file) next.image = await uploadImage(supabase, current.slug, file);
      const overrideResult = await supabase.from("recipe_overrides").upsert({ slug: current.slug, recipe: next }, { onConflict: "slug" });
      if (overrideResult.error) throw new Error(overrideResult.error.message);
      await supabase.from("recipes").upsert({ slug: current.slug, data: next, published: true }, { onConflict: "slug" });
      setDraft(toDraft(next));
      setFile(null);
      setPreview("");
      setSaved(true);
      setMsg("Recipe saved.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not save the recipe.");
    } finally {
      setBusy(false);
    }
  }

  if (!current) return <p className="mt-8 text-white/70">No recipes found.</p>;

  return (
    <section className="mt-8 space-y-6">
      <label className={labelClass}>
        Search recipes
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Title, region, or category" className={fieldClass} />
      </label>
      <label className={labelClass}>
        Select a recipe
        <select value={slug} onChange={(e) => pick(e.target.value)} className={fieldClass}>
          {(filtered.length ? filtered : catalog).map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.title}
            </option>
          ))}
        </select>
      </label>
      <p className="text-sm text-white/50">
        {catalog.length} recipes available. Editing {current.title}.
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <img src={preview || draft.image || current.image} alt="" className="h-48 w-full object-cover" />
      </div>
      <label className={labelClass}>
        Picture
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
          className={`${fieldClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#c45c26] file:px-3 file:py-2 file:text-[#0c0907]`}
          onChange={(e) => {
            const nextFile = e.target.files?.[0] || null;
            setFile(nextFile);
            setSaved(false);
            setPreview(nextFile ? URL.createObjectURL(nextFile) : "");
          }}
        />
      </label>
      <p className="text-xs text-white/40">JPEG, PNG, WebP, or GIF up to 8 MB. Use the phone photo picker.</p>
      <label className={labelClass}>
        Title
        <input value={draft.title} onChange={(e) => setField("title", e.target.value)} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Description
        <textarea value={draft.summary} onChange={(e) => setField("summary", e.target.value)} rows={3} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Story
        <textarea value={draft.story} onChange={(e) => setField("story", e.target.value)} rows={5} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Category
        <input value={draft.protein} onChange={(e) => setField("protein", e.target.value)} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Region
        <input value={draft.region} onChange={(e) => setField("region", e.target.value)} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Servings
        <input value={draft.servings} onChange={(e) => setField("servings", e.target.value)} className={fieldClass} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass}>
          Cooking time min (hours)
          <input value={draft.hoursMin} onChange={(e) => setField("hoursMin", e.target.value)} inputMode="decimal" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Cooking time max (hours)
          <input value={draft.hoursMax} onChange={(e) => setField("hoursMax", e.target.value)} inputMode="decimal" className={fieldClass} />
        </label>
      </div>
      <label className={labelClass}>
        Wood
        <input value={draft.wood} onChange={(e) => setField("wood", e.target.value)} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Pit temperature
        <input value={draft.pitTemp} onChange={(e) => setField("pitTemp", e.target.value)} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Finishing temperature
        <input value={draft.finish} onChange={(e) => setField("finish", e.target.value)} className={fieldClass} />
      </label>
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl italic">Ingredients</h2>
          <button type="button" className="rounded-lg border border-white/15 px-3 py-2 text-sm" onClick={() => setField("ingredients", [...draft.ingredients, { group: "New group", items: [""] }])}>
            Add group
          </button>
        </div>
        <div className="mt-4 space-y-6">
          {draft.ingredients.map((group, gi) => (
            <div key={gi} className="rounded-2xl border border-white/10 p-4">
              <label className={labelClass}>
                Group name
                <input value={group.group} onChange={(e) => setField("ingredients", draft.ingredients.map((g, i) => (i === gi ? { ...g, group: e.target.value } : g)))} className={fieldClass} />
              </label>
              <label className={`${labelClass} mt-3`}>
                Items (one per line)
                <textarea value={group.items.join("\n")} onChange={(e) => setField("ingredients", draft.ingredients.map((g, i) => (i === gi ? { ...g, items: e.target.value.split("\n") } : g)))} rows={Math.max(4, group.items.length + 1)} className={fieldClass} />
              </label>
              <button type="button" className="mt-3 text-sm text-red-300" onClick={() => setField("ingredients", draft.ingredients.filter((_, i) => i !== gi))}>
                Remove group
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl italic">Cooking steps</h2>
          <button type="button" className="rounded-lg border border-white/15 px-3 py-2 text-sm" onClick={() => setField("steps", [...draft.steps, { title: "", body: "" }])}>
            Add step
          </button>
        </div>
        <div className="mt-4 space-y-6">
          {draft.steps.map((step, si) => (
            <div key={si} className="rounded-2xl border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">Step {si + 1}</p>
              <label className={`${labelClass} mt-2`}>
                Step title
                <input value={step.title} onChange={(e) => setField("steps", draft.steps.map((s, i) => (i === si ? { ...s, title: e.target.value } : s)))} className={fieldClass} />
              </label>
              <label className={`${labelClass} mt-3`}>
                Step details
                <textarea value={step.body} onChange={(e) => setField("steps", draft.steps.map((s, i) => (i === si ? { ...s, body: e.target.value } : s)))} rows={4} className={fieldClass} />
              </label>
              <button type="button" className="mt-3 text-sm text-red-300" onClick={() => setField("steps", draft.steps.filter((_, i) => i !== si))}>
                Remove step
              </button>
            </div>
          ))}
        </div>
      </div>
      <button disabled={busy || !slug} onClick={save} className="min-h-14 w-full rounded-2xl bg-[#c45c26] px-4 py-4 text-lg font-semibold text-[#0c0907] disabled:opacity-50">
        {busy ? "Saving…" : "Save recipe"}
      </button>
      {saved ? <p className="text-center text-base text-emerald-300">Recipe saved.</p> : null}
      {msg && !saved ? <p className="text-center text-sm text-red-300">{msg}</p> : null}
    </section>
  );
}
