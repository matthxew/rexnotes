/* Coloring page generator — produces a printable PDF on the fly via a
   minimal hand-rolled PDF writer. No deps. Outputs an outline of the
   silhouette on a US Letter page with a title and credit line. */

window.generateColoringPDF = function generateColoringPDF(dino) {
  // US Letter, 612 x 792 pt
  const W = 612, H = 792;
  // Take silhouette path from Silhouette body table and scale to page.
  const bodies = {
    huge:   "M 40 220 Q 60 110 200 130 Q 360 110 460 90 Q 540 80 560 130 Q 580 160 540 175 Q 520 178 500 175 L 470 230 Q 460 245 445 240 L 430 235 L 415 220 Q 360 232 270 230 L 250 250 Q 240 260 225 252 L 215 240 Q 130 240 90 235 Q 50 230 40 220 Z",
    large:  "M 60 200 Q 90 100 220 110 Q 360 110 450 130 Q 500 138 510 165 Q 520 190 480 195 L 450 240 Q 442 252 428 248 L 415 235 Q 320 240 235 235 L 215 250 Q 205 258 195 250 L 187 235 Q 110 235 80 225 Q 55 220 60 200 Z",
    medium: "M 80 195 Q 110 120 220 125 Q 330 125 410 140 Q 460 148 470 170 Q 478 192 450 200 L 425 235 Q 420 245 408 242 L 395 230 Q 320 235 250 232 L 230 248 Q 222 256 213 248 L 205 232 Q 130 232 100 220 Q 76 215 80 195 Z",
    small:  "M 90 180 Q 130 130 220 132 Q 320 132 380 145 Q 420 152 425 175 Q 428 192 405 198 L 388 222 Q 384 230 374 228 L 365 218 Q 290 220 240 218 L 226 232 Q 220 240 212 232 L 206 220 Q 145 218 115 210 Q 88 205 90 180 Z",
    tiny:   "M 130 175 Q 160 140 220 140 Q 290 140 340 152 Q 372 158 376 175 Q 378 188 360 192 L 348 212 Q 344 220 336 218 L 328 210 Q 280 212 244 210 L 234 222 Q 228 228 222 222 L 218 212 Q 175 210 152 202 Q 130 198 130 175 Z"
  };
  const legs = "M 250 250 L 248 285 M 270 252 L 272 290 M 400 235 L 398 275 M 420 235 L 422 280";
  const path = bodies[dino.sizeBucket] || bodies.medium;

  // Convert the SVG path (viewBox 600x320) to PDF coords. PDF Y is bottom-up.
  // Scale to fit width 470pt, centered.
  const targetW = 470;
  const scale = targetW / 600;
  const targetH = 320 * scale;
  const offsetX = (W - targetW) / 2;
  const offsetY = H - 240 - targetH; // sit below title

  function tx(x) { return offsetX + x * scale; }
  function ty(y) { return offsetY + (320 - y) * scale; }

  // Approximate Bezier from quadratic. PDF uses cubic. For a quad (x1,y1) ctrl,(x2,y2) end
  // from current (x0,y0): cubic = (x0 + 2/3*(x1-x0), ...), (x2 + 2/3*(x1-x2), ...), (x2, y2).
  function svgPathToPdf(d) {
    const out = [];
    // tokenize commands
    const tokens = d.match(/[A-Za-z]|-?\d+(?:\.\d+)?/g);
    let i = 0, cx = 0, cy = 0;
    let cmd = "";
    while (i < tokens.length) {
      const t = tokens[i];
      if (/[A-Za-z]/.test(t)) { cmd = t; i++; continue; }
      // numeric, take per current command
      if (cmd === "M" || cmd === "L") {
        const x = parseFloat(tokens[i]); const y = parseFloat(tokens[i+1]); i += 2;
        cx = x; cy = y;
        out.push(`${tx(x).toFixed(2)} ${ty(y).toFixed(2)} ${cmd === "M" ? "m" : "l"}`);
      } else if (cmd === "Q") {
        const x1 = parseFloat(tokens[i]);   const y1 = parseFloat(tokens[i+1]);
        const x2 = parseFloat(tokens[i+2]); const y2 = parseFloat(tokens[i+3]); i += 4;
        const c1x = cx + (2/3)*(x1 - cx), c1y = cy + (2/3)*(y1 - cy);
        const c2x = x2 + (2/3)*(x1 - x2), c2y = y2 + (2/3)*(y1 - y2);
        out.push(`${tx(c1x).toFixed(2)} ${ty(c1y).toFixed(2)} ${tx(c2x).toFixed(2)} ${ty(c2y).toFixed(2)} ${tx(x2).toFixed(2)} ${ty(y2).toFixed(2)} c`);
        cx = x2; cy = y2;
      } else if (cmd === "Z" || cmd === "z") {
        out.push("h"); // close path
        // continue parsing — Z has no args
      }
    }
    return out.join("\n");
  }

  const bodyOps = svgPathToPdf(path);
  // Legs are M..L pairs, parse simple
  const legSegs = legs.split("M").filter(Boolean).map(seg => {
    const m = seg.match(/-?\d+(?:\.\d+)?/g).map(parseFloat);
    return `${tx(m[0]).toFixed(2)} ${ty(m[1]).toFixed(2)} m ${tx(m[2]).toFixed(2)} ${ty(m[3]).toFixed(2)} l`;
  }).join("\n");

  // PDF text encoded WinAnsi. Strip non-ASCII to be safe.
  const safe = (s) => s.replace(/[^\x20-\x7E]/g, "");

  const title = safe(dino.name).toUpperCase();
  const sub = safe(`Coloring page · DinoSite Vol. 1`);
  const credit = safe(`${dino.pronunciation} · ${dino.era}`);

  const content = `
q
1 1 1 rg
0 0 ${W} ${H} re f
Q
q
0 0 0 RG
2.5 w
1 j 1 J
${bodyOps}
S
${legSegs}
S
Q
BT
/F1 26 Tf
0 0 0 rg
72 ${H - 90} Td
(${title}) Tj
ET
BT
/F2 11 Tf
0.4 0.4 0.4 rg
72 ${H - 112} Td
(${sub}) Tj
ET
BT
/F2 10 Tf
0.5 0.5 0.5 rg
72 60 Td
(${credit}) Tj
ET
BT
/F2 9 Tf
0.6 0.6 0.6 rg
72 44 Td
(dinosite.example  ·  print at 100% scale  ·  best on cardstock) Tj
ET
`;

  // Assemble minimal PDF
  const objects = [];
  function add(obj) { objects.push(obj); return objects.length; }
  // 1: catalog, 2: pages, 3: page, 4: contents, 5: F1, 6: F2
  const catalog = `<< /Type /Catalog /Pages 2 0 R >>`;
  const pages = `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`;
  const page = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`;
  const stream = content;
  const contents = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  const f1 = `<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>`;
  const f2 = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;

  const objs = [catalog, pages, page, contents, f1, f2];
  let pdf = "%PDF-1.4\n";
  const xref = [0];
  objs.forEach((obj, i) => {
    xref.push(pdf.length);
    pdf += `${i+1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objs.length; i++) {
    pdf += String(xref[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${dino.slug}-coloring-page.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};
