import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const DEST = join(ROOT, "public", "images");
const ORIGIN = "https://plum-honey-silver-wave.grok.me/images/";
const FILES = [
  "applewood-bacon.jpg","banana-pudding.jpg","bananas-foster.jpg","bbq-spaghetti.jpg","beef-ribs.jpg","blackberry-cobbler.jpg","blackberry-sauce.jpg","bread-pudding.jpg","brisket.jpg","buckboard-bacon.jpg","burnt-ends.jpg","buttermilk-pie.jpg","cajun-mop.jpg","cajun-rub.jpg","championship-chili.jpg","championship-pulled-pork.jpg","cheese-grits.jpg","chess-pie.jpg","chicago-rub.jpg","chicago-sauce.jpg","chicken-thighs.jpg","chocolate-cobbler.jpg","chocolate-pecan-pie.jpg","chuck.jpg","coconut-cake.jpg","coffee-rub.jpg","cola-cake.jpg","collards.jpg","creamed-corn.jpg","dalmatian-rub.jpg","dirty-rice.jpg","dry-rub-spare-ribs.jpg","east-texas-sauce.jpg","ember-house-rub.jpg","ember-molasses-sauce.jpg","embers.jpg","florida-sweet-ribs.jpg","florida-sweet-sauce.jpg","fried-peach-pies.jpg","german-chocolate.jpg","hatch-elote.jpg","hatch-rub.jpg","hero-dusk.jpg","hero-smoker.jpg","honey-mustard-onion-sauce.jpg","house-bbq-seasoning.jpg","hummingbird-cake.jpg","hush-puppies.jpg","kc-ribs.jpg","kc-sauce.jpg","kentucky-burgoo.jpg","kerns-chocolate-walnut-pie.jpg","lamb.jpg","lemon-icebox.jpg","lexington-sauce.jpg","mac-cheese.jpg","maryland-rub.jpg","memphis-barbecue-sauce.jpg","memphis-dry-rub.jpg","memphis-ribs.jpg","mississippi-pot-roast.jpg","mississippi-sweet-ribs.jpg","mississippi-sweet-sauce.jpg","monroe-county-shoulder.jpg","mud-cake.jpg","mustard-sauce.jpg","owensboro-dip.jpg","owensboro-mutton.jpg","peach-cobbler.jpg","peanut-butter-sheet-cake.jpg","pecan-pie.jpg","pf-changs-ribs.jpg","pickled-onions.jpg","pig-pickin.jpg","pimento-cheese.jpg","pinquito-beans.jpg","pit-beans.jpg","pit-table.jpg","pnw-salmon-rub.jpg","pork-belly.jpg","pork-injection.jpg","pork-loin.jpg","pork-rub.jpg","pork-steaks.jpg","potato-salad.jpg","poultry-rub.jpg","pound-cake.jpg","pralines.jpg","pulled-pork.jpg","pulled-venison.jpg","raspberry-chipotle-sauce.jpg","red-chile-sauce.jpg","red-velvet.jpg","salmon.jpg","santa-maria-rub.jpg","sausage.jpg","skillet-cornbread.jpg","slaw.jpg","smoked-bbq-burger-cheddar.jpg","smoked-cabbage.jpg","smoked-meatloaf.jpg","south-texas-salsa.jpg","spg-rub.jpg","strawberry-shortcake.jpg","sweet-potato-pie.jpg","sweet-rib-rub.jpg","sweet-vinegar-sauce.jpg","texas-mop.jpg","texas-sheet-cake.jpg","tiger-sauce.jpg","tri-tip.jpg","turkey.jpg","venison-backstrap.jpg","vinegar-sauce.jpg","white-chicken.jpg","white-sauce.jpg","whole-smoked-gator-boudin.jpg","woods.jpg"
];

mkdirSync(DEST, { recursive: true });

async function one(name) {
  const dest = join(DEST, name);
  if (existsSync(dest)) return;
  const res = await fetch(ORIGIN + name);
  if (!res.ok) {
    console.warn("skip", name, res.status);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  console.log("vendored", name, buf.length);
}

await Promise.all(FILES.map(one));

const vidDir = join(ROOT, "public", "videos");
mkdirSync(vidDir, { recursive: true });
const vid = join(vidDir, "hero-fire.mp4");
if (!existsSync(vid)) {
  try {
    const res = await fetch("https://plum-honey-silver-wave.grok.me/videos/hero-fire.mp4");
    if (res.ok) writeFileSync(vid, Buffer.from(await res.arrayBuffer()));
  } catch (e) {
    console.warn("hero video skipped", e.message);
  }
}
