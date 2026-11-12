"use client";

import { useState } from "react";

/**
 * FishingForecast — ZIP in, best fishing days for the next 7 days.
 *
 * Everything runs in the visitor's browser, no server round-trip and no
 * Vercel cost:
 *   ZIP -> lat/lon  : api.zippopotam.us (free, no key)
 *   weather          : api.weather.gov (National Weather Service, free, no key)
 *   sun / moon / solunar : computed here, client-side.
 *
 * Astronomy: Schlyter's low-precision sun/moon algorithms (mean elements +
 * the principal perturbation terms) with topocentric parallax correction
 * for the moon, solved by bisection on the hour angle so the moon's fast
 * motion between transit and rise/set is handled. Validated against USNO
 * ground truth for Lawrenceburg, KY (38.03, -84.90) on Nov 12, 2026:
 * sunrise/sunset and moonrise/moonset/transit all within ~1 minute,
 * phase Waxing Crescent 11% exact. Sunrise/sunset use the NOAA standard
 * upper-limb altitude h0 = -(0.583 deg refraction + semidiameter).
 *
 * Solunar feeding windows follow the usual folklore: majors ~2 hr around
 * moon overhead (upper transit) and underfoot (lower transit); minors
 * ~1 hr around moonrise and moonset. They are shown as a planning aid,
 * not a guarantee — weather and first/last light carry the score, and
 * GPS-collar-style studies have found the moon's effect small. The score
 * below is a documented heuristic, not science.
 *
 * Scoring (heuristic, 0-100, starts at 50):
 *   wind 3-10 mph +10 · 11-15 +5 · 16-20 0 · over 20 -10 · under 3 +2
 *   rain chance under 20% +5 · 20-50% 0 · over 50% -8
 *   high 55-78 F +8 · 45-54 or 79-85 +3 · under 40 or over 90 -8
 *   pressure moving >1 hPa in 3 hr (today only, NWS station) +5
 *   solunar major overlapping first/last light +10 · minor +5
 *   major in daylight (not at light) +5
 *   moon near new or full (illumination under 15% or over 85%) +5
 * Grades: 80+ Great · 65-79 Good · 50-64 Fair · under 50 Slow.
 */

// ---------------------------------------------------------------------------
// Astronomy
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

const norm360 = (x: number) => ((x % 360) + 360) % 360;
const norm24 = (x: number) => ((x % 24) + 24) % 24;

function toJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}
function fromJulian(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

type SunPos = { ra: number; dec: number; sd: number };
function sunRaDec(d: number): SunPos {
  const w = 282.9404 + 4.70935e-5 * d;
  const e = 0.016709 - 1.151e-9 * d;
  const M = norm360(356.047 + 0.9856002585 * d);
  const L = w + M;
  const E = M + (RAD * e * Math.sin(M * DEG)) * (1 + e * Math.cos(M * DEG));
  const x = Math.cos(E * DEG) - e;
  const y = Math.sin(E * DEG) * Math.sqrt(1 - e * e);
  const v = norm360(Math.atan2(y, x) * RAD);
  const lon = norm360(v + w);
  const ra = norm360(Math.atan2(Math.sin(lon * DEG) * Math.cos(23.4393 * DEG), Math.cos(lon * DEG)) * RAD);
  const dec = Math.asin(Math.sin(lon * DEG) * Math.sin(23.4393 * DEG)) * RAD;
  return { ra, dec, sd: 0.2666 / (1 - e * Math.cos(E * DEG)) };
}

type MoonPos = { ra: number; dec: number; r: number; sd: number; illum: number; age: number };
function moonRaDec(d: number): MoonPos {
  const N = norm360(125.04 - 0.0529538083 * d);
  const i = norm360(5.1454);
  const w = norm360(318.0634 + 0.1643573223 * d);
  const a = 60.2666;
  const e = 0.0549;
  const M = norm360(115.3654 + 13.0649929509 * d);
  const Ms = norm360(356.047 + 0.9856002585 * d);
  const ws = norm360(282.9404 + 4.70935e-5 * d);
  const Lm = norm360(N + w + M);
  const Ls = norm360(ws + Ms);
  const D = norm360(Lm - Ls);
  const F = norm360(Lm - N);
  const E = M + (RAD * e * Math.sin(M * DEG)) * (1 + e * Math.cos(M * DEG));
  const x = a * (Math.cos(E * DEG) - e);
  const y = a * Math.sin(E * DEG) * Math.sqrt(1 - e * e);
  const v = Math.atan2(y, x) * RAD;
  const r = Math.sqrt(x * x + y * y);
  const lon =
    norm360(v + w) +
    -1.274 * Math.sin((M - 2 * D) * DEG) +
    0.658 * Math.sin(2 * D * DEG) -
    0.186 * Math.sin(Ms * DEG) -
    0.059 * Math.sin((2 * M - 2 * D) * DEG) -
    0.057 * Math.sin((M - 2 * D + Ms) * DEG) +
    0.053 * Math.sin((M + 2 * D) * DEG) +
    0.046 * Math.sin((2 * D - Ms) * DEG) +
    0.041 * Math.sin((M - Ms) * DEG) -
    0.035 * Math.sin(D * DEG) -
    0.031 * Math.sin((M + Ms) * DEG) -
    0.015 * Math.sin((2 * F - 2 * D) * DEG) +
    0.011 * Math.sin((M - 4 * D) * DEG);
  const lat =
    -0.173 * Math.sin((F - 2 * D) * DEG) -
    0.055 * Math.sin((M - F - 2 * D) * DEG) -
    0.046 * Math.sin((M + F - 2 * D) * DEG) +
    0.033 * Math.sin((F + 2 * D) * DEG) +
    0.017 * Math.sin((2 * M + F) * DEG);
  const lonR = norm360(lon) * DEG;
  const latR = lat * DEG;
  const ecl = 23.4393 * DEG;
  const ra = norm360(
    Math.atan2(Math.sin(lonR) * Math.cos(ecl) - Math.tan(latR) * Math.sin(ecl), Math.cos(lonR)) * RAD
  );
  const dec = Math.asin(
    Math.sin(latR) * Math.cos(ecl) + Math.cos(latR) * Math.sin(ecl) * Math.sin(lonR)
  ) * RAD;
  const sd = 0.2725 / r / DEG;
  const phaseAngle =
    180 -
    D -
    6.289 * Math.sin(M * DEG) +
    2.1 * Math.sin(Ms * DEG) -
    1.274 * Math.sin((2 * D - M) * DEG) -
    0.658 * Math.sin(2 * D * DEG) -
    0.214 * Math.sin(2 * M * DEG) -
    0.11 * Math.sin(D * DEG);
  const illum = (1 + Math.cos(phaseAngle * DEG)) / 2;
  const age = (D / 360) * 29.530588853;
  return { ra, dec, r, sd, illum, age };
}

function gmst(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm360(
    280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000
  );
}

/** Topocentric moon position: geocentric vector minus the observer's vector. */
function topocentricMoon(jd: number, lat: number, lon: number, geo: MoonPos): { ra: number; dec: number } {
  const phi = lat * DEG;
  const u = Math.atan(0.99664719 * Math.tan(phi));
  const rhoSinPhi = 0.99664719 * Math.sin(u);
  const rhoCosPhi = Math.cos(u);
  const lst = norm360(gmst(jd) + lon) * DEG;
  const raR = geo.ra * DEG;
  const decR = geo.dec * DEG;
  const x = geo.r * Math.cos(decR) * Math.cos(raR) - rhoCosPhi * Math.cos(lst);
  const y = geo.r * Math.cos(decR) * Math.sin(raR) - rhoCosPhi * Math.sin(lst);
  const z = geo.r * Math.sin(decR) - rhoSinPhi;
  return {
    ra: norm360(Math.atan2(y, x) * RAD),
    dec: Math.atan2(z, Math.hypot(x, y)) * RAD,
  };
}

type BodyEvents = { rise: number | null; set: number | null; transit: number | null; antiTransit: number | null };

function dayEvents(jd0: number, lat: number, lon: number, body: "sun" | "moon"): BodyEvents {
  const getPos = (jd: number) => {
    const d = jd - 2451543.5;
    if (body === "sun") {
      const p = sunRaDec(d);
      return { ra: p.ra, dec: p.dec, h0: -(0.583 + p.sd) };
    }
    const m = moonRaDec(d);
    const t = topocentricMoon(jd, lat, lon, m);
    return { ra: t.ra, dec: t.dec, h0: -(0.583 + m.sd) };
  };
  const norm180 = (x: number) => (((x + 180) % 360) + 360) % 360 - 180;
  const g0 = gmst(jd0);
  let tTransit = norm24((getPos(jd0).ra - lon - g0) / 15.0410686);
  for (let k = 0; k < 2; k++) {
    const p = getPos(jd0 + tTransit / 24);
    tTransit = norm24((p.ra - lon - g0) / 15.0410686);
  }
  let tAnti = norm24((getPos(jd0).ra + 180 - lon - g0) / 15.0410686);
  for (let k = 0; k < 2; k++) {
    const p = getPos(jd0 + tAnti / 24);
    tAnti = norm24((p.ra + 180 - lon - g0) / 15.0410686);
  }
  const H0at = (t: number) => {
    const p = getPos(jd0 + t / 24);
    const arg =
      (Math.sin(p.h0 * DEG) - Math.sin(lat * DEG) * Math.sin(p.dec * DEG)) /
      (Math.cos(lat * DEG) * Math.cos(p.dec * DEG));
    if (arg < -1 || arg > 1) return null;
    return Math.acos(arg) * RAD;
  };
  const Hat = (t: number) => {
    const p = getPos(jd0 + t / 24);
    return norm180(gmst(jd0 + t / 24) + lon - p.ra);
  };
  const bisect = (lo: number, hi: number, f: (t: number) => number | null): number | null => {
    let flo = f(lo);
    const fhi = f(hi);
    if (flo === null || fhi === null || flo * fhi > 0) return null;
    for (let k = 0; k < 12; k++) {
      const mid = (lo + hi) / 2;
      const fm = f(mid);
      if (fm === null) return null;
      if (flo * fm <= 0) hi = mid;
      else {
        lo = mid;
        flo = fm;
      }
    }
    return (lo + hi) / 2;
  };
  const rise = bisect(tTransit - 12, tTransit, (t) => {
    const h0 = H0at(t);
    return h0 === null ? null : Hat(t) + h0;
  });
  const set = bisect(tTransit, tTransit + 12, (t) => {
    const h0 = H0at(t);
    return h0 === null ? null : Hat(t) - h0;
  });
  return { rise, set, transit: tTransit, antiTransit: tAnti };
}

function phaseName(age: number): string {
  if (age < 1.84566) return "New Moon";
  if (age < 5.53699) return "Waxing Crescent";
  if (age < 9.22831) return "First Quarter";
  if (age < 12.91963) return "Waxing Gibbous";
  if (age < 16.61096) return "Full Moon";
  if (age < 20.30228) return "Waning Gibbous";
  if (age < 23.99361) return "Last Quarter";
  if (age < 27.68493) return "Waning Crescent";
  return "New Moon";
}

// ---------------------------------------------------------------------------
// Date / time helpers
// ---------------------------------------------------------------------------

function dateStrYMD(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function addDays(y: number, m: number, d: number, n: number): { y: number; m: number; d: number } {
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}
function todayInTz(tz: string): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { y: get("year"), m: get("month"), d: get("day") };
}
function localDateStr(dt: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(dt);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function fmtTime(dt: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  }).format(dt);
}
function dayLabel(y: number, m: number, d: number, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}
function fmtRange(start: Date, end: Date, tz: string): string {
  return `${fmtTime(start, tz)}–${fmtTime(end, tz)}`;
}

