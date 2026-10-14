import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const BRAIN_DIR = '/Users/kyle/.gemini/antigravity/brain/b6b677d3-5fc5-4227-8755-1b0a3091bbb4';

/**
 * Harmonic (Laplacian) Inpainting + High-Frequency Fabric Weave Transfer
 * Uses a full elliptical interior domain (or dilated predicate mask) solved via
 * 400 iterations of 2D Gauss-Seidel Laplace relaxation for C-infinity boundary continuity.
 */
function harmonicInpaint(data, width, height, channels, box, maskPred, opts = {}) {
  const { x0, y0, x1, y1 } = box;
  const dilate = opts.dilate ?? 4;
  const iterations = opts.iterations ?? 400;
  const texDx = opts.texDx ?? 0;
  const texDy = opts.texDy ?? 28;
  const texStrength = opts.texStrength ?? 0.85;
  const useRect = opts.rect ?? false;
  const useEllipse = !useRect && (opts.ellipse ?? (!maskPred));

  const bw = x1 - x0 + 1;
  const bh = y1 - y0 + 1;
  const mask = new Uint8Array(bw * bh);

  if (useRect) {
    for (let ly = 1; ly < bh - 1; ly++) {
      for (let lx = 1; lx < bw - 1; lx++) {
        mask[ly * bw + lx] = 1;
      }
    }
  } else if (useEllipse) {
    const cx = (bw - 1) / 2;
    const cy = (bh - 1) / 2;
    const rx = Math.max(1, cx - 2);
    const ry = Math.max(1, cy - 2);
    for (let ly = 1; ly < bh - 1; ly++) {
      for (let lx = 1; lx < bw - 1; lx++) {
        const nx = (lx - cx) / rx;
        const ny = (ly - cy) / ry;
        if (nx * nx + ny * ny <= 1.0) {
          mask[ly * bw + lx] = 1;
        }
      }
    }
  } else {
    const rawMask = new Uint8Array(bw * bh);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (maskPred(r, g, b, x, y)) {
          rawMask[(y - y0) * bw + (x - x0)] = 1;
        }
      }
    }
    for (let ly = 0; ly < bh; ly++) {
      for (let lx = 0; lx < bw; lx++) {
        if (rawMask[ly * bw + lx]) {
          for (let dy = -dilate; dy <= dilate; dy++) {
            for (let dx = -dilate; dx <= dilate; dx++) {
              if (dx * dx + dy * dy <= dilate * dilate + 1) {
                const ny = ly + dy, nx = lx + dx;
                if (ny >= 1 && ny < bh - 1 && nx >= 1 && nx < bw - 1) {
                  mask[ny * bw + nx] = 1;
                }
              }
            }
          }
        }
      }
    }
  }

  // Initialize float buffer for region
  const buf = new Float32Array(bw * bh * 3);
  for (let ly = 0; ly < bh; ly++) {
    for (let lx = 0; lx < bw; lx++) {
      const idx = ((y0 + ly) * width + (x0 + lx)) * channels;
      const bIdx = (ly * bw + lx) * 3;
      buf[bIdx] = data[idx];
      buf[bIdx + 1] = data[idx + 1];
      buf[bIdx + 2] = data[idx + 2];
    }
  }

  // Seed masked pixels with boundary average
  let sumR = 0, sumG = 0, sumB = 0, cnt = 0;
  for (let ly = 0; ly < bh; ly++) {
    for (let lx = 0; lx < bw; lx++) {
      if (!mask[ly * bw + lx]) {
        const bIdx = (ly * bw + lx) * 3;
        sumR += buf[bIdx]; sumG += buf[bIdx + 1]; sumB += buf[bIdx + 2]; cnt++;
      }
    }
  }
  if (cnt > 0) {
    sumR /= cnt; sumG /= cnt; sumB /= cnt;
    for (let i = 0; i < bw * bh; i++) {
      if (mask[i]) {
        buf[i * 3] = sumR; buf[i * 3 + 1] = sumG; buf[i * 3 + 2] = sumB;
      }
    }
  }

  // Gauss-Seidel Laplacian relaxation for C-infinity smooth boundary continuation
  for (let it = 0; it < iterations; it++) {
    for (let ly = 1; ly < bh - 1; ly++) {
      for (let lx = 1; lx < bw - 1; lx++) {
        const mIdx = ly * bw + lx;
        if (!mask[mIdx]) continue;
        const bIdx = mIdx * 3;
        const left = bIdx - 3, right = bIdx + 3, up = bIdx - bw * 3, down = bIdx + bw * 3;
        buf[bIdx] = 0.25 * (buf[left] + buf[right] + buf[up] + buf[down]);
        buf[bIdx + 1] = 0.25 * (buf[left + 1] + buf[right + 1] + buf[up + 1] + buf[down + 1]);
        buf[bIdx + 2] = 0.25 * (buf[left + 2] + buf[right + 2] + buf[up + 2] + buf[down + 2]);
      }
    }
  }

  // Write back with high-frequency fabric weave transfer from a guaranteed-clean patch outside the box
  const origCopy = Uint8Array.from(data);
  const tileX = opts.tileX ?? Math.max(2, x0 - 26);
  const tileY = opts.tileY ?? Math.min(height - 24, y0 + 2);
  for (let ly = 1; ly < bh - 1; ly++) {
    for (let lx = 1; lx < bw - 1; lx++) {
      const mIdx = ly * bw + lx;
      if (!mask[mIdx]) continue;

      const gx = x0 + lx, gy = y0 + ly;
      const sx = Math.min(width - 2, Math.max(1, tileX + (lx % 20)));
      const sy = Math.min(height - 2, Math.max(1, tileY + (ly % 20)));

      let mr = 0, mg = 0, mb = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const sIdx = ((sy + dy) * width + (sx + dx)) * channels;
          mr += origCopy[sIdx]; mg += origCopy[sIdx + 1]; mb += origCopy[sIdx + 2];
        }
      }
      mr /= 9; mg /= 9; mb /= 9;
      const scIdx = (sy * width + sx) * channels;
      const dr = (origCopy[scIdx] - mr) * texStrength;
      const dg = (origCopy[scIdx + 1] - mg) * texStrength;
      const db = (origCopy[scIdx + 2] - mb) * texStrength;

      const bIdx = mIdx * 3;
      const dstIdx = (gy * width + gx) * channels;
      data[dstIdx] = Math.min(255, Math.max(0, Math.round(buf[bIdx] + dr)));
      data[dstIdx + 1] = Math.min(255, Math.max(0, Math.round(buf[bIdx + 1] + dg)));
      data[dstIdx + 2] = Math.min(255, Math.max(0, Math.round(buf[bIdx + 2] + db)));
    }
  }
}

