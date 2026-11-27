"use client";

import BackButton from "@/components/BackButton";
import RecipeCard from "@/components/RecipeCard";
import { useLiveCatalog } from "@/components/LiveCatalog";

// Recipes folks have sent in — added here as they come in, with their names on them.
const friendSlugs: string[] = [];

export default function FriendsAndFamilyPage() {
  const { recipes } = useLiveCatalog();
  const list = friendSlugs.map((s) => recipes.find((r) => r.slug === s)).filter(Boolean);
  return (
    <main className="relative">
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <BackButton fallback="/" />
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Our user submitted recipes</p>
        <h1 className="mt-2 font-display text-5xl italic">Friends &amp; Family Recipes</h1>
        <p className="mt-3 max-w-xl text-parchment/80">Favorite family dishes, sent in by the folks who cook them — with their names on them.</p>
        <div className="mt-8 rounded-2xl border border-ember/30 bg-bark p-5 sm:p-6">
          <h2 className="font-display text-2xl italic text-cream">Send us yours</h2>
          <p className="mt-2 max-w-2xl text-parchment/85">Got a favorite family recipe? Holiday ones right now — Christmas dinner, sides, desserts, whatever your family makes every year. Write it down, add a photo of the dish if you&apos;ve got one, and share it on the <a href="https://www.facebook.com/profile.php?id=61596493118758" className="font-semibold text-ember hover:text-ember-hot">Smoke and Ember Facebook Page</a> or send it in a message. We&apos;ll feature it here with your name on it.</p>
        </div>
        {list.length === 0 ? (
          <p className="mt-8 text-lg text-parchment/80">Nothing here yet — the first recipes are on their way. Send yours in and be the first.</p>
        ) : (
          <>
            <p className="mt-6 text-sm text-subtle">{list.length} {list.length === 1 ? "recipe" : "recipes"} from friends and family</p>
            <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
            </div>
          </>
        )}
        <div className="mt-10">
          <BackButton fallback="/" />
        </div>
      </div>
    </main>
  );
}
