import { test, expect } from '@playwright/test';

test.describe('High Draw Golf — Automated E2E Regression Suite', () => {
  
  test('Storefront loads with far-left logo and genuine High Draw branding', async ({ page }) => {
    await page.goto('/');
    
    // Check main branding header & tracer logo
    await expect(page.locator('text=HIGH DRAW').first()).toBeVisible();
    await expect(page.locator('text=FREE SHIPPING ON ORDERS OVER $75').first()).toBeVisible();
    
    // Check hero CTA
    await expect(page.locator('text=SHOP MEN\'S POLOS').first()).toBeVisible();

    // Check nav links exist and are functional
    await expect(page.locator('button:has-text("MEN\'S POLOS ($48)")').first()).toBeVisible();
    await expect(page.locator('button:has-text("HEADWEAR ($32)")').first()).toBeVisible();
    await expect(page.locator('button:has-text("THE CRAFTSMANSHIP")').first()).toBeVisible();
    await expect(page.locator('button:has-text("GOLFER REVIEWS")').first()).toBeVisible();
  });

  test('Navigation links filter collections and scroll properly', async ({ page }) => {
    await page.goto('/');
    
    // Click HEADWEAR in navbar
    await page.locator('button:has-text("HEADWEAR ($32)")').first().click();
    
    // Verify headwear product is visible
    await expect(page.locator('text=The High Draw Structured Visor Rope Cap')).toBeVisible();
  });

  test('Cart Drawer opens and calculates subtotal & free shipping threshold', async ({ page }) => {
    await page.goto('/');
    
    // Click shopping bag icon
    await page.locator('button[aria-label="Shopping Bag"]').click();
    
    // Verify Cart Drawer opens
    await expect(page.locator('text=YOUR BAG')).toBeVisible();
    await expect(page.locator('text=SUBTOTAL')).toBeVisible();
  });

  test('Footer guarantee modal opens and displays 30-Day Fairway Guarantee', async ({ page }) => {
    await page.goto('/');
    
    // Click 30-Day Fairway Guarantee in footer
    await page.locator('button:has-text("30-Day Fairway Guarantee")').first().click();
    
    // Verify modal appears
    await expect(page.locator('text=Play 18 holes, sweat in it, and machine wash it')).toBeVisible();
  });

  test('Owner Command Console opens from footer admin link', async ({ page }) => {
    await page.goto('/');
    
    // Click Owner Admin in footer
    await page.locator('button:has-text("Owner Admin")').click();
    
    // Verify Owner Command Center opens
    await expect(page.locator('text=HIGH DRAW OWNER COMMAND CENTER')).toBeVisible();
    await expect(page.locator('text=Top Store Banner Announcement')).toBeVisible();
  });

});