async function prepareLogoLayers(logoColor, height, left, top, angle = 0) {
  const logoPath = path.resolve(`public/assets/brand/logo_tracer_${logoColor}.png`);
  let logoPipeline = sharp(logoPath).resize({ height });
  if (angle !== 0) {
    logoPipeline = logoPipeline.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }
  const logoBuf = await logoPipeline.toBuffer();

  const shadowBuf = await sharp(logoBuf)
    .tint({ r: 0, g: 0, b: 0 })
    .blur(1.1)
    .toBuffer();

  return [
    { input: shadowBuf, left: left + 1, top: top + 1, blend: 'multiply' },
    { input: logoBuf, left, top, blend: 'over' },
  ];
}

async function processImage(srcFile, outFile, inpaints, logos = [], isPng = false) {
  const { data, info } = await sharp(srcFile).raw().toBuffer({ resolveWithObject: true });

  for (const inp of inpaints) {
    harmonicInpaint(data, info.width, info.height, info.channels, inp.box, inp.pred, inp.opts);
  }

  let pipeline = sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  });

  if (logos.length > 0) {
    const layers = [];
    for (const l of logos) {
      const ls = await prepareLogoLayers(l.color, l.height, l.left, l.top, l.angle || 0);
      layers.push(...ls);
    }
    pipeline = pipeline.composite(layers);
  }

  if (isPng || outFile.endsWith('.png')) {
    await pipeline.png().toFile(outFile);
  } else {
    await pipeline.jpeg({ quality: 95 }).toFile(outFile);
  }
  console.log(`✓ Fixed ${outFile}`);
}

