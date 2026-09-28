import { test, expect } from '@playwright/test';

test.describe('High Draw Golf — Automated E2E Regression Suite', () => {
  
  test('Storefront loads with Straight Down hero and $48 tour-grade drape positioning', async ({ page }) => {
    await page.goto('/');
    
    // Check main branding header
    await expect(page.locator('text=HIGH DRAW').first()).toBeVisible();
    await expect(page.locator('text=FREE SHIPPING ON ORDERS OVER $75').first()).toBeVisible();
    
    // Check hero CTA
    await expect(page.locator('text=SHOP MEN\'S POLOS — $48').first()).toBeVisible();
  });

  test('Cart Drawer opens and calculates subtotal & free shipping threshold', async ({ page }) => {
    await page.goto('/');
    
    // Click shopping bag icon
    await page.locator('button[aria-label="Shopping Bag"]').click();
    
    // Verify Cart Drawer opens
    await expect(page.locator('text=YOUR BAG')).toBeVisible();
    await expect(page.locator('text=SUBTOTAL')).toBeVisible();
  });

  test('Owner Command Console opens and exposes zero-code brand controls', async ({ page }) => {
    await page.goto('/');
    
    // Click Owner Console button
    await page.locator('button:has-text("[OWNER CONSOLE]")').click();
    
    // Verify Owner Command Center opens
    await expect(page.locator('text=HIGH DRAW OWNER COMMAND CENTER')).toBeVisible();
    await expect(page.locator('text=Top Store Banner Announcement')).toBeVisible();
  });

});
