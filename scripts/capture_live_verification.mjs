import { chromium } from 'playwright';

const BASE_URL = 'https://www.highdrawgear.com';
const ARTIFACT_DIR = '/Users/kyle/.gemini/antigravity/brain/b6b677d3-5fc5-4227-8755-1b0a3091bbb4';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Catalog section with bespoke wood thumbnails
  console.log('Capturing catalog...');
  const shopSection = page.locator('text=THE PERFORMANCE LINEUP');
  if (await shopSection.count() > 0) {
    await shopSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${ARTIFACT_DIR}/live_catalog_bespoke_wood.png` });
  }

  // 2. Craftsmanship & Pricing Math section
  console.log('Capturing Why High Draw section...');
  const whySection = page.locator('#why');
  if (await whySection.count() > 0) {
    await whySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${ARTIFACT_DIR}/live_why_highdraw_pricing_collar.png` });
  }

  // 3. Men's Polo PDP
  console.log('Capturing Men Polo PDP...');
  await page.goto(`${BASE_URL}/products/mens-tour-performance-polo`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ARTIFACT_DIR}/live_pdp_men_polo_bespoke.png` });

  // 4. Quarter-Zip PDP
  console.log('Capturing Quarter Zip PDP...');
  await page.goto(`${BASE_URL}/products/mens-tour-tech-quarter-zip`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ARTIFACT_DIR}/live_pdp_quarter_zip_bespoke.png` });

  // 5. Performance Cap PDP
  console.log('Capturing Cap PDP...');
  await page.goto(`${BASE_URL}/products/tour-performance-poly-mesh-cap`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ARTIFACT_DIR}/live_pdp_hat_bespoke.png` });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
