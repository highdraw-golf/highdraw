import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function evalCubic(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
  const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
  const dx = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  const len = Math.hypot(dx, dy) || 1;
  return { x, y, tx: dx / len, ty: dy / len, nx: -dy / len, ny: dx / len };
}

function pointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function segIntersect(a1, a2, b1, b2) {
  const dax = a2.x - a1.x, day = a2.y - a1.y;
  const dbx = b2.x - b1.x, dby = b2.y - b1.y;
  const denom = dax * dby - day * dbx;
  if (Math.abs(denom) < 1e-9) return null;
  const s = ((b1.x - a1.x) * dby - (b1.y - a1.y) * dbx) / denom;
  const t = ((b1.x - a1.x) * day - (b1.y - a1.y) * dax) / denom;
  if (s >= -1e-7 && s <= 1 + 1e-7 && t >= -1e-7 && t <= 1 + 1e-7) {
    return {
      s: Math.max(0, Math.min(1, s)),
      t: Math.max(0, Math.min(1, t)),
      x: a1.x + s * dax,
      y: a1.y + s * day,
    };
  }
  return null;
}

function signedArea(poly) {
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const p1 = poly[i], p2 = poly[(i + 1) % poly.length];
    area += p1.x * p2.y - p2.x * p1.y;
  }
  return area * 0.5;
}

/**
 * Exact 2D Polygon Boolean Subtraction (subjectPoly MINUS clipPoly)
 * Produces true transparent negative-space vector cutouts with zero background-colored strokes!
 */
function subtractPolygon(rawSubject, rawClip) {
  const subjectPoly = signedArea(rawSubject) < 0 ? rawSubject.slice().reverse() : rawSubject;
  const clipPoly = signedArea(rawClip) < 0 ? rawClip.slice().reverse() : rawClip;
  const subjSplits = subjectPoly.map(() => [0, 1]);
  const clipSplits = clipPoly.map(() => [0, 1]);

  for (let i = 0; i < subjectPoly.length; i++) {
    const a1 = subjectPoly[i];
    const a2 = subjectPoly[(i + 1) % subjectPoly.length];
    for (let j = 0; j < clipPoly.length; j++) {
      const b1 = clipPoly[j];
      const b2 = clipPoly[(j + 1) % clipPoly.length];
      const hit = segIntersect(a1, a2, b1, b2);
      if (hit) {
        subjSplits[i].push(hit.s);
        clipSplits[j].push(hit.t);
      }
    }
  }

  const directedEdges = [];

  for (let i = 0; i < subjectPoly.length; i++) {
    const a1 = subjectPoly[i];
    const a2 = subjectPoly[(i + 1) % subjectPoly.length];
    const ts = subjSplits[i].sort((a, b) => a - b);
    for (let k = 0; k < ts.length - 1; k++) {
      const t0 = ts[k], t1 = ts[k + 1];
      if (t1 - t0 < 1e-5) continue;
      const tm = 0.5 * (t0 + t1);
      const mid = { x: a1.x + tm * (a2.x - a1.x), y: a1.y + tm * (a2.y - a1.y) };
      if (!pointInPoly(mid, clipPoly)) {
        directedEdges.push({
          p0: { x: a1.x + t0 * (a2.x - a1.x), y: a1.y + t0 * (a2.y - a1.y) },
          p1: { x: a1.x + t1 * (a2.x - a1.x), y: a1.y + t1 * (a2.y - a1.y) },
          used: false,
        });
      }
    }
  }

  for (let j = 0; j < clipPoly.length; j++) {
    const b1 = clipPoly[j];
    const b2 = clipPoly[(j + 1) % clipPoly.length];
    const ts = clipSplits[j].sort((a, b) => a - b);
    for (let k = 0; k < ts.length - 1; k++) {
      const t0 = ts[k], t1 = ts[k + 1];
      if (t1 - t0 < 1e-5) continue;
      const tm = 0.5 * (t0 + t1);
      const mid = { x: b1.x + tm * (b2.x - b1.x), y: b1.y + tm * (b2.y - b1.y) };
      if (pointInPoly(mid, subjectPoly)) {
        // Reversed direction for subtraction boundary!
        directedEdges.push({
          p0: { x: b1.x + t1 * (b2.x - b1.x), y: b1.y + t1 * (b2.y - b1.y) },
          p1: { x: b1.x + t0 * (b2.x - b1.x), y: b1.y + t0 * (b2.y - b1.y) },
          used: false,
        });
      }
    }
  }

  const loops = [];
  for (let i = 0; i < directedEdges.length; i++) {
    if (directedEdges[i].used) continue;
    const loop = [directedEdges[i].p0, directedEdges[i].p1];
    directedEdges[i].used = true;
    while (true) {
      const curr = loop[loop.length - 1];
      if (Math.hypot(curr.x - loop[0].x, curr.y - loop[0].y) < 0.05 && loop.length > 2) {
        break;
      }
      let bestIdx = -1;
      let bestDist = 0.5;
      for (let j = 0; j < directedEdges.length; j++) {
        if (directedEdges[j].used) continue;
        const d = Math.hypot(curr.x - directedEdges[j].p0.x, curr.y - directedEdges[j].p0.y);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = j;
        }
      }
      if (bestIdx === -1) break;
      directedEdges[bestIdx].used = true;
      loop.push(directedEdges[bestIdx].p1);
    }
    if (loop.length >= 3) loops.push(loop);
  }

  return loops
    .map(
      (loop) =>
        `M ${loop[0].x.toFixed(2)} ${loop[0].y.toFixed(2)} ` +
        loop
          .slice(1)
          .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
          .join(' ') +
        ' Z'
    )
    .join(' ');
}

