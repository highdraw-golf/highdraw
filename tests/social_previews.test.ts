import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  price: number;
}

interface ResolvedMeta {
  canonicalUrl: string;
  title: string;
  description: string;
  ogType: 'website' | 'product';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  priceAmount?: string;
  priceCurrency?: string;
}

const ROOT = process.cwd();

async function loadProducts(): Promise<ProductRecord[]> {
  const mod = (await import(pathToFileURL(path.join(ROOT, 'src/data/products.ts')).href)) as {
    PRODUCTS: ProductRecord[];
  };
  return mod.PRODUCTS;
}

async function loadSocialMetadata(): Promise<{
  CANONICAL_ORIGIN: string;
  resolveSocialMetadata: (pathname: string, search?: string, baseOrigin?: string) => ResolvedMeta;
}> {
  return (await import(pathToFileURL(path.join(ROOT, 'src/lib/socialMetadata.ts')).href)) as {
    CANONICAL_ORIGIN: string;
    resolveSocialMetadata: (pathname: string, search?: string, baseOrigin?: string) => ResolvedMeta;
  };
}

async function loadPrerenderer(): Promise<{
  prerenderSocialRoutes: (distDir?: string) => Promise<string[]>;
}> {
  return (await import(
    pathToFileURL(path.join(ROOT, 'scripts/prerender_social_routes.mjs')).href
  )) as {
    prerenderSocialRoutes: (distDir?: string) => Promise<string[]>;
  };
}

function parseJpegDimensions(buffer: Buffer): { width: number; height: number } {
  assert.ok(buffer.length > 10, 'JPEG buffer is unexpectedly short');
  assert.equal(buffer[0], 0xff, 'Missing JPEG SOI byte 0');
  assert.equal(buffer[1], 0xd8, 'Missing JPEG SOI byte 1');

  let offset = 2;
  while (offset < buffer.length - 1) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buffer[offset + 1];
    // Standalone markers (TEM, RST0..7, SOI, EOI)
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2;
      continue;
    }
    const segmentLength = buffer.readUInt16BE(offset + 2);
    // SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2)
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    offset += 2 + segmentLength;
  }
  throw new Error('Could not find JPEG SOF marker');
}

function createMockRes() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body = '';
  let ended = false;

  const res = {
    setHeader(key: string, value: string) {
      headers[key.toLowerCase()] = value;
      return res;
    },
    status(code: number) {
      statusCode = code;
      return res;
    },
    send(payload: string) {
      body = payload;
      ended = true;
      return res;
    },
    end(payload?: string) {
      if (typeof payload === 'string') body = payload;
      ended = true;
      return res;
    },
    json(payload: unknown) {
      body = JSON.stringify(payload);
      ended = true;
      return res;
    },
    getStatus: () => statusCode,
    getHeaders: () => headers,
    getBody: () => body,
    isEnded: () => ended,
  };
  return res;
}

