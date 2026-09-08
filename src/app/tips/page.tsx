export const metadata = { title: "Pit tips" };

const tips = [
  "Chicken skin is a schedule, not a prayer. Render fat before you chase color.",
  "Inject for moisture and seasoning inside the muscle. Do not use it as a gravy cannon.",
  "Rest is part of the cook. A tight box with dry meat loses to a looser box that juices.",
  "Salt is not optional. If the meat does not taste seasoned naked, sauce will not save you.",
  "Judges eat with their eyes first. Trim like you mean it.",
  "Hold the smoke. Thick white smoke is unburnt fuel. Thin blue is the job."
];

export default function TipsPage() {
  return (
    <main className="page">
      <p className="kicker">Field notes</p>
      <h1>Tips that keep you out of the swamp</h1>
      <ul className="list">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </main>
  );
}
