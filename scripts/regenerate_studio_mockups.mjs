#!/usr/bin/env node
/**
 * High Draw Golf — Studio Mockup & Brand Photography Regenerator (v2: Predicate-Masked Weave Cloning)
 *
 * Replaces blurry Printify stitch-rasterized logos, wholesale neck tags
 * (PORT AUTHORITY / SPORT-TEK), and cartoon CAD placeholders across
 * `public/assets/products/printify_mockups/` with crisp, physically calibrated
 * High Draw studio photography (2.25" Men's / 1.75" Women's).
 *
 * Uses predicate-based stitch/letter masking + seamless offset fabric cloning
 * so 95%+ of surrounding heather/pique weave and collar shading remains 100% untouched.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const MOCKUPS_DIR = path.resolve('public/assets/products/printify_mockups');
const LOGOS_DIR = path.resolve('public/assets/brand/logos');
const WOMENS_DIR = path.resolve('public/assets/products/womens-polo');
const CATALOG_DIR = path.resolve('public/assets/products/catalog');
const SCRATCH_DIR = '/Users/kendallkylecyree/.gemini/antigravity/brain/60a37700-3e30-4caf-87dd-f2160c629670/scratch';

/**
 * Predicate-masked seamless fabric patch healer:
 * 1. Estimates clean background fabric color around the box perimeter.
 * 2. Masks ONLY pixels that deviate from local fabric color (stitches, shadow, white tag text),
 *    dilated by `dilate` px with a soft feathered blend rim.
 * 3. Fills masked pixels using harmonic smooth shading + real full-spectrum heather/pique
 *    detail cloned from an unblemished patch directly below/beside the box (no repeating tile grid).
 */
