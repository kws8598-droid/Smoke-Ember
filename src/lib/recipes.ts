export type Recipe = {
  title: string;
  category: string;
  protein: string;
  slug: string;
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
    method: ["Trim hard fat and silverskin. Season heavy the night before.", "Smoke until the bark sets.", "Wrap when the bark no longer smears if the cook needs a push.", "Pull at probe-tender. Rest before slicing across the grain."]
  },
  Pork: {
    fire: "250-275F",
    wood: "Hickory, apple, or cherry",
    time: "5-10 hours",
    yield: "1 rack or shoulder",
    ingredients: ["Pork rack or shoulder", "Salt, pepper, paprika", "Cider vinegar spritz", "Sauce or mop for the finish"],
    method: ["Peel membranes on ribs. Season all sides.", "Smoke until bark sets. Spritz if the surface goes dull.", "Wrap only if tenderness is stalling.", "Glaze late if the recipe wants shine. Rest, then slice or pull."]
  },
  Poultry: {
    fire: "300-325F",
    wood: "Pecan or apple",
    time: "1.5-4 hours",
    yield: "1 bird or 8 thighs",
    ingredients: ["Chicken or turkey", "Salt, pepper, garlic", "Butter or a light injection", "Finishing sauce"],
    method: ["Dry the skin. Season under and over it.", "Cook hotter than beef so the skin can render.", "Sauce off the fire if the sauce is mayo-based.", "Rest 10-30 minutes depending on size."]
  },
  Venison: {
    fire: "225-250F then a hot sear for loins",
    wood: "Oak or apple",
    time: "45 minutes to 8 hours",
    yield: "1 loin or roast",
    ingredients: ["Venison loin or shoulder", "Salt and pepper", "Beef tallow or bacon for roasts"],
    method: ["Remove silver skin.", "Loins: smoke to 115F and sear to 125-130F.", "Shoulders: add fat, cook until they pull.", "Do not cook loin past medium."]
  },
  Mutton: {
    fire: "250-275F",
    wood: "Hickory",
    time: "8-10 hours",
    yield: "1 shoulder",
    ingredients: ["Mutton shoulder", "Salt and pepper", "Kentucky black dip"],
    method: ["Season simply.", "Smoke and mop with black dip after the first hours.", "Cook until the shoulder gives. Slice or pull."]
  },
  Gator: {
    fire: "275F",
    wood: "Pecan",
    time: "4-6 hours",
    yield: "Tail and legs or a small gator",
    ingredients: ["Alligator", "Salt brine or buttermilk", "Cajun rub", "Cajun butter mop"],
    method: ["Brine overnight.", "Season and smoke. Mop with butter.", "Tail is done near 190F. Loin cooks faster."]
  },
  Fish: {
    fire: "350F",
    wood: "Alder and a soaked cedar plank",
    time: "25-40 minutes",
    yield: "1 side",
    ingredients: ["Salmon side", "Salt, brown sugar, pepper", "Soaked cedar plank"],
    method: ["Season. Set on a soaked plank.", "Cook until the thickest part just flakes, 125-130F."]
  },
  Sausage: {
    fire: "250F then a hot kiss",
    wood: "Post oak",
    time: "1.5-2 hours",
    yield: "5 lb",
    ingredients: ["Beef with about 25% fat", "Salt, pepper, garlic, chile", "Hog casings"],
    method: ["Grind coarse. Mix until sticky. Stuff.", "Smoke to 150-155F. Blister the casing over hotter coals."]
  },
  Sides: {
    fire: "Pit, stovetop, or none",
    wood: "Whatever the pit is already burning",
    time: "20 minutes to 3 hours",
    yield: "1 pan or pot",
    ingredients: ["The named side ingredients", "Salt", "Fat from the cook if you have it"],
    method: ["Build the side so it can stand next to fat meat.", "Salt late on beans and greens.", "Do not candy a savory side."]
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
    method: ["Whisk or simmer until balanced.", "Thin mops stay thin. Thick sauces glaze late."]
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

const list: Array<[string, string, string, string]> = [
  ["Central Texas Brisket", "Beef", "Salt, pepper, post oak, and patience. The packer is the whole argument.", "If the smoke is white and thick, you are burning fuel, not cooking beef."],
  ["Santa Maria Tri-Tip", "Beef", "Live oak, a hard sear, and a medium-rare center.", "Slice against the grain. This cut changes direction mid-roast."],
  ["Point Burnt Ends", "Beef", "The point after the packer is done. Cubed, sauced, and caramelized.", "If they look wet in the pan, give them more time, not more sauce."],
  ["Texas Plate Ribs", "Beef", "Dino bones. Thick, greasy in the right way, and loud on the plate.", "Done by feel. If the probe drags, they are not ready."],
  ["Poor Man's Brisket", "Beef", "Chuck roast cooked like a packer when the bank account says no.", "Chuck has more seams than a flat. Slice across them or chop it."],
  ["Herb-Crusted Lamb Shoulder", "Beef", "Shoulder on smoke with rosemary, garlic, and lemon.", "Lamb fat goes rancid-fast on a dirty fire. Keep the smoke thin."],
  ["Smoked Mississippi Pot Roast", "Beef", "Ranch, pepperoncini, and butter - but the roast sees smoke first.", "If you start it in the pan, it is just a pot roast with ambition."],
  ["Smoked BBQ Burger", "Beef", "The grind gets oak and a mop of sauce at the end.", "Do not overwork the grind. Tight patties eat like meatloaf."],
  ["Smoked Meatloaf", "Beef", "A loaf that can take smoke without falling apart.", "Rack it. A pan of grease steams the loaf."],
  ["Championship Chili", "Beef", "No beans in the contest pot. Smoke the meat, then stew it.", "Beans are a side, not an ingredient, if you are turning this in."],
  ["Kansas City Spare Ribs", "Pork", "St. Louis trim, sweet bark, late glaze that shines without pooling.", "The bone should twist with a tug, not fall out like boiled meat."],
  ["Eastern Carolina Pulled Pork", "Pork", "Whole shoulder, vinegar-pepper, no ketchup in the building.", "If it tastes sweet, you left the Carolinas."],
  ["Memphis Dry Ribs", "Pork", "No glaze. The rub is the finish.", "Wet ribs are a different city. Keep the bottle off the box."],
  ["Pork Belly Burnt Ends", "Pork", "Cubed belly, rendered, then candy-glazed.", "Underrendered belly tastes like warm lard. Give it time before the glaze."],
  ["St. Louis Pork Steaks", "Pork", "Shoulder steaks over coals, mopped until they slump.", "This is tavern meat. Do not plate it like a tasting menu."],
  ["Applewood Pork Loin", "Pork", "Lean roast. Pull it early or it dies.", "145F is cooked. Chasing 160F invents sawdust."],
  ["Applewood Smoked Bacon", "Pork", "Belly, cure, smoke. Slice it yourself.", "No pink salt, no bacon. Do not freestyle the cure math."],
  ["Buckboard Bacon", "Pork", "Cured pork loin smoked like bacon.", "This overcooks in a blink. Watch the probe."],
  ["Monroe County Shoulder", "Pork", "West Kentucky shoulder dipped in a thin pepper dip.", "If it tastes like Kansas City, you missed Monroe County."],
  ["Florida Sweet Ribs", "Pork", "Sunshine-sweet glaze, a little citrus, still needs bark.", "Sweet is the finish, not the first hour."],
  ["Mississippi Sweet Ribs", "Pork", "Delta sweet, a little heat, pork that still tastes like pork.", "If the sauce is the only flavor, you under-seasoned the meat."],
  ["Copycat P.F. Chang's Spare Ribs", "Pork", "Sticky, salty-sweet, a little char.", "Dry the ribs before the glaze or it slides off."],
  ["Dry Rub Spare Ribs", "Pork", "No wrap, no sauce. Rub and smoke.", "Wrapping is a tool, not a requirement."],
  ["Championship Pulled Pork", "Pork", "Injected butt, layered rub, box-ready strands.", "Turn-in meat should be moist without sitting in a puddle."],
  ["Alabama White Sauce Chicken", "Poultry", "Smoked bird, then a slather of mayo-horseradish-pepper sauce.", "White sauce is a finishing dip, not a marinade. Do not heat it."],
  ["Competition Chicken Thighs", "Poultry", "Skin schedule, even color, bite-through, no leather.", "If the skin is rubber, you rushed the render."],
  ["Herb-Butter Smoked Turkey", "Poultry", "Butter under the skin, smoke that does not taste like an ashtray.", "Low-and-slow turkey invents beige wood. Give it heat."],
  ["Smoked Venison Backstrap", "Venison", "The tenderloin of the woods. Treat it like a good steak.", "Past medium and you are making jerky with extra steps."],
  ["Amish Pulled Venison", "Venison", "Shoulder or neck, low smoke, fat added back.", "Venison has no spare fat. You have to bring some."],
  ["Kentucky Burgoo", "Venison", "The stew that will take whatever walked through the fence.", "Burgoo is leftovers with a backbone. Do not make it pretty."],
  ["Owensboro Mutton", "Mutton", "Western Kentucky mutton and black dip.", "Young lamb and sweet sauce is a different state."],
  ["Whole Smoked Gator", "Gator", "Gulf yard bird. Brine it or the tail turns to rope.", "Dry gator cannot be sauced back to life."],
  ["Cedar-Plank Salmon", "Fish", "Plank, alder, brown sugar, and a fish that still flakes.", "A dry plank flames. Soak it."],
  ["Texas Hot Guts", "Sausage", "Coarse beef sausage, chile-hot, snapped over oak.", "If the snap is gone, you overcooked it or used lean grind."],
  ["Pit Beans with Brisket Trim", "Sides", "Beans that ate the leftover bark.", "Sweet beans are dessert. These should taste like the brisket plate."],
  ["Cast-Iron Smoked Mac", "Sides", "Cheese sauce in iron, a little smoke, a brown top.", "Too much smoke turns cheese bitter."],
  ["Pepper Vinegar Slaw", "Sides", "No mayo. Cabbage that can sit next to fat pork.", "This is for the pork tray, not a picnic buffet."],
  ["Mustard Potato Salad", "Sides", "Warm potatoes, yellow mustard, pickle bite.", "If it tastes only like mayo, you made the wrong potato salad."],
  ["Pit Pickled Onions", "Sides", "Red onions, hot vinegar, ready when the ribs rest.", "Put these on brisket sandwiches."],
  ["Smoked Cabbage Wedges", "Sides", "Wedges on the grate with butter and pepper.", "Leave the core so the wedge stays a wedge."],
  ["Cast-Iron Cornbread", "Sides", "Hot iron, bacon drippings, a brown crust that scrapes.", "If you add a lot of sugar, call it cake."],
  ["Memphis BBQ Spaghetti", "Sides", "Pork, spaghetti, and barbecue sauce in a pan.", "This is not Italian. Stop looking for basil."],
  ["Potlikker Collards", "Sides", "Greens on a ham hock until the pot liquor is the point.", "Save the potlikker. That is the sauce."],
  ["Hush Puppies", "Sides", "Cornmeal orbs fried next to the pit.", "Greasy pups sat in cool oil."],
  ["Smoked Creamed Corn", "Sides", "Corn, cream, a kiss of smoke.", "Twenty minutes of smoke is plenty."],
  ["Santa Maria Pinquito Beans", "Sides", "Small pink beans, bacon, chile. The tri-tip other half.", "Navy beans will not do."],
  ["Alabama Cheese Grits", "Sides", "Stone-ground, cheddar, salt enough for white-sauce chicken.", "Instant grits are a different and worse food."],
  ["Pit Pimento Cheese", "Sides", "Sharp cheddar, pimentos, mayo, a little heat.", "Pre-shredded cheese will not melt into the spread right."],
  ["Hatch Street Corn", "Sides", "Corn on the grate, Hatch chile, lime, cotija.", "Bland corn is a wasted grate."],
  ["Cajun Dirty Rice", "Sides", "Liver, sausage, trinity.", "If there is no liver, it is just rice with sausage."],
  ["Santa Maria Seasoning", "Rubs", "Salt, garlic, pepper, parsley.", "Fresh garlic burns. Granulated belongs in the rub."],
  ["Memphis Dry Rub", "Rubs", "Paprika-forward, brown sugar in check.", "Too much sugar and a dry rib becomes a sticky rib by accident."],
  ["Cajun Pit Rub", "Rubs", "Paprika, cayenne, garlic, thyme.", "Cayenne stacks. Taste before you bury a bird in it."],
  ["Hatch Chile Cumin Rub", "Rubs", "Dried Hatch, cumin, salt.", "If the chile is mild, add chipotle rather than more salt."],
  ["Chicago Rib-Tip Rub", "Rubs", "For the cheap cut Chicago turned into a religion.", "Celery salt is the Chicago tell. Leave it in."],
  ["Maryland Pit-Beef Rub", "Rubs", "For roast beef over coals, sliced thin.", "Pit beef is medium-rare. Do not cook the rub to death."],
  ["Alder Brown-Sugar Rub", "Rubs", "For salmon and pork loin.", "Sugar burns. This is a short-cook rub."],
  ["Ember House Rub", "Rubs", "Salt-forward, pepper-heavy, a little sugar and chile.", "If the meat is already injected, back this off."],
  ["Sweet Rib Rub", "Rubs", "More brown sugar, still enough salt to count.", "Keep the pit under 275F or the sugar goes bitter."],
  ["Barbecue Seasoning", "Rubs", "All-purpose shaker for weeknight chops.", "The pantry bottle, not the contest bottle."],
  ["Dalmatian Rub", "Rubs", "Salt and pepper. That is the whole sermon.", "Add ten spices and you made a different rub."],
  ["SPG House Rub", "Rubs", "Salt, pepper, garlic.", "Granulated garlic, not garlic salt."],
  ["Competition Pork Rub", "Rubs", "Built for butts and ribs that have to taste loud in one bite.", "Layer it: a coat, a rest, another coat."],
  ["Coffee-Chile Beef Rub", "Rubs", "Espresso, chile, salt. For plate ribs and the point.", "Use coffee, not a flavored latte grind."],
  ["Lemon-Pepper Poultry Rub", "Rubs", "The chicken-box perfume. Bright, not soapy.", "Bottled lemon pepper is already salty."],
  ["East Texas Sweet Sauce", "Sauces", "Tomato-sweet with a little heat.", "Central Texas can skip this. East Texas should not."],
  ["Thin Chile Mop", "Sauces", "A mop, not a coat.", "If it is thick, it is sauce. Thin it."],
  ["South Texas Pit Salsa", "Sauces", "Fire-roasted tomato and chile.", "Leave some char. That is the smoke."],
  ["Kentucky Black BBQ Sauce", "Sauces", "Worcestershire-heavy dip for mutton.", "Steak sauce that went to church in Owensboro."],
  ["Florida Sweet Sauce", "Sauces", "Citrus in the sweetness.", "Orange juice burns. Glaze late."],
  ["Mississippi Sweet Sauce", "Sauces", "Sweeter than Carolina, hotter than a picnic sauce.", "Taste it on pork, not on a spoon."],
  ["Ember Molasses Sauce", "Sauces", "House red. Molasses, vinegar, a little heat.", "Stop when it is deep, not black."],
  ["Ember Smoke Sauce", "Sauces", "Thinner, more pepper, for burgers and ends.", "If you cannot brush it, thin with vinegar."],
  ["Sweet Vinegar Sauce", "Sauces", "Halfway between Lexington and a picnic sauce.", "Warm meat drinks this."],
  ["Raspberry Chipotle Sauce", "Sauces", "Fruit and smoke for pork.", "One chipotle first."],
  ["Chicago Mild (and Hot)", "Sauces", "Mild for the table, hot for the people who asked.", "Serve both."],
  ["Maryland Tiger Sauce", "Sauces", "Horseradish and mayo heat for pit beef.", "Make it the day you serve it."],
  ["New Mexico Red Chile", "Sauces", "Red chile puree. Not ketchup with chili powder.", "Dusty taste means old chiles."],
  ["Cajun Butter Mop", "Sauces", "Butter, cayenne, lemon, garlic.", "Butter burns. Mop, do not pool it."],
  ["Blackberry Pit Sauce", "Sauces", "Dark fruit for pork.", "Salt it like a sauce, not like jam."],
  ["Kansas City Molasses Sauce", "Sauces", "The thick red people mean when they say barbecue sauce.", "Brush late or it scorches."],
  ["Eastern Vinegar-Pepper Sauce", "Sauces", "The whole Eastern Carolina argument in a jar.", "No tomato. Tomato is Lexington."],
  ["Carolina Gold Mustard Sauce", "Sauces", "South Carolina mustard. Tang first.", "This belongs on pork. It will fight brisket."],
  ["Alabama White Sauce", "Sauces", "Mayo, vinegar, pepper, horseradish.", "If you simmer this it breaks."],
  ["Lexington Dip", "Sauces", "Western NC vinegar-pepper with a little ketchup.", "It should still taste like vinegar."],
  ["Memphis Barbecue Sauce", "Sauces", "Tangier than KC, still red.", "On dry ribs this is a table sauce, not a mop."],
  ["Championship Pork Injection", "Sauces", "The juice that keeps a butt moist after a long smoke.", "If juice rivers off the board, you injected too fast."],
  ["Pit Banana Pudding", "Desserts", "Wafers, banana, soft custard. Cold after hot meat.", "Assemble close to service or the wafers turn to mush."],
  ["Skillet Peach Cobbler", "Desserts", "Peaches in iron with batter that rises around them.", "Ice cream is not optional unless you are out of ice cream."],
  ["Texas Pecan Pie", "Desserts", "Dark, set, pecans on top. Not a sugar puddle.", "Cut it cool. A hot pecan pie slumps like a bad brisket wrap."]
];

const extra: Record<string, Partial<Playbook>> = {
  "Central Texas Brisket": {
    fire: "250-275F",
    wood: "Post oak",
    time: "10-14 hours + 2 hour rest",
    yield: "1 packer, 12-16 lb",
    ingredients: ["1 packer brisket, 12-16 lb", "Coarse kosher salt", "16-mesh black pepper"],
    method: ["Trim. Leave a 1/4-inch fat cap on the flat.", "Season 50/50 salt and pepper the night before.", "Smoke until bark sets. Wrap in peach paper when it no longer smears.", "Pull at 200-205F when a probe slides like butter. Rest 2 hours."]
  },
  "Competition Chicken Thighs": {
    fire: "300F",
    wood: "Pecan or cherry",
    time: "2 hours plus rest",
    yield: "8 thighs",
    ingredients: ["8 bone-in skin-on thighs", "Lemon-pepper poultry rub", "Light injection", "Thin glaze"],
    method: ["Square the thighs. Scrape extra fat so the skin can render.", "Inject lightly. Season.", "Cook skin-side up until the skin bites through.", "Glaze late. Turn in the eight best, not the first eight."]
  },
  "Championship Pulled Pork": {
    time: "8-10 hours",
    yield: "1 bone-in butt",
    ingredients: ["1 pork butt", "Championship pork injection", "Competition pork rub"],
    method: ["Inject the night before.", "Rub and rest.", "Smoke to bark, wrap if needed, finish to 203F and a slipping bone.", "Rest 1 hour. Pull. Sauce lightly."]
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
  }
};

export const recipes: Recipe[] = list.map(([title, category, summary, note]) => {
  const base = playbooks[category];
  const over = extra[title] ?? {};
  return {
    title,
    category,
    protein: category,
    slug: slugify(title),
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
