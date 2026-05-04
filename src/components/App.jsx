/* Main app — Rex's Atlas */
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
    const m = h.match(/^d\/(.+)$/);
    if (m) return { name: "detail", slug: m[1] };
    return { name: "home" };
  }
}
function navigate(path) { location.hash = path; window.scrollTo({ top: 0, behavior: "instant" }); }

// Mode is the picture-book vs field-guide toggle. Persisted in localStorage
// and reflected as a body data-attribute so any selector can opt in via
// [data-mode="kid"] or [data-mode="grownup"].
function useMode() {
  const [mode, _setMode] = useState(() => {
    try { return localStorage.getItem("rexatlas-mode") || "kid"; }
    catch { return "kid"; }
  });
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try { localStorage.setItem("rexatlas-mode", mode); } catch {}
  }, [mode]);
  return [mode, _setMode];
}

function ModeToggle({ mode, setMode }) {
  return (
    <div className="mode-toggle" role="group" aria-label="Reading mode">
      <span className="mode-label">Read as</span>
      <button
        className={`mode-btn ${mode === "kid" ? "on" : ""}`}
        onClick={() => setMode("kid")}
        aria-pressed={mode === "kid"}>
        Kid
      </button>
      <button
        className={`mode-btn ${mode === "grownup" ? "on" : ""}`}
        onClick={() => setMode("grownup")}
        aria-pressed={mode === "grownup"}>
        Grown-up
      </button>
    </div>
  );
}

function Masthead({ route, query, setQuery, mode, setMode }) {
  return (
    <header className="masthead">
      <div className="shell masthead-row">
        <button className="brand" onClick={() => navigate("/")}>
          <b>Rex's</b><span>Atlas</span><span className="dot"></span>
        </button>
        <div className="mast-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
          </svg>
          <input
            type="text"
            placeholder={route.name === "home" ? "Search dinosaurs by name, habitat, diet…" : "Search dinosaurs"}
            value={query}
            onChange={e => { setQuery(e.target.value); if (route.name !== "home") navigate("/"); }}
          />
          {query ? <button className="clear" onClick={() => setQuery("")}>Clear</button> : null}
        </div>
        <nav className="nav">
          <button className={route.name === "home" ? "active" : ""} onClick={() => navigate("/")}>Index</button>
          <button className={route.name === "timeline" ? "active" : ""} onClick={() => navigate("/timeline")}>Timeline</button>
          <button className={route.name === "map" ? "active" : ""} onClick={() => navigate("/map")}>Map</button>
          <button className={route.name === "about" ? "active" : ""} onClick={() => navigate("/about")}>About</button>
        </nav>
      </div>
      <div className="shell mast-sub">
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="foot shell">
      <div className="name">Rex's Atlas</div>
      <div>Made for kids and the grown-ups reading along</div>
      <div>© 2026</div>
    </footer>
  );
}

function Home({ query, eras, diets, clearAll, mode, toggleEra, toggleDiet }) {
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return window.DINOSAURS.filter(d => {
      if (eras.size && !eras.has(d.era)) return false;
      if (diets.size && !diets.has(d.diet)) return false;
      if (needle) {
        const hay = `${d.name} ${d.teaser} ${d.diet} ${d.era} ${d.habitat}`.toLowerCase();
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
          Dinosaurs<br/>
          {mode === "kid" ? (
            <>For <span className="accent">kids</span> and <em>grown-ups.</em></>
          ) : (
            <>For <em>kids</em> and <span className="accent">grown-ups.</span></>
          )}
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
        <div className="rm-count"><strong>{filtered.length}</strong> of {window.DINOSAURS.length} dinosaurs</div>
      </div>

      {filtered.length === 0 ? (
        <div className="shell empty">No dinosaurs match. Loosen a filter.</div>
      ) : (
        <div className="shell">
          <div className="grid stagger">
            {filtered.map(d => (
              <button key={d.slug} className="card" onClick={() => navigate(`/d/${d.slug}`)}>
                <div className="card-illus">
                  <window.Silhouette slug={d.slug} era={d.era} />
                </div>
                <div className="meta-row">
                  <span className="era-dot" data-era={d.era}></span>
                  <span>{d.era}</span>
                  <span>·</span>
                  <span>{d.diet}</span>
                </div>
                <h3>{d.name}</h3>
                <p className="teaser">{d.teaser}</p>
                <span className="arrow">→</span>
              </button>
            ))}
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
            <div className="pronunciation only-grownup">
              <span>Said</span>
              <strong>{dino.pronunciation}</strong>
            </div>
          </div>
          <p className="d-when only-kid">{dino.kidTime}</p>
          <div className="d-era-badge only-kid">
            <span className="era-dot" data-era={dino.era}></span>
            <span>{dino.era}</span>
            <span>·</span>
            <span>{dino.diet}</span>
          </div>
        </section>

        <section className="detail-content">
          <div className="detail-illus">
            <window.Silhouette slug={dino.slug} era={dino.era} label="full illustration" />
          </div>
          <div className="only-grownup">
            <div className="detail-meta-grid">
              <div className="meta-item">
                <div className="meta-label">Era</div>
                <div className="meta-value era" data-era={dino.era}>{dino.era}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">When</div>
                <div className="meta-value">{dino.yearsAgo}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Diet</div>
                <div className="meta-value">{dino.diet}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Habitat</div>
                <div className="meta-value">{dino.habitat}</div>
              </div>
            </div>
            <p className="size-line">
              <span className="label">Size</span>
              {dino.sizeCompare}.
            </p>
          </div>
        </section>

        <section className="facts with-rule">
          <div className="fact-block kids only-kid">
            <h2>What it was like.</h2>
            <p className="fact-body">{dino.forKids}</p>
          </div>
          <div className="fact-block parents only-grownup">
            <div className="fact-label" data-num="02">For Grown-ups</div>
            <h2>What we know now.</h2>
            <p className="fact-body">{dino.forParents}</p>
          </div>
        </section>

        <section className="trivia">
          <h3>Field notes</h3>
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
      <h1>A small, considered field guide.</h1>
      <p>Most kids' dinosaur content is either Wikipedia-dense or covered in ads. Rex's Atlas is an attempt at something else.</p>
      <p>Made for kids who love dinosaurs and the grown-ups reading along. Built in London for our son Ethan, and named for his grandfather Rex.</p>
      <div className="field-note">
        Printable at home on standard letter paper.<br/>
        For corrections, write to hi@matthxew.co.
      </div>
    </main>
  );
}

function App() {
  const route = useHashRoute();
  const [mode, setMode] = useMode();
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
        mode={mode} setMode={setMode}
      />
      {route.name === "home" && <Home query={query} eras={eras} diets={diets} clearAll={clearAll} mode={mode} toggleEra={toggleEra} toggleDiet={toggleDiet} />}
      {route.name === "timeline" && <window.Timeline />}
      {route.name === "map" && <window.WorldMap />}
      {route.name === "detail" && <Detail slug={route.slug} />}
      {route.name === "about" && <About />}
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