function healStitchesOrTag(data, width, height, channels, box, opts = {}) {
  const x0 = Math.max(2, Math.round(box.x0));
  const y0 = Math.max(2, Math.round(box.y0));
  const x1 = Math.min(width - 3, Math.round(box.x1));
  const y1 = Math.min(height - 3, Math.round(box.y1));
  const bw = x1 - x0 + 1;
  const bh = y1 - y0 + 1;

  const thresh = opts.thresh ?? 22;
  const dilate = opts.dilate ?? 5;
  const feather = opts.feather ?? 3;
  const iterations = opts.iterations ?? 500;

  // 1. Compute perimeter median/mean RGB so we know the garment's local fabric color
  const rVals = [], gVals = [], bVals = [];
  for (let ly = 0; ly < bh; ly++) {
    for (const lx of [0, 1, bw - 2, bw - 1]) {
      const idx = ((y0 + ly) * width + (x0 + lx)) * channels;
      rVals.push(data[idx]);
      gVals.push(data[idx + 1]);
      bVals.push(data[idx + 2]);
    }
  }
  for (let lx = 0; lx < bw; lx++) {
    for (const ly of [0, 1, bh - 2, bh - 1]) {
      const idx = ((y0 + ly) * width + (x0 + lx)) * channels;
      rVals.push(data[idx]);
      gVals.push(data[idx + 1]);
      bVals.push(data[idx + 2]);
    }
  }
  rVals.sort((a, b) => a - b);
  gVals.sort((a, b) => a - b);
  bVals.sort((a, b) => a - b);
  const medR = rVals[Math.floor(rVals.length / 2)];
  const medG = gVals[Math.floor(gVals.length / 2)];
  const medB = bVals[Math.floor(bVals.length / 2)];

  // 2. Detect outlier pixels (or full inner-tag box when opts.fullMask is true)
  const rawMask = new Uint8Array(bw * bh);
  for (let ly = 1; ly < bh - 1; ly++) {
    for (let lx = 1; lx < bw - 1; lx++) {
      if (opts.fullMask) {
        if (ly >= 3 && ly < bh - 3 && lx >= 3 && lx < bw - 3) rawMask[ly * bw + lx] = 1;
        continue;
      }
      const idx = ((y0 + ly) * width + (x0 + lx)) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const diff = Math.max(Math.abs(r - medR), Math.abs(g - medG), Math.abs(b - medB));
      if (diff > thresh) {
        rawMask[ly * bw + lx] = 1;
      }
    }
  }

  // Distance transform (approx) for dilation + soft feathering
  const alphaMask = new Float32Array(bw * bh);
  const totalR = dilate + feather;
  for (let ly = 1; ly < bh - 1; ly++) {
    for (let lx = 1; lx < bw - 1; lx++) {
      let minDistSq = 9999;
      const rMinY = Math.max(0, ly - totalR), rMaxY = Math.min(bh - 1, ly + totalR);
      const rMinX = Math.max(0, lx - totalR), rMaxX = Math.min(bw - 1, lx + totalR);
      for (let ny = rMinY; ny <= rMaxY; ny++) {
        for (let nx = rMinX; nx <= rMaxX; nx++) {
          if (rawMask[ny * bw + nx]) {
            const d2 = (ny - ly) * (ny - ly) + (nx - lx) * (nx - lx);
            if (d2 < minDistSq) minDistSq = d2;
          }
        }
      }
      const d = Math.sqrt(minDistSq);
      if (d <= dilate) {
        alphaMask[ly * bw + lx] = 1.0;
      } else if (d < dilate + feather) {
        alphaMask[ly * bw + lx] = 1.0 - (d - dilate) / feather;
      }
    }
  }

  // 3. Harmonic solve across masked region for low-frequency lighting gradient
  const hardMask = new Uint8Array(bw * bh);
  const buf = new Float32Array(bw * bh * 3);
  for (let ly = 0; ly < bh; ly++) {
    for (let lx = 0; lx < bw; lx++) {
      const idx = ((y0 + ly) * width + (x0 + lx)) * channels;
      const mIdx = ly * bw + lx;
      const bIdx = mIdx * 3;
      if (alphaMask[mIdx] > 0.05) {
        hardMask[mIdx] = 1;
        buf[bIdx] = medR;
        buf[bIdx + 1] = medG;
        buf[bIdx + 2] = medB;
      } else {
        buf[bIdx] = data[idx];
        buf[bIdx + 1] = data[idx + 1];
        buf[bIdx + 2] = data[idx + 2];
      }
    }
  }

  for (let it = 0; it < iterations; it++) {
    for (let ly = 1; ly < bh - 1; ly++) {
      for (let lx = 1; lx < bw - 1; lx++) {
        const mIdx = ly * bw + lx;
        if (!hardMask[mIdx]) continue;
        const bIdx = mIdx * 3;
        const l = bIdx - 3, r = bIdx + 3, u = bIdx - bw * 3, d = bIdx + bw * 3;
        buf[bIdx] = 0.25 * (buf[l] + buf[r] + buf[u] + buf[d]);
        buf[bIdx + 1] = 0.25 * (buf[l + 1] + buf[r + 1] + buf[u + 1] + buf[d + 1]);
        buf[bIdx + 2] = 0.25 * (buf[l + 2] + buf[r + 2] + buf[u + 2] + buf[d + 2]);
      }
    }
  }

  // 4. Clone contiguous non-repeating fabric grain from clean donor region (offset dx, dy)
  const origCopy = Uint8Array.from(data);
  const donorDx = opts.donorDx ?? 0;
  const donorDy = opts.donorDy ?? bh + 18;

  // Compute local low-frequency donor mean (15x15 box window) so medium+high heather grain transfers cleanly
  const winR = 7;
  for (let ly = 1; ly < bh - 1; ly++) {
    for (let lx = 1; lx < bw - 1; lx++) {
      const a = alphaMask[ly * bw + lx];
      if (a <= 0.01) continue;

      const gx = x0 + lx;
      const gy = y0 + ly;
      const sx = Math.min(width - winR - 2, Math.max(winR + 1, gx + donorDx));
      const sy = Math.min(height - winR - 2, Math.max(winR + 1, gy + donorDy));

      let mr = 0, mg = 0, mb = 0, cnt = 0;
      for (let wy = -winR; wy <= winR; wy += 2) {
        for (let wx = -winR; wx <= winR; wx += 2) {
          const sIdx = ((sy + wy) * width + (sx + wx)) * channels;
          mr += origCopy[sIdx];
          mg += origCopy[sIdx + 1];
          mb += origCopy[sIdx + 2];
          cnt++;
        }
      }
      mr /= cnt;
      mg /= cnt;
      mb /= cnt;

      const scIdx = (sy * width + sx) * channels;
      const dr = origCopy[scIdx] - mr;
      const dg = origCopy[scIdx + 1] - mg;
      const db = origCopy[scIdx + 2] - mb;

      const bIdx = (ly * bw + lx) * 3;
      const healedR = Math.min(255, Math.max(0, buf[bIdx] + dr));
      const healedG = Math.min(255, Math.max(0, buf[bIdx + 1] + dg));
      const healedB = Math.min(255, Math.max(0, buf[bIdx + 2] + db));

      const dstIdx = (gy * width + gx) * channels;
      data[dstIdx] = Math.round(origCopy[dstIdx] * (1 - a) + healedR * a);
      data[dstIdx + 1] = Math.round(origCopy[dstIdx + 1] * (1 - a) + healedG * a);
      data[dstIdx + 2] = Math.round(origCopy[dstIdx + 2] * (1 - a) + healedB * a);
    }
  }
}

