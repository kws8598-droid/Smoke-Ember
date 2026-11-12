"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * DeerForecast — best-days-to-hunt forecast for the venison page.
 *
 * Everything runs in the visitor's browser. No server calls, no API keys,
 * no paid services, no images, no video, no new dependencies:
 *  - ZIP -> lat/lon: api.zippopotam.us (free, no key)
 *  - Weather: api.weather.gov, the National Weather Service (free, no key)
 *  - Sunrise/sunset/moon phase: standard astronomy math, computed on device
 *  - Peak rut dates: small built-in table (below)
 *
 * Scoring is a documented heuristic, NOT a guarantee. GPS-collar studies
 * (Mississippi State Deer Lab, 48 collared bucks; Penn State Deer-Forest
 * Study) found moon phase barely moves deer in daylight — under 20 feet per
 * hour between new and full moon — while the rut raises buck movement by
 * about 140 yards per hour. So the score leans on rut position, weather,
 * and first/last light, and the moon is shown but weighted lightly.
 */

const ZIP_KEY = "smoke-ember-deer-zip";

type RutEntry = {
  /** month 1-12 */
  m: number;
  /** day of month */
  d: number;
  /** true = published by a state wildlife agency or peer-reviewed study;
      false = latitude-based estimate, no published peak found */
  pub: boolean;
  note?: string;
};

/**
 * Peak buck-movement date by state. Where an agency published a peak
 * *conception* date, movement is centered about 8 days ahead of it
 * (Alabama WFF and Mississippi MDWFP both put peak movement 7-14 days
 * ahead of peak conception). Ranges (Texas ecoregions, Georgia counties,
 * Mississippi, Florida, Louisiana) use the statewide midpoint.
 */
