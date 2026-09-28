import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const LOGO_DIR = 'public/assets/logos';
const OUT_DIR = 'public/assets/products/catalog';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Men's Polo ST740 configs (1200x1800)
// Verified exact chest: x=665, y=660, height=56
const MENS_POLOS = [
  { file: 'ST740_truenavy_model_front.jpg', out: 'men_polo_truenavy.jpg', logo: 'logo_tracer_gold.png', x: 665, y: 660, h: 56 },
  { file: 'ST740_black_model_front.jpg', out: 'men_polo_black.jpg', logo: 'logo_tracer_cyan.png', x: 665, y: 660, h: 56 },
  { file: 'ST740_carolinablue_model_front.jpg', out: 'men_polo_carolinablue.jpg', logo: 'logo_tracer_white.png', x: 665, y: 660, h: 56 },
  { file: 'ST740_white_model_front.jpg', out: 'men_polo_white.jpg', logo: 'logo_tracer_cyan.png', x: 665, y: 660, h: 56 },
  { file: 'ST740_forestgreen_model_front.jpg', out: 'men_polo_forestgreen.jpg', logo: 'logo_tracer_gold.png', x: 665, y: 660, h: 56 },
  { file: 'ST740_deepred_model_front.jpg', out: 'men_polo_deepred.jpg', logo: 'logo_tracer_white.png', x: 665, y: 660, h: 56 },
  { file: 'ST740_graphite_model_front.jpg', out: 'men_polo_graphite.jpg', logo: 'logo_tracer_cyan.png', x: 665, y: 660, h: 56 },
  { file: 'ST740_greyconcrete_model_front.jpg', out: 'men_polo_greyconcrete.jpg', logo: 'logo_tracer_white.png', x: 665, y: 660, h: 56 },
  { file: 'ST740_trueroyal_model_front.jpg', out: 'men_polo_trueroyal.jpg', logo: 'logo_tracer_white.png', x: 665, y: 660, h: 56 },
];

// Women's Polo LST740 configs (1800x1800)
// Verified exact chest: x=1010, y=710, height=60
const WOMENS_POLOS = [
  { file: 'LST740_carolinablue_model_front.jpg', out: 'women_polo_carolinablue.jpg', logo: 'logo_tracer_black.png', x: 1010, y: 710, h: 60 },
  { file: 'LST740_black_model_front.jpg', out: 'women_polo_black.jpg', logo: 'logo_tracer_gold.png', x: 1010, y: 710, h: 60 },
  { file: 'LST740_white_model_front.jpg', out: 'women_polo_white.jpg', logo: 'logo_tracer_cyan.png', x: 1010, y: 710, h: 60 },
  { file: 'LST740_truenavy_model_front.jpg', out: 'women_polo_truenavy.jpg', logo: 'logo_tracer_white.png', x: 1010, y: 710, h: 60 },
  { file: 'LST740_deepred_model_front.jpg', out: 'women_polo_deepred.jpg', logo: 'logo_tracer_white.png', x: 1010, y: 710, h: 60 },
  { file: 'LST740_trueroyal_model_front.jpg', out: 'women_polo_trueroyal.jpg', logo: 'logo_tracer_white.png', x: 1010, y: 710, h: 60 },
  { file: 'LST740_greyconcrete_model_front.jpg', out: 'women_polo_greyconcrete.jpg', logo: 'logo_tracer_white.png', x: 1010, y: 710, h: 60 },
  { file: 'LST740_graphite_model_front.jpg', out: 'women_polo_graphite.jpg', logo: 'logo_tracer_cyan.png', x: 1010, y: 710, h: 60 },
];

