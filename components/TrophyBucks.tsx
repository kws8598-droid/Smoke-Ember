"use client";

import Image from "next/image";

type TrophyBuck = {
  image: string;
  hunter: string;
  place: string;
  date: string;
  note?: string;
};

// Kelly-curated gallery. There is no open upload form on purpose — hunters
// send their photo to Kelly, he picks what goes up, and the entry is added
// here by hand. To add a buck: shrink the photo to 1200x800 JPEG (quality
// 82), put it in public/images/trophy-bucks/<slug>.jpg, then add one entry
// below with the hunter's first name, where and when it was taken, and an
// optional short line about the buck.
const trophyBucks: TrophyBuck[] = [];

export default function TrophyBucks() {
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl italic">Trophy Bucks</h2>
      <p className="mt-2 max-w-xl text-parchment/80">
        The bucks our hunters are proud of — every one of them picked by Kelly.
        Legal harvests only, in season and tagged.
      </p>
      {trophyBucks.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-bark p-5">
          <p className="font-display text-xl italic text-cream">
            No bucks in the gallery yet — be the first.
          </p>
          <p className="mt-2 text-sm text-parchment/80">
            Got a buck you are proud of? Send your photo to Kelly — a message here
            or on Facebook — with your first name, where you took it, and when. He
            picks what goes up.
          </p>
          <p className="mt-2 text-sm text-parchment/80">
            Clean trophy photos only, please: the deer intact, you with your buck,
            your gun or bow laid across it if you like — no blood, no gut piles, no
            field-dressing close-ups.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trophyBucks.map((b) => (
            <figure
              key={b.image}
              className="overflow-hidden rounded-2xl border border-white/10 bg-bark"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={b.image}
                  alt={`Trophy buck taken by ${b.hunter}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="p-4">
                <p className="font-display text-xl italic text-cream">{b.hunter}</p>
                <p className="mt-1 text-sm text-parchment/80">
                  {b.place} · {b.date}
                </p>
                {b.note ? (
                  <p className="mt-2 text-sm text-parchment/80">{b.note}</p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