/**
 * Generates polygon points for the Tracer Ribbon (with optional radial expansion `pad` for negative-space cutout)
 */
function buildTracerPolygon({
  launch = { x: 292, y: 782 },
  c1 = { x: 405, y: 615 },
  c2 = { x: 534, y: 392 },
  apex = { x: 422, y: 172 },
  c3 = { x: 358, y: 46 },
  c4 = { x: 296, y: 168 },
  tip = { x: 270, y: 392 },
  wStart = 28,
  wApex = 20,
  wEnd = 4.5,
  pad = 0,
} = {}) {
  const N = 110;
  const pts = [];
  const uStart = pad > 0 ? -0.02 : 0;
  const uEnd = pad > 0 ? 1.01 : 1.0;

  for (let i = 0; i <= N; i++) {
    const u = uStart + (uEnd - uStart) * (i / N);
    let pt;
    if (u <= 0.56) {
      const t = u / 0.56;
      pt = evalCubic(launch, c1, c2, apex, t);
    } else {
      const t = (u - 0.56) / 0.44;
      pt = evalCubic(apex, c3, c4, tip, t);
    }
    const uClamped = Math.max(0, Math.min(1, u));
    let w;
    if (uClamped < 0.56) {
      const s = uClamped / 0.56;
      w = wStart + (wApex - wStart) * (s * s * (3 - 2 * s));
    } else {
      const s = Math.min(1, Math.max(0, (uClamped - 0.56) / 0.44));
      w = wApex * Math.pow(Math.max(0, 1 - s), 1.15) + wEnd * s;
    }
    pts.push({ ...pt, hw: w / 2 + pad });
  }

  const leftPts = pts.map((p) => ({ x: p.x + p.nx * p.hw, y: p.y + p.ny * p.hw }));
  const rightPts = pts
    .slice()
    .reverse()
    .map((p) => ({ x: p.x - p.nx * p.hw, y: p.y - p.ny * p.hw }));

  // Add rounded tip cap points
  const tipPt = pts[pts.length - 1];
  const tipCap = [];
  for (let k = 1; k <= 5; k++) {
    const ang = (k / 6) * Math.PI;
    const cx = tipPt.x + (tipPt.nx * Math.cos(ang) + tipPt.tx * Math.sin(ang)) * tipPt.hw;
    const cy = tipPt.y + (tipPt.ny * Math.cos(ang) + tipPt.ty * Math.sin(ang)) * tipPt.hw;
    tipCap.push({ x: cx, y: cy });
  }

  // Add rounded launch cap points so the bottom-left tee launch is sculpted and organic (not a blocky butt cap!)
  const startPt = pts[0];
  const startCap = [];
  for (let k = 1; k <= 7; k++) {
    const ang = (k / 8) * Math.PI;
    const cx = startPt.x + (-startPt.nx * Math.cos(ang) - startPt.tx * Math.sin(ang)) * startPt.hw;
    const cy = startPt.y + (-startPt.ny * Math.cos(ang) - startPt.ty * Math.sin(ang)) * startPt.hw;
    startCap.push({ x: cx, y: cy });
  }

  return [...leftPts, ...tipCap, ...rightPts, ...startCap];
}

