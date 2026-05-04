/* Timeline view — click-to-select model. No scrubber. Selecting a species
   overlays its lifespan as a range bar on the strata; species whose
   lifespans overlap with the selection get an "alongside" highlight, and
   the callout names them so contemporaries are explicit. */
const { useState: useTState, useEffect: useTEffect, useMemo: useTMemo } = React;

function parseYears(str) {
  const nums = (str || "").match(/\d+(?:\.\d+)?/g);
  if (!nums) return { start: 100, end: 100, mid: 100 };
  if (nums.length === 1) {
    const n = parseFloat(nums[0]);
    return { start: n, end: n, mid: n };
  }
  const a = parseFloat(nums[0]), b = parseFloat(nums[1]);
  const start = Math.max(a, b), end = Math.min(a, b);
  return { start, end, mid: (start + end) / 2 };
}

const TL_START = 252;
const TL_END = 66;

// Non-linear era allocation so each band has visual room: Triassic 18%,
// Jurassic 30%, Cretaceous 52%.
const ERA_BOUNDS = [
  { name: "Triassic",   start: 252, end: 201, xStart: 0,    xEnd: 18 },
  { name: "Jurassic",   start: 201, end: 145, xStart: 18,   xEnd: 48 },
  { name: "Cretaceous", start: 145, end: 66,  xStart: 48,   xEnd: 100 }
];

function myaToX(mya) {
  for (const b of ERA_BOUNDS) {
    if (mya <= b.start && mya >= b.end) {
      const t = (b.start - mya) / (b.start - b.end);
      return b.xStart + t * (b.xEnd - b.xStart);
    }
  }
  return mya > TL_START ? 0 : 100;
}

// Two species' lifespans overlap if any year falls in both ranges.
// time = { start: older mya (larger number), end: younger mya (smaller) }.
function rangesOverlap(a, b) {
  return a.time.end <= b.time.start && b.time.end <= a.time.start;
}