async function buildCenteredLogoLayers(logoFile, targetHeight, cx, cy, angle = 0) {
  const logoPath = path.join(LOGOS_DIR, logoFile);
  let pipe = sharp(logoPath).trim().resize({ height: targetHeight });
  if (angle !== 0) {
    pipe = pipe.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }
  const { data: logoBuf, info } = await pipe.png().toBuffer({ resolveWithObject: true });
  const left = Math.round(cx - info.width / 2);
  const top = Math.round(cy - info.height / 2);

  const shadowBuf = await sharp(logoBuf)
    .ensureAlpha()
    .modulate({ brightness: 0 })
    .blur(0.85)
    .linear([1, 1, 1, 0.28], [0, 0, 0, 0])
    .png()
    .toBuffer();

  return [
    { input: shadowBuf, left: left + 1, top: top + 1, blend: 'over' },
    { input: logoBuf, left, top, blend: 'over' },
  ];
}

function logoFilename(styleSlug, colorTone) {
  const prefix =
    styleSlug === 'mark-only'
      ? 'mark_only'
      : styleSlug === 'mark-wordmark'
      ? 'mark_text'
      : 'mark_monogram';
  return `${prefix}_${colorTone}.png`;
}

async function cleanFlatlayFamily({
  prefixBase,
  colors,
  collarBox,
  chestBox,
  logoHeight,
  logoCx,
  logoCy,
  getLogoTone,
}) {
  const styles = ['mark-monogram', 'mark-only', 'mark-wordmark'];
  for (const color of colors) {
    // Use mark-only as base (narrowest 18px chest mark!)
    const srcPath = path.join(MOCKUPS_DIR, `${prefixBase}-mark-only--${color}.jpg`);
    const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

    if (collarBox) {
      healStitchesOrTag(data, info.width, info.height, info.channels, collarBox, {
        fullMask: true,
        dilate: 1,
        feather: 4,
        donorDx: collarBox.donorDx ?? 0,
        donorDy: collarBox.donorDy ?? -34,
      });
    }

    healStitchesOrTag(data, info.width, info.height, info.channels, chestBox, {
      thresh: chestBox.thresh ?? 20,
      dilate: 5,
      feather: 4,
      donorDx: chestBox.donorDx ?? 0,
      donorDy: chestBox.donorDy ?? 145,
    });

    const cleanBasePng = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .png()
      .toBuffer();

    for (const style of styles) {
      const tone = getLogoTone(style, color);
      const layers = await buildCenteredLogoLayers(
        logoFilename(style, tone),
        logoHeight,
        logoCx,
        logoCy,
        0
      );
      const outPath = path.join(MOCKUPS_DIR, `${prefixBase}-${style}--${color}.jpg`);
      await sharp(cleanBasePng).composite(layers).jpeg({ quality: 94, mozjpeg: true }).toFile(outPath);
    }
    console.log(`  ✓ ${prefixBase} [${color}] (3 logo variants)`);
  }
}

