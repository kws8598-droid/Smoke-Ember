export const metadata = { title: "The stall is not a problem" };

export default function TipsPage() {
  return (
    <main className="page">
      <img
        className="hero-photo stall-cover"
        src="/food/the-stall?v=9"
        alt="Coals and thin smoke — the stall is just weather on the surface"
      />
      <p className="kicker">Fire school</p>
      <h1>The stall is not a problem</h1>
      <p className="lede">
        When a brisket or shoulder parks at 160°F for hours, the meat is evaporating, not failing. Wrap for time. Wait for bark.
      </p>
      <p>
        Every all-day cook hits a wall somewhere between 150 and 170°F internal. The pit is still at 250. The probe hasn&apos;t moved in 90 minutes. This is evaporative cooling — the same physics as sweat. Moisture at the surface is dumping heat as fast as the fire is putting it in.
      </p>
      <section className="stack">
        <article className="panel">
          <p className="meta">Wrap for the clock, not for fear</p>
          <p>
            Butcher paper (the Texas crutch&apos;s quieter cousin) slows evaporation without turning bark to stew. Foil is faster and wetter. Neither is mandatory. Competition teams wrap because turn-in is at 1:30, not because the meat requires it. If the bark is mahogany and dinner is flexible, ride the stall out.
          </p>
        </article>
        <article className="panel">
          <p className="meta">What the stall is not</p>
          <p>
            It is not the fat rendering. It is not collagen magically converting at 160. Collagen starts dissolving in earnest closer to 180–200, which is why a shoulder that &apos;feels done&apos; at 175 is still a rubber roast. The stall is weather on the surface. Keep the fire clean and let it pass.
          </p>
        </article>
        <article className="panel">
          <p className="meta">Take it to the pit</p>
          <ul className="list">
            <li>Expect 2–4 hours of stall on a packer or a butt.</li>
            <li>Wrap only after bark is set, and only if you need the time.</li>
            <li>Paper breathes; foil braises. Choose on purpose.</li>
          </ul>
        </article>
        <article className="panel">
          <p className="meta">More fire school</p>
          <ul className="list">
            <li>Thin blue smoke or go home. White billowing smoke is unburned wood.</li>
            <li>Bark is dried spice, rendered fat, smoke, and Maillard — not a packet of bark dust.</li>
            <li>Temperature is a rumor. Probe tender is the law.</li>
            <li>Resting is still cooking. Slice too soon and you donated the juice to the board.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
