/* World map view — pin dinosaurs at fossil regions, click to highlight + zoom.
   Uses d3-geo + topojson for real Natural Earth coastlines. */
const { useState: useMState, useMemo: useMMemo, useEffect: useMEffect, useRef: useMRef } = React;

// Each location: lat/lng, kid-friendly place label, "what is this place" explainer, country.
const MAP_LOCATIONS = {
  "tyrannosaurus-rex":   { lat: 47.5,  lng: -106.5, place: "Montana, USA",   landmark: "Hell Creek",                placeNote: "Hell Creek is a stretch of badlands in Montana where the rocks happen to be exactly the age of the last big dinosaurs. Fossil hunters keep finding new T. rex bones eroding out of the cliffs.",                                                country: "United States of America" },
  "triceratops":         { lat: 46.0,  lng: -104.5, place: "Montana, USA",   landmark: "Hell Creek",                placeNote: "Same Montana badlands as T. rex — they lived and died side by side. Many Triceratops skulls are pulled out of these rocks every year.",                                                                                                            country: "United States of America" },
  "stegosaurus":         { lat: 41.0,  lng: -107.0, place: "Wyoming, USA",   landmark: "Morrison rocks",            placeNote: "The Morrison is a thick layer of old riverbed rock that runs from Montana to New Mexico. Most of America's giant Jurassic dinosaurs come from it.",                                                                                              country: "United States of America" },
  "brachiosaurus":       { lat: 39.0,  lng: -108.0, place: "Colorado, USA",  landmark: "Morrison rocks",            placeNote: "The Morrison is a thick layer of old riverbed rock that runs from Montana to New Mexico. The first Brachiosaurus came out of a hill near Grand Junction in 1900.",                                                                              country: "United States of America" },
  "velociraptor":        { lat: 44.0,  lng: 103.5,  place: "Mongolia",       landmark: "Gobi Desert",               placeNote: "The Gobi is a huge cold desert in Asia. Sand dunes once buried whole Velociraptor families in their burrows, and we still dig up those scenes today.",                                                                                          country: "Mongolia" },
  "spinosaurus":         { lat: 26.0,  lng: -8.0,   place: "Morocco",        landmark: "Sahara Desert",             placeNote: "The Sahara wasn't always a desert — 95 million years ago this part of North Africa was a giant river. Spinosaurus fossils still come out of the cliffs called the Kem Kem beds.",                                                              country: "Morocco" },
  "ankylosaurus":        { lat: 47.0,  lng: -107.0, place: "Montana, USA",   landmark: "Hell Creek",                placeNote: "The same Montana badlands where T. rex prowled. Ankylosaurus was rare even then — fewer than ten good specimens have ever been found.",                                                                                                       country: "United States of America" },
  "parasaurolophus":     { lat: 36.5,  lng: -107.5, place: "New Mexico, USA",landmark: "Kirtland badlands",         placeNote: "A stretch of striped desert rock in northwestern New Mexico. The crested hadrosaurs called from these rocks 75 million years ago.",                                                                                                              country: "United States of America" },
  "therizinosaurus":     { lat: 43.5,  lng: 100.0,  place: "Mongolia",       landmark: "Gobi Desert",               placeNote: "The southern Gobi is famous for its painted cliffs and weird, unique dinosaurs — Therizinosaurus is the biggest oddball of the bunch.",                                                                                                          country: "Mongolia" },
  "microraptor":         { lat: 41.5,  lng: 120.5,  place: "China",          landmark: "Liaoning",                  placeNote: "Liaoning is a province in northeast China where volcanic ash buried whole forests. The ash preserved feathers, skin, and even the colors of tiny dinosaurs.",                                                                                  country: "China" },
  "diplodocus":          { lat: 41.5,  lng: -106.0, place: "Wyoming, USA",   landmark: "Morrison rocks",            placeNote: "The Morrison is a thick layer of old riverbed rock that runs from Montana to New Mexico. So many Diplodocus skeletons come from it that the species is in nearly every big museum.",                                                            country: "United States of America" },
  "allosaurus":          { lat: 39.5,  lng: -110.5, place: "Utah, USA",      landmark: "Morrison rocks",            placeNote: "The Morrison is a thick layer of old riverbed rock that runs from Montana to New Mexico. One Utah quarry alone has yielded dozens of Allosaurus skeletons.",                                                                                  country: "United States of America" },
  "iguanodon":           { lat: 50.5,  lng: 4.0,    place: "Belgium",        landmark: "Bernissart coal mine",      placeNote: "In 1878, miners in Bernissart broke through a wall and found 38 complete Iguanodon skeletons stacked in a fossil pit. It's still one of the greatest finds in dinosaur history.",                                                              country: "Belgium" },
  "pachycephalosaurus":  { lat: 47.0,  lng: -106.5, place: "Montana, USA",   landmark: "Hell Creek",                placeNote: "Hell Creek again — the thick-headed dome-skull dinosaurs lived right alongside T. rex.",                                                                                                                                                       country: "United States of America" },
  "carnotaurus":         { lat: -45.0, lng: -68.5,  place: "Argentina",      landmark: "Patagonia",                 placeNote: "Patagonia is the southern tip of South America — windy, dry, and full of late-Cretaceous fossils that are different from the ones in North America.",                                                                                          country: "Argentina" },
  "plateosaurus":        { lat: 49.5,  lng: 9.0,    place: "Germany",        landmark: "Trossingen",                placeNote: "A small town in southern Germany where workers digging clay in 1911 found dozens of complete Plateosaurus skeletons — one of the earliest big dinosaur graveyards ever discovered.",                                                       country: "Germany" },
  "coelophysis":         { lat: 36.5,  lng: -106.5, place: "New Mexico, USA",landmark: "Ghost Ranch",               placeNote: "A famous fossil pit in northern New Mexico. In 1947 paleontologists pulled out hundreds of tangled Coelophysis skeletons — a whole pack that died together in a flood.",                                                                    country: "United States of America" },
  "eoraptor":            { lat: -29.5, lng: -69.0,  place: "Argentina",      landmark: "Ischigualasto Valley",      placeNote: "A red-and-grey valley in northwest Argentina. Its rocks are some of the oldest dinosaur-bearing rocks on Earth — almost 230 million years old.",                                                                                              country: "Argentina" },
  "deinonychus":         { lat: 45.5,  lng: -109.0, place: "Montana, USA",   landmark: "Cloverly badlands",         placeNote: "A layer of striped Cretaceous rock in southern Montana and Wyoming. Deinonychus came out of these hills in the 1960s and rewrote what people thought dinosaurs were like — fast, sharp, almost bird.",                                      country: "United States of America" },
  "ichthyovenator":      { lat: 17.0,  lng: 105.5,  place: "Laos",           landmark: "Savannakhet",               placeNote: "A region in central Laos where French and Lao paleontologists have been working since the 1990s. The big sandstone cliffs preserve a whole Asian Cretaceous river world.",                                                                  country: "Laos" }
};