test('1. index.html & codebase have zero highdrawgolf.com domain leaks and valid canonical/OG/Twitter tags', () => {
  const filesToCheck = [
    'index.html',
    'src/components/FoursomeConciergeModal.tsx',
    'src/components/FoursomeTryOnModal.tsx',
    'api/stripe.ts',
    'api/printify.ts',
  ];

  for (const relPath of filesToCheck) {
    const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    assert.ok(
      !content.includes('highdrawgolf.com'),
      `${relPath} still references unrelated domain highdrawgolf.com`
    );
  }

  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(
    /<link\s+rel="canonical"\s+href="https:\/\/www\.highdrawgear\.com\/"\s*\/>/.test(indexHtml),
    'index.html must declare <link rel="canonical" href="https://www.highdrawgear.com/" />'
  );
  assert.ok(
    indexHtml.includes('<meta property="og:url" content="https://www.highdrawgear.com/" />'),
    'index.html must point og:url to https://www.highdrawgear.com/'
  );
  assert.ok(
    indexHtml.includes('<meta property="og:site_name" content="High Draw Golf" />'),
    'index.html must include og:site_name'
  );
  assert.ok(
    indexHtml.includes('<meta property="og:locale" content="en_US" />'),
    'index.html must include og:locale'
  );
  assert.ok(
    indexHtml.includes('<meta property="og:image" content="https://www.highdrawgear.com/assets/og/og-home.jpg" />'),
    'index.html must point og:image to https://www.highdrawgear.com/assets/og/og-home.jpg'
  );
  assert.ok(
    indexHtml.includes('<meta property="og:image:secure_url" content="https://www.highdrawgear.com/assets/og/og-home.jpg" />'),
    'index.html must include og:image:secure_url'
  );
  assert.ok(
    indexHtml.includes('<meta property="og:image:type" content="image/jpeg" />'),
    'index.html must include og:image:type="image/jpeg"'
  );
  assert.ok(
    indexHtml.includes('<meta property="og:image:width" content="1200" />'),
    'index.html must include og:image:width="1200"'
  );
  assert.ok(
    indexHtml.includes('<meta property="og:image:height" content="630" />'),
    'index.html must include og:image:height="630"'
  );
  assert.ok(
    /<meta\s+property="og:image:alt"\s+content="[^"]+"\s*\/>/.test(indexHtml),
    'index.html must include og:image:alt'
  );
  assert.ok(
    !indexHtml.includes('property="twitter:'),
    'index.html must use name="twitter:..." instead of invalid property="twitter:..."'
  );
  for (const attr of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) {
    assert.ok(
      indexHtml.includes(`name="${attr}"`),
      `index.html must include name="${attr}"`
    );
  }
  assert.ok(
    indexHtml.includes('"url": "https://www.highdrawgear.com/products/mens-weekender-performance-polo"'),
    'JSON-LD Product offer must point to https://www.highdrawgear.com/products/mens-weekender-performance-polo'
  );
});

test('2. Generated public/assets/og/*.jpg cards exist, are 1200x630 valid JPEGs, and stay under 280 KB', async () => {
  const PRODUCTS = await loadProducts();
  const expectedFiles = [
    'og-home.jpg',
    ...PRODUCTS.map((p) => `${p.slug}.jpg`),
    'og-collections.jpg',
    'og-craftsmanship.jpg',
    'og-about.jpg',
    'og-reviews.jpg',
    'og-guarantee.jpg',
    'og-logo-studio.jpg',
  ];

  assert.equal(expectedFiles.length, 15);

  for (const fileName of expectedFiles) {
    const filePath = path.join(ROOT, 'public/assets/og', fileName);
    assert.ok(fs.existsSync(filePath), `Missing OG card image: ${filePath}`);
    const buf = fs.readFileSync(filePath);
    assert.ok(buf.length >= 15_000, `${fileName} unexpectedly small (${buf.length} bytes)`);
    assert.ok(buf.length <= 280_000, `${fileName} exceeds 280 KB WhatsApp/Facebook threshold (${buf.length} bytes)`);
    const dims = parseJpegDimensions(buf);
    assert.equal(dims.width, 1200, `${fileName} width must be 1200, got ${dims.width}`);
    assert.equal(dims.height, 630, `${fileName} height must be 630, got ${dims.height}`);
  }
});