function polyToPath(poly) {
  return (
    `M ${poly[0].x.toFixed(2)} ${poly[0].y.toFixed(2)} ` +
    poly
      .slice(1)
      .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ') +
    ' Z'
  );
}

/**
 * Generates polygon points for a luxury bracketed serif pillar
 */
function buildSerifPillarPoly(cx, topY, botY, stemW = 42, serifExt = 22, serifThick = 11, bracketH = 28) {
  const hw = stemW / 2;
  const sw = hw + serifExt;
  const t0 = topY;
  const t1 = topY + serifThick;
  const t2 = t1 + bracketH;
  const b0 = botY;
  const b1 = botY - serifThick;
  const b2 = b1 - bracketH;

  const pts = [];
  const sampleBez = (p0, p1, p2, p3, steps = 12) => {
    for (let i = 0; i <= steps; i++) {
      const p = evalCubic(p0, p1, p2, p3, i / steps);
      pts.push({ x: p.x, y: p.y });
    }
  };

  pts.push({ x: cx - sw, y: t0 });
  pts.push({ x: cx + sw, y: t0 });
  sampleBez(
    { x: cx + sw, y: t1 },
    { x: cx + hw + serifExt * 0.22, y: t1 },
    { x: cx + hw, y: t1 + bracketH * 0.38 },
    { x: cx + hw, y: t2 }
  );
  sampleBez(
    { x: cx + hw, y: b2 },
    { x: cx + hw, y: b1 - bracketH * 0.38 },
    { x: cx + hw + serifExt * 0.22, y: b1 },
    { x: cx + sw, y: b1 }
  );
  pts.push({ x: cx + sw, y: b0 });
  pts.push({ x: cx - sw, y: b0 });
  sampleBez(
    { x: cx - sw, y: b1 },
    { x: cx - hw - serifExt * 0.22, y: b1 },
    { x: cx - hw, y: b1 - bracketH * 0.38 },
    { x: cx - hw, y: b2 }
  );
  sampleBez(
    { x: cx - hw, y: t2 },
    { x: cx - hw, y: t1 + bracketH * 0.38 },
    { x: cx - hw - serifExt * 0.22, y: t1 },
    { x: cx - sw, y: t1 }
  );
  return pts;
}

function buildSerifD(stemCx, topY, botY, stemW = 42, serifExt = 22, serifThick = 11, bracketH = 28, bowlWidth = 224, crescentW = 46, hairline = 15) {
  const hw = stemW / 2;
  const sw = hw + serifExt;
  const leftEdge = stemCx - hw;
  const rightStemEdge = stemCx + hw;
  const outerRightX = leftEdge + bowlWidth;
  const innerRightX = outerRightX - crescentW;
  const midY = (topY + botY) / 2;
  const h = botY - topY;

  const t0 = topY;
  const t1 = topY + serifThick;
  const t2 = t1 + bracketH;
  const b0 = botY;
  const b1 = botY - serifThick;
  const b2 = b1 - bracketH;

  const outer = [
    `M ${stemCx - sw} ${t0}`,
    `L ${stemCx + bowlWidth * 0.35} ${t0}`,
    `C ${stemCx + bowlWidth * 0.78} ${t0}, ${outerRightX} ${topY + h * 0.17}, ${outerRightX} ${midY}`,
    `C ${outerRightX} ${botY - h * 0.17}, ${stemCx + bowlWidth * 0.78} ${b0}, ${stemCx + bowlWidth * 0.35} ${b0}`,
    `L ${stemCx - sw} ${b0}`,
    `L ${stemCx - sw} ${b1}`,
    `C ${leftEdge - serifExt * 0.22} ${b1}, ${leftEdge} ${b1 - bracketH * 0.38}, ${leftEdge} ${b2}`,
    `L ${leftEdge} ${t2}`,
    `C ${leftEdge} ${t1 + bracketH * 0.38}, ${leftEdge - serifExt * 0.22} ${t1}, ${stemCx - sw} ${t1}`,
    `Z`,
  ].join(' ');

  const innerTopY = topY + hairline;
  const innerBotY = botY - hairline;
  const innerBrace = 20;
  const inner = [
    `M ${rightStemEdge} ${innerTopY + innerBrace}`,
    `C ${rightStemEdge} ${innerTopY + 4}, ${rightStemEdge + 8} ${innerTopY}, ${rightStemEdge + 24} ${innerTopY}`,
    `L ${stemCx + bowlWidth * 0.31} ${innerTopY}`,
    `C ${stemCx + bowlWidth * 0.65} ${innerTopY}, ${innerRightX} ${topY + h * 0.20}, ${innerRightX} ${midY}`,
    `C ${innerRightX} ${botY - h * 0.20}, ${stemCx + bowlWidth * 0.65} ${innerBotY}, ${stemCx + bowlWidth * 0.31} ${innerBotY}`,
    `L ${rightStemEdge + 24} ${innerBotY}`,
    `C ${rightStemEdge + 8} ${innerBotY}, ${rightStemEdge} ${innerBotY - 4}, ${rightStemEdge} ${innerBotY - innerBrace}`,
    `Z`,
  ].join(' ');

  return `${outer} ${inner}`;
}

