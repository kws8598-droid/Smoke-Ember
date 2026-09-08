export type IngredientGroup = { group: string; items: string[] };
export type Step = { title: string; body: string };
export type ProTip = { voice: string; text: string };
export type Milestone = { id: string; label: string; hint: string };
export type BodyBlock = { heading?: string; text: string; bullets?: string[] };

export type Recipe = {
  slug: string;
  title: string;
  region: string;
  protein: string;
  difficulty: string;
  hours: { min: number; max: number };
  servings: string;
  wood: string;
  pitTemp: string;
  finish: string;
  summary: string;
  story: string;
  school: string;
  image: string;
  ingredients: IngredientGroup[];
  steps: Step[];
  proTips?: ProTip[];
  milestones?: Milestone[];
};

export type Wisdom = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  image: string;
  readMinutes: number;
  body: BodyBlock[];
  takeaways?: string[];
};