const RUT_PEAKS: Record<string, RutEntry> = {
  AL: { m: 1, d: 17, pub: true },
  AK: { m: 11, d: 8, pub: false },
  AZ: { m: 12, d: 15, pub: false, note: "Coues whitetail rut runs late" },
  AR: { m: 11, d: 15, pub: false },
  CA: { m: 11, d: 20, pub: false, note: "blacktail rut runs later" },
  CO: { m: 11, d: 10, pub: false },
  CT: { m: 11, d: 10, pub: false },
  DE: { m: 11, d: 10, pub: false },
  FL: { m: 2, d: 1, pub: true, note: "varies widely by region" },
  GA: { m: 11, d: 6, pub: true, note: "varies by county" },
  HI: { m: 11, d: 15, pub: false, note: "axis deer" },
  ID: { m: 11, d: 8, pub: false },
  IL: { m: 11, d: 2, pub: true },
  IN: { m: 11, d: 10, pub: false },
  IA: { m: 11, d: 10, pub: false },
  KS: { m: 11, d: 12, pub: false },
  KY: { m: 11, d: 12, pub: true, note: "peak breeding estimate Nov 12-15" },
  LA: { m: 12, d: 20, pub: true, note: "varies by area" },
  ME: { m: 11, d: 8, pub: false },
  MD: { m: 11, d: 8, pub: true },
  MA: { m: 11, d: 13, pub: true },
  MI: { m: 11, d: 10, pub: false },
  MN: { m: 11, d: 8, pub: false },
  MS: { m: 12, d: 25, pub: true, note: "varies by region" },
  MO: { m: 11, d: 12, pub: false },
  MT: { m: 11, d: 8, pub: false },
  NE: { m: 11, d: 10, pub: false },
  NV: { m: 11, d: 10, pub: false },
  NH: { m: 11, d: 8, pub: false },
  NJ: { m: 11, d: 10, pub: false },
  NM: { m: 11, d: 20, pub: false },
  NY: { m: 11, d: 10, pub: false },
  NC: { m: 11, d: 12, pub: false },
  ND: { m: 11, d: 8, pub: false },
  OH: { m: 11, d: 12, pub: false },
  OK: { m: 11, d: 5, pub: true },
  OR: { m: 11, d: 10, pub: false },
  PA: { m: 11, d: 5, pub: true },
  RI: { m: 11, d: 10, pub: false },
  SC: { m: 10, d: 22, pub: true },
  SD: { m: 11, d: 8, pub: false },
  TN: { m: 11, d: 15, pub: false },
  TX: { m: 11, d: 15, pub: true, note: "varies by ecoregion" },
  UT: { m: 11, d: 10, pub: false },
  VT: { m: 11, d: 8, pub: false },
  VA: { m: 11, d: 12, pub: false },
  WA: { m: 11, d: 10, pub: false },
  WV: { m: 11, d: 12, pub: false },
  WI: { m: 11, d: 4, pub: true },
  WY: { m: 11, d: 8, pub: false },
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface ZippoPlace {
  "place name": string;
  latitude: string;
  longitude: string;
  state: string;
  "state abbreviation": string;
}

interface ZippoResponse {
  places?: ZippoPlace[];
}

interface PointsResponse {
  properties: {
    forecast: string;
    timeZone?: string;
  };
}

interface NwsPeriod {
  name: string;
  startTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  probabilityOfPrecipitation?: { value?: number | null } | null;
}

interface ForecastResponse {
  properties: {
    periods: NwsPeriod[];
  };
}

interface LocationInfo {
  city: string;
  state: string;
  stateAbbr: string;
}

type Verdict = "Great" | "Good" | "Fair" | "Slow";

interface DayForecast {
  dateLabel: string;
  weekday: string;
  score: number;
  verdict: Verdict;
  sunrise: string;
  sunset: string;
  high: number;
  low: number | null;
  wind: string;
  precip: number | null;
  shortForecast: string;
  moon: string;
  moonIllum: number;
  rutLabel: string;
  rutPeakLabel: string;
}

/* ---------- astronomy: NOAA solar algorithm, moon phase ---------- */

function sunTimes(date: Date, lat: number, lon: number): { sunrise: Date; sunset: Date } | null {
  const rad = Math.PI / 180;
  const dayMs = 86400000;
  const jd = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12) / dayMs + 2440587.5;
  const n = jd - 2451545.0 + 0.0008;
  // lon is east-positive; NOAA's J* uses west-positive longitude, so subtract
  const jStar = n - lon / 360;
  const mDeg = (357.5291 + 0.98560028 * jStar) % 360;
  const mRad = mDeg * rad;
  const c =
    1.9148 * Math.sin(mRad) + 0.02 * Math.sin(2 * mRad) + 0.0003 * Math.sin(3 * mRad);
  const lambda = (mDeg + c + 180 + 102.9372) % 360;
  const lambdaRad = lambda * rad;
  const jTransit =
    2451545.0 + jStar + 0.0053 * Math.sin(mRad) - 0.0069 * Math.sin(2 * lambdaRad);
  const delta = Math.asin(Math.sin(lambdaRad) * Math.sin(23.44 * rad));
  const latRad = lat * rad;
  const cosOmega =
    (Math.sin(-0.833 * rad) - Math.sin(latRad) * Math.sin(delta)) /
    (Math.cos(latRad) * Math.cos(delta));
  if (cosOmega > 1 || cosOmega < -1) return null;
  const omega = Math.acos(cosOmega) / rad;
  const toDate = (j: number) => new Date((j - 2440587.5) * dayMs);
  return { sunrise: toDate(jTransit - omega / 360), sunset: toDate(jTransit + omega / 360) };
}

function moonPhase(date: Date): { name: string; illum: number; index: number } {
  const synodic = 29.530588853;
  const newMoonJd = 2451550.1; // Jan 6, 2000 18:14 UTC
  const jd = date.getTime() / 86400000 + 2440587.5;
  let age = (jd - newMoonJd) % synodic;
  if (age < 0) age += synodic;
  const illum = (1 - Math.cos((2 * Math.PI * age) / synodic)) / 2;
  const index = Math.floor(age / (synodic / 8)) % 8;
  const names = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ];
  return { name: names[index], illum, index };
}

/* ---------- helpers ---------- */

