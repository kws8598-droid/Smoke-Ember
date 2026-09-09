# Smoke Ember

Pull up a chair. Regional barbecue, pitmaster sides, house bottles, and fire-school notes.

This repository is the original Smoke and Ember book from [the Grok site](https://plum-honey-silver-wave.grok.me/):

- All 113 original recipes (complete ingredients + steps, not generic templates)
- Original photographs vendored into `/public/images` at build time (the running app does not call grok.me)
- Search, protein, region, and time filters
- Saved recipes and cook timers (stored on this device)
- Mobile-friendly layout with a hamburger menu

You own this repository (`kws8598-droid/Smoke-Ember`). Push to `main` to rebuild.

## Run

```
npm install
npm run dev
```

`predev` / `prebuild` pull the original recipe book and photographs, then write them into `data/chunks` and `public/images` so later edits can live in those files.

## Update recipes later

After the first build, edit:

- `data/chunks/recipes-00.json` … `recipes-22.json`
- `data/recipes-part-0.json` … `recipes-part-2.json`
- `data/wisdom.json`

If those chunk files already contain recipes, the extractor leaves them alone.