type DayAstro = {
  date: string;
  sunrise: Date | null;
  sunset: Date | null;
  moonrise: Date | null;
  moonset: Date | null;
  moonTransit: Date | null;
  moonAntiTransit: Date | null;
  phaseName: string;
  illumination: number;
};

function astroForDate(
  y: number,
  m: number,
  d: number,
  lat: number,
  lon: number,
  tz: string
): DayAstro {
  const target = dateStrYMD(y, m, d);
  const result: DayAstro = {
    date: target,
    sunrise: null,
    sunset: null,
    moonrise: null,
    moonset: null,
    moonTransit: null,
    moonAntiTransit: null,
    phaseName: "—",
    illumination: 0,
  };
  const jdNoon = toJulian(new Date(Date.UTC(y, m - 1, d, 12, 0, 0)));
  const base = Math.floor(jdNoon);
  const seen = new Set<string>();
  const collect = (body: "sun" | "moon") => {
    for (let off = -1; off <= 1; off++) {
      const jd0 = base + off;
      const ev = dayEvents(jd0, lat, lon, body);
      const fields: [keyof BodyEvents, "sunrise" | "sunset" | "moonrise" | "moonset" | "moonTransit" | "moonAntiTransit"][] =
        body === "sun"
          ? [
              ["rise", "sunrise"],
              ["set", "sunset"],
            ]
          : [
              ["rise", "moonrise"],
              ["set", "moonset"],
              ["transit", "moonTransit"],
              ["antiTransit", "moonAntiTransit"],
            ];
      for (const [field, dest] of fields) {
        const t = ev[field];
        if (t === null) continue;
        const dt = fromJulian(jd0 + t / 24);
        if (localDateStr(dt, tz) !== target) continue;
        const k = `${dest}:${dt.getUTCFullYear()}-${dt.getUTCMonth()}-${dt.getUTCDate()} ${dt.getUTCHours()}:${dt.getUTCMinutes()}`;
        if (seen.has(k)) continue;
        seen.add(k);
        if (!result[dest]) result[dest] = dt;
      }
    }
  };
  collect("sun");
  collect("moon");
  const moonNoon = moonRaDec(jdNoon - 2451543.5);
  result.phaseName = phaseName(moonNoon.age);
  result.illumination = moonNoon.illum;
  return result;
}

