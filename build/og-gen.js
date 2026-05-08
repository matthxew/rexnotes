#!/usr/bin/env node
/* Generate /og/<slug>.png for every species that has a cropped illustration.
 * 1200×630, cream background, species cutout on the right, name + teaser
 * + meta line on the left. Run with `node build/og-gen.js`. */

const sharp = require('/tmp/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OG_DIR = path.join(ROOT, 'og');
const CROPPED_DIR = path.join(SRC, 'assets/cropped');

// Load the dinosaur data without polluting global scope.
const fakeWindow = {};
new Function('window', fs.readFileSync(path.join(SRC, 'data/dinosaurs.js'), 'utf8'))(fakeWindow);
const DINOSAURS = fakeWindow.DINOSAURS;

fs.mkdirSync(OG_DIR, { recursive: true });

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');

(async () => {
  let made = 0, skipped = 0;
  for (const dino of DINOSAURS) {
    const croppedPath = path.join(CROPPED_DIR, dino.slug + '.webp');
    if (!fs.existsSync(croppedPath)) {
      console.log('  skip:', dino.slug, '(no cropped image)');
      skipped++;
      continue;
    }

    // Cutout on the right, sized to fit the 630-tall canvas with margin.
    const cutout = await sharp(croppedPath)
      .resize({ height: 540, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();
    const cutoutMeta = await sharp(cutout).metadata();

    // Text panel on the left. Georgia is system-available everywhere
    // and reads as a reasonable proxy for Old Standard at OG sizes.
    const text = Buffer.from(`
      <svg xmlns='http://www.w3.org/2000/svg' width='620' height='460'>
        <text x='0' y='80' font-family='Georgia, serif' font-size='62' font-weight='600' fill='#1c1e25'>${escape(dino.name)}</text>
        <text x='0' y='150' font-family='Georgia, serif' font-style='italic' font-size='30' fill='#1c2a55'>${escape(dino.teaser)}</text>
        <line x1='0' y1='200' x2='460' y2='200' stroke='#cf983e' stroke-width='3'/>
        <text x='0' y='248' font-family='Georgia, serif' font-size='22' fill='#3c3d44'>${escape(dino.era)} · ${escape(dino.diet)} · ${escape(dino.yearsAgo)}</text>
        <text x='0' y='430' font-family='Georgia, serif' font-style='italic' font-size='32' font-weight='600' fill='#1c2a55'>Rex's Notes</text>
      </svg>
    `);

    const out = path.join(OG_DIR, dino.slug + '.png');
    await sharp({
      create: { width: 1200, height: 630, channels: 4, background: { r: 243, g: 241, b: 231, alpha: 1 } },
    })
      .composite([
        { input: cutout, left: 1200 - cutoutMeta.width - 40, top: Math.round((630 - cutoutMeta.height) / 2) },
        { input: text,   left: 80, top: 100 },
      ])
      .png()
      .toFile(out);

    const sz = (fs.statSync(out).size / 1024).toFixed(0);
    console.log('  wrote og/' + dino.slug + '.png  (' + sz + ' KB)');
    made++;
  }
  console.log(`\n${made} OG images written, ${skipped} skipped.`);
})();
