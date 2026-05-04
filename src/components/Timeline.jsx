/* Timeline view — non-linear era scale, draggable bar that captures multiple dinosaurs. */
const { useState: useTState, useEffect: useTEffect, useMemo: useTMemo, useRef: useTRef, useCallback: useTCallback } = React;

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

// Non-linear era allocation: Triassic gets 18%, Jurassic 30%, Cretaceous 52%
const ERA_BOUNDS = [
  { name: "Triassic",   start: 252, end: 201, xStart: 0,    xEnd: 18 },
  { name: "Jurassic",   start: 201, end: 145, xStart: 18,   xEnd: 48 },
  { name: "Cretaceous", start: 145, end: 66,  xStart: 48,   xEnd: 100 }
];

// Map mya → x% using piecewise-linear era bands
function myaToX(mya) {
  for (const b of ERA_BOUNDS) {
    if (mya <= b.start && mya >= b.end) {
      const t = (b.start - mya) / (b.start - b.end);
      return b.xStart + t * (b.xEnd - b.xStart);
    }
  }
  if (mya > TL_START) return 0;
  return 100;
}
function xToMya(xPct) {
  for (const b of ERA_BOUNDS) {
    if (xPct >= b.xStart && xPct <= b.xEnd) {
      const t = (xPct - b.xStart) / (b.xEnd - b.xStart);
      return b.start - t * (b.start - b.end);
    }
  }
  return xPct < 0 ? TL_START : TL_END;
}

// Width of the scrubber bar in mya — varies by era so it captures roughly the same visual width
const BAR_WIDTH_PCT = 5; // % of track width

