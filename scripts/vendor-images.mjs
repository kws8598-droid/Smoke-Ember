import { mkdirSync, existsSync, writeFileSync, copyFileSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DEST = join(ROOT, "public", "images");
const foodDest = join(ROOT, "public", "food");
const ORIGIN = "https://plum-honey-silver-wave.grok.me/images/";
const FILES = [
  "apple-peach-pork-injection.jpg","applewood-bacon.jpg","banana-pudding.jpg","bananas-foster.jpg","bbq-spaghetti.jpg","beef-ribs.jpg","blackberry-cobbler.jpg","blackberry-sauce.jpg","bread-pudding.jpg","brisket.jpg","buckboard-bacon.jpg","burnt-ends.jpg","buttermilk-pie.jpg","cajun-mop.jpg","cajun-rub.jpg","championship-chili.jpg","championship-pulled-pork.jpg","cheese-grits.jpg","chess-pie.jpg","chicago-rub.jpg","chicago-sauce.jpg","chicken-thighs.jpg","chocolate-cobbler.jpg","chocolate-pecan-pie.jpg","chuck.jpg","coconut-cake.jpg","coffee-rub.jpg","cola-cake.jpg","collards.jpg","creamed-corn.jpg","dalmatian-rub.jpg","dirty-rice.jpg","dry-rub-spare-ribs.jpg","east-texas-sauce.jpg","ember-beef-injection.jpg","ember-finishing-glaze.jpg","ember-house-rub.jpg","ember-molasses-sauce.jpg","embers.jpg","florida-sweet-ribs.jpg","florida-sweet-sauce.jpg","fried-peach-pies.jpg","german-chocolate.jpg","hatch-elote.jpg","hatch-rub.jpg","hero-dusk.jpg","hero-smoker.jpg","holiday-smoked-ham.jpg","honey-mustard-onion-sauce.jpg","house-bbq-seasoning.jpg","hummingbird-cake.jpg","hush-puppies.jpg","kc-ribs.jpg","kc-sauce.jpg","kentucky-burgoo.jpg","kerns-chocolate-walnut-pie.jpg","lamb.jpg","lemon-icebox.jpg","lexington-sauce.jpg","mac-cheese.jpg","maryland-rub.jpg","memphis-barbecue-sauce.jpg","memphis-dry-rub.jpg","memphis-ribs.jpg","mississippi-pot-roast.jpg","mississippi-sweet-ribs.jpg","mississippi-sweet-sauce.jpg","monroe-county-shoulder.jpg","mud-cake.jpg","mustard-sauce.jpg","owensboro-dip.jpg","owensboro-mutton.jpg","peach-cobbler.jpg","peanut-butter-sheet-cake.jpg","pecan-pie.jpg","pf-changs-ribs.jpg","pickled-onions.jpg","pig-pickin.jpg","pimento-cheese.jpg","pinquito-beans.jpg","pit-beans.jpg","pit-table.jpg","pnw-salmon-rub.jpg","pork-belly.jpg","pork-injection.jpg","pork-loin.jpg","pork-rub.jpg","pork-steaks.jpg","potato-salad.jpg","poultry-rub.jpg","pound-cake.jpg","pralines.jpg","pulled-pork.jpg","pulled-venison.jpg","raspberry-chipotle-sauce.jpg","red-chile-sauce.jpg","red-velvet.jpg","salmon.jpg","santa-maria-rub.jpg","sausage.jpg","skillet-cornbread.jpg","slaw.jpg","smoked-bbq-burger-cheddar.jpg","smoked-cabbage.jpg","smoked-meatloaf.jpg","south-texas-salsa.jpg","spg-rub.jpg","strawberry-shortcake.jpg","sweet-potato-pie.jpg","sweet-rib-rub.jpg","sweet-vinegar-sauce.jpg","texas-mop.jpg","texas-sheet-cake.jpg","texas-twinkies.jpg","tiger-sauce.jpg","tri-tip.jpg","turkey.jpg","venison-backstrap.jpg","vinegar-sauce.jpg","white-chicken.jpg","white-sauce.jpg","whole-smoked-gator-boudin.jpg","woods.jpg"
];

mkdirSync(DEST, { recursive: true });
mkdirSync(foodDest, { recursive: true });

const localPhotos = join(ROOT, "scripts", "photos");
if (existsSync(localPhotos)) {
  for (const name of readdirSync(localPhotos)) {
    if (!name.endsWith(".b64")) continue;
    const raw = readFileSync(join(localPhotos, name), "utf8").trim();
    if (!raw || raw === "PLACEHOLDER") continue;
    const outName = name.replace(/\.b64$/, "");
    const buf = Buffer.from(raw, "base64");
    writeFileSync(join(DEST, outName), buf);
    writeFileSync(join(foodDest, outName), buf);
  }
}

async function grab(url, dest, ms = 15000) {
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

const foodCopies = [
  ["turkey.jpg", "honey-glazed-smoked-turkey.jpg"],
  ["holiday-smoked-ham.jpg", "christmas-ham.jpg"],
  ["cast-iron-green-beans.jpg", "cast-iron-green-beans.jpg"],
  ["texas-twinkies.jpg", "texas-twinkies.jpg"],
];
function copyFoodAliases() {
  for (const [from, to] of foodCopies) {
    const srcImages = join(DEST, from);
    const srcFood = join(foodDest, from);
    const dst = join(foodDest, to);
    const src = existsSync(srcImages) ? srcImages : existsSync(srcFood) ? srcFood : null;
    if (src) copyFileSync(src, dst);
  }
}
copyFoodAliases();

const probe = await grab(ORIGIN + "brisket.jpg", join(DEST, "brisket.jpg"), 15000);
if (!probe) {
  console.warn("origin photos unreachable; continuing with local photos only");
  copyFoodAliases();
  process.exit(0);
}

const videoDest = join(ROOT, "public", "videos");
mkdirSync(videoDest, { recursive: true });
await grab("https://plum-honey-silver-wave.grok.me/videos/hero-fire.mp4", join(videoDest, "hero-fire.mp4"), 30000);
await grab("https://plum-honey-silver-wave.grok.me/og.jpg", join(ROOT, "public", "og.jpg"), 15000);
await grab("https://plum-honey-silver-wave.grok.me/favicon.svg", join(ROOT, "public", "favicon.svg"), 10000);

const queue = FILES.filter((n) => n !== "brisket.jpg");
async function worker() {
  while (queue.length) {
    const name = queue.shift();
    await grab(ORIGIN + name, join(DEST, name), 15000);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));

copyFoodAliases();

console.warn("photo vendor finished");