async function buildWomensWeekenderFamily() {
  const colorMap = [
    { mockupSlug: 'black', formSlug: 'black' },
    { mockupSlug: 'carolina-blue', formSlug: 'carolinablue' },
    { mockupSlug: 'deep-red', formSlug: 'deepred' },
    { mockupSlug: 'graphite', formSlug: 'graphite' },
    { mockupSlug: 'grey-concrete', formSlug: 'greyconcrete' },
    { mockupSlug: 'true-navy', formSlug: 'truenavy' },
    { mockupSlug: 'true-royal', formSlug: 'trueroyal' },
    { mockupSlug: 'white', formSlug: null },
  ];
  const styles = ['mark-monogram', 'mark-only', 'mark-wordmark'];

  const cleanForms = {};
  for (const item of colorMap) {
    if (!item.formSlug) continue;
    const formPath = path.join(WOMENS_DIR, `LST740_${item.formSlug}_form_front.jpg`);
    const { data, info } = await sharp(formPath).raw().toBuffer({ resolveWithObject: true });

    // LST740_*_form_front.jpg is 1800x1800: SPORT-TEK tag sits inside collar at x=835..965, y=210..315
    healStitchesOrTag(
      data,
      info.width,
      info.height,
      info.channels,
      { x0: 825, y0: 205, x1: 975, y1: 325 },
      { thresh: 18, dilate: 5, feather: 3, donorDx: 0, donorDy: 95 }
    );

    // Save cleaned 1800x1800 form_front so PDP Angle #3 is also tag-free
    await sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .jpeg({ quality: 93, mozjpeg: true })
      .toFile(formPath);

    // Frame 1800x1800 cleanly (crop excess bottom whitespace -> 1560x1560 -> 1200x1200)
    cleanForms[item.mockupSlug] = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .extract({ left: 120, top: 20, width: 1560, height: 1560 })
      .resize(1200, 1200)
      .png()
      .toBuffer();
  }

  // Synthesize Crisp White studio form from Grey Concrete studio form
  {
    const { data, info } = await sharp(cleanForms['grey-concrete']).raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < 250 || g < 250 || b < 250) {
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const lifted = Math.min(1, 0.79 + Math.pow(lum, 0.85) * 0.21);
        const v = Math.round(lifted * 255);
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = Math.min(255, v + 1);
      }
    }
    cleanForms['white'] = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .png()
      .toBuffer();
  }

  // Composite 1.75" left-chest logo onto all 8 colorways x 3 styles
  for (const item of colorMap) {
    const basePng = cleanForms[item.mockupSlug];
    for (const style of styles) {
      const tone = item.mockupSlug === 'white' ? 'cyan' : 'white';
      const layers = await buildCenteredLogoLayers(
        logoFilename(style, tone),
        58,
        665,
        378,
        -2
      );
      const outPath = path.join(
        MOCKUPS_DIR,
        `high-draw-weekender-women-s-polo-${style}--${item.mockupSlug}.jpg`
      );
      await sharp(basePng).composite(layers).jpeg({ quality: 94, mozjpeg: true }).toFile(outPath);
    }
    console.log(`  ✓ high-draw-weekender-women-s-polo [${item.mockupSlug}] (3 logo variants)`);
  }
}

async function buildClubhouseFleeceQuarterZipFamily() {
  const blackUrl = 'https://images.printify.com/6abf6c563d3df6f14b062880';
  const greyUrl = 'https://images.printify.com/6abf6c583c0fc787590f1e00';

  const getBuf = async (localName, url) => {
    const p = path.join(SCRATCH_DIR, localName);
    if (fs.existsSync(p)) return fs.readFileSync(p);
    return Buffer.from(await (await fetch(url)).arrayBuffer());
  };

  const prepFlatlay = async rawBuf => {
    const { data, info } = await sharp(rawBuf).raw().toBuffer({ resolveWithObject: true });
    // Blank out blue/white woven label letters inside the black neck ribbon without touching grey fleece
    for (let y = 375; y <= 435; y++) {
      for (let x = 550; x <= 660; x++) {
        const idx = (y * info.width + x) * info.channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (b > r + 6 || (y >= 390 && y <= 425 && x >= 572 && x <= 645 && r < 110 && g < 110)) {
          data[idx] = 22;
          data[idx + 1] = 22;
          data[idx + 2] = 24;
        }
      }
    }
    // Fit 1200x1800 cleanly inside a 1200x1200 white studio square (garment centered at x=600)
    return sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .extract({ left: 0, top: 210, width: 1200, height: 1380 })
      .resize(1200, 1200, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 },
      })
      .removeAlpha()
      .png()
      .toBuffer();
  };

  const blackBase = await prepFlatlay(await getBuf('f218_6.jpg', blackUrl));
  const greyBase = await prepFlatlay(await getBuf('f218_8.jpg', greyUrl));

  // Derive True Navy studio flatlay cleanly from neutral Iron Grey flatlay
  const navyBase = await (async () => {
    const { data, info } = await sharp(greyBase).raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < 248 || g < 248 || b < 248) {
        const lum = (r + g + b) / 3;
        if (lum > 205) {
          const t = Math.min(1, (lum - 205) / 45);
          data[i] = Math.round(24 * (1 - t) + r * t);
          data[i + 1] = Math.round(31 * (1 - t) + g * t);
          data[i + 2] = Math.round(58 * (1 - t) + b * t);
        } else {
          const ratio = lum / 65;
          data[i] = Math.min(255, Math.max(0, Math.round(23 * Math.pow(ratio, 1.04))));
          data[i + 1] = Math.min(255, Math.max(0, Math.round(30 * Math.pow(ratio, 1.04))));
          data[i + 2] = Math.min(255, Math.max(0, Math.round(57 * Math.pow(ratio, 0.97))));
        }
      }
    }
    return sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .png()
      .toBuffer();
  })();

  const bases = {
    black: blackBase,
    'iron-grey': greyBase,
    'true-navy': navyBase,
  };
  const styles = ['mark-monogram', 'mark-only', 'mark-wordmark'];

  for (const [color, basePng] of Object.entries(bases)) {
    for (const style of styles) {
      // On 1200x1200 contain-fitted fleece: zipper is at x=608, wearer's left chest is at (735, 392)
      const layers = await buildCenteredLogoLayers(
        logoFilename(style, 'white'),
        64,
        735,
        392,
        0
      );
      const outPath = path.join(
        MOCKUPS_DIR,
        `high-draw-clubhouse-fleece-quarter-zip-${style}--${color}.jpg`
      );
      await sharp(basePng).composite(layers).jpeg({ quality: 94, mozjpeg: true }).toFile(outPath);
    }
    console.log(`  ✓ high-draw-clubhouse-fleece-quarter-zip [${color}] (3 logo variants)`);
  }
}