// ---------------------------------------------------------------------------
// Weather (National Weather Service) + ZIP lookup (zippopotam.us)
// ---------------------------------------------------------------------------

type ZippopotamResponse = {
  places?: { latitude: string; longitude: string; "place name": string; "state abbreviation": string }[];
};
type NwsPointsResponse = {
  properties?: {
    forecast?: string;
    observationStations?: string;
    timeZone?: string;
    relativeLocation?: { properties?: { city?: string; state?: string } };
  };
};
type NwsPeriod = {
  name: string;
  startTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  probabilityOfPrecipitation?: { value: number | null };
  shortForecast: string;
};
type NwsForecastResponse = { properties?: { periods?: NwsPeriod[] } };
type NwsStationsResponse = { features?: { properties?: { stationIdentifier?: string } }[] };
type NwsObservationsResponse = {
  features?: {
    properties?: {
      timestamp?: string;
      barometricPressure?: { value: number | null };
    };
  }[];
};

function parseWindMph(windSpeed: string): number | null {
  const nums = windSpeed.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Current pressure trend from the nearest NWS station; nulls on any failure. */
async function fetchPressureTrend(stationsUrl: string): Promise<number | null> {
  try {
    const stRes = await fetch(stationsUrl);
    if (!stRes.ok) return null;
    const st = (await stRes.json()) as NwsStationsResponse;
    const id = st.features?.[0]?.properties?.stationIdentifier;
    if (!id) return null;
    const obRes = await fetch(`https://api.weather.gov/stations/${id}/observations?limit=40`);
    if (!obRes.ok) return null;
    const ob = (await obRes.json()) as NwsObservationsResponse;
    const readings = (ob.features ?? [])
      .map((f) => ({
        t: f.properties?.timestamp ? Date.parse(f.properties.timestamp) : NaN,
        p: f.properties?.barometricPressure?.value ?? null,
      }))
      .filter((r) => !Number.isNaN(r.t) && r.p !== null)
      .sort((a, b) => b.t - a.t);
    if (readings.length < 2) return null;
    const latest = readings[0];
    const target = latest.t - 3 * 3600 * 1000;
    let earlier = readings[readings.length - 1];
    for (const r of readings) {
      if (Math.abs(r.t - target) < Math.abs(earlier.t - target)) earlier = r;
    }
    if (latest.t - earlier.t < 3600 * 1000) return null;
    return ((latest.p as number) - (earlier.p as number)) / 100; // Pa -> hPa
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Scoring + feeding windows
// ---------------------------------------------------------------------------

function gradeFor(score: number): { grade: string; blurb: string } {
  if (score >= 80) return { grade: "Great", blurb: "Get out there." };
  if (score >= 65) return { grade: "Good", blurb: "Worth the trip." };
  if (score >= 50) return { grade: "Fair", blurb: "An ordinary day." };
  return { grade: "Slow", blurb: "Tough day — fish the edges of light." };
}

function overlapMinutes(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): number {
  return Math.max(0, (Math.min(aEnd.getTime(), bEnd.getTime()) - Math.max(aStart.getTime(), bStart.getTime())) / 60000);
}

type DayForecast = {
  date: string;
  label: string;
  high: number | null;
  low: number | null;
  windMph: number | null;
  windText: string;
  pop: number | null;
  shortForecast: string;
  astro: DayAstro;
  score: number;
  grade: string;
  blurb: string;
  bestBet: string;
};

function scoreAndBestBet(
  astro: DayAstro,
  high: number | null,
  windMph: number | null,
  pop: number | null,
  pressureTrendHpa: number | null,
  isToday: boolean,
  tz: string
): { score: number; bestBet: string } {
  let score = 50;
  if (windMph !== null) {
    if (windMph >= 3 && windMph <= 10) score += 10;
    else if (windMph > 10 && windMph <= 15) score += 5;
    else if (windMph > 20) score -= 10;
    else if (windMph < 3) score += 2;
  }
  if (pop !== null) {
    if (pop < 20) score += 5;
    else if (pop > 50) score -= 8;
  }
  if (high !== null) {
    if (high >= 55 && high <= 78) score += 8;
    else if ((high >= 45 && high < 55) || (high > 78 && high <= 85)) score += 3;
    else if (high < 40 || high > 90) score -= 8;
  }
  if (isToday && pressureTrendHpa !== null && Math.abs(pressureTrendHpa) >= 1) score += 5;

  const dawn =
    astro.sunrise !== null
      ? { start: astro.sunrise, end: new Date(astro.sunrise.getTime() + 3600 * 1000), label: "first light" }
      : null;
  const dusk =
    astro.sunset !== null
      ? { start: new Date(astro.sunset.getTime() - 3600 * 1000), end: astro.sunset, label: "last light" }
      : null;

  const windows: { label: string; start: Date; end: Date; weight: number }[] = [];
  if (dawn) windows.push({ label: "first light", start: dawn.start, end: dawn.end, weight: 3 });
  if (dusk) windows.push({ label: "last light", start: dusk.start, end: dusk.end, weight: 3 });
  const addWindow = (center: Date | null, halfHours: number, label: string, baseWeight: number) => {
    if (!center) return;
    const start = new Date(center.getTime() - halfHours * 3600 * 1000);
    const end = new Date(center.getTime() + halfHours * 3600 * 1000);
    let weight = baseWeight;
    if (astro.sunrise && astro.sunset) {
      const inLight = overlapMinutes(start, end, astro.sunrise, astro.sunset);
      if (inLight > 0) weight += label.startsWith("major") ? 5 : 1.5;
    }
    windows.push({ label, start, end, weight });
  };
  addWindow(astro.moonTransit, 1, "major feeding window", 2);
  addWindow(astro.moonAntiTransit, 1, "major feeding window", 2);
  addWindow(astro.moonrise, 0.5, "minor feeding window", 1);
  addWindow(astro.moonset, 0.5, "minor feeding window", 1);

  // Solunar bonuses on the score: a major or minor overlapping first/last light.
  if (dawn || dusk) {
    const lightWindows = [dawn, dusk].filter((w): w is NonNullable<typeof w> => w !== null);
    const majorHits = windows.some(
      (w) =>
        w.label === "major feeding window" &&
        lightWindows.some((l) => overlapMinutes(w.start, w.end, l.start, l.end) > 0)
    );
    const minorHits = windows.some(
      (w) =>
        w.label === "minor feeding window" &&
        lightWindows.some((l) => overlapMinutes(w.start, w.end, l.start, l.end) > 0)
    );
    if (majorHits) score += 10;
    else if (minorHits) score += 5;
    else if (
      astro.sunrise &&
      astro.sunset &&
      windows.some(
        (w) =>
          w.label === "major feeding window" &&
          overlapMinutes(w.start, w.end, astro.sunrise as Date, astro.sunset as Date) > 0
      )
    ) {
      score += 5;
    }
  }
  if (astro.illumination < 0.15 || astro.illumination > 0.85) score += 5;

  score = Math.max(0, Math.min(100, Math.round(score)));
  windows.sort((a, b) => b.weight - a.weight || a.start.getTime() - b.start.getTime());
  const best = windows[0];
  const bestBet = best
    ? `Best bet: ${best.label}, ${fmtRange(best.start, best.end, tz)}`
    : "Fish first and last light.";
  return { score, bestBet };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FishingForecast() {
  const [zip, setZip] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [place, setPlace] = useState("");
  const [tz, setTz] = useState("America/New_York");
  const [days, setDays] = useState<DayForecast[]>([]);
  const [pressureNote, setPressureNote] = useState<string | null>(null);

  async function runForecast(e: React.FormEvent) {
    e.preventDefault();
    const z = zip.trim();
    if (!/^\d{5}$/.test(z)) {
      setError("Enter a 5-digit ZIP code.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const zpRes = await fetch(`https://api.zippopotam.us/us/${z}`);
      if (!zpRes.ok) throw new Error("That ZIP code did not come back from the lookup. Check it and try again.");
      const zp = (await zpRes.json()) as ZippopotamResponse;
      const place0 = zp.places?.[0];
      if (!place0) throw new Error("That ZIP code did not come back from the lookup. Check it and try again.");
      const lat = parseFloat(place0.latitude);
      const lon = parseFloat(place0.longitude);
      const zipPlace = `${place0["place name"]}, ${place0["state abbreviation"]}`;

      const ptRes = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
      if (!ptRes.ok) throw new Error("The National Weather Service did not answer. Try again in a bit.");
      const pt = (await ptRes.json()) as NwsPointsResponse;
      const forecastUrl = pt.properties?.forecast;
      const stationsUrl = pt.properties?.observationStations;
      const zone = pt.properties?.timeZone ?? "America/New_York";
      const rel = pt.properties?.relativeLocation?.properties;
      const placeName = rel?.city && rel?.state ? `${rel.city}, ${rel.state}` : zipPlace;
      if (!forecastUrl) throw new Error("The National Weather Service did not answer. Try again in a bit.");

      const fcRes = await fetch(forecastUrl);
      if (!fcRes.ok) throw new Error("The National Weather Service did not answer. Try again in a bit.");
      const fc = (await fcRes.json()) as NwsForecastResponse;
      const periods = fc.properties?.periods ?? [];

      const trend = stationsUrl ? await fetchPressureTrend(stationsUrl) : null;
      const pressureText =
        trend === null
          ? null
          : trend > 1
            ? `Pressure rising ${trend.toFixed(1)} hPa in the last 3 hours`
            : trend < -1
              ? `Pressure falling ${Math.abs(trend).toFixed(1)} hPa in the last 3 hours`
              : "Pressure steady the last 3 hours";

      const today = todayInTz(zone);
      const out: DayForecast[] = [];
      for (let i = 0; i < 7; i++) {
        const { y, m, d } = addDays(today.y, today.m, today.d, i);
        const key = dateStrYMD(y, m, d);
        const astro = astroForDate(y, m, d, lat, lon, zone);
        const dayPeriods = periods.filter((p) => p.startTime.slice(0, 10) === key);
        const dayP = dayPeriods.find((p) => p.isDaytime);
        const nightP = dayPeriods.find((p) => !p.isDaytime);
        const high = dayP ? dayP.temperature : null;
        const low = nightP ? nightP.temperature : null;
        const windMph = dayP ? parseWindMph(dayP.windSpeed) : null;
        const pop = dayP?.probabilityOfPrecipitation?.value ?? null;
        const { score, bestBet } = scoreAndBestBet(astro, high, windMph, pop, trend, i === 0, zone);
        const { grade, blurb } = gradeFor(score);
        out.push({
          date: key,
          label: dayLabel(y, m, d, zone),
          high,
          low,
          windMph,
          windText: dayP?.windSpeed ?? "—",
          pop,
          shortForecast: dayP?.shortForecast ?? nightP?.shortForecast ?? "—",
          astro,
          score,
          grade,
          blurb,
          bestBet,
        });
      }
      setPlace(placeName);
      setTz(zone);
      setDays(out);
      setPressureNote(pressureText);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong fetching the forecast. Try again.");
      setStatus("error");
    }
  }

  const windowList = (a: DayAstro): { label: string; range: string }[] => {
    const list: { label: string; range: string; t: number }[] = [];
    const push = (center: Date | null, halfHours: number, label: string) => {
      if (!center) return;
      list.push({
        label,
        range: fmtRange(
          new Date(center.getTime() - halfHours * 3600 * 1000),
          new Date(center.getTime() + halfHours * 3600 * 1000),
          tz
        ),
        t: center.getTime(),
      });
    };
    push(a.moonTransit, 1, "Major");
    push(a.moonAntiTransit, 1, "Major");
    push(a.moonrise, 0.5, "Minor");
    push(a.moonset, 0.5, "Minor");
    return list.sort((x, y) => x.t - y.t).map(({ label, range }) => ({ label, range }));
  };

  return (
    <section aria-label="Fishing forecast" className="rounded-2xl border border-white/10 bg-bark p-5 sm:p-6">
      <h3 className="font-display text-xl text-cream">Fishing forecast</h3>
      <p className="mt-1 text-sm text-parchment/80">
        Put in your ZIP and get the next 7 days scored for fishing — sun and moon times, feeding
        windows, wind, rain, and temperatures. The weather comes straight from the National Weather
        Service and the sun and moon are figured right here in your browser.
      </p>

      <form onSubmit={runForecast} className="mt-4 flex flex-wrap items-center gap-2">
        <label htmlFor="fishing-zip" className="sr-only">
          ZIP code
        </label>
        <input
          id="fishing-zip"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="h-11 w-36 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-cream placeholder:text-subtle focus:border-ember focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-11 items-center rounded-full bg-ember px-5 text-sm font-semibold text-cream hover:bg-ember-hot disabled:opacity-60"
        >
          {status === "loading" ? "Checking the water…" : "Get the forecast"}
        </button>
      </form>

      {status === "error" && <p className="mt-3 text-sm text-ember-hot">{error}</p>}

      {status === "done" && (
        <div className="mt-5">
          <p className="text-sm text-parchment/80">
            Forecast for <span className="font-semibold text-cream">{place}</span>
            {pressureNote ? ` — ${pressureNote}.` : "."}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((day) => (
              <article key={day.date} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-cream">{day.label}</h4>
                    <p className="text-xs text-subtle">{day.shortForecast}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-block rounded-full bg-ember px-3 py-1 text-xs font-bold text-cream">
                      {day.grade} · {day.score}
                    </span>
                    <p className="mt-1 text-[11px] text-subtle">{day.blurb}</p>
                  </div>
                </div>
                <dl className="mt-3 space-y-1 text-sm text-parchment/90">
                  <div className="flex justify-between gap-2">
                    <dt className="text-subtle">Sun</dt>
                    <dd>
                      {day.astro.sunrise ? fmtTime(day.astro.sunrise, tz) : "—"} –{" "}
                      {day.astro.sunset ? fmtTime(day.astro.sunset, tz) : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-subtle">High / Low</dt>
                    <dd>
                      {day.high !== null ? `${day.high}°F` : "—"} / {day.low !== null ? `${day.low}°F` : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-subtle">Wind</dt>
                    <dd>{day.windText}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-subtle">Rain chance</dt>
                    <dd>{day.pop !== null ? `${day.pop}%` : "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-subtle">Moon</dt>
                    <dd>
                      {day.astro.phaseName} · {Math.round(day.astro.illumination * 100)}% lit
                    </dd>
                  </div>
                </dl>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-subtle">Feeding windows</p>
                  <ul className="mt-1 space-y-1 text-sm text-parchment/90">
                    {windowList(day.astro).map((w, i) => (
                      <li key={i} className="flex justify-between gap-2">
                        <span>{w.label}</span>
                        <span>{w.range}</span>
                      </li>
                    ))}
                    {windowList(day.astro).length === 0 && <li>—</li>}
                  </ul>
                  <p className="mt-2 text-sm font-medium text-cream">{day.bestBet}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-subtle">
            A planning aid, not a guarantee — the fish have the final say. Solunar feeding windows are
            tradition; first and last light and the weather matter most. Before you go, check your
            state&apos;s fishing regulations, seasons, and size and creel limits. Sunrise, sunset, moonrise,
            and moonset are figured in your browser from the moon&apos;s orbit; the score is a simple
            weather-and-light heuristic, not a scientific model.
          </p>
        </div>
      )}
    </section>
  );
}
