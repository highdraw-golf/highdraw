import { chromium } from 'playwright';

const BASE_URL = 'https://www.highdrawgear.com';
const ARTIFACT_DIR = '/Users/kyle/.gemini/antigravity/brain/b6b677d3-5fc5-4227-8755-1b0a3091bbb4';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Hero & Ticker
  await page.screenshot({ path: `${ARTIFACT_DIR}/final_live_hero_ticker.png` });

  // 2. Open Cart Drawer and capture Step 1: Bag
  console.log('Opening Cart Drawer...');
  const cartButton = page.locator('button[title*="Cart"], button:has(svg.lucide-shopping-bag)').first();
  if (await cartButton.count() > 0) {
    await cartButton.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${ARTIFACT_DIR}/final_live_cart_step1_bag.png` });

    // Click Proceed to Checkout to show Step 2: Real Shipping Details
    console.log('Clicking Proceed to Checkout...');
    const checkoutBtn = page.locator('button:has-text("PROCEED TO CHECKOUT")').first();
    if (await checkoutBtn.count() > 0) {
      await checkoutBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${ARTIFACT_DIR}/final_live_cart_step2_shipping.png` });
    }
  }

  // 3. Why High Draw section
  console.log('Navigating to Why High Draw section...');
  const whySection = page.locator('#why');
  if (await whySection.count() > 0) {
    await whySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${ARTIFACT_DIR}/final_live_why_section_10wash.png` });
  }

  await browser.close();
  console.log('Done capturing final live verification!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