function localParts(d: Date, tz: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function fmtTime(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function dayOfYear(year: number, month: number, day: number): number {
  return Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000
  );
}

/** signed days from peak, wrapped to [-182, 182] so January peaks work */
function signedDayDiff(doy: number, peakDoy: number): number {
  let diff = (doy - peakDoy) % 365;
  if (diff > 182) diff -= 365;
  if (diff < -182) diff += 365;
  return diff;
}

function windMph(s: string): number {
  const nums = s.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function verdictFor(score: number): Verdict {
  if (score >= 80) return "Great";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Slow";
}

function rutLabelFor(diff: number): string {
  const a = Math.abs(diff);
  if (a <= 7) return "Peak rut";
  if (diff < 0 && a <= 21) return "Pre-rut — bucks chasing";
  if (diff < 0 && a <= 35) return "Rut building";
  if (diff > 0 && a <= 21) return "Post-rut";
  if (diff > 0 && a <= 35) return "Second rut — unbred does cycle again";
  return "Outside the rut";
}

/*
 * Score, 0-100. Weights, by what the GPS-collar research says actually
 * moves deer: rut 40, weather 35, first/last light 15, moon 10.
 */
function scoreDay(opts: {
  rutDiff: number;
  high: number;
  prevHigh: number | null;
  wind: number;
  precip: number | null;
  moonIndex: number;
}): number {
  const a = Math.abs(opts.rutDiff);
  const rut = a <= 7 ? 40 : a <= 35 ? Math.round((40 * (35 - a)) / 28) : 0;

  let temp = 0;
  if (opts.high >= 35 && opts.high <= 55) temp = 12;
  else if ((opts.high >= 30 && opts.high < 35) || (opts.high > 55 && opts.high <= 60)) temp = 9;
  else if ((opts.high >= 25 && opts.high < 30) || (opts.high > 60 && opts.high <= 65)) temp = 6;
  else if ((opts.high >= 20 && opts.high < 25) || (opts.high > 65 && opts.high <= 70)) temp = 3;

  let front = 2; // neutral when no previous day to compare
  if (opts.prevHigh !== null) {
    const drop = opts.prevHigh - opts.high;
    if (drop >= 6) front = 8;
    else if (drop >= 3) front = 4;
    else if (drop >= 0) front = 2;
    else front = 0;
  }

  let wind = 0;
  if (opts.wind >= 3 && opts.wind <= 12) wind = 8;
  else if (opts.wind > 12 && opts.wind <= 18) wind = 5;
  else if (opts.wind >= 0 && opts.wind < 3) wind = 4;
  else wind = 1;

  let precip = 5; // unknown
  if (opts.precip !== null) {
    if (opts.precip <= 20) precip = 7;
    else if (opts.precip <= 40) precip = 5;
    else if (opts.precip <= 60) precip = 3;
    else precip = 0;
  }

  const moon = opts.moonIndex === 0 ? 10 : opts.moonIndex === 4 ? 4 : opts.moonIndex === 2 || opts.moonIndex === 6 ? 7 : 8;

  return Math.max(0, Math.min(100, rut + temp + front + wind + precip + 15 + moon));
}

function buildDays(
  periods: NwsPeriod[],
  lat: number,
  lon: number,
  tz: string,
  stateAbbr: string
): DayForecast[] {
  const byDate = new Map<string, { day?: NwsPeriod; night?: NwsPeriod }>();
  const order: string[] = [];
  for (const p of periods) {
    const key = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(p.startTime));
    if (!byDate.has(key)) {
      byDate.set(key, {});
      order.push(key);
    }
    const slot = byDate.get(key) as { day?: NwsPeriod; night?: NwsPeriod };
    if (p.isDaytime && !slot.day) slot.day = p;
    if (!p.isDaytime && !slot.night) slot.night = p;
  }

  const rut = RUT_PEAKS[stateAbbr] ?? { m: 11, d: 12, pub: false };
  const rutPeakLabel = `${MONTHS[rut.m - 1]} ${rut.d}${rut.pub ? "" : " (estimate)"}${rut.note ? ` — ${rut.note}` : ""}`;

  const days: DayForecast[] = [];
  const inputs: { rutDiff: number; wind: number; moon: number }[] = [];
  for (const key of order) {
    const slot = byDate.get(key) as { day?: NwsPeriod; night?: NwsPeriod };
    if (!slot.day) continue; // day is spent; start from the next full day
    if (days.length >= 7) break;
    const dayStart = new Date(slot.day.startTime);
    const lp = localParts(dayStart, tz);
    const sun = sunTimes(new Date(Date.UTC(lp.year, lp.month - 1, lp.day, 12)), lat, lon);
    const moon = moonPhase(dayStart);
    const doy = dayOfYear(lp.year, lp.month, lp.day);
    const peakDoy = dayOfYear(lp.year, rut.m, rut.d);
    const rutDiff = signedDayDiff(doy, peakDoy);
    const precip =
      slot.day.probabilityOfPrecipitation?.value === undefined
        ? null
        : slot.day.probabilityOfPrecipitation.value;
    days.push({
      dateLabel: `${MONTHS[lp.month - 1]} ${lp.day}`,
      weekday: new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long" }).format(dayStart),
      score: 0, // filled in below, once the previous day's high is known
      verdict: "Slow",
      sunrise: sun ? fmtTime(sun.sunrise, tz) : "—",
      sunset: sun ? fmtTime(sun.sunset, tz) : "—",
      high: slot.day.temperature,
      low: slot.night ? slot.night.temperature : null,
      wind: `${slot.day.windDirection} ${slot.day.windSpeed}`,
      precip,
      shortForecast: slot.day.shortForecast,
      moon: moon.name,
      moonIllum: Math.round(moon.illum * 100),
      rutLabel: rutLabelFor(rutDiff),
      rutPeakLabel,
    });
    inputs.push({ rutDiff, wind: windMph(slot.day.windSpeed), moon: moon.index });
  }

  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    const score = scoreDay({
      rutDiff: inputs[i].rutDiff,
      high: d.high,
      prevHigh: i > 0 ? days[i - 1].high : null,
      wind: inputs[i].wind,
      precip: d.precip,
      moonIndex: inputs[i].moon,
    });
    d.score = score;
    d.verdict = verdictFor(score);
  }
  return days;
}