function Timeline() {
  // Items sorted oldest → youngest so left/right arrow keys move forward
  // and backward in time without surprises.
  const items = useTMemo(() => (
    window.DINOSAURS
      .map(d => ({ ...d, time: parseYears(d.yearsAgo) }))
      .sort((a, b) => b.time.mid - a.time.mid)
  ), []);

  // Lane-pack: dots at similar x get stacked into rows so labels don't
  // collide. Threshold is in % of track width — a dinosaur name set in
  // 9.5px caps is roughly 11–14% wide on a typical track, so ~14% buys
  // enough horizontal headroom that adjacent species like Parasaurolophus
  // and Pachycephalosaurus land on different rows.
  const laid = useTMemo(() => {
    const lanes = [];
    const out = [];
    for (const d of items) {
      const xMid = myaToX(d.time.mid);
      let lane = -1;
      for (let i = 0; i < lanes.length; i++) {
        if (xMid - lanes[i] > 14) { lane = i; break; }
      }
      if (lane === -1) { lane = lanes.length; lanes.push(0); }
      lanes[lane] = xMid;
      out.push({ ...d, lane, xMid });
    }
    return { items: out, laneCount: lanes.length };
  }, [items]);

  const [selectedSlug, setSelectedSlug] = useTState(items[0].slug);
  const selected = laid.items.find(d => d.slug === selectedSlug) || laid.items[0];

  // Species whose lifespans overlap with the selection (excluding itself).
  const alongside = useTMemo(() => (
    laid.items.filter(d => d.slug !== selected.slug && rangesOverlap(d, selected))
  ), [laid, selected]);

  const alongsideSet = useTMemo(() => new Set(alongside.map(d => d.slug)), [alongside]);

  // Range overlay: lifespan of the selected species, projected to the
  // visual axis, drawn as a translucent band across the strata.
  const rangeLeft = myaToX(selected.time.start);   // older = smaller x
  const rangeRight = myaToX(selected.time.end);    // younger = larger x

  // Arrow keys cycle through species chronologically.
  useTEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const idx = laid.items.findIndex(d => d.slug === selectedSlug);
      if (idx === -1) return;
      const next = e.key === "ArrowLeft"
        ? (idx - 1 + laid.items.length) % laid.items.length
        : (idx + 1) % laid.items.length;
      setSelectedSlug(laid.items[next].slug);
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [laid, selectedSlug]);

  // Ticks: era boundaries + interior 20-mya marks (skipped if too close
  // to a major).
  const ticks = useTMemo(() => {
    const majors = [252, 201, 145, 66];
    const t = majors.map(m => ({ m, major: true }));
    for (let m = 240; m >= 75; m -= 20) {
      if (majors.every(M => Math.abs(M - m) > 8)) t.push({ m, major: false });
    }
    return t.sort((a, b) => b.m - a.m);
  }, []);

  return (
    <main className="timeline fade-in">
      <div className="shell">
        <header className="tl-header">
          <h1>The <span className="tl-accent">timeline</span>.</h1>
          <p className="tl-dek">
            Click any species to see when it lived and which dinosaurs walked the same earth.
            Use <span className="tl-key">←</span> <span className="tl-key">→</span> to step through them in order.
          </p>
        </header>

        <div className="tl-callout">
          <div className="tl-callout-head">
            <div className="tl-callout-name" data-era={selected.era}>{selected.name}</div>
            <button className="tl-open" onClick={() => navigate(`/d/${selected.slug}`)}>
              Open {selected.name.split(" ")[0]} →
            </button>
          </div>

          <div className="tl-callout-grid">
            <div className="tl-callout-cell">
              <div className="tl-callout-label">When it lived</div>
              <div className="tl-callout-value">{selected.yearsAgo}</div>
            </div>
            <div className="tl-callout-cell">
              <div className="tl-callout-label">Where</div>
              <div className="tl-callout-value">{selected.habitat}</div>
            </div>
          </div>

          <div className="tl-callout-fact">{selected.trivia[0]}</div>

          <div className="tl-callout-alongside">
            <span className="tl-callout-label">Lived alongside</span>
            {alongside.length > 0 ? (
              <ul className="tl-alongside-list">
                {alongside.map(d => (
                  <li key={d.slug}>
                    <button
                      className="tl-alongside-chip"
                      data-era={d.era}
                      onClick={() => setSelectedSlug(d.slug)}>
                      {d.name.split(" ")[0]}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="tl-alongside-empty">no overlap with anything in our atlas</span>
            )}
          </div>
        </div>

        <div className="tl-track">
          <div className="tl-bands">
            {ERA_BOUNDS.map(b => (
              <div key={b.name} className="tl-band" data-era={b.name}
                style={{ left: `${b.xStart}%`, width: `${b.xEnd - b.xStart}%` }}>
                <span className="tl-band-label">{b.name}</span>
              </div>
            ))}
            {/* Selection range overlay: the species' lifespan projected onto
                the strata. Sits above the band tints, below the dots. */}
            <div className="tl-range" data-era={selected.era}
              style={{ left: `${rangeLeft}%`, width: `${Math.max(0.5, rangeRight - rangeLeft)}%` }} />
          </div>

          <div className="tl-dots" style={{ height: `${laid.laneCount * 56 + 24}px` }}>
            {laid.items.map(d => {
              const isAlongside = alongsideSet.has(d.slug);
              const isSelected = d.slug === selected.slug;
              // Anchor the label so it never spills off the track: dots in
              // the rightmost band get right-aligned labels that grow leftward,
              // dots near the left edge get left-aligned labels that grow
              // rightward, the middle stays centered.
              const edge = d.xMid > 86 ? "right" : d.xMid < 14 ? "left" : "center";
              return (
                <button
                  key={d.slug}
                  className={`tl-dot ${isAlongside ? "is-alongside" : ""} ${isSelected ? "is-selected" : ""}`}
                  data-era={d.era}
                  data-edge={edge}
                  style={{ left: `${d.xMid}%`, top: `${d.lane * 56 + 8}px` }}
                  onClick={() => setSelectedSlug(d.slug)}
                  onDoubleClick={() => navigate(`/d/${d.slug}`)}
                  title={`${d.name} — ${d.yearsAgo}. Double-click to open.`}>
                  <span className="tl-dot-marker" />
                  <span className="tl-dot-name">{d.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="tl-ticks">
            {ticks.map(t => (
              <div key={t.m} className={`tl-tick ${t.major ? "major" : ""}`}
                   style={{ left: `${myaToX(t.m)}%` }}>
                <div className="tl-tick-line" />
                <div className="tl-tick-label">{t.m}</div>
              </div>
            ))}
            <div className="tl-axis-label">million years ago</div>
          </div>
        </div>

        <p className="tl-footnote">
          <span className="tl-legend-chip">mya</span> means <em>million years ago</em>.
          66 mya is when the last big dinosaurs died out; 252 mya is roughly when the first ones showed up.
        </p>
      </div>
    </main>
  );
}

window.Timeline = Timeline;