// Men's 1/4-Zip Pullover ST443 Form Front (1800x1800)
// Verified exact chest: x=1015, y=520, height=58
const QUARTER_ZIPS = [
  { file: 'ST443_truenavywhite_form_front.jpg', out: 'quarter_zip_truenavywhite.jpg', logo: 'logo_tracer_cyan.png', x: 1015, y: 520, h: 58 },
  { file: 'ST443_blackwhite_form_front.jpg', out: 'quarter_zip_blackwhite.jpg', logo: 'logo_tracer_cyan.png', x: 1015, y: 520, h: 58 },
  { file: 'ST443_irongreywhite_form_front.jpg', out: 'quarter_zip_irongreywhite.jpg', logo: 'logo_tracer_cyan.png', x: 1015, y: 520, h: 58 },
  { file: 'ST443_trueroyalwhite_form_front.jpg', out: 'quarter_zip_trueroyalwhite.jpg', logo: 'logo_tracer_white.png', x: 1015, y: 520, h: 58 },
  { file: 'ST443_blackdeepred_form_front.jpg', out: 'quarter_zip_blackdeepred.jpg', logo: 'logo_tracer_white.png', x: 1015, y: 520, h: 58 },
];

// Flexfit Performance Mesh Cap (1800x1800)
// Verified exact crown panel: x=710, y=430, height=75
const HATS = [
  { file: 'left-white_hat.jpg', out: 'hat_white.jpg', logo: 'logo_tracer_cyan.png', x: 710, y: 430, h: 75 },
  { file: 'left-black_hat.jpg', out: 'hat_black.jpg', logo: 'logo_tracer_cyan.png', x: 710, y: 430, h: 75 },
  { file: 'left-truenavy_hat.jpg', out: 'hat_truenavy.jpg', logo: 'logo_tracer_cyan.png', x: 710, y: 430, h: 75 },
  { file: 'left-magnet_hat.jpg', out: 'hat_magnet.jpg', logo: 'logo_tracer_cyan.png', x: 710, y: 430, h: 75 },
  { file: 'left-truered_hat.jpg', out: 'hat_truered.jpg', logo: 'logo_tracer_cyan.png', x: 710, y: 430, h: 75 },
  { file: 'left-trueroyal_hat.jpg', out: 'hat_trueroyal.jpg', logo: 'logo_tracer_cyan.png', x: 710, y: 430, h: 75 },
  { file: 'left-greyheather_hat.jpg', out: 'hat_greyheather.jpg', logo: 'logo_tracer_white.png', x: 710, y: 430, h: 75 },
];

async function processItem(srcPath, outPath, logoFile, targetHeight, leftX, topY) {
  const logoBuffer = await sharp(path.join(LOGO_DIR, logoFile))
    .resize({ height: targetHeight })
    .toBuffer();

  await sharp(srcPath)
    .composite([
      {
        input: logoBuffer,
        left: leftX,
        top: topY,
        blend: 'over'
      }
    ])
    .jpeg({ quality: 92 })
    .toFile(outPath);
}

async function run() {
  console.log("Generating refined Men's Polos...");
  for (const item of MENS_POLOS) {
    const src = path.join('public/assets/products/mens-polo', item.file);
    const dest = path.join(OUT_DIR, item.out);
    await processItem(src, dest, item.logo, item.h, item.x, item.y);
    console.log(`  ✓ ${item.out}`);
  }

  console.log("Generating refined Women's Polos...");
  for (const item of WOMENS_POLOS) {
    const src = path.join('public/assets/products/womens-polo', item.file);
    const dest = path.join(OUT_DIR, item.out);
    await processItem(src, dest, item.logo, item.h, item.x, item.y);
    console.log(`  ✓ ${item.out}`);
  }

  console.log("Generating refined 1/4-Zip Pullovers (Form Front)...");
  for (const item of QUARTER_ZIPS) {
    const src = path.join('public/assets/products/quarter-zip', item.file);
    const dest = path.join(OUT_DIR, item.out);
    await processItem(src, dest, item.logo, item.h, item.x, item.y);
    console.log(`  ✓ ${item.out}`);
  }

  console.log("Generating refined Performance Mesh Caps...");
  for (const item of HATS) {
    const src = path.join('public/assets/products/performance-hat', item.file);
    const dest = path.join(OUT_DIR, item.out);
    await processItem(src, dest, item.logo, item.h, item.x, item.y);
    console.log(`  ✓ ${item.out}`);
  }

  console.log("All 29 catalog images generated with verified subtle placement!");
}

run().catch(err => {
  console.error("Error building catalog:", err);
  process.exit(1);
});
