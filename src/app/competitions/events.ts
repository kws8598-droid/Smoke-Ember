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
// Refreshed November 2026 — MBN events plus KCBS Jack/Royal qualifier events
// in the southern states. Refreshed monthly.
export const events: CompEvent[] = [
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
    name: "Toula 'Que & Fall Fest",
    start: "2026-11-13",
    end: "2026-11-14",
    city: "Ponchatoula",
    state: "LA",
    body: "KCBS",
  },
  {
    name: "Christmas on the Coast",
    start: "2026-12-04",
    end: "2026-12-05",
    city: "Biloxi",
    state: "MS",
    body: "KCBS",
  },
  {
    name: "Smokin' the SIP",
    start: "2026-12-18",
    end: "2026-12-19",
    city: "Moss Point",
    state: "MS",
    body: "KCBS",
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
    name: "15th Annual Taste of Blanchard",
    start: "2027-01-15",
    end: "2027-01-16",
    city: "Blanchard",
    state: "LA",
    body: "KCBS",
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
    name: "22nd Bi-Annual Spring BBQ Throwdown",
    start: "2027-04-16",
    end: "2027-04-17",
    city: "Marksville",
    state: "LA",
    body: "KCBS",
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
    name: "Quein' On the Red",
    start: "2027-04-30",
    end: "2027-05-01",
    city: "Alexandria",
    state: "LA",
    body: "KCBS",
  },
  {
    name: "Memphis in May World Championship Barbecue Cooking Contest",
    start: "2027-05-12",
    end: "2027-05-15",
    city: "Memphis",
    state: "TN",
    body: "MBN",
    note: "50th anniversary",
  },
  {
    name: "Sweetwater Campground BBQ Contest",
    start: "2027-05-21",
    end: "2027-05-22",
    city: "Loranger",
    state: "LA",
    body: "KCBS",
  },
  {
    name: "10th Annual Cooking on the Creek BBQ Battle",
    start: "2027-06-18",
    end: "2027-06-19",
    city: "Biloxi",
    state: "MS",
    body: "KCBS",
  },
  {
    name: "16th Annual BBQ Bash",
    start: "2027-07-30",
    end: "2027-07-31",
    city: "Morgan City",
    state: "LA",
    body: "KCBS",
  },
  {
    name: "Bucks Birds and BBQ",
    start: "2027-08-20",
    end: "2027-08-21",
    city: "Brookhaven",
    state: "MS",
    body: "KCBS",
  },
  {
    name: "20th Annual Smokin' Oldies BBQ Cook-off",
    start: "2027-09-10",
    end: "2027-09-11",
    city: "Port Allen",
    state: "LA",
    body: "KCBS",
  },
  {
    name: "The Shed BBQ",
    start: "2027-09-17",
    end: "2027-09-18",
    city: "Ocean Springs",
    state: "MS",
    body: "KCBS",
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
