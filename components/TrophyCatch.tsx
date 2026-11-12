"use client";

import Image from "next/image";

type TrophyCatch = {
  image: string;
  angler: string;
  place: string;
  date: string;
  note?: string;
};

// Kelly-curated gallery. There is no open upload form on purpose — anglers
// send their photo to Kelly, he picks what goes up, and the entry is added
// here by hand. To add a catch: shrink the photo to 1200x800 JPEG (quality
// 82), put it in public/images/trophy-catch/<slug>.jpg, then add one entry
// below with the angler's first name, where and when it was caught, and an
// optional short line (species, size, or how it was caught).
const trophyCatch: TrophyCatch[] = [];

export default function TrophyCatch() {
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl italic">Trophy Catch</h2>
      <p className="mt-2 max-w-xl text-parchment/80">
        The fish our anglers are proud of — every one of them picked by Kelly.
        Legal catches only, in season and within size and creel limits.
      </p>
      {trophyCatch.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-bark p-5">
          <p className="font-display text-xl italic text-cream">
            No catches in the gallery yet — be the first.
          </p>
          <p className="mt-2 text-sm text-parchment/80">
            Got a fish you are proud of? Send your photo to Kelly — a message here
            or on Facebook — with your first name, where you caught it, and when.
            He picks what goes up.
          </p>
          <p className="mt-2 text-sm text-parchment/80">
            Clean photos only, please: you with your catch, held up nice — no
            bloody close-ups, no illegal harvests, nothing out of season or over
            the limit.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trophyCatch.map((c) => (
            <figure
              key={c.image}
              className="overflow-hidden rounded-2xl border border-white/10 bg-bark"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={c.image}
                  alt={`Trophy catch by ${c.angler}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="p-4">
                <p className="font-display text-xl italic text-cream">{c.angler}</p>
                <p className="mt-1 text-sm text-parchment/80">
                  {c.place} · {c.date}
                </p>
                {c.note ? (
                  <p className="mt-2 text-sm text-parchment/80">{c.note}</p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
