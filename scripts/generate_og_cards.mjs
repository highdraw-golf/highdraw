import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public/assets/og');

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapLines(text, maxCharsPerLine, maxLines = 4) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) {
        // pack remaining words and break if too long later
      }
    }
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const clamped = lines.slice(0, maxLines);
    const last = clamped[maxLines - 1];
    clamped[maxLines - 1] = last.length > maxCharsPerLine - 1
      ? `${last.slice(0, maxCharsPerLine - 2)}…`
      : `${last}…`;
    return clamped;
  }
  return lines;
}

const OG_CARDS = [
  {
    filename: 'og-home.jpg',
    eyebrow: 'DESIGNED FOR SPORT · CRAFTED FOR LIFE',
    title: 'High Draw Golf Apparel',
    subtitle: 'Tour-grade 180 GSM micro-pique performance drape, stay-flat collars & zero $125 retail markup.',
    pillText: 'WEEKENDER $48  ·  CLUBHOUSE $66',
    sourceImage: 'public/assets/lifestyle_golf.jpg',
    mode: 'cover',
  },
  {
    filename: 'mens-weekender-performance-polo.jpg',
    eyebrow: 'THE WEEKENDER COLLECTION · MEN’S',
    title: "The Weekender Performance Polo — Men's",
    subtitle: '180 GSM micro-pique drape, UPF 50+ solar protection, and choice of 3 official High Draw chest marks.',
    pillText: '$48  ·  COMPARE AT $115',
    sourceImage: 'public/assets/products/bespoke/men_polo_hero_wood.jpg',
    mode: 'cover',
  },
  {
    filename: 'womens-weekender-performance-polo.jpg',
    eyebrow: 'THE WEEKENDER COLLECTION · WOMEN’S',
    title: "The Weekender Performance Polo — Women's",
    subtitle: 'Contoured feminine silhouette with elongated Y-neck placket and 2.25" lower-aligned chest embroidery.',
    pillText: '$48  ·  COMPARE AT $115',
    sourceImage: 'public/assets/products/bespoke/women_polo_hero_wood.jpg',
    mode: 'cover',
  },
  {
    filename: 'tour-performance-poly-mesh-cap.jpg',
    eyebrow: 'FLEXFIT COOL & DRY · HEADWEAR',
    title: 'The Tour Performance Poly-Mesh Cap',
    subtitle: 'Breathable honeycomb poly-mesh crown, silver anti-glare underbill & structured chest-matched embroidery.',
    pillText: '$35 ($28 WITH ANY SHIRT)',
    sourceImage: 'public/assets/products/bespoke/hat_hero_wood.jpg',
    mode: 'cover',
  },
  {
    filename: 'the-saturday-foursome-scramble-kit.jpg',
    eyebrow: '4-POLO PRESENTATION BOX',
    title: 'The Saturday Foursome Scramble Kit',
    subtitle: 'Any mix of Men’s & Women’s Tour Performance Polos at $40/shirt with custom crew embroidery.',
    pillText: '$160  ·  FREE US SHIPPING',
    sourceImage: 'public/assets/products/editorial/foursome_scramble_18th.jpg',
    mode: 'cover',
  },
  {
    filename: 'mens-clubhouse-fine-pique-polo.jpg',
    eyebrow: 'THE CLUBHOUSE · 57/43 COTTON-POLY PIQUE',
    title: "The Clubhouse Fine Pique Polo — Men's",
    subtitle: 'Rich heather tones tailored for the 19th hole and dinner without synthetic gym shine.',
    pillText: '$66  ·  COMPARE AT $125',
    sourceImage: 'public/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--aegean-blue-heather.jpg',
    mode: 'contain',
  },
  {
    filename: 'womens-clubhouse-fine-pique-polo.jpg',
    eyebrow: 'THE CLUBHOUSE · 57/43 COTTON-POLY PIQUE',
    title: "The Clubhouse Fine Pique Polo — Women's",
    subtitle: 'Ultra-soft combed cotton-poly fine pique with open Y-neck placket and 2.25" lower chest mark.',
    pillText: '$66  ·  COMPARE AT $125',
    sourceImage: 'public/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-monogram--aegean-blue-heather.jpg',
    mode: 'contain',
  },
  {
    filename: 'clubhouse-value-fleece-quarter-zip.jpg',
    eyebrow: 'THE CLUBHOUSE LAYERING · 8.3 OZ FLEECE',
    title: 'The Clubhouse Value Fleece 1/4-Zip',
    subtitle: 'Low-pill midweight thermal fleece with reverse coil zipper built for twilight putting & patio nights.',
    pillText: '$68  ·  COMPARE AT $135',
    sourceImage: 'public/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-mark-monogram--true-navy.jpg',
    mode: 'contain',
  },
  {
    filename: 'tournament-tour-spec-polo.jpg',
    eyebrow: 'TOURNAMENT ALLOCATION · SUMMER 2026',
    title: 'The Tournament Tour-Spec Polo',
    subtitle: '3.4 oz high-tensile micro-knit prototype with bonded hems tested alongside tour ball strikers.',
    pillText: '$110  ·  WAITLIST OPEN',
    sourceImage: 'public/assets/founder/ken_overcast_apex_swing.jpg',
    mode: 'cover',
  },
  {
    filename: 'og-collections.jpg',
    eyebrow: '3-TIER APPAREL ARCHITECTURE',
    title: 'Explore The High Draw Catalog',
    subtitle: 'From $48 Weekender course polos to $66 Clubhouse fine pique & $160 Foursome Kits.',
    pillText: 'FREE US SHIPPING $75+',
    sourceImage: 'public/assets/products/editorial/men_polo_navy_course.jpg',
    mode: 'cover',
  },
  {
    filename: 'og-craftsmanship.jpg',
    eyebrow: 'MATERIAL ENGINEERING',
    title: 'Stay-Flat Collar & 100-Wash Craft',
    subtitle: 'Fused collar stands, 180 GSM capillary micropique, and crisp left-chest embroidery.',
    pillText: 'ZERO COLLAR BACONING',
    sourceImage: 'public/assets/craft_collar_macro.jpg',
    mode: 'cover',
  },
  {
    filename: 'og-about.jpg',
    eyebrow: 'FOUNDER STORY · KEN & LORI CYREE',
    title: 'Tour Quality Without the $125 Markup',
    subtitle: '47 of 50 US states played. 2.9 handicap discipline applied to honest direct-to-golfer apparel.',
    pillText: 'BUILT BY GOLFERS',
    sourceImage: 'public/assets/founder/ken_fairway_wave_sun.jpg',
    mode: 'cover',
  },
  {
    filename: 'og-reviews.jpg',
    eyebrow: 'VERIFIED FAIRWAY PROOF',
    title: 'Rated 4.9/5 Across Dedicated Weekenders',
    subtitle: 'Wash-tested across 100+ rounds for collar retention, drape, and heat breathability.',
    pillText: '30-DAY FAIRWAY GUARANTEE',
    sourceImage: 'public/assets/review_ken.jpg',
    mode: 'cover',
  },
  {
    filename: 'og-guarantee.jpg',
    eyebrow: 'FAIRWAY & WASH WARRANTY',
    title: '100+ Washes & 30-Day Guarantee',
    subtitle: 'If a collar curls into bacon or loses crisp structure within 30 days, we replace or refund it.',
    pillText: 'ZERO RISK FAIRWAY FIT',
    sourceImage: 'public/assets/polo_navy_flatlay.jpg',
    mode: 'cover',
  },
  {
    filename: 'og-logo-studio.jpg',
    eyebrow: '3 OFFICIAL BESPOKE MARKS',
    title: 'The High Draw Embroidery Studio',
    subtitle: 'Preview Mark + Monogram (H | D), Ball Flight Tracer, or Wordmark stitched to order in the USA.',
    pillText: '2.5" MEN’S · 2.25" WOMEN’S',
    sourceImage: 'public/assets/products/bespoke/men_polo_black_wood.jpg',
    mode: 'cover',
  },
];

