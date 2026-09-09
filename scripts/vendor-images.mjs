import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DEST = join(ROOT, "public", "images");
const ORIGIN = "https://plum-honey-silver-wave.grok.me/images/";
const FILES = [
  "applewood-bacon.jpg","banana-pudding.jpg","bananas-foster.jpg","bbq-spaghetti.jpg","beef-ribs.jpg","blackberry-cobbler.jpg","blackberry-sauce.jpg","bread-pudding.jpg","brisket.jpg","buckboard-bacon.jpg","burnt-ends.jpg","buttermilk-pie.jpg","cajun-mop.jpg","cajun-rub.jpg","championship-chili.jpg","championship-pulled-pork.jpg","cheese-grits.jpg","chess-pie.jpg","chicago-rub.jpg","chicago-sauce.jpg","chicken-thighs.jpg","chocolate-cobbler.jpg","chocolate-pecan-pie.jpg","chuck.jpg","coconut-cake.jpg","coffee-rub.jpg","cola-cake.jpg","collards.jpg","creamed-corn.jpg","dalmatian-rub.jpg","dirty-rice.jpg","dry-rub-spare-ribs.jpg","east-texas-sauce.jpg","ember-house-rub.jpg","ember-molasses-sauce.jpg","embers.jpg","florida-sweet-ribs.jpg","florida-sweet-sauce.jpg","fried-peach-pies.jpg","german-chocolate.jpg","hatch-elote.jpg","hatch-rub.jpg","hero-dusk.jpg","hero-smoker.jpg","honey-mustard-onion-sauce.jpg","house-bbq-seasoning.jpg","hummingbird-cake.jpg","hush-puppies.jpg","kc-ribs.jpg","kc-sauce.jpg","kentucky-burgoo.jpg","kerns-chocolate-walnut-pie.jpg","lamb.jpg","lemon-icebox.jpg","lexington-sauce.jpg","mac-cheese.jpg","maryland-rub.jpg","memphis-barbecue-sauce.jpg","memphis-dry-rub.jpg","memphis-ribs.jpg","mississippi-pot-roast.jpg","mississippi-sweet-ribs.jpg","mississippi-sweet-sauce.jpg","monroe-county-shoulder.jpg","mud-cake.jpg","mustard-sauce.jpg","owensboro-dip.jpg","owensboro-mutton.jpg","peach-cobbler.jpg","peanut-butter-sheet-cake.jpg","pecan-pie.jpg","pf-changs-ribs.jpg","pickled-onions.jpg","pig-pickin.jpg","pimento-cheese.jpg","pinquito-beans.jpg","pit-beans.jpg","pit-table.jpg","pnw-salmon-rub.jpg","pork-belly.jpg","pork-injection.jpg","pork-loin.jpg","pork-rub.jpg","pork-steaks.jpg","potato-salad.jpg","poultry-rub.jpg","pound-cake.jpg","pralines.jpg","pulled-pork.jpg","pulled-venison.jpg","raspberry-chipotle-sauce.jpg","red-chile-sauce.jpg","red-velvet.jpg","salmon.jpg","santa-maria-rub.jpg","sausage.jpg","skillet-cornbread.jpg","slaw.jpg","smoked-bbq-burger-cheddar.jpg","smoked-cabbage.jpg","smoked-meatloaf.jpg","south-texas-salsa.jpg","spg-rub.jpg","strawberry-shortcake.jpg","sweet-potato-pie.jpg","sweet-rib-rub.jpg","sweet-vinegar-sauce.jpg","texas-mop.jpg","texas-sheet-cake.jpg","tiger-sauce.jpg","tri-tip.jpg","turkey.jpg","venison-backstrap.jpg","vinegar-sauce.jpg","white-chicken.jpg","white-sauce.jpg","whole-smoked-gator-boudin.jpg","woods.jpg"
];

mkdirSync(DEST, { recursive: true });

async function grab(url, dest, ms = 4000) {
  if (existsSync(dest)) return true;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return false;
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

const probe = await grab(ORIGIN + "brisket.jpg", join(DEST, "brisket.jpg"), 4000);
if (!probe) {
  console.warn("origin photos unreachable; continuing without vendoring");
  process.exit(0);
}

const queue = FILES.filter((n) => n !== "brisket.jpg");
async function worker() {
  while (queue.length) {
    const name = queue.shift();
    await grab(ORIGIN + name, join(DEST, name), 4000);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.warn("photo vendor finished");