export function generateHDLogoSVG({
  variant = 'classic', // 'classic' | 'crossbar' | 'flagstick'
  monogramColor = '#1C2C24',
  tracerColor = '#38BDF8',
  cupColor = '#1C2C24',
  flagColor = '#B12535',
  useCutout = true,
  background = null,
} = {}) {
  const topY = 270;
  const botY = 740;
  const hLeftX = 358;
  const hRightX = 492;
  const dStemX = 602;

  const hLeftPoly = buildSerifPillarPoly(hLeftX, topY, botY);
  const hRightPoly = buildSerifPillarPoly(hRightX, topY, botY);
  const crossbarPoly = [
    { x: hLeftX + 18, y: 494 },
    { x: hRightX - 18, y: 494 },
    { x: hRightX - 18, y: 509 },
    { x: hLeftX + 18, y: 509 },
  ];

  const tracerPoly = buildTracerPolygon({ pad: 0 });
  const cutoutPoly = buildTracerPolygon({ pad: 7.5 });

  const hLeftPath = useCutout ? subtractPolygon(hLeftPoly, cutoutPoly) : polyToPath(hLeftPoly);
  const hRightPath = useCutout ? subtractPolygon(hRightPoly, cutoutPoly) : polyToPath(hRightPoly);
  const crossbarPath =
    variant === 'crossbar'
      ? useCutout
        ? subtractPolygon(crossbarPoly, cutoutPoly)
        : polyToPath(crossbarPoly)
      : '';

  const dPath = buildSerifD(dStemX, topY, botY);
  const tracerPath = polyToPath(tracerPoly);

  const cupCx = variant === 'flagstick' ? 236 : 262;
  const cupCy = 442;
  const cupRx = 33;
  const cupRy = 11;

  const cupElement =
    variant === 'flagstick'
      ? `<g id="Golf-Cup-and-Pin">
          <ellipse id="Golf-Cup" cx="${cupCx}" cy="${cupCy}" rx="${cupRx}" ry="${cupRy}" fill="${cupColor}" />
          <rect id="Pin-Shaft" x="${cupCx - 3.5}" y="${cupCy - 142}" width="7" height="142" rx="3.5" fill="${cupColor}" />
          <path id="Pin-Flag" d="M ${cupCx - 4} ${cupCy - 138} C ${cupCx - 28} ${cupCy - 140}, ${cupCx - 46} ${cupCy - 122}, ${cupCx - 68} ${cupCy - 120} C ${cupCx - 46} ${cupCy - 108}, ${cupCx - 28} ${cupCy - 100}, ${cupCx - 4} ${cupCy - 98} Z" fill="${flagColor}" />
        </g>`
      : `<g id="Golf-Cup-Target">
          <ellipse id="Golf-Cup" cx="${cupCx}" cy="${cupCy}" rx="${cupRx}" ry="${cupRy}" fill="${cupColor}" />
        </g>`;

  const bgRect = background
    ? `<rect id="Background" width="1024" height="1024" rx="48" fill="${background}" />`
    : '';

  const crossbarElement = crossbarPath
    ? `<path id="H-Crossbar" d="${crossbarPath}" fill="${monogramColor}" />`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" fill="none">
  <title>High Draw Golf — HD Monogram &amp; Ball Flight Tracer</title>
  <desc>Editable multi-layer vector logo for Figma &amp; Sketch. Every group (Monogram-HD, Golf-Cup-Target, Ball-Flight-Tracer) has independent fill colors and true transparent negative-space cutouts.</desc>
  ${bgRect}
  <g id="High-Draw-Logo">
    <g id="Monogram-HD" fill="${monogramColor}">
      <g id="Letter-H" fill="${monogramColor}">
        <path id="H-Left-Pillar" d="${hLeftPath}" fill="${monogramColor}" />
        <path id="H-Right-Pillar" d="${hRightPath}" fill="${monogramColor}" />
        ${crossbarElement}
      </g>
      <path id="Letter-D" d="${dPath}" fill-rule="evenodd" clip-rule="evenodd" fill="${monogramColor}" />
    </g>
    ${cupElement}
    <g id="Ball-Flight-Tracer" fill="${tracerColor}">
      <path id="Tracer-Arc" d="${tracerPath}" fill="${tracerColor}" />
    </g>
  </g>
</svg>`;
}

async function renderAllAssets() {
  const outDir = 'public/assets/brand/hd-monogram';
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Save Master Editable SVGs (Transparent Background — Ready to drag & drop into Figma / Sketch!)
  const presets = [
    {
      name: 'hd_monogram_classic_cypress_cyan',
      variant: 'classic',
      monogramColor: '#1C2C24',
      tracerColor: '#38BDF8',
      cupColor: '#1C2C24',
    },
    {
      name: 'hd_monogram_crossbar_cypress_cyan',
      variant: 'crossbar',
      monogramColor: '#1C2C24',
      tracerColor: '#38BDF8',
      cupColor: '#1C2C24',
    },
    {
      name: 'hd_monogram_flagstick_cypress_cyan',
      variant: 'flagstick',
      monogramColor: '#1C2C24',
      tracerColor: '#38BDF8',
      cupColor: '#1C2C24',
      flagColor: '#B12535',
    },
    {
      name: 'hd_monogram_classic_navy_gold',
      variant: 'classic',
      monogramColor: '#1E293B',
      tracerColor: '#D4AF37',
      cupColor: '#1E293B',
    },
    {
      name: 'hd_monogram_crossbar_navy_gold',
      variant: 'crossbar',
      monogramColor: '#1E293B',
      tracerColor: '#D4AF37',
      cupColor: '#1E293B',
    },
    {
      name: 'hd_monogram_classic_white_cyan',
      variant: 'classic',
      monogramColor: '#FFFFFF',
      tracerColor: '#38BDF8',
      cupColor: '#FFFFFF',
    },
    {
      name: 'hd_monogram_crossbar_white_gold',
      variant: 'crossbar',
      monogramColor: '#FFFFFF',
      tracerColor: '#D4AF37',
      cupColor: '#D4AF37',
    },
    {
      name: 'hd_monogram_classic_onyx_cyan',
      variant: 'classic',
      monogramColor: '#111827',
      tracerColor: '#0EA5E9',
      cupColor: '#111827',
    },
  ];

  for (const p of presets) {
    const svgTransparent = generateHDLogoSVG({ ...p, background: null });
    fs.writeFileSync(path.join(outDir, `${p.name}.svg`), svgTransparent, 'utf8');
    await sharp(Buffer.from(svgTransparent))
      .resize(2048, 2048)
      .png()
      .toFile(path.join(outDir, `${p.name}.png`));
  }

  // 2. Also export SEPARATED LAYER PNGs (2048x2048 transparent, 1:1 registered coordinates)
  // so even if the user imports PNGs into Figma/Sketch, they can stack Layer 1 + Layer 2 + Layer 3 and tint each layer independently!
  const topY = 270, botY = 740, hLeftX = 358, hRightX = 492, dStemX = 602;
  const cutoutPoly = buildTracerPolygon({ pad: 7.5 });
  const hLeftPath = subtractPolygon(buildSerifPillarPoly(hLeftX, topY, botY), cutoutPoly);
  const hRightPath = subtractPolygon(buildSerifPillarPoly(hRightX, topY, botY), cutoutPoly);
  const crossbarPath = subtractPolygon([
    { x: hLeftX + 18, y: 494 },
    { x: hRightX - 18, y: 494 },
    { x: hRightX - 18, y: 509 },
    { x: hLeftX + 18, y: 509 },
  ], cutoutPoly);
  const dPath = buildSerifD(dStemX, topY, botY);
  const tracerPath = polyToPath(buildTracerPolygon({ pad: 0 }));

  const wrapLayerSvg = (inner) =>
    `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" fill="none">${inner}</svg>`;

  const layer1MonogramClassicSvg = wrapLayerSvg(
    `<g id="Layer-1-Monogram-HD" fill="#1C2C24"><path d="${hLeftPath}"/><path d="${hRightPath}"/><path d="${dPath}" fill-rule="evenodd"/></g>`
  );
  const layer1MonogramCrossbarSvg = wrapLayerSvg(
    `<g id="Layer-1-Monogram-HD-Crossbar" fill="#1C2C24"><path d="${hLeftPath}"/><path d="${hRightPath}"/><path d="${crossbarPath}"/><path d="${dPath}" fill-rule="evenodd"/></g>`
  );
  const layer2TracerSvg = wrapLayerSvg(
    `<g id="Layer-2-Ball-Flight-Tracer" fill="#38BDF8"><path d="${tracerPath}"/></g>`
  );
  const layer3CupSvg = wrapLayerSvg(
    `<g id="Layer-3-Golf-Cup" fill="#1C2C24"><ellipse cx="262" cy="442" rx="33" ry="11"/></g>`
  );

  await sharp(Buffer.from(layer1MonogramClassicSvg)).resize(2048, 2048).png().toFile(path.join(outDir, 'layer_1_monogram_hd_classic.png'));
  await sharp(Buffer.from(layer1MonogramCrossbarSvg)).resize(2048, 2048).png().toFile(path.join(outDir, 'layer_1_monogram_hd_crossbar.png'));
  await sharp(Buffer.from(layer2TracerSvg)).resize(2048, 2048).png().toFile(path.join(outDir, 'layer_2_ball_flight_tracer.png'));
  await sharp(Buffer.from(layer3CupSvg)).resize(2048, 2048).png().toFile(path.join(outDir, 'layer_3_golf_cup_target.png'));

  // 3. Render presentation cards on light/dark backgrounds for visual inspection
  await sharp(Buffer.from(generateHDLogoSVG({
    variant: 'classic',
    monogramColor: '#1C2C24',
    tracerColor: '#38BDF8',
    cupColor: '#1C2C24',
    useCutout: true,
    background: '#FFFFFF',
  }))).resize(1024, 1024).png().toFile(path.join(outDir, 'card_classic_light.png'));

  await sharp(Buffer.from(generateHDLogoSVG({
    variant: 'crossbar',
    monogramColor: '#1C2C24',
    tracerColor: '#38BDF8',
    cupColor: '#1C2C24',
    useCutout: true,
    background: '#F9F8F6',
  }))).resize(1024, 1024).png().toFile(path.join(outDir, 'card_crossbar_alabaster.png'));

  await sharp(Buffer.from(generateHDLogoSVG({
    variant: 'crossbar',
    monogramColor: '#FFFFFF',
    tracerColor: '#D4AF37',
    cupColor: '#D4AF37',
    useCutout: true,
    background: '#1C2C24',
  }))).resize(1024, 1024).png().toFile(path.join(outDir, 'card_crossbar_cypress_gold.png'));

  await sharp(Buffer.from(generateHDLogoSVG({
    variant: 'flagstick',
    monogramColor: '#FFFFFF',
    tracerColor: '#38BDF8',
    cupColor: '#FFFFFF',
    flagColor: '#B12535',
    useCutout: true,
    background: '#1E293B',
  }))).resize(1024, 1024).png().toFile(path.join(outDir, 'card_flagstick_navy.png'));

  console.log('✓ Generated all editable SVGs, 2048px PNG lockups, and separated layer PNGs!');
}

renderAllAssets();
