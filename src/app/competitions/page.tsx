import Image from "next/image";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { events, monthLabel, dayLabel, monthShort, dateRange, type CompEvent } from "./events";

export const metadata = {
  title: "Competition Calendar | Smoke and Ember",
  description:
    "Upcoming BBQ competitions across the South — KCBS and MBN sanctioned contests from Texas to Virginia.",
};

function groupByMonth(list: CompEvent[]) {
  const groups: { label: string; items: CompEvent[] }[] = [];
  for (const e of list) {
    const label = monthLabel(e.start);
    const g = groups.find((g) => g.label === label);
    if (g) g.items.push(e);
    else groups.push({ label, items: [e] });
  }
  return groups;
}

export default function CompetitionsPage() {
  const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
  const groups = groupByMonth(sorted);
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <BackButton fallback="/" />
      <div className="relative -mx-4 overflow-hidden">
        <div className="relative h-52 sm:h-72">
          <Image
            src="/images/competitions-header.jpg"
            alt="BBQ competition with smokers, trophies and bunting at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-5">
          <p className="text-xs uppercase tracking-[0.22em] text-ember">Smoke and Ember</p>
          <h1 className="mt-1 font-display text-4xl italic text-cream sm:text-5xl">
            Competition Calendar
          </h1>
          <p className="mt-2 max-w-xl text-sm text-parchment/90">
            BBQ contests across the South, Texas to Virginia. Sanctioned cook-offs worth the drive —
            updated every month.
          </p>
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.label} className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.22em] text-subtle">{g.label}</h2>
          <div className="mt-3 grid gap-3">
            {g.items.map((e) => (
              <article
                key={e.name}
                className="flex gap-4 rounded-2xl border border-white/10 bg-bark p-4"
              >
                <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-ink/60">
                  <span className="font-display text-2xl text-cream">{dayLabel(e.start)}</span>
                  <span className="text-[10px] tracking-widest text-subtle">{monthShort(e.start)}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl text-cream">{e.name}</h3>
                  <p className="mt-0.5 text-sm text-parchment/80">
                    {e.city}, {e.state} · {dateRange(e)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-ember/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-ember">
                      {e.body}
                    </span>
                    {e.note && <span className="text-xs text-subtle">{e.note}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-12 rounded-2xl border border-white/10 bg-bark p-5">
        <h2 className="font-display text-2xl italic text-cream">Know a contest we're missing?</h2>
        <p className="mt-2 text-sm text-parchment/80">
          We cover KCBS and MBN sanctioned events across TX, MO, KY, TN, MS, AL, GA, SC, NC, VA,
          FL, LA and AR, refreshed monthly. Cooking in one?{" "}
          <Link href="/contact" className="text-ember hover:text-ember-hot">
            Tell us about it
          </Link>
          .
        </p>
        <p className="mt-3 text-xs text-subtle">
          Always confirm dates with the organizer before you load the trailer — schedules shift.
        </p>
      </section>
      <div className="mt-10">
        <BackButton fallback="/" />
      </div>
    </main>
  );
}
