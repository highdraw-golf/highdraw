import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const BRAIN_DIR = '/Users/kendallkylecyree/.gemini/antigravity/brain/b6b677d3-5fc5-4227-8755-1b0a3091bbb4';
const LOGOS_DIR = 'public/assets/brand/logos';
const CATALOG_OUT = 'public/assets/products/catalog';
const BESPOKE_OUT = 'public/assets/products/bespoke';
const EDITORIAL_OUT = 'public/assets/products/editorial';
const UNBRANDED_OUT = 'public/assets/products/unbranded';

for (const d of [CATALOG_OUT, BESPOKE_OUT, EDITORIAL_OUT, UNBRANDED_OUT]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

/**
 * Harmonic (Laplacian) Inpainting + High-Frequency Fabric Weave Transfer
 */
function harmonicInpaint(data, width, height, channels, box, maskPred, opts = {}) {
  const { x0, y0, x1, y1 } = box;
  const dilate = opts.dilate ?? 4;
  const iterations = opts.iterations ?? 400;
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

async function prepareLogoLayers(logoFile, height, left, top, angle = 0) {
  const logoPath = path.resolve(LOGOS_DIR, logoFile);
  let logoPipeline = sharp(logoPath).resize({ height });
  if (angle !== 0) {
    logoPipeline = logoPipeline.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }
  const logoBuf = await logoPipeline.toBuffer();

  const shadowBuf = await sharp(logoBuf)
    .tint({ r: 0, g: 0, b: 0 })
    .blur(1.0)
    .toBuffer();

  return [
    { input: shadowBuf, left: left + 1, top: top + 1, blend: 'multiply' },
    { input: logoBuf, left, top, blend: 'over' },
  ];
}

async function processImage(srcFile, outFile, inpaints = [], logos = [], cropHat = false) {
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
      const ls = await prepareLogoLayers(l.file, l.height, l.left, l.top, l.angle || 0);
      layers.push(...ls);
    }
    pipeline = pipeline.composite(layers);
  }

  if (cropHat) {
    pipeline = pipeline
      .extract({ left: 250, top: 80, width: 1300, height: 1300 })
      .resize(1200, 1200);
  }

  if (outFile.endsWith('.png')) {
    await pipeline.png().toFile(outFile);
  } else {
    await pipeline.jpeg({ quality: 95 }).toFile(outFile);
  }
  console.log(`  ✓ ${outFile}`);
}