function Timeline() {
  const trackRef = useTRef(null);
  const [scrub, setScrub] = useTState(67); // mya — center of scrub bar
  const [dragging, setDragging] = useTState(false);
  const [activeIdx, setActiveIdx] = useTState(0);

  const items = useTMemo(() => {
    return window.DINOSAURS.map(d => ({ ...d, time: parseYears(d.yearsAgo) }))
      .sort((a, b) => b.time.mid - a.time.mid);
  }, []);

  const laid = useTMemo(() => {
    const lanes = [];
    const out = [];
    for (const d of items) {
      // Lane assignment by visual X-distance, not mya
      const xMid = myaToX(d.time.mid);
      let lane = -1;
      for (let i = 0; i < lanes.length; i++) {
        if (xMid - lanes[i] > 4) { lane = i; break; }
      }
      if (lane === -1) { lane = lanes.length; lanes.push(0); }
      lanes[lane] = xMid;
      out.push({ ...d, lane, xMid });
    }
    return { items: out, laneCount: lanes.length };
  }, [items]);

  // Scrub bar X range in %
  const barLeftPct = Math.max(0, Math.min(100 - BAR_WIDTH_PCT, myaToX(scrub) - BAR_WIDTH_PCT / 2));
  const barRightPct = barLeftPct + BAR_WIDTH_PCT;

  // Dinosaurs whose visual X-range overlaps the bar. Overlap (not midpoint)
  // so a species' whole lifespan is matched — e.g. Triceratops (68–66 mya)
  // is captured at any scrub between those years.
  const inBar = useTMemo(() => {
    const list = laid.items.filter(d => {
      const dxLeft = myaToX(d.time.start);  // older mya → smaller x
      const dxRight = myaToX(d.time.end);   // younger mya → larger x
      return dxRight >= barLeftPct - 0.1 && dxLeft <= barRightPct + 0.1;
    });
    if (list.length === 0) {
      // fallback: nearest single dinosaur
      let best = null, bestDist = Infinity;
      for (const d of laid.items) {
        const xCenter = (barLeftPct + barRightPct) / 2;
        const dist = Math.abs(d.xMid - xCenter);
        if (dist < bestDist) { bestDist = dist; best = d; }
      }
      return best ? [best] : [];
    }
    return list;
  }, [laid, barLeftPct, barRightPct]);

  // Reset active index when the captured set changes
  useTEffect(() => { setActiveIdx(0); }, [inBar.map(d => d.slug).join(",")]);

  const nearest = inBar[Math.min(activeIdx, inBar.length - 1)] || laid.items[0];

  const updateFromClient = useTCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setScrub(xToMya(pct));
  }, []);

  useTEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClient(x);
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, updateFromClient]);

  useTEffect(() => {
    const onKey = (e) => {
      // Don't hijack arrow keys when the user is typing in the search bar.
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowLeft")  setScrub(s => Math.min(TL_START, s + 2));
      if (e.key === "ArrowRight") setScrub(s => Math.max(TL_END,   s - 2));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nearestEra = ERA_BOUNDS.find(e => scrub <= e.start && scrub >= e.end) || ERA_BOUNDS[2];

  // Ticks at era boundaries + interior 25mya marks (skip if too close to majors)
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
          <p className="tl-dek">Drag the bar across two hundred million years. Any dinosaur it covers is highlighted. Use <span className="tl-key">←</span> <span className="tl-key">→</span> for fine motion.</p>
          <p className="tl-legend"><span className="tl-legend-chip">mya</span> means <em>million years ago</em>. So 66 mya is when the last dinosaurs died out, and 252 mya is roughly when the first ones showed up.</p>
        </header>

        <div className="tl-callout-top">
          <div className="tl-top-head">
            <div className="tl-callout-name">{nearest.name}</div>
            <button className="tl-open" onClick={() => navigate(`/d/${nearest.slug}`)}>
              Open {nearest.name.split(" ")[0]} →
            </button>
          </div>
          {inBar.length > 1 && (
            <div className="tl-tabs">
              <span className="tl-tabs-label">{inBar.length} dinosaurs in this slice:</span>
              {inBar.map((d, i) => (
                <button key={d.slug}
                  className={`tl-tab ${i === activeIdx ? "on" : ""}`}
                  onClick={() => setActiveIdx(i)}>
                  {d.name.split(" ")[0]}
                </button>
              ))}
            </div>
          )}
          <div className="tl-callout-fact">{nearest.trivia[0]}</div>
          <div className="tl-top-meta">
            <div>
              <div className="tl-callout-label">When it lived</div>
              <div className="tl-callout-when">{nearest.yearsAgo}</div>
            </div>
            <div>
              <div className="tl-callout-label">Where</div>
              <div className="tl-callout-where">{nearest.habitat}</div>
            </div>
          </div>
        </div>

        <div
          className="tl-track"
          ref={trackRef}
          onMouseDown={(e) => { setDragging(true); updateFromClient(e.clientX); }}
          onTouchStart={(e) => { setDragging(true); updateFromClient(e.touches[0].clientX); }}
        >
          <div className="tl-bands">
            {ERA_BOUNDS.map(b => (
              <div key={b.name} className="tl-band" data-era={b.name}
                style={{ left: `${b.xStart}%`, width: `${b.xEnd - b.xStart}%` }}>
                <span className="tl-band-label">{b.name}</span>
              </div>
            ))}
          </div>

          <div className="tl-dots" style={{ height: `${laid.laneCount * 56 + 24}px` }}>
            {laid.items.map(d => {
              const isInBar = inBar.some(b => b.slug === d.slug);
              const isActive = nearest && d.slug === nearest.slug;
              return (
                <button
                  key={d.slug}
                  className={`tl-dot ${isInBar ? "in-bar" : ""} ${isActive ? "is-near" : ""}`}
                  data-era={d.era}
                  style={{ left: `${d.xMid}%`, top: `${d.lane * 56 + 8}px` }}
                  onClick={(e) => { e.stopPropagation(); setScrub(d.time.mid); }}
                  onDoubleClick={() => navigate(`/d/${d.slug}`)}
                  title={`${d.name} — ${d.yearsAgo}. Double-click to open.`}
                >
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

          {/* Scrubber as a bar */}
          <div className="tl-scrub-bar"
               style={{ left: `${barLeftPct}%`, width: `${BAR_WIDTH_PCT}%` }}
               onMouseDown={(e) => { e.stopPropagation(); setDragging(true); }}>
            <div className="tl-scrub-handle" data-era={nearestEra.name}>
              <span>{Math.round(scrub)}<small>mya</small></span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

window.Timeline = Timeline;