async function run() {
  console.log('🔧 Running full-domain harmonic inpainting across all High Draw images...');

  // 1. EDITORIAL: Cap Model Sunset Closeup
  await processImage(
    path.join(BRAIN_DIR, 'cap_model_sunset_closeup_1790659606256.jpg'),
    'public/assets/products/editorial/cap_model_sunset_closeup.jpg',
    [
      {
        box: { x0: 608, y0: 162, x1: 708, y1: 244 },
        pred: (r, g, b) => (b - r > 12 || g - r > 8 || r < 175),
        opts: { dilate: 8, iterations: 500, tileX: 575, tileY: 195, texStrength: 0.85 },
      },
    ],
    [{ color: 'cyan', height: 48, left: 644, top: 182, angle: -4 }]
  );

  // 2. EDITORIAL: Women's Polo Carolina Course
  await processImage(
    path.join(BRAIN_DIR, 'women_polo_carolina_course_1790659492687.jpg'),
    'public/assets/products/editorial/women_polo_carolina_course.jpg',
    [
      {
        box: { x0: 632, y0: 242, x1: 676, y1: 282 },
        opts: { ellipse: true, iterations: 400, tileX: 605, tileY: 265 },
      },
    ],
    [{ color: 'black', height: 27, left: 646, top: 256, angle: 0 }]
  );

  // 3. EDITORIAL: Quarter-Zip Pullover Action
  await processImage(
    path.join(BRAIN_DIR, 'quarter_zip_pullover_action_1790659519216.jpg'),
    'public/assets/products/editorial/quarter_zip_pullover_action.jpg',
    [
      {
        box: { x0: 858, y0: 350, x1: 904, y1: 386 },
        opts: { ellipse: true, iterations: 400, tileX: 830, tileY: 375 },
      },
    ],
    [{ color: 'cyan', height: 32, left: 872, top: 362, angle: 0 }]
  );

  // 4. EDITORIAL: Men's Polo Carolina Course
  await processImage(
    path.join(BRAIN_DIR, 'men_polo_carolina_course_1790659466894.jpg'),
    'public/assets/products/editorial/men_polo_carolina_course.jpg',
    [
      {
        box: { x0: 780, y0: 370, x1: 822, y1: 412 },
        opts: { ellipse: true, iterations: 400, tileX: 750, tileY: 395 },
      },
    ],
    [{ color: 'white', height: 30, left: 792, top: 388, angle: 0 }]
  );

  // 5. EDITORIAL: Men's Polo Navy Course
  await processImage(
    path.join(BRAIN_DIR, 'men_polo_navy_course_1790659440421.jpg'),
    'public/assets/products/editorial/men_polo_navy_course.jpg',
    [
      {
        box: { x0: 866, y0: 278, x1: 904, y1: 316 },
        opts: { ellipse: true, iterations: 400, tileX: 838, tileY: 300 },
      },
    ],
    [{ color: 'gold', height: 30, left: 878, top: 294, angle: 0 }]
  );

  // 6. BESPOKE: Quarter-Zip Hero Wood (from clean original pullover_wood_tees_1790631546708.jpg)
  await processImage(
    path.join(BRAIN_DIR, 'pullover_wood_tees_1790631546708.jpg'),
    'public/assets/products/bespoke/quarter_zip_hero_wood.jpg',
    [
      // Remove white neck tag inside navy collar facing (including all 4 rectangular corners)
      {
        box: { x0: 468, y0: 248, x1: 544, y1: 292 },
        pred: (r, g, b) => (r > 52 || g > 58 || b > 72),
        opts: { dilate: 6, iterations: 500, tileX: 435, tileY: 252 },
      },
      // Remove old cyan chest logo
      {
        box: { x0: 536, y0: 386, x1: 618, y1: 456 },
        opts: { ellipse: true, iterations: 500, tileX: 490, tileY: 410 },
      },
    ],
    [{ color: 'cyan', height: 50, left: 562, top: 396, angle: 18 }]
  );

  // 7. BESPOKE: Men's Polo Hero Wood (Keep crisp original chest logo, remove ONLY SPORT-TEK collar tag & box gibberish)
  await processImage(
    path.join(BRAIN_DIR, 'polo_navy_wood_1790631580362.jpg'),
    'public/assets/products/bespoke/men_polo_hero_wood.jpg',
    [
      // Remove yellow SPORT-TEK collar text completely
      {
        box: { x0: 575, y0: 335, x1: 690, y1: 395 },
        pred: (r, g, b) => (r - b > -8),
        opts: { dilate: 6, iterations: 500, tileX: 580, tileY: 345 },
      },
      // Remove yellow AI gibberish text on background gift box while preserving 3D box crease
      {
        box: { x0: 785, y0: 210, x1: 922, y1: 260 },
        pred: (r, g, b) => (r - b > -8),
        opts: { dilate: 5, iterations: 400, tileX: 745, tileY: 215 },
      },
    ],
    []
  );

  // 8. BESPOKE: Men's Polo Black Wood (Keep crisp original chest logo, remove ONLY white SPORT-TEK collar text)
  await processImage(
    path.join(BRAIN_DIR, 'polo_wood_tees_1790631429607.jpg'),
    'public/assets/products/bespoke/men_polo_black_wood.jpg',
    [
      {
        box: { x0: 464, y0: 154, x1: 538, y1: 182 },
        opts: { ellipse: true, iterations: 400, texDx: 0, texDy: 18 },
      },
    ],
    []
  );

  // 9. BESPOKE: Women's Polo Hero Wood (Keep crisp original chest logo, remove ONLY white collar tag text)
  await processImage(
    path.join(BRAIN_DIR, 'polo_carolina_wood_1790631459055.jpg'),
    'public/assets/products/bespoke/women_polo_hero_wood.jpg',
    [
      {
        box: { x0: 604, y0: 314, x1: 682, y1: 348 },
        opts: { ellipse: true, iterations: 400, texDx: -28, texDy: -14 },
      },
    ],
    []
  );

  // 10. GOLFER REVIEW PHOTOS: Full elliptical harmonic inpaint + genuine High Draw tracer
  await processImage(
    path.join(BRAIN_DIR, 'golfer_marcus_cypress_1790577543427.jpg'),
    'public/assets/review_marcus.jpg',
    [
      {
        box: { x0: 540, y0: 448, x1: 604, y1: 506 },
        opts: { ellipse: true, iterations: 500, texDx: -35, texDy: 30 },
      },
    ],
    [{ color: 'gold', height: 32, left: 558, top: 462, angle: 0 }]
  );

  await processImage(
    path.join(BRAIN_DIR, 'golfer_david_carolina_1790577564056.jpg'),
    'public/assets/review_david.jpg',
    [
      {
        box: { x0: 534, y0: 354, x1: 576, y1: 394 },
        opts: { ellipse: true, iterations: 400, texDx: -24, texDy: 24 },
      },
    ],
    [{ color: 'black', height: 24, left: 546, top: 363, angle: 0 }]
  );

  await processImage(
    path.join(BRAIN_DIR, 'golfer_ken_navy_1790577585262.jpg'),
    'public/assets/review_ken.jpg',
    [
      {
        box: { x0: 558, y0: 590, x1: 614, y1: 650 },
        opts: { ellipse: true, iterations: 500, texDx: -35, texDy: 25 },
      },
    ],
    [{ color: 'gold', height: 34, left: 574, top: 602, angle: 0 }]
  );

  console.log('✅ Full-domain harmonic inpainting complete!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