const COUNTRY_CONTINENT = {
  "United States of America": "NA", "Canada": "NA", "Mexico": "NA",
  "Argentina": "SA", "Brazil": "SA", "Chile": "SA",
  "Belgium": "EU", "Germany": "EU", "France": "EU", "United Kingdom": "EU", "Spain": "EU",
  "Morocco": "AF", "Egypt": "AF", "South Africa": "AF",
  "Mongolia": "AS", "China": "AS", "Laos": "AS", "Japan": "AS", "India": "AS"
};

const CONTINENT_NAMES = {
  NA: "North America", SA: "South America", EU: "Europe",
  AF: "Africa", AS: "Asia", AU: "Australia", AN: "Antarctica"
};

const VW = 1000, VH = 500;
function project(lng, lat) {
  const x = ((lng + 180) / 360) * VW;
  const y = ((90 - lat) / 180) * VH;
  return [x, y];
}

// Smooth animated viewBox interpolation
function useAnimatedViewBox(target, duration = 700) {
  const [current, setCurrent] = useMState(target);
  const fromRef = useMRef(target);
  const startRef = useMRef(0);
  const rafRef = useMRef(0);

  useMEffect(() => {
    const from = current;
    fromRef.current = from;
    startRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const k = easeOutCubic(t);
      setCurrent({
        x:      from.x + (target.x - from.x) * k,
        y:      from.y + (target.y - from.y) * k,
        width:  from.width + (target.width - from.width) * k,
        height: from.height + (target.height - from.height) * k
      });
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target.x, target.y, target.width, target.height]);

  return current;
}