test('3. resolveSocialMetadata covers home, all 8 products (slug + id + fuzzy), collections, and editorial pages', async () => {
  const PRODUCTS = await loadProducts();
  const { CANONICAL_ORIGIN, resolveSocialMetadata } = await loadSocialMetadata();

  assert.equal(CANONICAL_ORIGIN, 'https://www.highdrawgear.com');

  const home = resolveSocialMetadata('/', '');
  assert.equal(home.canonicalUrl, 'https://www.highdrawgear.com/');
  assert.equal(home.ogType, 'website');
  assert.equal(home.ogImage, 'https://www.highdrawgear.com/assets/og/og-home.jpg');
  assert.equal(home.ogImageWidth, 1200);
  assert.equal(home.ogImageHeight, 630);

  for (const product of PRODUCTS) {
    const bySlug = resolveSocialMetadata(`/products/${product.slug}`, '');
    assert.equal(bySlug.canonicalUrl, `https://www.highdrawgear.com/products/${product.slug}`);
    assert.equal(bySlug.ogType, 'product');
    assert.equal(bySlug.ogImage, `https://www.highdrawgear.com/assets/og/${product.slug}.jpg`);
    assert.equal(bySlug.priceAmount, product.price.toFixed(2));
    assert.equal(bySlug.priceCurrency, 'USD');
    assert.ok(bySlug.title.includes(product.name), `Product title should include ${product.name}`);

    const byId = resolveSocialMetadata(`/products/${product.id}`, '');
    assert.equal(byId.canonicalUrl, bySlug.canonicalUrl);
    assert.equal(byId.ogImage, bySlug.ogImage);
  }

  // Fuzzy product paths match App.tsx
  assert.equal(
    resolveSocialMetadata('/products/clubhouse-womens').canonicalUrl,
    'https://www.highdrawgear.com/products/womens-clubhouse-fine-pique-polo'
  );
  assert.equal(
    resolveSocialMetadata('/products/quarter-zip').canonicalUrl,
    'https://www.highdrawgear.com/products/clubhouse-value-fleece-quarter-zip'
  );
  assert.equal(
    resolveSocialMetadata('/products/scramble').canonicalUrl,
    'https://www.highdrawgear.com/products/the-saturday-foursome-scramble-kit'
  );

  const clubhouseCol = resolveSocialMetadata('/collections/clubhouse');
  assert.equal(clubhouseCol.canonicalUrl, 'https://www.highdrawgear.com/collections/clubhouse');
  assert.equal(clubhouseCol.ogImage, 'https://www.highdrawgear.com/assets/og/og-collections.jpg');

  const weekenderPolos = resolveSocialMetadata('/collections/polos', '?tier=weekender');
  assert.equal(weekenderPolos.canonicalUrl, 'https://www.highdrawgear.com/collections/polos?tier=weekender');
  assert.ok(weekenderPolos.title.toLowerCase().includes('weekender'));

  assert.equal(resolveSocialMetadata('/about').canonicalUrl, 'https://www.highdrawgear.com/pages/about');
  assert.equal(resolveSocialMetadata('/pages/about').ogImage, 'https://www.highdrawgear.com/assets/og/og-about.jpg');
  assert.equal(resolveSocialMetadata('/pages/craftsmanship').ogImage, 'https://www.highdrawgear.com/assets/og/og-craftsmanship.jpg');
  assert.equal(resolveSocialMetadata('/pages/reviews').ogImage, 'https://www.highdrawgear.com/assets/og/og-reviews.jpg');
  assert.equal(resolveSocialMetadata('/pages/guarantee').ogImage, 'https://www.highdrawgear.com/assets/og/og-guarantee.jpg');
  assert.equal(resolveSocialMetadata('/pages/logo-studio').ogImage, 'https://www.highdrawgear.com/assets/og/og-logo-studio.jpg');
});

test('4. api/og.ts returns valid crawler HTML with route-specific OG/Twitter/product tags', async () => {
  const PRODUCTS = await loadProducts();
  const ogApi = await import('../api/og.ts');

  const pathsToVerify = [
    '/',
    ...PRODUCTS.map((p) => `/products/${p.slug}`),
    '/collections/clubhouse',
    '/pages/about',
  ];

  for (const routePath of pathsToVerify) {
    const res = createMockRes();
    await ogApi.default(
      {
        method: 'GET',
        headers: { host: 'www.highdrawgear.com', 'user-agent': 'facebookexternalhit/1.1' },
        query: { path: routePath },
      },
      res as unknown as Parameters<typeof ogApi.default>[1]
    );

    assert.equal(res.getStatus(), 200);
    const headers = res.getHeaders();
    assert.equal(headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(headers['x-content-type-options'], 'nosniff');
    assert.ok(headers['cache-control']?.includes('s-maxage='), 'Missing Cache-Control s-maxage');

    const html = res.getBody();
    assert.ok(html.includes('property="og:url"'));
    assert.ok(html.includes('property="og:image"'));
    assert.ok(html.includes('property="og:image:width" content="1200"'));
    assert.ok(html.includes('property="og:image:height" content="630"'));
    assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));

    if (routePath.startsWith('/products/')) {
      assert.ok(html.includes('property="product:price:amount"'), `Missing product:price:amount for ${routePath}`);
      assert.ok(html.includes('property="og:type" content="product"'), `Missing og:type="product" for ${routePath}`);
    }
  }
});