async function fetchForecast(zip: string): Promise<{ location: LocationInfo; days: DayForecast[] }> {
  const zr = await fetch(`https://api.zippopotam.us/us/${zip}`);
  if (!zr.ok) {
    throw new Error("That ZIP code did not come back as a US ZIP. Double-check the five digits and try again.");
  }
  const zj = (await zr.json()) as ZippoResponse;
  const place = zj.places?.[0];
  if (!place) {
    throw new Error("That ZIP code did not come back as a US ZIP. Double-check the five digits and try again.");
  }
  const lat = parseFloat(place.latitude);
  const lon = parseFloat(place.longitude);
  const pr = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
  if (!pr.ok) {
    throw new Error("The National Weather Service did not have a forecast for that spot. Try again in a bit.");
  }
  const pj = (await pr.json()) as PointsResponse;
  const fr = await fetch(pj.properties.forecast);
  if (!fr.ok) {
    throw new Error("The forecast would not load. Try again in a bit.");
  }
  const fj = (await fr.json()) as ForecastResponse;
  const tz = pj.properties.timeZone ?? "America/New_York";
  const days = buildDays(fj.properties.periods, lat, lon, tz, place["state abbreviation"]);
  if (days.length === 0) {
    throw new Error("No forecast days came back. Try again in a bit.");
  }
  return {
    location: { city: place["place name"], state: place.state, stateAbbr: place["state abbreviation"] },
    days,
  };
}

const VERDICT_CLASS: Record<Verdict, string> = {
  Great: "text-emerald-300",
  Good: "text-amber-200",
  Fair: "text-orange-300",
  Slow: "text-stone-400",
};

