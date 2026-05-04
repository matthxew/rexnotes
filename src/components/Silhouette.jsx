/* SVG silhouette placeholders. These are abstract striped shapes that read as
   "dinosaur shape goes here," not anatomically detailed. Real illustrations
   will replace them by writing /illustrations/<slug>.svg of the same aspect.
   Each silhouette returns an inline SVG with a striped fill pattern. */

window.Silhouette = function Silhouette({ slug, era, label = "illustration" }) {
  // Pick one of a few abstract body silhouettes by sizeBucket/diet hint.
  const bodies = {
    huge: "M 40 220 Q 60 110 200 130 Q 360 110 460 90 Q 540 80 560 130 Q 580 160 540 175 Q 520 178 500 175 L 470 230 Q 460 245 445 240 L 430 235 L 415 220 Q 360 232 270 230 L 250 250 Q 240 260 225 252 L 215 240 Q 130 240 90 235 Q 50 230 40 220 Z",
    large: "M 60 200 Q 90 100 220 110 Q 360 110 450 130 Q 500 138 510 165 Q 520 190 480 195 L 450 240 Q 442 252 428 248 L 415 235 Q 320 240 235 235 L 215 250 Q 205 258 195 250 L 187 235 Q 110 235 80 225 Q 55 220 60 200 Z",
    medium: "M 80 195 Q 110 120 220 125 Q 330 125 410 140 Q 460 148 470 170 Q 478 192 450 200 L 425 235 Q 420 245 408 242 L 395 230 Q 320 235 250 232 L 230 248 Q 222 256 213 248 L 205 232 Q 130 232 100 220 Q 76 215 80 195 Z",
    small: "M 90 180 Q 130 130 220 132 Q 320 132 380 145 Q 420 152 425 175 Q 428 192 405 198 L 388 222 Q 384 230 374 228 L 365 218 Q 290 220 240 218 L 226 232 Q 220 240 212 232 L 206 220 Q 145 218 115 210 Q 88 205 90 180 Z",
    tiny: "M 130 175 Q 160 140 220 140 Q 290 140 340 152 Q 372 158 376 175 Q 378 188 360 192 L 348 212 Q 344 220 336 218 L 328 210 Q 280 212 244 210 L 234 222 Q 228 228 222 222 L 218 212 Q 175 210 152 202 Q 130 198 130 175 Z"
  };
  // legs
  const legs = "M 250 250 L 248 285 M 270 252 L 272 290 M 400 235 L 398 275 M 420 235 L 422 280";

  const dino = window.DINOSAURS.find(d => d.slug === slug);
  const bucket = dino ? dino.sizeBucket : "medium";
  const path = bodies[bucket] || bodies.medium;

  const eraColor = {
    Triassic:   "oklch(0.55 0.11 30)",   /* red-bed sandstone */
    Jurassic:   "oklch(0.65 0.06 130)",  /* sage / Morrison shale */
    Cretaceous: "oklch(0.60 0.07 240)"   /* chalk-blue limestone */
  }[era] || "oklch(0.4 0.03 60)";

  const stripeId = `stripe-${slug}`;

  return (
    <>
      <svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet"
           style={{ width: "82%", height: "82%" }}>
        <defs>
          <pattern id={stripeId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={eraColor} opacity="0.18" />
            <rect width="3" height="6" fill={eraColor} opacity="0.32" />
          </pattern>
        </defs>
        <path d={path} fill={`url(#${stripeId})`} stroke={eraColor} strokeOpacity="0.55" strokeWidth="1.2" />
        <path d={legs} fill="none" stroke={eraColor} strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="silhouette-caption">{label} · {slug}.svg</div>
    </>
  );
};