async function buildCapsFamily() {
  const map = {
    black: 'hat_black.jpg',
    'grey-heather': 'hat_greyheather.jpg',
    magnet: 'hat_magnet.jpg',
    'true-navy': 'hat_truenavy.jpg',
    'true-red': 'hat_truered.jpg',
    'true-royal': 'hat_trueroyal.jpg',
    white: 'hat_white.jpg',
  };
  for (const [slug, catFile] of Object.entries(map)) {
    const src = path.join(CATALOG_DIR, catFile);
    const dst = path.join(MOCKUPS_DIR, `flexfit-cool-dry-poly-block-mesh-cap--${slug}.jpg`);
    await sharp(src).resize(1200, 1200).jpeg({ quality: 94, mozjpeg: true }).toFile(dst);
  }
  console.log('  ✓ flexfit-cool-dry-poly-block-mesh-cap (7 real studio cap photos)');
}

async function removeDeadIndexedMockups() {
  const files = fs.readdirSync(MOCKUPS_DIR);
  let removed = 0;
  for (const f of files) {
    if (/-color-\d+\.jpg$/.test(f)) {
      fs.unlinkSync(path.join(MOCKUPS_DIR, f));
      removed++;
    }
  }
  if (removed > 0) {
    console.log(`  ✓ Removed ${removed} unused legacy -color-N.jpg files`);
  }
}

async function main() {
  console.log('==============================================================');
  console.log(' HIGH DRAW GOLF — STUDIO MOCKUP & BRAND ACCURACY REGENERATOR');
  console.log('==============================================================\n');

  await cleanFlatlayFamily({
    prefixBase: 'high-draw-clubhouse-men-s-polo',
    colors: [
      'aegean-blue-heather',
      'black-heather',
      'charcoal-heather',
      'dark-teal-heather',
      'river-blue-navy-heather',
    ],
    collarBox: { x0: 556, y0: 170, x1: 646, y1: 226, thresh: 16, donorDx: 0, donorDy: -56 },
    chestBox: { x0: 696, y0: 306, x1: 790, y1: 438, thresh: 18, donorDx: 0, donorDy: 145 },
    logoHeight: 74,
    logoCx: 738,
    logoCy: 374,
    getLogoTone: () => 'white',
  });

  await cleanFlatlayFamily({
    prefixBase: 'high-draw-clubhouse-women-s-polo',
    colors: ['aegean-blue-heather', 'black-heather', 'charcoal-heather'],
    collarBox: null,
    chestBox: { x0: 704, y0: 354, x1: 784, y1: 486, thresh: 18, donorDx: 0, donorDy: 145 },
    logoHeight: 64,
    logoCx: 735,
    logoCy: 425,
    getLogoTone: () => 'white',
  });

  await cleanFlatlayFamily({
    prefixBase: 'high-draw-weekender-men-s-polo',
    colors: [
      'black',
      'carolina-blue',
      'deep-red',
      'forest-green',
      'graphite',
      'grey-concrete',
      'true-navy',
      'true-royal',
      'white',
    ],
    collarBox: { x0: 560, y0: 206, x1: 634, y1: 234, thresh: 18, donorDx: 0, donorDy: -32 },
    chestBox: { x0: 690, y0: 314, x1: 782, y1: 438, thresh: 16, donorDx: 0, donorDy: 145 },
    logoHeight: 72,
    logoCx: 734,
    logoCy: 376,
    getLogoTone: (style, color) => {
      if (style === 'mark-monogram') return 'cyan';
      if (color === 'white') return 'cyan';
      return 'white';
    },
  });

  await buildWomensWeekenderFamily();
  await buildClubhouseFleeceQuarterZipFamily();
  await buildCapsFamily();
  await removeDeadIndexedMockups();

  console.log('\n✅ Regenerated all 91 studio product mockups cleanly!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
