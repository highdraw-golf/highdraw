import React, { useState, useMemo } from 'react';
import { ArrowLeft, Copy, Check, Download, Layers, Sparkles, Sliders } from 'lucide-react';

interface LogoStudioPageProps {
  onBackToHome: () => void;
}

interface Pt {
  x: number;
  y: number;
}

function evalCubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number) {
  const mt = 1 - t;
  const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
  const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
  const dx = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  const len = Math.hypot(dx, dy) || 1;
  return { x, y, tx: dx / len, ty: dy / len, nx: -dy / len, ny: dx / len };
}

function pointInPoly(pt: Pt, poly: Pt[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function segIntersect(a1: Pt, a2: Pt, b1: Pt, b2: Pt) {
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
    };
  }
  return null;
}

function signedArea(poly: Pt[]) {
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const p1 = poly[i], p2 = poly[(i + 1) % poly.length];
    area += p1.x * p2.y - p2.x * p1.y;
  }
  return area * 0.5;
}

function subtractPolygon(rawSubject: Pt[], rawClip: Pt[]) {
  const subjectPoly = signedArea(rawSubject) < 0 ? rawSubject.slice().reverse() : rawSubject;
  const clipPoly = signedArea(rawClip) < 0 ? rawClip.slice().reverse() : rawClip;
  const subjSplits: number[][] = subjectPoly.map(() => [0, 1]);
  const clipSplits: number[][] = clipPoly.map(() => [0, 1]);

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

  const directedEdges: Array<{ p0: Pt; p1: Pt; used: boolean }> = [];

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
        directedEdges.push({
          p0: { x: b1.x + t1 * (b2.x - b1.x), y: b1.y + t1 * (b2.y - b1.y) },
          p1: { x: b1.x + t0 * (b2.x - b1.x), y: b1.y + t0 * (b2.y - b1.y) },
          used: false,
        });
      }
    }
  }

  const loops: Pt[][] = [];
  for (let i = 0; i < directedEdges.length; i++) {
    if (directedEdges[i].used) continue;
    const loop = [directedEdges[i].p0, directedEdges[i].p1];
    directedEdges[i].used = true;
    while (true) {
      const curr = loop[loop.length - 1];
      if (Math.hypot(curr.x - loop[0].x, curr.y - loop[0].y) < 0.05 && loop.length > 2) break;
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

function buildTracerPolygon(pad = 0): Pt[] {
  const launch = { x: 292, y: 782 };
  const c1 = { x: 405, y: 615 };
  const c2 = { x: 534, y: 392 };
  const apex = { x: 422, y: 172 };
  const c3 = { x: 358, y: 46 };
  const c4 = { x: 296, y: 168 };
  const tip = { x: 270, y: 392 };
  const wStart = 28, wApex = 20, wEnd = 4.5;

  const N = 110;
  const pts = [];
  const uStart = pad > 0 ? -0.02 : 0;
  const uEnd = pad > 0 ? 1.01 : 1.0;

  for (let i = 0; i <= N; i++) {
    const u = uStart + (uEnd - uStart) * (i / N);
    const pt = u <= 0.56 ? evalCubic(launch, c1, c2, apex, u / 0.56) : evalCubic(apex, c3, c4, tip, (u - 0.56) / 0.44);
    const uClamped = Math.max(0, Math.min(1, u));
    let w: number;
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
  const rightPts = pts.slice().reverse().map((p) => ({ x: p.x - p.nx * p.hw, y: p.y - p.ny * p.hw }));

  const tipPt = pts[pts.length - 1];
  const tipCap: Pt[] = [];
  for (let k = 1; k <= 5; k++) {
    const ang = (k / 6) * Math.PI;
    tipCap.push({
      x: tipPt.x + (tipPt.nx * Math.cos(ang) + tipPt.tx * Math.sin(ang)) * tipPt.hw,
      y: tipPt.y + (tipPt.ny * Math.cos(ang) + tipPt.ty * Math.sin(ang)) * tipPt.hw,
    });
  }

  const startPt = pts[0];
  const startCap: Pt[] = [];
  for (let k = 1; k <= 7; k++) {
    const ang = (k / 8) * Math.PI;
    startCap.push({
      x: startPt.x + (-startPt.nx * Math.cos(ang) - startPt.tx * Math.sin(ang)) * startPt.hw,
      y: startPt.y + (-startPt.ny * Math.cos(ang) - startPt.ty * Math.sin(ang)) * startPt.hw,
    });
  }

  return [...leftPts, ...tipCap, ...rightPts, ...startCap];
}

function polyToPath(poly: Pt[]) {
  return (
    `M ${poly[0].x.toFixed(2)} ${poly[0].y.toFixed(2)} ` +
    poly.slice(1).map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') +
    ' Z'
  );
}

function buildSerifPillarPoly(cx: number, topY: number, botY: number) {
  const stemW = 42, serifExt = 22, serifThick = 11, bracketH = 28;
  const hw = stemW / 2;
  const sw = hw + serifExt;
  const t0 = topY, t1 = topY + serifThick, t2 = t1 + bracketH;
  const b0 = botY, b1 = botY - serifThick, b2 = b1 - bracketH;

  const pts: Pt[] = [];
  const sampleBez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, steps = 12) => {
    for (let i = 0; i <= steps; i++) {
      const p = evalCubic(p0, p1, p2, p3, i / steps);
      pts.push({ x: p.x, y: p.y });
    }
  };

  pts.push({ x: cx - sw, y: t0 });
  pts.push({ x: cx + sw, y: t0 });
  sampleBez({ x: cx + sw, y: t1 }, { x: cx + hw + serifExt * 0.22, y: t1 }, { x: cx + hw, y: t1 + bracketH * 0.38 }, { x: cx + hw, y: t2 });
  sampleBez({ x: cx + hw, y: b2 }, { x: cx + hw, y: b1 - bracketH * 0.38 }, { x: cx + hw + serifExt * 0.22, y: b1 }, { x: cx + sw, y: b1 });
  pts.push({ x: cx + sw, y: b0 });
  pts.push({ x: cx - sw, y: b0 });
  sampleBez({ x: cx - sw, y: b1 }, { x: cx - hw - serifExt * 0.22, y: b1 }, { x: cx - hw, y: b1 - bracketH * 0.38 }, { x: cx - hw, y: b2 });
  sampleBez({ x: cx - hw, y: t2 }, { x: cx - hw, y: t1 + bracketH * 0.38 }, { x: cx - hw - serifExt * 0.22, y: t1 }, { x: cx - sw, y: t1 });
  return pts;
}

function buildSerifD(stemCx: number, topY: number, botY: number) {
  const stemW = 42, serifExt = 22, serifThick = 11, bracketH = 28, bowlWidth = 224, crescentW = 46, hairline = 15;
  const hw = stemW / 2;
  const sw = hw + serifExt;
  const leftEdge = stemCx - hw;
  const rightStemEdge = stemCx + hw;
  const outerRightX = leftEdge + bowlWidth;
  const innerRightX = outerRightX - crescentW;
  const midY = (topY + botY) / 2;
  const h = botY - topY;
  const t0 = topY, t1 = topY + serifThick, t2 = t1 + bracketH;
  const b0 = botY, b1 = botY - serifThick, b2 = b1 - bracketH;

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

const BRAND_SWATCHES = [
  { name: 'Cypress Green', hex: '#1C2C24' },
  { name: 'Cyan Tracer', hex: '#38BDF8' },
  { name: 'Championship Gold', hex: '#D4AF37' },
  { name: 'Midnight Navy', hex: '#1E293B' },
  { name: 'Tour Crimson', hex: '#B12535' },
  { name: 'Onyx Black', hex: '#111827' },
  { name: 'Pure White', hex: '#FFFFFF' },
];

export const LogoStudioPage: React.FC<LogoStudioPageProps> = ({ onBackToHome }) => {
  const [variant, setVariant] = useState<'crossbar' | 'classic' | 'flagstick'>('crossbar');
  const [monogramColor, setMonogramColor] = useState('#1C2C24');
  const [tracerColor, setTracerColor] = useState('#38BDF8');
  const [cupColor, setCupColor] = useState('#1C2C24');
  const [flagColor, setFlagColor] = useState('#B12535');
  const [useCutout, setUseCutout] = useState(true);
  const [canvasBg, setCanvasBg] = useState<string>('transparent');
  const [copiedSvg, setCopiedSvg] = useState(false);

  const paths = useMemo(() => {
    const topY = 270, botY = 740, hLeftX = 358, hRightX = 492, dStemX = 602;
    const hLeftPoly = buildSerifPillarPoly(hLeftX, topY, botY);
    const hRightPoly = buildSerifPillarPoly(hRightX, topY, botY);
    const crossbarPoly = [
      { x: hLeftX + 18, y: 494 },
      { x: hRightX - 18, y: 494 },
      { x: hRightX - 18, y: 509 },
      { x: hLeftX + 18, y: 509 },
    ];
    const tracerPoly = buildTracerPolygon(0);
    const cutoutPoly = buildTracerPolygon(7.5);

    return {
      hLeftPath: useCutout ? subtractPolygon(hLeftPoly, cutoutPoly) : polyToPath(hLeftPoly),
      hRightPath: useCutout ? subtractPolygon(hRightPoly, cutoutPoly) : polyToPath(hRightPoly),
      crossbarPath: useCutout ? subtractPolygon(crossbarPoly, cutoutPoly) : polyToPath(crossbarPoly),
      dPath: buildSerifD(dStemX, topY, botY),
      tracerPath: polyToPath(tracerPoly),
    };
  }, [useCutout]);

  const cupCx = variant === 'flagstick' ? 236 : 262;
  const cupCy = 442;

  const buildSvgMarkup = (includeBackground = false) => {
    const bgLayer =
      includeBackground && canvasBg !== 'transparent'
        ? `  <rect id="Background" width="1024" height="1024" rx="48" fill="${canvasBg}" />\n`
        : '';
    const crossbarMarkup =
      variant === 'crossbar'
        ? `\n        <path id="H-Crossbar" d="${paths.crossbarPath}" fill="${monogramColor}" />`
        : '';
    const cupMarkup =
      variant === 'flagstick'
        ? `    <g id="Golf-Cup-and-Pin">
      <ellipse id="Golf-Cup" cx="${cupCx}" cy="${cupCy}" rx="33" ry="11" fill="${cupColor}" />
      <rect id="Pin-Shaft" x="${cupCx - 3.5}" y="${cupCy - 142}" width="7" height="142" rx="3.5" fill="${cupColor}" />
      <path id="Pin-Flag" d="M ${cupCx - 4} ${cupCy - 138} C ${cupCx - 28} ${cupCy - 140}, ${cupCx - 46} ${cupCy - 122}, ${cupCx - 68} ${cupCy - 120} C ${cupCx - 46} ${cupCy - 108}, ${cupCx - 28} ${cupCy - 100}, ${cupCx - 4} ${cupCy - 98} Z" fill="${flagColor}" />
    </g>`
        : `    <g id="Golf-Cup-Target" fill="${cupColor}">
      <ellipse id="Golf-Cup" cx="${cupCx}" cy="${cupCy}" rx="33" ry="11" fill="${cupColor}" />
    </g>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" fill="none">
  <title>High Draw Golf — HD Monogram &amp; Ball Flight Tracer</title>
  <desc>Editable multi-layer vector logo for Figma &amp; Sketch. Paste directly into Figma or Sketch (Cmd+V) to control every layer's color independently.</desc>
${bgLayer}  <g id="High-Draw-Logo">
    <g id="Monogram-HD" fill="${monogramColor}">
      <g id="Letter-H" fill="${monogramColor}">
        <path id="H-Left-Pillar" d="${paths.hLeftPath}" fill="${monogramColor}" />
        <path id="H-Right-Pillar" d="${paths.hRightPath}" fill="${monogramColor}" />${crossbarMarkup}
      </g>
      <path id="Letter-D" d="${paths.dPath}" fill-rule="evenodd" clip-rule="evenodd" fill="${monogramColor}" />
    </g>
${cupMarkup}
    <g id="Ball-Flight-Tracer" fill="${tracerColor}">
      <path id="Tracer-Arc" d="${paths.tracerPath}" fill="${tracerColor}" />
    </g>
  </g>
</svg>`;
  };

  const handleCopySvgForFigma = async () => {
    const svgText = buildSvgMarkup(false);
    await navigator.clipboard.writeText(svgText);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2200);
  };

  const handleDownloadSvg = () => {
    const svgText = buildSvgMarkup(false);
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `highdraw_hd_${variant}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = (withBg = false) => {
    const svgText = buildSvgMarkup(withBg);
    const img = new Image();
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 2048, 2048);
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `highdraw_hd_${variant}_2048px${withBg ? '_card' : '_transparent'}.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
          }
        }, 'image/png');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const applyThemePreset = (preset: { mono: string; tracer: string; cup: string; flag?: string; bg: string }) => {
    setMonogramColor(preset.mono);
    setTracerColor(preset.tracer);
    setCupColor(preset.cup);
    if (preset.flag) setFlagColor(preset.flag);
    setCanvasBg(preset.bg);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1F26]">
      {/* Header Banner */}
      <div className="bg-[#1C2C24] text-white py-12 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>BACK TO STOREFRONT</span>
            </button>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#38BDF8]" />
              <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                BRAND IDENTITY SYSTEM &bull; FIGMA / SKETCH VECTOR STUDIO
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">
              The High Draw &ldquo;HD&rdquo; Monogram Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Engineered with bespoke bracketed editorial serifs, true boolean negative-space cutouts, and a variable-taper ballistic High Draw shot tracer. Control every element&rsquo;s color independently and paste directly into Figma or Sketch (<code className="text-[#38BDF8]">Cmd+V</code>) as editable vector layers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopySvgForFigma}
              className="px-5 py-3.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0F172A] font-bold text-xs uppercase tracking-wider rounded-xs shadow-md flex items-center gap-2 cursor-pointer transition"
            >
              {copiedSvg ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedSvg ? 'COPIED! PRESS CMD+V IN FIGMA/SKETCH' : 'COPY SVG FOR FIGMA / SKETCH'}</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition"
            >
              <Download size={16} />
              <span>DOWNLOAD .SVG</span>
            </button>
            <button
              onClick={() => handleDownloadPng(false)}
              className="px-5 py-3.5 bg-[#B12535] hover:bg-[#8f1d2a] text-white font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition"
            >
              <Download size={16} />
              <span>EXPORT 2048PX .PNG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Live Vector Canvas */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className="relative aspect-square w-full rounded-sm border border-slate-300 shadow-lg overflow-hidden flex items-center justify-center transition-colors duration-200"
            style={{
              backgroundColor: canvasBg === 'transparent' ? '#FFFFFF' : canvasBg,
              backgroundImage:
                canvasBg === 'transparent'
                  ? 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)'
                  : 'none',
              backgroundSize: '28px 28px',
              backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0',
            }}
          >
            <svg viewBox="0 0 1024 1024" className="w-full h-full max-w-[560px] max-h-[560px] drop-shadow-xs">
              <g id="High-Draw-Logo">
                <g id="Monogram-HD" fill={monogramColor}>
                  <g id="Letter-H" fill={monogramColor}>
                    <path id="H-Left-Pillar" d={paths.hLeftPath} fill={monogramColor} />
                    <path id="H-Right-Pillar" d={paths.hRightPath} fill={monogramColor} />
                    {variant === 'crossbar' && (
                      <path id="H-Crossbar" d={paths.crossbarPath} fill={monogramColor} />
                    )}
                  </g>
                  <path id="Letter-D" d={paths.dPath} fillRule="evenodd" clipRule="evenodd" fill={monogramColor} />
                </g>
                {variant === 'flagstick' ? (
                  <g id="Golf-Cup-and-Pin">
                    <ellipse id="Golf-Cup" cx={cupCx} cy={cupCy} rx="33" ry="11" fill={cupColor} />
                    <rect id="Pin-Shaft" x={cupCx - 3.5} y={cupCy - 142} width="7" height="142" rx="3.5" fill={cupColor} />
                    <path
                      id="Pin-Flag"
                      d={`M ${cupCx - 4} ${cupCy - 138} C ${cupCx - 28} ${cupCy - 140}, ${cupCx - 46} ${cupCy - 122}, ${cupCx - 68} ${cupCy - 120} C ${cupCx - 46} ${cupCy - 108}, ${cupCx - 28} ${cupCy - 100}, ${cupCx - 4} ${cupCy - 98} Z`}
                      fill={flagColor}
                    />
                  </g>
                ) : (
                  <g id="Golf-Cup-Target" fill={cupColor}>
                    <ellipse id="Golf-Cup" cx={cupCx} cy={cupCy} rx="33" ry="11" fill={cupColor} />
                  </g>
                )}
                <g id="Ball-Flight-Tracer" fill={tracerColor}>
                  <path id="Tracer-Arc" d={paths.tracerPath} fill={tracerColor} />
                </g>
              </g>
            </svg>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 bg-black/75 backdrop-blur-xs text-white px-4 py-2.5 rounded-xs text-[11px] font-mono">
              <span>1024&times;1024 VECTOR GRID &bull; TRUE BOOLEAN CUTOUTS</span>
              <span className="text-[#38BDF8]">3 INDEPENDENT LAYER GROUPS</span>
            </div>
          </div>

          {/* Quick Brand Colorway Presets */}
          <div className="bg-white border border-slate-200 p-5 rounded-xs space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
              One-Click Brand Colorway Combos
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => applyThemePreset({ mono: '#1C2C24', tracer: '#38BDF8', cup: '#1C2C24', flag: '#B12535', bg: '#F9F8F6' })}
                className="p-2.5 border border-slate-200 hover:border-slate-900 rounded-xs text-left cursor-pointer transition"
              >
                <div className="flex gap-1.5 mb-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#1C2C24] border border-slate-300" />
                  <span className="w-4 h-4 rounded-full bg-[#38BDF8]" />
                </div>
                <span className="text-xs font-bold block">Cypress &amp; Cyan</span>
                <span className="text-[10px] text-slate-500">Flagship Light</span>
              </button>

              <button
                onClick={() => applyThemePreset({ mono: '#FFFFFF', tracer: '#D4AF37', cup: '#D4AF37', flag: '#38BDF8', bg: '#1C2C24' })}
                className="p-2.5 border border-slate-200 hover:border-slate-900 rounded-xs text-left cursor-pointer transition"
              >
                <div className="flex gap-1.5 mb-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#1C2C24] border border-slate-300" />
                  <span className="w-4 h-4 rounded-full bg-[#D4AF37]" />
                </div>
                <span className="text-xs font-bold block">Cypress &amp; Gold</span>
                <span className="text-[10px] text-slate-500">Clubhouse Crest</span>
              </button>

              <button
                onClick={() => applyThemePreset({ mono: '#1E293B', tracer: '#D4AF37', cup: '#1E293B', flag: '#B12535', bg: '#FFFFFF' })}
                className="p-2.5 border border-slate-200 hover:border-slate-900 rounded-xs text-left cursor-pointer transition"
              >
                <div className="flex gap-1.5 mb-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#1E293B]" />
                  <span className="w-4 h-4 rounded-full bg-[#D4AF37]" />
                </div>
                <span className="text-xs font-bold block">Tour Navy &amp; Gold</span>
                <span className="text-[10px] text-slate-500">Polo Embroidery</span>
              </button>

              <button
                onClick={() => applyThemePreset({ mono: '#FFFFFF', tracer: '#38BDF8', cup: '#FFFFFF', flag: '#B12535', bg: '#111827' })}
                className="p-2.5 border border-slate-200 hover:border-slate-900 rounded-xs text-left cursor-pointer transition"
              >
                <div className="flex gap-1.5 mb-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#111827]" />
                  <span className="w-4 h-4 rounded-full bg-[#38BDF8]" />
                </div>
                <span className="text-xs font-bold block">Onyx &amp; Cyan</span>
                <span className="text-[10px] text-slate-500">Dark Mode Lockup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Variable Element Color Controllers & Downloads */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Structural Variant */}
          <div className="bg-white border border-slate-200 p-6 rounded-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-[#1C2C24]" />
              <h2 className="font-serif text-lg font-bold">1. Select Monogram Architecture</h2>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => setVariant('crossbar')}
                className={`p-3.5 border rounded-xs text-left cursor-pointer transition flex items-center justify-between ${
                  variant === 'crossbar' ? 'border-[#1C2C24] bg-[#1C2C24]/5' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">The Tour Crossbar &ldquo;HD&rdquo; (Recommended)</span>
                  <span className="text-[11px] text-slate-600">Complete serif H with crossbar, D, tracer &amp; cup</span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#1C2C24] text-white rounded-xs">
                  PRIMARY
                </span>
              </button>

              <button
                onClick={() => setVariant('classic')}
                className={`p-3.5 border rounded-xs text-left cursor-pointer transition flex items-center justify-between ${
                  variant === 'classic' ? 'border-[#1C2C24] bg-[#1C2C24]/5' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">The Minimalist Sketch &ldquo;HD&rdquo;</span>
                  <span className="text-[11px] text-slate-600">Direct elevation of your sketch — tracer bridges the H</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">SKETCH</span>
              </button>

              <button
                onClick={() => setVariant('flagstick')}
                className={`p-3.5 border rounded-xs text-left cursor-pointer transition flex items-center justify-between ${
                  variant === 'flagstick' ? 'border-[#1C2C24] bg-[#1C2C24]/5' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">The Heritage Flagstick &ldquo;HD&rdquo;</span>
                  <span className="text-[11px] text-slate-600">Adds the signature High Draw pin &amp; flag in the cup</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">CREST</span>
              </button>
            </div>

            <label className="flex items-center gap-2.5 pt-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useCutout}
                onChange={(e) => setUseCutout(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span>Enable true boolean negative-space embroidery gap around Tracer</span>
            </label>
          </div>

          {/* 2. Controllable Variable Element Colors */}
          <div className="bg-white border border-slate-200 p-6 rounded-xs space-y-5">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#1C2C24]" />
              <h2 className="font-serif text-lg font-bold">2. Variable Element Colors</h2>
            </div>

            {/* Layer 1: HD Monogram */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Layer 1: &ldquo;HD&rdquo; Serif Monogram (<code className="text-[11px] font-mono text-slate-500">#Monogram-HD</code>)</span>
                <input
                  type="color"
                  value={monogramColor}
                  onChange={(e) => setMonogramColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-300"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {BRAND_SWATCHES.map((s) => (
                  <button
                    key={`mono-${s.hex}`}
                    onClick={() => setMonogramColor(s.hex)}
                    title={s.name}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition ${
                      monogramColor.toUpperCase() === s.hex ? 'ring-2 ring-offset-2 ring-slate-900' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: s.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Layer 2: Ball-Flight Tracer */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Layer 2: Ball-Flight Tracer (<code className="text-[11px] font-mono text-slate-500">#Ball-Flight-Tracer</code>)</span>
                <input
                  type="color"
                  value={tracerColor}
                  onChange={(e) => setTracerColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-300"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {BRAND_SWATCHES.map((s) => (
                  <button
                    key={`tracer-${s.hex}`}
                    onClick={() => setTracerColor(s.hex)}
                    title={s.name}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition ${
                      tracerColor.toUpperCase() === s.hex ? 'ring-2 ring-offset-2 ring-slate-900' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: s.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Layer 3: Golf Cup Target */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Layer 3: Golf Cup Target (<code className="text-[11px] font-mono text-slate-500">#Golf-Cup</code>)</span>
                <input
                  type="color"
                  value={cupColor}
                  onChange={(e) => setCupColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-300"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {BRAND_SWATCHES.map((s) => (
                  <button
                    key={`cup-${s.hex}`}
                    onClick={() => setCupColor(s.hex)}
                    title={s.name}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition ${
                      cupColor.toUpperCase() === s.hex ? 'ring-2 ring-offset-2 ring-slate-900' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: s.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Preview Canvas Background */}
            <div className="space-y-2">
              <span className="text-xs font-bold block">Preview Backdrop (Transparent on SVG/PNG Export)</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Transparent', val: 'transparent' },
                  { label: 'White', val: '#FFFFFF' },
                  { label: 'Alabaster', val: '#F9F8F6' },
                  { label: 'Cypress', val: '#1C2C24' },
                  { label: 'Navy', val: '#1E293B' },
                  { label: 'Onyx', val: '#111827' },
                ].map((b) => (
                  <button
                    key={b.val}
                    onClick={() => setCanvasBg(b.val)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-xs border cursor-pointer ${
                      canvasBg === b.val ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Pre-Built Separated PNG Layers & SVG Files */}
          <div className="bg-white border border-slate-200 p-6 rounded-xs space-y-3">
            <h3 className="font-serif text-base font-bold">Separated 2048px PNG Layers (For Raster Tint in Figma/Sketch)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In Figma or Sketch, <strong>.SVG</strong> is best because every vector path is directly clickable. If you prefer working with <strong>.PNG</strong> files, stack these 3 registered <code className="font-mono">2048&times;2048</code> transparent PNG layers at <code className="font-mono">(0, 0)</code> and apply a Fill/Tint to each layer independently:
            </p>
            <div className="grid grid-cols-1 gap-2 pt-1 text-xs font-mono">
              <a
                href="/assets/brand/hd-monogram/layer_1_monogram_hd_crossbar.png"
                download
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xs flex items-center justify-between text-[#1C2C24]"
              >
                <span>1. layer_1_monogram_hd_crossbar.png</span>
                <Download size={14} />
              </a>
              <a
                href="/assets/brand/hd-monogram/layer_2_ball_flight_tracer.png"
                download
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xs flex items-center justify-between text-[#0EA5E9]"
              >
                <span>2. layer_2_ball_flight_tracer.png</span>
                <Download size={14} />
              </a>
              <a
                href="/assets/brand/hd-monogram/layer_3_golf_cup_target.png"
                download
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xs flex items-center justify-between text-slate-700"
              >
                <span>3. layer_3_golf_cup_target.png</span>
                <Download size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
