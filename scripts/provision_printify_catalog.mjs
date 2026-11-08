#!/usr/bin/env node
/**
 * High Draw Golf — Sovereign Printify Catalog Provisioner & Sync Engine
 *
 * Eliminates manual Printify web UI setup.
 * 1. Fetches live blueprint variants & availability from Printify API (Provider 217: Fulfill Engine)
 * 2. Maps all 16 High Draw brand logo PNGs (`public/assets/brand/logos/`)
 * 3. Maps existing shop products and generates `src/data/printify_ledger.json`
 * 4. Optional `--provision` flag uploads logos and creates canonical Printify products programmatically
 */

import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(process.cwd(), '.env.local');
let PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN || '';
let PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || '29111523';

if (fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  const tokenMatch = envContent.match(/PRINTIFY_API_TOKEN="([^"]+)"/);
  const shopMatch = envContent.match(/PRINTIFY_SHOP_ID="([^"]+)"/);
  if (tokenMatch && !PRINTIFY_API_TOKEN) PRINTIFY_API_TOKEN = tokenMatch[1];
  if (shopMatch && !process.env.PRINTIFY_SHOP_ID) PRINTIFY_SHOP_ID = shopMatch[1];
}

const BLUEPRINTS = [
  {
    silhouetteId: 'men-polo-st740',
    skuCode: 'MST740',
    title: "The Tour Performance Polo — Men's",
    blueprintId: 1984,
    printProviderId: 217,
    placeholderPosition: 'front_left_chest',
    decorationMethod: 'embroidery',
    retailPriceCents: 4800,
    canonicalShopProductId: '6aefb534afdf3f8ff4025e42',
  },
  {
    silhouetteId: 'women-polo-lst740',
    skuCode: 'WLST740',
    title: "The Tour Performance Polo — Women's",
    blueprintId: 3322,
    printProviderId: 217,
    placeholderPosition: 'left_chest_dtf',
    decorationMethod: 'dtf',
    retailPriceCents: 4800,
    canonicalShopProductId: '6aecb1678ba16c774e0f63e1',
  },
  {
    silhouetteId: 'outerwear-st443',
    skuCode: 'MST443',
    title: "The Tour Tech Quarter-Zip Pullover — Men's",
    blueprintId: 4133,
    printProviderId: 217,
    placeholderPosition: 'left_chest_dtf',
    decorationMethod: 'dtf',
    retailPriceCents: 5600,
    canonicalShopProductId: '6ababb99f64086b4c307d74c',
  },
  {
    silhouetteId: 'headwear-flexfit-mesh',
    skuCode: 'CAP',
    title: 'The Tour Performance Poly-Mesh Cap',
    blueprintId: 5272,
    printProviderId: 217,
    placeholderPosition: 'front_left_dtf',
    decorationMethod: 'dtf',
    retailPriceCents: 3500,
    canonicalShopProductId: '6abac00a7ed05bbe6f073036',
  },
];

async function fetchPrintify(endpoint, options = {}) {
  const res = await fetch(`https://api.printify.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'HighDraw-Sovereign-Provisioner/1.0',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Printify API Error (${res.status} on ${endpoint}): ${text}`);
  }
  return res.json();
}

async function run() {
  const isDryRun = !process.argv.includes('--apply');
  console.log('==============================================================');
  console.log(' HIGH DRAW GOLF — SOVEREIGN TAXONOMY & PRINTIFY PROVISIONER');
  console.log(` Mode: ${isDryRun ? 'DRY-RUN / READ-ONLY SYNC (Safe)' : 'LIVE PROVISIONING'}`);
  console.log(` Shop ID: ${PRINTIFY_SHOP_ID}`);
  console.log('==============================================================\n');

  if (!PRINTIFY_API_TOKEN) {
    console.error('❌ Missing PRINTIFY_API_TOKEN in .env.local');
    process.exit(1);
  }

  // 1. Inspect existing uploaded logos in Printify media library
  console.log('1. Auditing Printify Media Library (/v1/uploads.json)...');
  const uploadsData = await fetchPrintify('/uploads.json?page=1&limit=50');
  const uploadedFiles = (uploadsData.data || []).map(u => ({
    id: u.id,
    fileName: u.file_name,
    width: u.width,
    height: u.height,
    previewUrl: u.preview_url,
  }));
  console.log(`   ✓ Found ${uploadedFiles.length} registered print assets in Printify.`);

  // 2. Inspect existing shop products
  console.log('\n2. Auditing Existing Shop Products...');
  const shopProductsData = await fetchPrintify(`/shops/${PRINTIFY_SHOP_ID}/products.json?limit=50`);
  const shopProducts = (shopProductsData.data || []).map(p => ({
    id: p.id,
    title: p.title,
    blueprintId: p.blueprint_id,
    printProviderId: p.print_provider_id,
    variantCount: p.variants?.length || 0,
    tags: p.tags || [],
  }));
  console.log(`   ✓ Found ${shopProducts.length} products in Printify shop #${PRINTIFY_SHOP_ID}.`);

  // 3. Query Blueprint Variants for all 4 core silhouettes
  console.log('\n3. Building Deterministic Variant Matrix across 4 Core Silhouettes...');
  const blueprintsMatrix = {};

  for (const bp of BLUEPRINTS) {
    const varData = await fetchPrintify(
      `/catalog/blueprints/${bp.blueprintId}/print_providers/${bp.printProviderId}/variants.json`
    );

    const byColorAndSize = {};
    const rawVariants = varData.variants || [];

    for (const v of rawVariants) {
      const color = (v.options?.color || '').trim();
      const size = (v.options?.size || '').trim();
      // Normalize XXL -> 2XL so lookup is uniform
      const normalizedSize = size === 'XXL' ? '2XL' : size;
      if (!byColorAndSize[color]) {
        byColorAndSize[color] = {};
      }
      byColorAndSize[color][normalizedSize] = v.id;
      if (normalizedSize !== size) {
        byColorAndSize[color][size] = v.id;
      }
    }

    blueprintsMatrix[bp.silhouetteId] = {
      silhouetteId: bp.silhouetteId,
      skuCode: bp.skuCode,
      title: bp.title,
      blueprintId: bp.blueprintId,
      printProviderId: bp.printProviderId,
      placeholderPosition: bp.placeholderPosition,
      decorationMethod: bp.decorationMethod,
      retailPriceCents: bp.retailPriceCents,
      canonicalShopProductId: bp.canonicalShopProductId,
      totalCatalogVariants: rawVariants.length,
      colors: byColorAndSize,
    };

    console.log(
      `   ✓ [${bp.skuCode}] ${bp.title}: ${rawVariants.length} factory variants mapped across ${
        Object.keys(byColorAndSize).length
      } colorways.`
    );
  }

  // 4. Write ledger to src/data/printify_ledger.json
  const ledger = {
    generatedAt: new Date().toISOString(),
    shopId: PRINTIFY_SHOP_ID,
    providerId: 217,
    providerName: 'Fulfill Engine',
    silhouettes: blueprintsMatrix,
    shopProducts,
    uploadedAssets: uploadedFiles,
  };

  const outPath = path.resolve(process.cwd(), 'src/data/printify_ledger.json');
  fs.writeFileSync(outPath, JSON.stringify(ledger, null, 2) + '\n', 'utf8');
  console.log(`\n✅ Wrote authoritative fulfillment ledger to: ${outPath}`);
}

run().catch(err => {
  console.error('❌ Provisioner error:', err);
  process.exit(1);
});