test('5. api/og.ts enforces strict Host allowlist and escapes injected XSS payloads', async () => {
  const ogApi = await import('../api/og.ts');

  const evilRes = createMockRes();
  await ogApi.default(
    {
      method: 'GET',
      headers: { host: 'evil.attacker.example' },
      query: { path: '/products/"><script>alert(1)</script>' },
    },
    evilRes as unknown as Parameters<typeof ogApi.default>[1]
  );

  assert.equal(evilRes.getStatus(), 200);
  const evilHtml = evilRes.getBody();
  assert.ok(!evilHtml.includes('evil.attacker.example'), 'Untrusted Host header leaked into OG HTML');
  assert.ok(evilHtml.includes('https://www.highdrawgear.com'), 'Must fall back to https://www.highdrawgear.com');
  assert.ok(!evilHtml.includes('<script>alert(1)</script>'), 'XSS payload was not escaped/rejected');

  const previewHost = 'highdraw-git-staging-high-draw-gear.vercel.app';
  const previewRes = createMockRes();
  await ogApi.default(
    {
      method: 'GET',
      headers: { host: previewHost },
      query: { path: '/products/mens-clubhouse-fine-pique-polo' },
    },
    previewRes as unknown as Parameters<typeof ogApi.default>[1]
  );

  assert.equal(previewRes.getStatus(), 200);
  const previewHtml = previewRes.getBody();
  assert.ok(
    previewHtml.includes(`https://${previewHost}/products/mens-clubhouse-fine-pique-polo`),
    'Valid Vercel preview host should be preserved for staging debugger tests'
  );
});

test('6. scripts/prerender_social_routes.mjs generates static route index.html files preserving Vite assets', async () => {
  const PRODUCTS = await loadProducts();
  const { prerenderSocialRoutes } = await loadPrerenderer();

  const tmpDist = fs.mkdtempSync(path.join(os.tmpdir(), 'hd-prerender-'));
  try {
    const sampleIndexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(
      '<script type="module" src="/src/main.tsx"></script>',
      '<script type="module" src="/assets/index-test.js"></script>'
    );
    fs.writeFileSync(path.join(tmpDist, 'index.html'), sampleIndexHtml, 'utf8');

    const generatedRoutes = await prerenderSocialRoutes(tmpDist);
    assert.ok(generatedRoutes.length >= PRODUCTS.length * 2 + 18);

    for (const product of PRODUCTS) {
      const slugHtmlPath = path.join(tmpDist, 'products', product.slug, 'index.html');
      assert.ok(fs.existsSync(slugHtmlPath), `Missing prerendered slug page: ${slugHtmlPath}`);
      const html = fs.readFileSync(slugHtmlPath, 'utf8');
      assert.ok(
        html.includes('<script type="module" src="/assets/index-test.js"></script>'),
        'Prerendered HTML dropped Vite bundle script'
      );
      assert.ok(html.includes('<div id="root"></div>'), 'Prerendered HTML dropped #root mount');
      assert.ok(
        html.includes(`content="https://www.highdrawgear.com/products/${product.slug}"`),
        `Prerendered ${product.slug} missing exact og:url`
      );
      assert.ok(
        html.includes(`content="https://www.highdrawgear.com/assets/og/${product.slug}.jpg"`),
        `Prerendered ${product.slug} missing exact og:image`
      );
      assert.ok(
        html.includes('name="twitter:card" content="summary_large_image"'),
        `Prerendered ${product.slug} missing valid name="twitter:card"`
      );

      const idHtmlPath = path.join(tmpDist, 'products', product.id, 'index.html');
      assert.ok(fs.existsSync(idHtmlPath), `Missing prerendered id page: ${idHtmlPath}`);
    }

    const clubhouseHtml = fs.readFileSync(path.join(tmpDist, 'collections', 'clubhouse', 'index.html'), 'utf8');
    assert.ok(clubhouseHtml.includes('https://www.highdrawgear.com/collections/clubhouse'));
    assert.ok(clubhouseHtml.includes('https://www.highdrawgear.com/assets/og/og-collections.jpg'));

    const aboutHtml = fs.readFileSync(path.join(tmpDist, 'pages', 'about', 'index.html'), 'utf8');
    assert.ok(aboutHtml.includes('https://www.highdrawgear.com/pages/about'));
    assert.ok(aboutHtml.includes('https://www.highdrawgear.com/assets/og/og-about.jpg'));
  } finally {
    fs.rmSync(tmpDist, { recursive: true, force: true });
  }
});