function buildLeftOverlaySvg(card) {
  const titleLines = wrapLines(card.title, 22, 3);
  const subLines = wrapLines(card.subtitle, 40, 3);

  const titleStartY = 218;
  const titleLineHeight = 52;
  const subStartY = titleStartY + titleLines.length * titleLineHeight + 22;
  const subLineHeight = 29;
  const pillY = Math.min(486, Math.max(438, subStartY + subLines.length * subLineHeight + 24));
  const pillWidth = Math.min(520, Math.max(220, card.pillText.length * 10.6 + 44));

  const titleSvg = titleLines
    .map(
      (line, idx) =>
        `<text x="52" y="${titleStartY + idx * titleLineHeight}" fill="#F8F7F4" font-family="Georgia, 'Times New Roman', serif" font-size="40" font-weight="700" letter-spacing="-0.3">${escapeXml(line)}</text>`
    )
    .join('\n  ');

  const subSvg = subLines
    .map(
      (line, idx) =>
        `<text x="52" y="${subStartY + idx * subLineHeight}" fill="#CBD5E1" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" font-weight="400">${escapeXml(line)}</text>`
    )
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="edgeFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#14201A" stop-opacity="0.92" />
      <stop offset="45%" stop-color="#14201A" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#14201A" stop-opacity="0" />
    </linearGradient>
  </defs>

  ${card.mode === 'cover' ? '<!-- Subtle editorial edge blend onto right photo panel -->\n  <rect x="640" y="0" width="88" height="630" fill="url(#edgeFade)" />' : '<line x1="640" y1="0" x2="640" y2="630" stroke="#2A3F33" stroke-width="1.5" />'}

  <!-- Outer hairline border -->
  <rect x="16" y="16" width="1168" height="598" fill="none" stroke="#2A3F33" stroke-width="1.5" />

  <!-- Gold rule beside tracer mark -->
  <rect x="108" y="69" width="44" height="2" fill="#D4AF37" />
  <text x="164" y="75" fill="#F8F7F4" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="700" letter-spacing="4.2">HIGH DRAW</text>

  <!-- Eyebrow -->
  <text x="52" y="152" fill="#38BDF8" font-family="Menlo, Monaco, Consolas, monospace" font-size="13.5" font-weight="700" letter-spacing="2.4">${escapeXml(card.eyebrow)}</text>

  <!-- Title -->
  ${titleSvg}

  <!-- Subtitle -->
  ${subSvg}

  <!-- Price / Spec Pill -->
  <rect x="52" y="${pillY}" width="${pillWidth}" height="42" rx="3" fill="#1C2C24" stroke="#D4AF37" stroke-width="1.25" />
  <text x="72" y="${pillY + 26}" fill="#D4AF37" font-family="Menlo, Monaco, Consolas, monospace" font-size="15" font-weight="700" letter-spacing="1.8">${escapeXml(card.pillText)}</text>

  <!-- Canonical footer -->
  <line x1="52" y1="560" x2="588" y2="560" stroke="#2A3F33" stroke-width="1" />
  <text x="52" y="586" fill="#94A3B8" font-family="Menlo, Monaco, Consolas, monospace" font-size="13" letter-spacing="2">WWW.HIGHDRAWGEAR.COM  ·  DIRECT TO GOLFER</text>
</svg>`;
}

export async function generateAllOgCards() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const logoPath = path.join(ROOT, 'public/assets/brand/logos/mark_only_gold.png');
  const logoBuffer = await sharp(logoPath)
    .resize({ height: 56, fit: 'contain' })
    .png()
    .toBuffer();

  const results = [];

  for (const card of OG_CARDS) {
    const srcPath = path.join(ROOT, card.sourceImage);
    if (!fs.existsSync(srcPath)) {
      throw new Error(`Missing source image for ${card.filename}: ${srcPath}`);
    }

    let rightPanelBuffer;
    if (card.mode === 'contain') {
      const studioItemBuffer = await sharp(srcPath)
        .resize(520, 580, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toBuffer();

      rightPanelBuffer = await sharp({
        create: {
          width: 560,
          height: 630,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .composite([{ input: studioItemBuffer, left: 20, top: 25 }])
        .png()
        .toBuffer();
    } else {
      rightPanelBuffer = await sharp(srcPath)
        .resize(560, 630, { fit: 'cover', position: 'attention' })
        .png()
        .toBuffer();
    }

    const overlaySvg = Buffer.from(buildLeftOverlaySvg(card));
    const outPath = path.join(OUTPUT_DIR, card.filename);

    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 3,
        background: { r: 20, g: 32, b: 26 },
      },
    })
      .composite([
        { input: rightPanelBuffer, left: 640, top: 0 },
        { input: overlaySvg, left: 0, top: 0 },
        { input: logoBuffer, left: 56, top: 44 },
      ])
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    results.push({ filename: card.filename, bytes: stats.size });
  }

  return results;
}

if (process.argv[1] === __filename) {
  generateAllOgCards()
    .then((results) => {
      for (const r of results) {
        console.log(`Generated public/assets/og/${r.filename} (${(r.bytes / 1024).toFixed(1)} KB)`);
      }
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