async function run() {
  console.log('🎨 Regenerating Bespoke & Editorial Images with Official HighDraw Logos...');

  // 1. Men's Polo Hero Wood: Full clean removal of old chest mark + SPORT-TEK tag + box gibberish, composite Mark + Monogram Gold
  await processImage(
    path.join(BRAIN_DIR, 'polo_navy_wood_1790631580362.jpg'),
    path.join(BESPOKE_OUT, 'men_polo_hero_wood.jpg'),
    [
      {
        box: { x0: 575, y0: 335, x1: 690, y1: 395 },
        pred: (r, g, b) => (r - b > -8),
        opts: { dilate: 6, iterations: 500, tileX: 580, tileY: 345 },
      },
      {
        box: { x0: 785, y0: 210, x1: 922, y1: 260 },
        pred: (r, g, b) => (r - b > -8),
        opts: { dilate: 5, iterations: 400, tileX: 745, tileY: 215 },
      },
      {
        box: { x0: 595, y0: 495, x1: 730, y1: 605 },
        opts: { rect: true, iterations: 600, tileX: 540, tileY: 530 },
      },
    ],
    [{ file: 'mark_monogram_gold.png', height: 62, left: 632, top: 518, angle: 32 }]
  );

  // 2. Men's Polo Black Wood: Full clean removal of SPORT-TEK tag & old chest mark, composite Mark + Monogram Cyan
  await processImage(
    path.join(BRAIN_DIR, 'polo_wood_tees_1790631429607.jpg'),
    path.join(BESPOKE_OUT, 'men_polo_black_wood.jpg'),
    [
      {
        box: { x0: 458, y0: 148, x1: 545, y1: 186 },
        opts: { rect: true, iterations: 500, tileX: 465, tileY: 195 },
      },
      {
        box: { x0: 575, y0: 265, x1: 675, y1: 380 },
        opts: { rect: true, iterations: 600, tileX: 535, tileY: 310 },
      },
    ],
    [{ file: 'mark_monogram_cyan.png', height: 62, left: 592, top: 290, angle: 0 }]
  );

  // 3. Women's Polo Hero Wood: Full clean removal of collar tag & old chest mark, composite Mark + Monogram Black
  await processImage(
    path.join(BRAIN_DIR, 'polo_carolina_wood_1790631459055.jpg'),
    path.join(BESPOKE_OUT, 'women_polo_hero_wood.jpg'),
    [
      {
        box: { x0: 600, y0: 310, x1: 685, y1: 350 },
        opts: { rect: true, iterations: 500, tileX: 560, tileY: 295 },
      },
      {
        box: { x0: 620, y0: 475, x1: 735, y1: 570 },
        opts: { rect: true, iterations: 600, tileX: 570, tileY: 515 },
      },
    ],
    [{ file: 'mark_monogram_black.png', height: 56, left: 646, top: 494, angle: 28 }]
  );

  // 4. Quarter-Zip Hero Wood: Clean collar tag & chest mark, composite Mark + Monogram Cyan
  await processImage(
    path.join(BRAIN_DIR, 'pullover_wood_tees_1790631546708.jpg'),
    path.join(BESPOKE_OUT, 'quarter_zip_hero_wood.jpg'),
    [
      {
        box: { x0: 468, y0: 248, x1: 544, y1: 292 },
        pred: (r, g, b) => (r > 52 || g > 58 || b > 72),
        opts: { dilate: 6, iterations: 500, tileX: 435, tileY: 252 },
      },
      {
        box: { x0: 536, y0: 386, x1: 618, y1: 456 },
        opts: { ellipse: true, iterations: 500, tileX: 490, tileY: 410 },
      },
    ],
    [{ file: 'mark_monogram_cyan.png', height: 54, left: 556, top: 394, angle: 16 }]
  );

  // 5. Hat Hero Wood: Predicate-based seamless removal of old cyan crown mark, composite Mark + Monogram Cyan
  await processImage(
    path.join(BRAIN_DIR, 'cap_wood_tees_1790631513053.jpg'),
    path.join(BESPOKE_OUT, 'hat_hero_wood.jpg'),
    [
      {
        box: { x0: 520, y0: 440, x1: 625, y1: 592 },
        pred: (r, g, b) => (b - r > 8 || g - r > 8),
        opts: { dilate: 5, iterations: 500, tileX: 480, tileY: 495 },
      },
    ],
    [{ file: 'mark_monogram_cyan.png', height: 84, left: 538, top: 472, angle: 6 }]
  );

  // 6. Editorial Images with Mark + Monogram
  await processImage(
    path.join(BRAIN_DIR, 'men_polo_navy_course_1790659440421.jpg'),
    path.join(EDITORIAL_OUT, 'men_polo_navy_course.jpg'),
    [
      {
        box: { x0: 866, y0: 278, x1: 904, y1: 316 },
        opts: { ellipse: true, iterations: 400, tileX: 838, tileY: 300 },
      },
    ],
    [{ file: 'mark_monogram_gold.png', height: 34, left: 874, top: 292, angle: 0 }]
  );

  await processImage(
    path.join(BRAIN_DIR, 'men_polo_carolina_course_1790659466894.jpg'),
    path.join(EDITORIAL_OUT, 'men_polo_carolina_course.jpg'),
    [
      {
        box: { x0: 780, y0: 370, x1: 822, y1: 412 },
        opts: { ellipse: true, iterations: 400, tileX: 750, tileY: 395 },
      },
    ],
    [{ file: 'mark_monogram_white.png', height: 34, left: 788, top: 386, angle: 0 }]
  );

  await processImage(
    path.join(BRAIN_DIR, 'women_polo_carolina_course_1790659492687.jpg'),
    path.join(EDITORIAL_OUT, 'women_polo_carolina_course.jpg'),
    [
      {
        box: { x0: 632, y0: 242, x1: 676, y1: 282 },
        opts: { ellipse: true, iterations: 400, tileX: 605, tileY: 265 },
      },
    ],
    [{ file: 'mark_monogram_black.png', height: 30, left: 642, top: 254, angle: 0 }]
  );

  await processImage(
    path.join(BRAIN_DIR, 'quarter_zip_pullover_action_1790659519216.jpg'),
    path.join(EDITORIAL_OUT, 'quarter_zip_pullover_action.jpg'),
    [
      {
        box: { x0: 858, y0: 350, x1: 904, y1: 386 },
        opts: { ellipse: true, iterations: 400, tileX: 830, tileY: 375 },
      },
    ],
    [{ file: 'mark_monogram_cyan.png', height: 36, left: 868, top: 360, angle: 0 }]
  );

  await processImage(
    path.join(BRAIN_DIR, 'cap_model_sunset_closeup_1790659606256.jpg'),
    path.join(EDITORIAL_OUT, 'cap_model_sunset_closeup.jpg'),
    [
      {
        box: { x0: 608, y0: 162, x1: 708, y1: 244 },
        pred: (r, g, b) => (b - r > 12 || g - r > 8 || r < 175),
        opts: { dilate: 8, iterations: 500, tileX: 575, tileY: 195, texStrength: 0.85 },
      },
    ],
    [{ file: 'mark_monogram_cyan.png', height: 52, left: 636, top: 179, angle: -4 }]
  );

  console.log('🎨 Regenerating 29 Catalog Images with Exact Printify Physical Dimensions & Tag Removal...');

  // Men's Polos: 2.0" left chest (height: 54, left: 710, top: 655)
  const MENS_POLOS = [
    { file: 'ST740_truenavy_model_front.jpg', out: 'men_polo_truenavy.jpg', logo: 'mark_monogram_gold.png' },
    { file: 'ST740_black_model_front.jpg', out: 'men_polo_black.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'ST740_carolinablue_model_front.jpg', out: 'men_polo_carolinablue.jpg', logo: 'mark_monogram_white.png' },
    { file: 'ST740_white_model_front.jpg', out: 'men_polo_white.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'ST740_forestgreen_model_front.jpg', out: 'men_polo_forestgreen.jpg', logo: 'mark_monogram_gold.png' },
    { file: 'ST740_deepred_model_front.jpg', out: 'men_polo_deepred.jpg', logo: 'mark_monogram_white.png' },
    { file: 'ST740_graphite_model_front.jpg', out: 'men_polo_graphite.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'ST740_greyconcrete_model_front.jpg', out: 'men_polo_greyconcrete.jpg', logo: 'mark_monogram_black.png' },
    { file: 'ST740_trueroyal_model_front.jpg', out: 'men_polo_trueroyal.jpg', logo: 'mark_monogram_white.png' },
  ];

  for (const item of MENS_POLOS) {
    await processImage(
      path.join('public/assets/products/mens-polo', item.file),
      path.join(CATALOG_OUT, item.out),
      [],
      [{ file: item.logo, height: 54, left: 710, top: 655 }]
    );
  }

  // Women's Polos: 1.75" left chest (height: 48, left: 1030, top: 730)
  const WOMENS_POLOS = [
    { file: 'LST740_carolinablue_model_front.jpg', out: 'women_polo_carolinablue.jpg', logo: 'mark_monogram_black.png' },
    { file: 'LST740_black_model_front.jpg', out: 'women_polo_black.jpg', logo: 'mark_monogram_gold.png' },
    { file: 'LST740_white_model_front.jpg', out: 'women_polo_white.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'LST740_truenavy_model_front.jpg', out: 'women_polo_truenavy.jpg', logo: 'mark_monogram_white.png' },
    { file: 'LST740_deepred_model_front.jpg', out: 'women_polo_deepred.jpg', logo: 'mark_monogram_white.png' },
    { file: 'LST740_trueroyal_model_front.jpg', out: 'women_polo_trueroyal.jpg', logo: 'mark_monogram_white.png' },
    { file: 'LST740_greyconcrete_model_front.jpg', out: 'women_polo_greyconcrete.jpg', logo: 'mark_monogram_black.png' },
    { file: 'LST740_graphite_model_front.jpg', out: 'women_polo_graphite.jpg', logo: 'mark_monogram_cyan.png' },
  ];

  for (const item of WOMENS_POLOS) {
    await processImage(
      path.join('public/assets/products/womens-polo', item.file),
      path.join(CATALOG_OUT, item.out),
      [],
      [{ file: item.logo, height: 48, left: 1030, top: 730 }]
    );
  }

  // Quarter-Zips: Remove white SPORT-TEK neck tag + 2.0" left chest (height: 54, left: 990, top: 540)
  const QUARTER_ZIPS = [
    { file: 'ST443_truenavywhite_form_front.jpg', out: 'quarter_zip_truenavywhite.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'ST443_blackwhite_form_front.jpg', out: 'quarter_zip_blackwhite.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'ST443_irongreywhite_form_front.jpg', out: 'quarter_zip_irongreywhite.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'ST443_trueroyalwhite_form_front.jpg', out: 'quarter_zip_trueroyalwhite.jpg', logo: 'mark_monogram_white.png' },
    { file: 'ST443_blackdeepred_form_front.jpg', out: 'quarter_zip_blackdeepred.jpg', logo: 'mark_monogram_white.png' },
  ];

  for (const item of QUARTER_ZIPS) {
    await processImage(
      path.join('public/assets/products/quarter-zip', item.file),
      path.join(CATALOG_OUT, item.out),
      [
        {
          box: { x0: 830, y0: 155, x1: 912, y1: 202 },
          opts: { rect: true, iterations: 400, tileX: 790, tileY: 165 },
        },
      ],
      [{ file: item.logo, height: 54, left: 990, top: 540 }]
    );
  }

  // Hats: Crown embroidery + center-crop (1200x1200)
  const HATS = [
    { file: 'left-white_hat.jpg', out: 'hat_white.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'left-black_hat.jpg', out: 'hat_black.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'left-truenavy_hat.jpg', out: 'hat_truenavy.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'left-magnet_hat.jpg', out: 'hat_magnet.jpg', logo: 'mark_monogram_cyan.png' },
    { file: 'left-truered_hat.jpg', out: 'hat_truered.jpg', logo: 'mark_monogram_white.png' },
    { file: 'left-trueroyal_hat.jpg', out: 'hat_trueroyal.jpg', logo: 'mark_monogram_white.png' },
    { file: 'left-greyheather_hat.jpg', out: 'hat_greyheather.jpg', logo: 'mark_monogram_black.png' },
  ];

  for (const item of HATS) {
    await processImage(
      path.join('public/assets/products/performance-hat', item.file),
      path.join(CATALOG_OUT, item.out),
      [],
      [{ file: item.logo, height: 74, left: 685, top: 395 }],
      true
    );
    await processImage(
      path.join('public/assets/products/performance-hat', item.file),
      path.join(UNBRANDED_OUT, item.out),
      [],
      [],
      true
    );
  }

  console.log('🎨 Generating Unbranded Clean Base Images for Live Customizer...');

  await processImage(
    path.join(BRAIN_DIR, 'polo_navy_wood_1790631580362.jpg'),
    path.join(UNBRANDED_OUT, 'men_polo_hero_wood.jpg'),
    [
      {
        box: { x0: 575, y0: 335, x1: 690, y1: 395 },
        pred: (r, g, b) => (r - b > -8),
        opts: { dilate: 6, iterations: 500, tileX: 580, tileY: 345 },
      },
      {
        box: { x0: 785, y0: 210, x1: 922, y1: 260 },
        pred: (r, g, b) => (r - b > -8),
        opts: { dilate: 5, iterations: 400, tileX: 745, tileY: 215 },
      },
      {
        box: { x0: 595, y0: 495, x1: 730, y1: 605 },
        opts: { rect: true, iterations: 600, tileX: 540, tileY: 530 },
      },
    ],
    []
  );

  await processImage(
    path.join(BRAIN_DIR, 'polo_wood_tees_1790631429607.jpg'),
    path.join(UNBRANDED_OUT, 'men_polo_black_wood.jpg'),
    [
      {
        box: { x0: 458, y0: 148, x1: 545, y1: 186 },
        opts: { rect: true, iterations: 500, tileX: 465, tileY: 195 },
      },
      {
        box: { x0: 575, y0: 265, x1: 675, y1: 380 },
        opts: { rect: true, iterations: 600, tileX: 535, tileY: 310 },
      },
    ],
    []
  );

  await processImage(
    path.join(BRAIN_DIR, 'polo_carolina_wood_1790631459055.jpg'),
    path.join(UNBRANDED_OUT, 'women_polo_hero_wood.jpg'),
    [
      {
        box: { x0: 600, y0: 310, x1: 685, y1: 350 },
        opts: { rect: true, iterations: 500, tileX: 560, tileY: 295 },
      },
      {
        box: { x0: 620, y0: 475, x1: 735, y1: 570 },
        opts: { rect: true, iterations: 600, tileX: 570, tileY: 515 },
      },
    ],
    []
  );

  await processImage(
    path.join(BRAIN_DIR, 'pullover_wood_tees_1790631546708.jpg'),
    path.join(UNBRANDED_OUT, 'quarter_zip_hero_wood.jpg'),
    [
      {
        box: { x0: 468, y0: 248, x1: 544, y1: 292 },
        pred: (r, g, b) => (r > 52 || g > 58 || b > 72),
        opts: { dilate: 6, iterations: 500, tileX: 435, tileY: 252 },
      },
      {
        box: { x0: 536, y0: 386, x1: 618, y1: 456 },
        opts: { ellipse: true, iterations: 500, tileX: 490, tileY: 410 },
      },
    ],
    []
  );

  await processImage(
    path.join(BRAIN_DIR, 'cap_wood_tees_1790631513053.jpg'),
    path.join(UNBRANDED_OUT, 'hat_hero_wood.jpg'),
    [
      {
        box: { x0: 520, y0: 440, x1: 625, y1: 592 },
        pred: (r, g, b) => (b - r > 8 || g - r > 8),
        opts: { dilate: 5, iterations: 500, tileX: 480, tileY: 495 },
      },
    ],
    []
  );

  for (const item of QUARTER_ZIPS) {
    await processImage(
      path.join('public/assets/products/quarter-zip', item.file),
      path.join(UNBRANDED_OUT, item.out),
      [
        {
          box: { x0: 830, y0: 155, x1: 912, y1: 202 },
          opts: { rect: true, iterations: 400, tileX: 790, tileY: 165 },
        },
      ],
      []
    );
  }

  console.log('✅ All product, editorial & unbranded customizer base images generated!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
