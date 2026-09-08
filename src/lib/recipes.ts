import { listA } from "./recipe-list-a";
import { listB } from "./recipe-list-b";

export type Recipe = {
  title: string;
  category: string;
  protein: string;
  slug: string;
  image: string;
  summary: string;
  fire: string;
  wood: string;
  time: string;
  yield: string;
  ingredients: string[];
  method: string[];
  note: string;
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type Playbook = {
  fire: string;
  wood: string;
  time: string;
  yield: string;
  ingredients: string[];
  method: string[];
};

const playbooks: Record<string, Playbook> = {
  Beef: {
    fire: "250-275F",
    wood: "Post oak or hickory",
    time: "6-12 hours",
    yield: "1 roast or rack",
    ingredients: ["Beef roast or ribs", "Kosher salt", "Coarse black pepper", "Optional garlic"],
    method: [
      "Trim hard fat and silverskin. Season heavy the night before.",
      "Smoke until the bark sets.",
      "Wrap when the bark no longer smears if the cook needs a push.",
      "Pull at probe-tender. Rest before slicing across the grain."
    ]
  },
  Pork: {
    fire: "250-275F",
    wood: "Hickory, apple, or cherry",
    time: "5-10 hours",
    yield: "1 rack or shoulder",
    ingredients: ["Pork rack or shoulder", "Salt, pepper, paprika", "Cider vinegar spritz", "Sauce or mop for the finish"],
    method: [
      "Peel membranes on ribs. Season all sides.",
      "Smoke until bark sets. Spritz if the surface goes dull.",
      "Wrap only if tenderness is stalling.",
      "Glaze late if the recipe wants shine. Rest, then slice or pull."
    ]
  },
  Poultry: {
    fire: "300-325F",
    wood: "Pecan or apple",
    time: "1.5-4 hours",
    yield: "1 bird or 8 thighs",
    ingredients: ["Chicken or turkey", "Salt, pepper, garlic", "Butter or a light injection", "Finishing sauce"],
    method: [
      "Dry the skin. Season under and over it.",
      "Cook hotter than beef so the skin can render.",
      "Sauce off the fire if the sauce is mayo-based.",
      "Rest 10-30 minutes depending on size."
    ]
  },
  Venison: {
    fire: "225-250F then a hot sear for loins",
    wood: "Oak or apple",
    time: "45 minutes to 8 hours",
    yield: "1 loin or roast",
    ingredients: ["Venison loin or shoulder", "Salt and pepper", "Beef tallow or bacon for roasts"],
    method: [
      "Remove silver skin.",
      "Loins: smoke to 115F and sear to 125-130F.",
      "Shoulders: add fat, cook until they pull.",
      "Do not cook loin past medium."
    ]
  },
  Mutton: {
    fire: "250-275F",
    wood: "Hickory",
    time: "8-10 hours",
    yield: "1 shoulder",
    ingredients: ["Mutton shoulder", "Salt and pepper", "Kentucky black dip"],
    method: [
      "Season simply.",
      "Smoke and mop with black dip after the first hours.",
      "Cook until the shoulder gives. Slice or pull."
    ]
  },
  Gator: {
    fire: "275F",
    wood: "Pecan",
    time: "4-6 hours",
    yield: "Tail and legs or a small gator",
    ingredients: ["Alligator", "Salt brine or buttermilk", "Cajun rub", "Cajun butter mop"],
    method: [
      "Brine overnight.",
      "Season and smoke. Mop with butter.",
      "Tail is done near 190F. Loin cooks faster."
    ]
  },
  Fish: {
    fire: "350F",
    wood: "Alder and a soaked cedar plank",
    time: "25-40 minutes",
    yield: "1 side",
    ingredients: ["Salmon side", "Salt, brown sugar, pepper", "Soaked cedar plank"],
    method: [
      "Season. Set on a soaked plank.",
      "Cook until the thickest part just flakes, 125-130F."
    ]
  },
  Sausage: {
    fire: "250F then a hot kiss",
    wood: "Post oak",
    time: "1.5-2 hours",
    yield: "5 lb",
    ingredients: ["Beef with about 25% fat", "Salt, pepper, garlic, chile", "Hog casings"],
    method: [
      "Grind coarse. Mix until sticky. Stuff.",
      "Smoke to 150-155F. Blister the casing over hotter coals."
    ]
  },
  Sides: {
    fire: "Pit, stovetop, or none",
    wood: "Whatever the pit is already burning",
    time: "20 minutes to 3 hours",
    yield: "1 pan or pot",
    ingredients: ["The named side ingredients", "Salt", "Fat from the cook if you have it"],
    method: [
      "Build the side so it can stand next to fat meat.",
      "Salt late on beans and greens.",
      "Do not candy a savory side."
    ]
  },
  Rubs: {
    fire: "None",
    wood: "None",
    time: "5 minutes",
    yield: "About 1 cup",
    ingredients: ["Kosher salt", "Coarse black pepper", "Paprika or chile", "Garlic"],
    method: ["Mix and jar. Taste on a finger before you bury a whole packer in it."]
  },
  Sauces: {
    fire: "Simmer or none",
    wood: "None",
    time: "5-40 minutes",
    yield: "About 2 cups",
    ingredients: ["Acid (vinegar or tomato)", "Sweetener if the style wants it", "Salt, pepper, heat"],
    method: [
      "Whisk or simmer until balanced.",
      "Thin mops stay thin. Thick sauces glaze late."
    ]
  },
  Desserts: {
    fire: "Oven or skillet on the pit",
    wood: "None, or a short pecan kiss",
    time: "40-70 minutes",
    yield: "1 pan or pie",
    ingredients: ["Fruit or pecans", "Sugar", "Butter", "A starch or crust"],
    method: ["Bake until set. Cool before a clean slice."]
  }
};

const extra: Record<string, Partial<Playbook>> = {
  "Central Texas Brisket": {
    fire: "250-275F",
    wood: "Post oak",
    time: "10-14 hours + 2 hour rest",
    yield: "1 packer, 12-16 lb",
    ingredients: ["1 packer brisket, 12-16 lb", "Coarse kosher salt", "16-mesh black pepper"],
    method: [
      "Trim. Leave a 1/4-inch fat cap on the flat.",
      "Season 50/50 salt and pepper the night before.",
      "Smoke until bark sets. Wrap in peach paper when it no longer smears.",
      "Pull at 200-205F when a probe slides like butter. Rest 2 hours."
    ]
  },
  "Poor Man's Brisket": {
    fire: "250-265F",
    wood: "Oak",
    time: "6-8 hours",
    yield: "1 chuck roast, 3-4 lb",
    ingredients: ["1 boneless chuck roast", "Salt, pepper, garlic", "Beef tallow or a thin mop"],
    method: [
      "Season like brisket. Overnight is better.",
      "Smoke until bark sets, about 160F internal.",
      "Wrap with a spoon of tallow. Finish to probe-tender.",
      "Rest 1 hour. Slice across the seams or chop it."
    ]
  },
  "Smoked Mississippi Pot Roast": {
    fire: "275F then covered finish",
    wood: "Hickory",
    time: "5-6 hours",
    yield: "1 chuck roast",
    ingredients: ["1 chuck roast", "Ranch seasoning", "Au jus mix", "Stick of butter", "Pepperoncini and a splash of the brine"],
    method: [
      "Smoke the seasoned roast naked for 2 hours.",
      "Move to a pan with butter, pepperoncini, ranch, and au jus.",
      "Cover and cook until it shreds.",
      "Reduce the juices. Serve on bread or over grits."
    ]
  },
  "Competition Chicken Thighs": {
    fire: "300F",
    wood: "Pecan or cherry",
    time: "2 hours plus rest",
    yield: "8 thighs",
    ingredients: ["8 bone-in skin-on thighs", "Lemon-pepper poultry rub", "Light injection", "Thin glaze"],
    method: [
      "Square the thighs. Scrape extra fat so the skin can render.",
      "Inject lightly. Season.",
      "Cook skin-side up until the skin bites through.",
      "Glaze late. Turn in the eight best, not the first eight."
    ]
  },
  "Championship Pulled Pork": {
    time: "8-10 hours",
    yield: "1 bone-in butt",
    ingredients: ["1 pork butt", "Championship pork injection", "Competition pork rub"],
    method: [
      "Inject the night before.",
      "Rub and rest.",
      "Smoke to bark, wrap if needed, finish to 203F and a slipping bone.",
      "Rest 1 hour. Pull. Sauce lightly."
    ]
  },
  "Alabama White Sauce": {
    fire: "None",
    time: "5 minutes",
    ingredients: ["Mayo", "Cider vinegar", "Black pepper", "Horseradish", "Lemon"],
    method: ["Whisk cold. Do not heat it."]
  },
  "Eastern Vinegar-Pepper Sauce": {
    fire: "None",
    time: "5 minutes",
    ingredients: ["Apple cider vinegar", "Red pepper flakes", "Black pepper", "Salt"],
    method: ["Shake. Rest overnight so the flake blooms."]
  },
  "Texas Pecan Pie": {
    fire: "350F oven",
    time: "1 hour plus cool",
    yield: "1 pie",
    ingredients: ["Pie crust", "Eggs, brown sugar, dark corn syrup or sorghum", "Melted butter, vanilla, salt", "Pecan halves"],
    method: [
      "Whisk the filling. Do not beat it full of air.",
      "Pack pecans in the crust. Pour filling over.",
      "Bake until the center barely jiggles. Cool completely."
    ]
  }
};

export const recipes: Recipe[] = [...listA, ...listB].map(([title, category, summary, note]) => {
  const base = playbooks[category];
  const over = extra[title] ?? {};
  const slug = slugify(title);
  return {
    title,
    category,
    protein: category,
    slug,
    image: `/food/${slug}?v=6`,
    summary,
    note,
    fire: over.fire ?? base.fire,
    wood: over.wood ?? base.wood,
    time: over.time ?? base.time,
    yield: over.yield ?? base.yield,
    ingredients: over.ingredients ?? base.ingredients,
    method: over.method ?? base.method
  };
});

export function getRecipe(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function recipesByCategory() {
  return recipes.reduce<Record<string, Recipe[]>>((groups, recipe) => {
    groups[recipe.category] = groups[recipe.category] ?? [];
    groups[recipe.category].push(recipe);
    return groups;
  }, {});
}