function WorldMap() {
  const [selectedSlug, setSelectedSlug] = useMState("tyrannosaurus-rex");
  const [eraFilter, setEraFilter] = useMState(new Set());
  const [worldData, setWorldData] = useMState(null);
  const [zoomed, setZoomed] = useMState(true);

  useMEffect(() => {
    let cancelled = false;
    fetch(window.__resources?.worldAtlas || "https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then(r => r.json())
      .then(topo => {
        if (cancelled) return;
        setWorldData(topojson.feature(topo, topo.objects.countries));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const items = useMMemo(() => {
    return window.DINOSAURS.map(d => ({
      ...d,
      loc: MAP_LOCATIONS[d.slug],
      continent: COUNTRY_CONTINENT[MAP_LOCATIONS[d.slug]?.country] || "NA"
    })).filter(d => d.loc);
  }, []);

  const filtered = useMMemo(() => {
    if (eraFilter.size === 0) return items;
    return items.filter(d => eraFilter.has(d.era));
  }, [items, eraFilter]);

  const selected = items.find(d => d.slug === selectedSlug) || items[0];

  // Compute target viewBox: zoomed-in around selected pin (≈ 280×140 viewport), or full world
  const targetVB = useMMemo(() => {
    if (!zoomed) return { x: 0, y: 0, width: VW, height: VH };
    const [px, py] = project(selected.loc.lng, selected.loc.lat);
    const w = 320, h = 160;
    let x = px - w / 2;
    let y = py - h / 2;
    x = Math.max(0, Math.min(VW - w, x));
    y = Math.max(0, Math.min(VH - h, y));
    return { x, y, width: w, height: h };
  }, [selected, zoomed]);
  const animVB = useAnimatedViewBox(targetVB);

  const byContinent = useMMemo(() => {
    const g = {};
    for (const d of filtered) {
      const c = d.continent;
      (g[c] = g[c] || []).push(d);
    }
    return g;
  }, [filtered]);

  function toggleEra(era) {
    setEraFilter(s => {
      const n = new Set(s);
      n.has(era) ? n.delete(era) : n.add(era);
      return n;
    });
  }

  const geoPath = useMMemo(() => {
    if (!worldData || !window.d3) return null;
    const projection = d3.geoEquirectangular()
      .scale(VW / (2 * Math.PI))
      .translate([VW / 2, VH / 2]);
    return d3.geoPath(projection);
  }, [worldData]);

  const countryPaths = useMMemo(() => {
    if (!worldData || !geoPath) return [];
    return worldData.features.map(f => {
      const name = f.properties.name;
      const continent = COUNTRY_CONTINENT[name] || guessContinentFromCentroid(f);
      return { name, continent, d: geoPath(f) };
    }).filter(c => c.d);
  }, [worldData, geoPath]);

  const activeCountry = selected.loc.country;
  const [pinX, pinY] = project(selected.loc.lng, selected.loc.lat);

  // Pin scales inversely with zoom so it stays visually consistent
  const zoomScale = animVB.width / VW; // 1.0 = full world, ~0.32 = zoomed
  const pinDotR = 5 * zoomScale + 2;
  const pinHaloR = 14 * zoomScale + 4;
  const pulseR = 22 * zoomScale + 6;

  return (
    <main className="worldmap fade-in">
      <div className="shell">
        <header className="wm-header">
          <h1>The <span className="wm-accent">map</span>.</h1>
          <p className="wm-dek">Pick a dinosaur. The map flies to the place its bones came out of the ground.</p>
        </header>

        <div className="wm-filters">
          <span className="wm-filters-label">Filter by era:</span>
          {["Triassic", "Jurassic", "Cretaceous"].map(era => (
            <button
              key={era}
              className={`wm-chip ${eraFilter.has(era) ? "on" : ""}`}
              data-era={era}
              onClick={() => toggleEra(era)}>
              {era}
            </button>
          ))}
          {eraFilter.size > 0 && (
            <button className="wm-chip-clear" onClick={() => setEraFilter(new Set())}>Clear</button>
          )}
          <span className="wm-spacer" />
          <button className={`wm-chip ${!zoomed ? "on" : ""}`} onClick={() => setZoomed(z => !z)}>
            {zoomed ? "Show whole world" : "Zoom in"}
          </button>
        </div>

        <div className="wm-layout">
          <div className="wm-map">
            <svg
              viewBox={`${animVB.x} ${animVB.y} ${animVB.width} ${animVB.height}`}
              className="wm-svg"
              preserveAspectRatio="xMidYMid meet">
              <rect x="0" y="0" width={VW} height={VH} fill="var(--paper-2)" />

              <g className="wm-grid">
                {[-60, -30, 0, 30, 60].map(lat => {
                  const [, y] = project(0, lat);
                  return <line key={lat} x1="0" y1={y} x2={VW} y2={y} />;
                })}
                {[-120, -60, 60, 120].map(lng => {
                  const [x] = project(lng, 0);
                  return <line key={lng} x1={x} y1="0" x2={x} y2={VH} />;
                })}
              </g>

              <g className="wm-countries">
                {countryPaths.map((c, i) => (
                  <path
                    key={i}
                    d={c.d}
                    className={`wm-continent ${activeCountry === c.name ? "is-active-country" : ""}`}
                    data-continent={c.continent}
                  />
                ))}
              </g>

              {/* Single highlighted pin */}
              <g className="wm-pin is-sel">
                <circle cx={pinX} cy={pinY} r={pulseR} className="wm-pin-pulse" />
                <circle cx={pinX} cy={pinY} r={pinHaloR} className="wm-pin-halo" />
                <circle cx={pinX} cy={pinY} r={pinDotR} className="wm-pin-dot" />
              </g>

              {!worldData && (
                <text x={VW/2} y={VH/2} textAnchor="middle"
                      style={{fontFamily: "var(--mono)", fontSize: "14px", fill: "var(--ink-3)"}}>
                  Loading map…
                </text>
              )}
            </svg>

            {/* Place label overlay */}
            <div className="wm-place-overlay">
              <div className="wm-place-landmark">{selected.loc.landmark}</div>
              <div className="wm-place-where">{selected.loc.place}</div>
            </div>
          </div>

          <aside className="wm-side">
            <div className="wm-card">
              <div className="wm-card-era" data-era={selected.era}>{selected.era}</div>
              <div className="wm-card-name">{selected.name}</div>
              <div className="wm-card-region">
                Found in <strong>{selected.loc.landmark}</strong>, {selected.loc.place}
              </div>
              <div className="wm-card-explainer">
                <div className="wm-card-explainer-label">What is {selected.loc.landmark}?</div>
                <div className="wm-card-explainer-text">{selected.loc.placeNote}</div>
              </div>
              <button className="wm-card-open" onClick={() => navigate(`/d/${selected.slug}`)}>
                Open {selected.name.split(" ")[0]} →
              </button>
            </div>

            <div className="wm-list">
              {Object.entries(byContinent).map(([c, ds]) => (
                <div key={c} className="wm-list-group">
                  <div className="wm-list-head">
                    <span className="wm-list-continent">{CONTINENT_NAMES[c]}</span>
                    <span className="wm-list-count">{ds.length}</span>
                  </div>
                  {ds.map(d => (
                    <button key={d.slug}
                      className={`wm-list-item ${d.slug === selectedSlug ? "on" : ""}`}
                      data-era={d.era}
                      onClick={() => setSelectedSlug(d.slug)}>
                      <span className="wm-list-marker" />
                      <span className="wm-list-name">{d.name}</span>
                      <span className="wm-list-region">{d.loc.place}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function guessContinentFromCentroid(feature) {
  if (!window.d3) return "NA";
  const [lng, lat] = d3.geoCentroid(feature);
  if (lat < -60) return "AN";
  if (lat < 0 && lng > 110 && lng < 180) return "AU";
  if (lng > -30 && lng < 60 && lat < 35) {
    if (lat < 35 && lng > -20 && lng < 55) return "AF";
  }
  if (lat > 35 && lng > -25 && lng < 60) return "EU";
  if (lng > 25 && lng < 180 && lat > -10) return "AS";
  if (lng < -30 && lat > 12) return "NA";
  if (lng < -30 && lat <= 12) return "SA";
  return "NA";
}

window.WorldMap = WorldMap;
