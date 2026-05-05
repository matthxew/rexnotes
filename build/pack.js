#!/usr/bin/env node
/* Bundle src/ into a self-contained index.html.
 *
 * Reads:    src/**, build/loader.js, build/shell.html, build/asset-map.json
 * Writes:   index.html (and back-fills asset-map.json with new UUIDs if any)
 *
 * Each src file (except index.html and styles.css, which become the template)
 * goes into a base64 (gzipped) manifest entry keyed by its UUID. The
 * template HTML's src=/href= attributes are rewritten from readable paths
 * back to UUIDs; the loader resolves UUIDs to blob URLs at runtime. */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const BUILD = __dirname;
const OUT = path.join(ROOT, 'index.html');
const MAP_PATH = path.join(BUILD, 'asset-map.json');

const MIME = {
  '.js':    'text/javascript',
  '.jsx':   'text/javascript',
  '.json':  'application/json',
  '.css':   'text/css',
  '.html':  'text/html',
  '.woff2': 'font/woff2',
  '.svg':   'image/svg+xml',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
};

// Babel runs at pack time only — its 3 MB cost stays out of the bundle.
const Babel = require('./babel.min.js');
function compileJSX(src) {
  return Babel.transform(src, { presets: ['react'] }).code;
}

// Files consumed by the build itself, not bundled as assets.
const SKIP = new Set(['index.html', 'styles.css']);

function relSrc(abs) {
  return path.relative(SRC, abs).split(path.sep).join('/');
}

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function loadMap() {
  return JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
}

function saveMap(map) {
  // Sort keys for stable diffs.
  const sorted = {};
  for (const k of Object.keys(map).sort()) sorted[k] = map[k];
  fs.writeFileSync(MAP_PATH, JSON.stringify(sorted, null, 2) + '\n');
}

function buildManifest(map) {
  const manifest = {};
  let dirty = false;
  const files = walk(SRC).map(relSrc).sort();
  for (const rel of files) {
    if (SKIP.has(rel)) continue;
    if (!map[rel]) {
      map[rel] = crypto.randomUUID();
      dirty = true;
      console.log('  + registered ' + rel + ' -> ' + map[rel]);
    }
    const uuid = map[rel];
    const ext = path.extname(rel).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    let raw = fs.readFileSync(path.join(SRC, rel));

    // Compile JSX -> JS at pack time so the bundle doesn't ship Babel.
    if (ext === '.jsx') raw = Buffer.from(compileJSX(raw.toString('utf8')));

    let bytes = raw;
    let compressed = false;
    // Skip recompressing already-compressed formats.
    if (!['.woff2', '.png', '.jpg'].includes(ext)) {
      const z = zlib.gzipSync(raw, { level: 9 });
      if (z.length < raw.length) { bytes = z; compressed = true; }
    }
    manifest[uuid] = { data: bytes.toString('base64'), compressed, mime };
  }
  return { manifest, dirty };
}

function buildTemplate(map) {
  const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');

  // Rewrite font url() paths back to UUIDs for the runtime template.
  const cssWithUuid = css.replace(/url\("(assets\/fonts\/[^"]+)"\)/g, (m, key) => {
    if (!map[key]) throw new Error('no UUID for ' + key);
    return `url("${map[key]}")`;
  });

  // Strip dev-only window.__resources shim (loader injects production version).
  let t = html.replace(/[ \t]*<script>window\.__resources[^<]*<\/script>\s*\n/, '');

  // Inline styles.css in place of the dev <link>.
  t = t.replace(
    /<link rel="stylesheet" href="styles\.css">/,
    `<style>${cssWithUuid.trim()}</style>`
  );

  // Rewrite readable src/href paths to UUIDs.
  t = t.replace(/(src|href)="([^"]+)"/g, (m, attr, val) => {
    if (/^https?:|^blob:|^data:|^#/.test(val)) return m;
    return map[val] ? `${attr}="${map[val]}"` : m;
  });

  return t;
}

function verify(template, manifest) {
  // Every UUID referenced from the template must be in the manifest.
  const refs = new Set();
  for (const m of template.matchAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g)) {
    refs.add(m[0]);
  }
  const missing = [...refs].filter(u => !manifest[u]);
  if (missing.length) throw new Error('template references missing UUIDs: ' + missing.join(', '));
  return refs.size;
}

function main() {
  console.log('Packing rexatlas...');
  const map = loadMap();

  const { manifest, dirty } = buildManifest(map);
  if (dirty) saveMap(map);

  const template = buildTemplate(map);
  const refCount = verify(template, manifest);

  const extResources = [{ id: 'worldAtlas', uuid: map['assets/world-atlas.json'] }];

  // Auto-expose every species illustration as an ext_resource keyed by
  // "illustration:<slug>" so the Silhouette component can look them up
  // at runtime via window.__resources. Drop a PNG/JPG/SVG into
  // src/assets/illustrations/<slug>.<ext> and it appears on next pack.
  const illusDir = path.join(SRC, 'assets/illustrations');
  if (fs.existsSync(illusDir)) {
    for (const f of fs.readdirSync(illusDir)) {
      const slug = f.replace(/\.(png|jpg|jpeg|svg|webp)$/i, '');
      if (slug === f) continue; // not a recognised image extension
      const key = 'assets/illustrations/' + f;
      if (!map[key]) continue; // not yet registered (will be on a re-run)
      extResources.push({ id: 'illustration:' + slug, uuid: map[key] });
    }
  }
  const loader = fs.readFileSync(path.join(BUILD, 'loader.js'), 'utf8').trimEnd();
  const shell = fs.readFileSync(path.join(BUILD, 'shell.html'), 'utf8');

  // Escape "</" as "<\/" inside JSON payloads. JSON.parse accepts the escape,
  // and the HTML parser stops looking for </script inside our data blocks.
  const safeJson = (obj) => JSON.stringify(obj).replace(/<\//g, '<\\/');

  const out = shell
    .replace('__LOADER__', () => loader)
    .replace('__MANIFEST__', () => safeJson(manifest))
    .replace('__EXT_RESOURCES__', () => safeJson(extResources))
    .replace('__TEMPLATE__', () => safeJson(template));

  fs.writeFileSync(OUT, out);
  const sz = fs.statSync(OUT).size;
  console.log(
    'Wrote ' + path.relative(ROOT, OUT) +
    ' — ' + Object.keys(manifest).length + ' assets, ' +
    refCount + ' UUID refs, ' +
    (sz / 1024 / 1024).toFixed(2) + ' MB'
  );
}

main();
