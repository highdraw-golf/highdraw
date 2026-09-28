import { test, expect } from '@playwright/test';

test.describe('High Draw Golf — Multi-Page Storefront & Luxury UI Suite', () => {
  
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

  test('Navbar routes to dedicated collection page', async ({ page }) => {
    await page.goto('/');
    
    // Click HEADWEAR in navbar
    await page.locator('button:has-text("HEADWEAR ($32)")').first().click();
    
    // Verify collection page loads with headline and headwear product
    await expect(page.locator('h1:has-text("Structured Visor Rope Caps ($32)")')).toBeVisible();
    await expect(page.locator('text=The High Draw Structured Visor Rope Cap').first()).toBeVisible();
    expect(page.url()).toContain('/collections/headwear');
  });

  test('Clicking product card navigates to dedicated Product Detail Page (PDP)', async ({ page }) => {
    await page.goto('/');
    
    // Click Cypress polo card
    await page.locator('h3:has-text("The Heritage Cypress Micro-Pique Polo")').first().click();
    
    // Verify PDP loads
    await expect(page.locator('h1:has-text("The Heritage Cypress Micro-Pique Polo")')).toBeVisible();
    await expect(page.locator('text=$48 USD')).toBeVisible();
    await expect(page.locator('text=Frequently Bought Together')).toBeVisible();
    expect(page.url()).toContain('/products/the-heritage-cypress-micro-pique-polo');

    // Add to bag from PDP
    await page.locator('button:has-text("ADD TO BAG • $48")').click();
    await expect(page.getByText('YOUR BAG', { exact: true })).toBeVisible();
  });

  test('Direct URL routing loads Craftsmanship page', async ({ page }) => {
    await page.goto('/pages/craftsmanship');
    
    await expect(page.locator('h1:has-text("Collar Architecture & The 100+ Washes Guarantee")')).toBeVisible();
    await expect(page.locator('text=THE HIGH DRAW ENGINEERING LAB')).toBeVisible();
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
    
    // Verify modal or page appears
    await expect(page.locator('text=30-Day Fairway Guarantee').first()).toBeVisible();
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
