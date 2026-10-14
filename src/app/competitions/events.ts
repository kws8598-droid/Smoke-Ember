export type CompEvent = {
  name: string;
  start: string; // ISO date
  end: string;   // ISO date
  city: string;
  state: string;
  body: string;  // KCBS | MBN | IBCA | ...
  note?: string;
  url?: string;
};

// Seeded October 2026 from the Memphis Barbecue Network public calendar.
// Refreshed monthly — KCBS sanctioned events get added on each refresh.
export const events: CompEvent[] = [
  {
    name: "Fall Fest Memphis BBQ Cook-Off",
    start: "2026-10-16",
    end: "2026-10-17",
    city: "Collierville",
    state: "TN",
    body: "MBN",
  },
  {
    name: "Downtown BBQ Throwdown",
    start: "2026-10-16",
    end: "2026-10-17",
    city: "Memphis",
    state: "TN",
    body: "MBN",
  },
  {
    name: "Bolivar BBQ Blowout",
    start: "2026-10-23",
    end: "2026-10-24",
    city: "Bolivar",
    state: "TN",
    body: "MBN",
  },
  {
    name: "Fire on the Water",
    start: "2026-10-23",
    end: "2026-10-24",
    city: "Memphis",
    state: "TN",
    body: "MBN",
  },
  {
    name: "Smokin' the Coast",
    start: "2026-10-30",
    end: "2026-10-31",
    city: "Gulf Coast",
    state: "MS",
    body: "MBN",
  },
  {
    name: "Big Pig Jig",
    start: "2026-11-06",
    end: "2026-11-07",
    city: "Vienna",
    state: "GA",
    body: "MBN",
    note: "Georgia's oldest cooking contest",
  },
  {
    name: "The Hog Drop",
    start: "2026-12-30",
    end: "2027-01-01",
    city: "Memphis",
    state: "TN",
    body: "MBN",
    note: "New Year's Eve cook-off",
  },
  {
    name: "Atoka BBQ Fest",
    start: "2027-04-02",
    end: "2027-04-03",
    city: "Atoka",
    state: "TN",
    body: "MBN",
  },
  {
    name: "Southaven Springfest",
    start: "2027-04-23",
    end: "2027-04-24",
    city: "Southaven",
    state: "MS",
    body: "MBN",
  },
  {
    name: "Kentucky State BBQ Festival",
    start: "2027-09-10",
    end: "2027-09-12",
    city: "Danville",
    state: "KY",
    body: "KY",
    note: "Kelly's home turf — dates TBA, check back",
  },
];

export function monthLabel(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function dayLabel(iso: string) {
  return new Date(iso + "T12:00:00").getDate().toString();
}

export function monthShort(iso: string) {
  return new Date(iso + "T12:00:00")
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
}

export function dateRange(e: CompEvent) {
  const s = new Date(e.start + "T12:00:00");
  const en = new Date(e.end + "T12:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (e.start === e.end) return s.toLocaleDateString("en-US", opts);
  return `${s.toLocaleDateString("en-US", opts)} – ${en.toLocaleDateString("en-US", opts)}`;
}