export default function DeerForecast() {
  const [zip, setZip] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [days, setDays] = useState<DayForecast[]>([]);
  const autoLoaded = useRef(false);

  const load = useCallback(async (z: string) => {
    setStatus("loading");
    setError(null);
    try {
      const r = await fetchForecast(z);
      setLocation(r.location);
      setDays(r.days);
      setStatus("done");
      try {
        localStorage.setItem(ZIP_KEY, z);
      } catch {
        /* private mode — ignore */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong loading the forecast.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(ZIP_KEY);
    } catch {
      /* ignore */
    }
    if (saved && /^\d{5}$/.test(saved)) {
      setZip(saved);
      void load(saved);
    }
  }, [load]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const z = zip.trim();
    if (!/^\d{5}$/.test(z)) {
      setError("Enter a 5-digit US ZIP code.");
      setStatus("error");
      return;
    }
    void load(z);
  };

  return (
    <div className="mt-8 rounded-2xl border border-ember/30 bg-bark p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ember">Deer forecast</p>
      <h2 className="mt-2 font-display text-3xl italic">Best days to hunt</h2>
      <p className="mt-2 max-w-xl text-sm text-parchment/80">
        Type in a ZIP code and get the next 7 days scored for deer movement — sunrise
        and sunset, temperatures, wind, rain chance, moon phase, and where the date
        falls against that state&apos;s peak rut.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex max-w-md gap-2">
        <label htmlFor="deer-zip" className="sr-only">
          ZIP code
        </label>
        <input
          id="deer-zip"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="ZIP code — try 40342"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          className="w-40 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-cream placeholder:text-subtle"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-cream hover:bg-ember-hot disabled:opacity-50"
        >
          {status === "loading" ? "Checking…" : "Get the forecast"}
        </button>
      </form>

      {status === "loading" && (
        <p className="mt-4 text-sm text-parchment/80">Checking the sky over that ZIP…</p>
      )}

      {status === "error" && error && (
        <p className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-parchment/90">
          {error}
        </p>
      )}

      {status === "done" && location && days.length > 0 && (
        <div className="mt-5">
          <p className="text-sm text-subtle">
            {location.city}, {location.state} · {days[0].rutPeakLabel}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((d) => (
              <div key={d.dateLabel} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-lg italic">
                    {d.weekday} · {d.dateLabel}
                  </p>
                  <p className={`font-display text-2xl italic ${VERDICT_CLASS[d.verdict]}`}>
                    {d.score} · {d.verdict}
                  </p>
                </div>
                <p className="mt-2 text-sm text-parchment/90">{d.shortForecast}</p>
                <p className="mt-1 text-sm text-parchment/80">
                  High {d.high}°{d.low !== null ? ` · Low ${d.low}°` : ""}
                </p>
                <p className="mt-1 text-sm text-parchment/80">
                  Sunrise {d.sunrise} · Sunset {d.sunset}
                </p>
                <p className="mt-1 text-sm text-parchment/80">
                  Wind {d.wind} · Rain {d.precip === null ? "—" : `${d.precip}%`}
                </p>
                <p className="mt-1 text-sm text-parchment/80">
                  Moon: {d.moon} ({d.moonIllum}% lit)
                </p>
                <p className="mt-1 text-sm font-semibold text-cream">{d.rutLabel}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-subtle">
            A planning aid, not a promise — deer move most at first and last light,
            and the rut matters far more than the moon. Check your state&apos;s legal
            shooting hours and season dates before you go.
          </p>
          <details className="mt-3 text-xs leading-relaxed text-subtle">
            <summary className="cursor-pointer text-parchment/80">How the score works</summary>
            <p className="mt-2">
              Each day scores 0–100: rut position 40 points, weather 35 (temperature,
              a cooling front, wind, and rain), first and last light 15, moon phase 10.
              GPS-collar studies from Mississippi State and Penn State found the moon
              barely moves deer in daylight, while the rut is the big driver — so the
              moon is shown but weighted lightly. Rut dates come from state wildlife
              agency publications and peer-reviewed studies where one exists; where
              no published peak was found, the date is a latitude-based estimate and
              is labeled as one. Weather comes from the National Weather Service;
              sunrise, sunset, and moon phase are computed on your device.
            </p>
          </details>
        </div>
      )}
    </div>
  );
}
