/* Main app — Rex's Notes */
const { useState, useMemo, useEffect } = React;

const ERAS = ["Triassic", "Jurassic", "Cretaceous"];
const DIETS = ["Carnivore", "Herbivore", "Omnivore"];

function useHashRoute() {
  const [route, setRoute] = useState(() => parse(location.hash));
  useEffect(() => {
    const h = () => setRoute(parse(location.hash));
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return route;
  function parse(hash) {
    const h = (hash || "").replace(/^#\/?/, "");
    if (!h) return { name: "home" };
    if (h === "about") return { name: "about" };
    if (h === "timeline") return { name: "timeline" };
    if (h === "map") return { name: "map" };
    // Optional /<slug> on timeline + map deep-links to a pre-selected species.
    const tl = h.match(/^timeline\/(.+)$/);
    if (tl) return { name: "timeline", slug: tl[1] };
    const mp = h.match(/^map\/(.+)$/);
    if (mp) return { name: "map", slug: mp[1] };
    const m = h.match(/^d\/(.+)$/);
    if (m) return { name: "detail", slug: m[1] };
    return { name: "home" };
  }
}
function navigate(path) { location.hash = path; window.scrollTo({ top: 0, behavior: "instant" }); }

/* Brand mark — uses the uploaded footprint image at runtime. Falls back
   to a tiny inline SVG silhouette only if the image asset is missing
   (e.g. during dev before the bundle is packed). */
function BrandMark() {
  const url = window.__resources?.brandMark;
  if (url) {
    return <img src={url} alt="" className="brand-mark-img" />;
  }
  return (
    <svg viewBox="0 0 64 80" fill="currentColor" aria-hidden="true">
      <ellipse cx="32" cy="60" rx="20" ry="14" />
      <path d="M32 4 C 25 4, 22 12, 23 24 C 23 32, 26 40, 32 42 C 38 40, 41 32, 41 24 C 42 12, 39 4, 32 4 Z" />
      <path d="M11 18 C 6 22, 4 32, 8 40 C 12 46, 18 48, 22 44 C 25 40, 24 32, 20 24 C 16 18, 13 16, 11 18 Z" />
      <path d="M53 18 C 58 22, 60 32, 56 40 C 52 46, 46 48, 42 44 C 39 40, 40 32, 44 24 C 48 18, 51 16, 53 18 Z" />
    </svg>
  );
}

/* Sketchier icons: organic curves, slight rotation in the SVGs that
   carry a flourish, varied stroke endings. Meant to feel pen-drawn
   rather than vector-precise. */
const NAV_ICONS = {
  home: (
    /* Stack of three slightly-offset cards — index entries layered. */
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8 L17 6.5 L18.5 17 L6.5 18.5 Z" />
      <path d="M6 5 L18 4 L19.2 14.5" />
      <path d="M8 12 L14 11.4" />
      <path d="M8 14.5 L13 14" />
    </svg>
  ),
  timeline: (
    /* Slightly oval clock face, hands at 10:10, a little dot at center. */
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.5 C 17 3.6, 20.8 7.4, 20.5 12.2 C 20.3 17, 16.5 20.6, 11.6 20.5 C 6.8 20.4, 3.4 16.6, 3.6 11.8 C 3.8 7, 7.4 3.4, 12 3.5 Z" />
      <path d="M12 7 L 12 12.4 L 8.5 14" />
      <path d="M12 2.5 L 12 3.7" />
      <circle cx="12" cy="12.4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  map: (
    /* Folded paper map with a small north-arrow flourish. */
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6.5 L9 4 L15 6 L21 4 L20.5 18 L14.5 20.2 L9 17.8 L3.5 20 Z" />
      <path d="M9 4 L 9 17.8" />
      <path d="M15 6 L 14.5 20.2" />
      <path d="M17.5 8 L 18 11.5 L 19.4 8.4" />
      <path d="M18 7 L 18 8.5" />
    </svg>
  ),
  about: (
    /* Open book with a rough spine + a few sketched lines. */
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6 C 6 4.8, 9.5 4.8, 12 6.5 C 14.5 4.8, 18 4.8, 21 6 L 20.6 18.5 C 18 17.4, 14.5 17.4, 12 18.7 C 9.5 17.4, 6 17.4, 3.4 18.5 Z" />
      <path d="M12 6.5 L 12 18.7" />
      <path d="M5.5 9.5 L 9 9.2" />
      <path d="M5.5 12 L 9 11.7" />
      <path d="M15 9.2 L 18.5 9.5" />
      <path d="M15 11.7 L 18.5 12" />
    </svg>
  ),
};

function Masthead({ route, query, setQuery }) {
  return (
    <header className="masthead">
      <div className="shell masthead-row">
        <button className="brand" onClick={() => navigate("/")}>
          <span className="brand-words">Rex's Notes</span>
        </button>
        <div className="mast-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
          </svg>
          <input
            type="text"
            placeholder="Search dinosaurs"
            value={query}
            onChange={e => { setQuery(e.target.value); if (route.name !== "home") navigate("/"); }}
          />
          {query ? <button className="clear" onClick={() => setQuery("")}>Clear</button> : null}
        </div>
        <nav className="nav">
          <button className={route.name === "home" ? "active" : ""} onClick={() => navigate("/")}>
            <span className="nav-icon">{NAV_ICONS.home}</span>
            <span className="nav-label">Index</span>
          </button>
          <button className={route.name === "timeline" ? "active" : ""} onClick={() => navigate("/timeline")}>
            <span className="nav-icon">{NAV_ICONS.timeline}</span>
            <span className="nav-label">Timeline</span>
          </button>
          <button className={route.name === "map" ? "active" : ""} onClick={() => navigate("/map")}>
            <span className="nav-icon">{NAV_ICONS.map}</span>
            <span className="nav-label">Map</span>
          </button>
          <button className={route.name === "about" ? "active" : ""} onClick={() => navigate("/about")}>
            <span className="nav-icon">{NAV_ICONS.about}</span>
            <span className="nav-label">About</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="foot shell">
      <div className="name">Rex's Notes</div>
      <div>Made for kids and the grown-ups reading along</div>
      <div>© 2026</div>
    </footer>
  );
}

function Home({ query, eras, diets, clearAll, toggleEra, toggleDiet }) {
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return window.DINOSAURS.filter(d => {
      if (eras.size && !eras.has(d.era)) return false;
      if (diets.size && !diets.has(d.diet)) return false;
      if (needle) {
        const hay = `${d.name} ${d.teaser} ${d.diet} ${d.era} ${d.habitat} ${(d.aliases || []).join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [query, eras, diets]);

  const anyFilter = query || eras.size || diets.size;

  return (
    <main className="fade-in">
      <section className="shell hero">
        <h1>
          <span className="hero-title">Dinosaurs</span>
          <span className="hero-sub">
            For <em>kids</em> and <span className="accent">grown-ups.</span>
          </span>
        </h1>
      </section>

      <div className="shell results-meta">
        <div className="rm-filter">
          <span className="rm-label">Era</span>
          {ERAS.map(e => (
            <button key={e}
              className={`chip-sm ${eras.has(e) ? "on" : ""}`}
              onClick={() => toggleEra(e)}>{e}</button>
          ))}
        </div>
        <div className="rm-sep" aria-hidden="true">·</div>
        <div className="rm-filter">
          <span className="rm-label">Diet</span>
          {DIETS.map(d => (
            <button key={d}
              className={`chip-sm ${diets.has(d) ? "on" : ""}`}
              onClick={() => toggleDiet(d)}>{d}</button>
          ))}
        </div>
        {anyFilter ? (
          <button className="rm-clear" onClick={clearAll}>Clear ✕</button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="shell empty">No dinosaurs match. Loosen a filter.</div>
      ) : (
        <div className="shell">
          <div className="sticker-page stagger">
            {filtered.map((d, i) => {
              const url = window.__resources?.["cropped:" + d.slug];
              if (!url) return null; // no cropped image yet — skip
              return (
                <button
                  key={d.slug}
                  className="sticker"
                  style={{ "--i": i }}
                  onClick={() => navigate(`/d/${d.slug}`)}>
                  <img src={url} alt={d.name} />
                  <span className="sticker-label">{d.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({ slug }) {
  const dino = window.DINOSAURS.find(d => d.slug === slug);
  if (!dino) {
    return (
      <main className="shell fade-in" style={{ padding: "80px 0" }}>
        <p className="serif" style={{ fontSize: 28, fontStyle: "italic" }}>That dinosaur is not in the index.</p>
        <button onClick={() => navigate("/")} className="back-link" style={{ marginTop: 24 }}>← Back</button>
      </main>
    );
  }
  return (
    <main className="detail fade-in">
      <div className="shell">
        <button className="back-link" onClick={() => navigate("/")}>← Back to index</button>

        <section className="detail-hero">
          <div className="detail-name-row">
            <h1>{dino.name}</h1>
            <div className="pronunciation">
              <span>Said</span>
              <strong>{dino.pronunciation}</strong>
            </div>
          </div>
        </section>

        <section className="detail-content">
          <div className="detail-illus">
            <window.Silhouette slug={dino.slug} era={dino.era} label="full illustration" />
          </div>
          <div>
            <div className="detail-meta-grid">
              <div className="meta-item">
                <div className="meta-label">Era</div>
                <div className="meta-value era" data-era={dino.era}>{dino.era}</div>
              </div>
              <button className="meta-item meta-link" onClick={() => navigate(`/timeline/${dino.slug}`)}>
                <div className="meta-label">When <span className="meta-arrow">↗</span></div>
                <div className="meta-value">{dino.yearsAgo}</div>
              </button>
              <div className="meta-item">
                <div className="meta-label">Diet</div>
                <div className="meta-value">{dino.diet}</div>
              </div>
              <button className="meta-item meta-link" onClick={() => navigate(`/map/${dino.slug}`)}>
                <div className="meta-label">Habitat <span className="meta-arrow">↗</span></div>
                <div className="meta-value">{dino.habitat}</div>
              </button>
            </div>
            <p className="size-line">
              <span className="label">Size</span>
              {dino.sizeCompare}.
            </p>
          </div>
        </section>

        <section className="facts with-rule">
          <div className="fact-block">
            <h2>What it was like.</h2>
            <p className="fact-body">{dino.forKids}</p>
          </div>
          <div className="fact-block">
            <h2>What we know now.</h2>
            <p className="fact-body">{dino.forParents}</p>
          </div>
        </section>

        <section className="trivia">
          <h3>Notes</h3>
          <ul>
            {dino.trivia.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>

        <section className="downloads">
          <h3>Downloads</h3>
          <div className="download-list">
            <button className="download-item" onClick={() => window.generateColoringPDF(dino)}>
              <div>
                <div className="dl-name">{dino.name} coloring page</div>
                <div className="dl-meta">PDF · US Letter · 1 page</div>
              </div>
              <div className="dl-action">Download ↓</div>
            </button>
          </div>
        </section>

        <NextPrev current={dino} />
      </div>
    </main>
  );
}

function NextPrev({ current }) {
  const list = window.DINOSAURS;
  const i = list.findIndex(d => d.slug === current.slug);
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  return (
    <nav className="pn-nav">
      <button className="pn-item" onClick={() => navigate(`/d/${prev.slug}`)}>
        <div className="pn-label">← Previous</div>
        <div className="pn-name">{prev.name}</div>
      </button>
      <button className="pn-item" onClick={() => navigate(`/d/${next.slug}`)}>
        <div className="pn-label">Next →</div>
        <div className="pn-name">{next.name}</div>
      </button>
    </nav>
  );
}

function About() {
  return (
    <main className="shell about fade-in">
      <h1>A small, considered dinosaur guide.</h1>
      <p>Most kids' dinosaur content is either Wikipedia-dense or covered in ads. Rex's Notes is an attempt at something else.</p>
      <p>Made for kids who love dinosaurs and the grown-ups reading along. Built in London for our son Ethan, and named for his grandfather Rex.</p>
      <p className="about-note">A note on the illustrations: paleontology keeps moving — colours, postures, even feathers shift as new fossils turn up. The drawings here are our best interpretation from what we know today, not the final word. Take them as a starting point.</p>
      <div className="field-note">
        Printable at home on standard letter paper.<br/>
        For corrections, write to hi@matthxew.co.
      </div>
    </main>
  );
}

function App() {
  const route = useHashRoute();
  const [query, setQuery] = useState("");
  const [eras, setEras] = useState(new Set());
  const [diets, setDiets] = useState(new Set());

  const toggleEra = (val) => {
    setEras(prev => {
      const n = new Set(prev);
      n.has(val) ? n.delete(val) : n.add(val);
      return n;
    });
  };
  const toggleDiet = (val) => {
    setDiets(prev => {
      const n = new Set(prev);
      n.has(val) ? n.delete(val) : n.add(val);
      return n;
    });
  };
  const clearAll = () => { setQuery(""); setEras(new Set()); setDiets(new Set()); };

  return (
    <>
      <Masthead
        route={route}
        query={query} setQuery={setQuery}
      />
      {route.name === "home" && <Home query={query} eras={eras} diets={diets} clearAll={clearAll} toggleEra={toggleEra} toggleDiet={toggleDiet} />}
      {route.name === "timeline" && <window.Timeline initialSlug={route.slug} />}
      {route.name === "map" && <window.WorldMap initialSlug={route.slug} />}
      {route.name === "detail" && <Detail slug={route.slug} />}
      {route.name === "about" && <About />}
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
