# Rex's Notes

A small, considered dinosaur guide. Twenty species, double-written —
each entry has a kid-facing intro and a denser write-up for the grown-up
reading along, fact-checked against current paleontology.

Live: [rexnotes.com](https://rexnotes.com)

---

## What this is

A static site for kids who love dinosaurs and the grown-ups reading
along. Twenty species, each with:

- pronunciation, era, age range, diet, habitat, length
- a short kid-facing introduction
- a denser write-up for adult readers, sourced against post-2015
  paleontological literature
- three trivia lines
- a printable coloring page

The home page is a sticker collage; there's a timeline view, a world
map view, and an `/about` page.

## Stack

| Area | Choice |
|---|---|
| Frontend | React 18 (loaded as plain `<script>`, no npm) |
| Routing | History API + Vercel SPA rewrite |
| Styling | Hand-rolled CSS, no framework |
| Data viz | D3 + topojson-client (world map) |
| Hosting | Vercel (Edge runtime for middleware) |
| Analytics | Vercel Web Analytics |

Everything ships as **one self-contained `index.html`** (~2.7 MB) with
all assets — fonts, illustrations, JSON, JSX — base64-inlined by a
custom bundler.

## Build pipeline

There's no npm in production. Build steps are plain Node scripts:

| Script | What it does |
|---|---|
| `node build/pack.js` | Bundle `src/` into the single-file `index.html`. |
| `node build/og-gen.js` | Generate `og/<slug>.png` (1200×630 share previews) for every species. Requires `sharp` available locally. |
| `node build/middleware-gen.js` | Regenerate `middleware.js`, `sitemap.xml`, and the home `<noscript>` block from the species dataset. |

Run all three after editing the dataset; just `pack.js` for code or
asset changes.

## SEO

- **Vercel Edge Middleware** (`middleware.js`) intercepts `/d/:slug`,
  rewrites the canonical / OG / Twitter meta tags, swaps in
  per-species noscript content, and injects `Article` JSON-LD before
  serving — so every species URL has correct share previews and
  crawlable copy without JavaScript.
- **`sitemap.xml`** lists all 24 URLs (home, about, timeline, map, 20
  species).
- **noscript fallback.** Home and species pages all render readable
  HTML without JS, regenerated from the dataset at build time.

## Project layout

```
src/
  index.html              # template (becomes the shell at build time)
  styles.css
  components/             # App.jsx, Timeline.jsx, WorldMap.jsx, Silhouette.jsx
  data/dinosaurs.js       # the 20-species dataset
  assets/
    illustrations/        # full Midjourney illustrations, one per slug
    cropped/              # transparent cutouts used on the home + OG cards
    fonts/                # Old Standard TT, DM Sans, Biro Script (woff2)

build/
  pack.js                 # the bundler
  og-gen.js               # OG image generator
  middleware-gen.js       # middleware + sitemap + noscript generator
  shell.html              # head/template wrapper around the React app
  loader.js               # runtime that resolves UUID-keyed assets to blob URLs
  asset-map.json          # stable filename → UUID map (so URLs survive rebuilds)

middleware.js             # auto-generated, edge-runtime
sitemap.xml               # auto-generated
robots.txt
vercel.json               # SPA rewrite
og/                       # auto-generated, one PNG per species
```

## Adding a 21st species

1. Append an entry to `src/data/dinosaurs.js`.
2. Drop the illustration into `src/assets/illustrations/<slug>.webp` and a
   transparent cutout into `src/assets/cropped/<slug>.webp`.
3. Run:
   ```sh
   node build/og-gen.js
   node build/middleware-gen.js
   node build/pack.js
   ```
4. Commit the regenerated `index.html`, `middleware.js`, `sitemap.xml`,
   and the new OG card.

## Credits

- **Illustrations** generated with [Midjourney](https://midjourney.com),
  prompted toward an ink-pen line style on cream paper.
- **Typography:** Old Standard TT (Alexey Kryukov, OFL), DM Sans (Indian
  Type Foundry, OFL), Biro Script (proprietary; not redistributed in
  the public bundle).
- **World map:** topojson from [Natural Earth](https://www.naturalearthdata.com/).
- **Paleontology** is sourced from post-2015 published literature where
  claims are contested; outdated consensus has been corrected with
  citations in the parent-facing copy.

## License

All rights reserved. The code is published for reference; the
illustrations and copy are not licensed for reuse.
