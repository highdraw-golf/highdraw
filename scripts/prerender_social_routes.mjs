import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DIST_DIR = path.resolve(__dirname, '../dist');
const CANONICAL_ORIGIN = 'https://www.highdrawgear.com';
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const PRODUCT_ROUTES = [
  {
    id: 'men-polo-st740',
    slug: 'mens-weekender-performance-polo',
    name: "The Weekender Performance Polo — Men's",
    price: 48,
    fabric: '100% Technical Polyester Micropique (4.3 oz/yd²)',
    washGuarantee: '100+ Washes Guarantee • Won’t Shrink, Curl, or Fade',
    description:
      'Tour-grade 180 GSM micro-pique stretch blend with UPF 50+ solar protection, tailored flat-knit collar, and choice of 3 official High Draw chest marks stitched in the USA.',
  },
  {
    id: 'women-polo-lst740',
    slug: 'womens-weekender-performance-polo',
    name: "The Weekender Performance Polo — Women's",
    price: 48,
    fabric: '100% Technical Polyester Micropique (4.3 oz/yd²)',
    washGuarantee: '100+ Washes Guarantee • Wrinkle-Free Dry',
    description:
      'Tour-grade micro-pique stretch blend with a contoured feminine silhouette, open Y-neck collar, and 2.25" lower-aligned chest embroidery.',
  },
  {
    id: 'headwear-flexfit-mesh',
    slug: 'tour-performance-poly-mesh-cap',
    name: 'The Tour Performance Poly-Mesh Cap',
    price: 35,
    fabric: '100% Polyester Cool & Dry Poly Block Mesh',
    washGuarantee: 'Sweat-Stain Resistant • Hand Wash Rinse',
    description:
      'Official Flexfit Cool & Dry honeycomb poly-mesh cap with silver anti-glare underbill, moisture-wicking sweatband, and structured front crown embroidery.',
  },
  {
    id: 'bundle-foursome-01',
    slug: 'the-saturday-foursome-scramble-kit',
    name: 'The Saturday Foursome Scramble Kit (4 Polos)',
    price: 160,
    fabric: '100% Technical Polyester Micropique Across All 4 Polos',
    washGuarantee: 'Complete Foursome Guarantee • 100+ Washes per Shirt',
    description:
      'Outfit your weekend foursome in 4 tour-grade performance polos at $40/shirt ($32 bundle savings) in a luxury presentation box with balls and tees.',
  },
  {
    id: 'men-polo-k830',
    slug: 'mens-clubhouse-fine-pique-polo',
    name: "The Clubhouse Fine Pique Polo — Men's",
    price: 66,
    fabric: '57% Combed Cotton / 43% Technical Polyester Fine Pique Knit',
    washGuarantee: 'Color-Lock Guaranteed • 100+ Washes without fading',
    description:
      'Crafted from Port Authority 57/43 cotton-poly fine pique knit (K830) with rich heather tones tailored for the 19th hole and dinner at the clubhouse.',
  },
  {
    id: 'women-polo-lk830',
    slug: 'womens-clubhouse-fine-pique-polo',
    name: "The Clubhouse Fine Pique Polo — Women's",
    price: 66,
    fabric: '57% Cotton / 43% Polyester Fine Pique',
    washGuarantee: 'Color-Lock Guaranteed • 100+ Washes without fading',
    description:
      'Tailored 57/43 cotton-poly fine pique polo (LK830) with an open Y-neck placket and 2.25" lower-aligned white chest embroidery for clubhouse evenings.',
  },
  {
    id: 'outerwear-f218-fleece',
    slug: 'clubhouse-value-fleece-quarter-zip',
    name: 'The Clubhouse Value Fleece 1/4-Zip Pullover',
    price: 68,
    fabric: '100% Low-Pill Midweight Polyester Fleece',
    washGuarantee: 'Low-Pill Fleece Guarantee • 100+ Washes',
    description:
      'Year-round 8.3 oz low-pill midweight fleece with twill-taped neck, reverse coil zipper, and direct High Draw chest embroidery.',
  },
  {
    id: 'tournament-tour-spec-polo',
    slug: 'tournament-tour-spec-polo',
    name: 'The Tournament Tour-Spec Performance Polo',
    price: 110,
    fabric: 'Tour-Spec Proprietary High-Tensile Micro-Knit',
    washGuarantee: 'Tour Grade Standard • Lifetime Quality Assurance',
    description:
      'Ultra-high thread count micro-knit championship prototype with laser-cut bonded seams, currently in final tour testing.',
  },
];

const COLLECTION_ROUTES = [
  { routePath: 'collections/all', heading: 'Complete Apparel Catalog' },
  { routePath: 'collections/polos', heading: "Men's & Women's Performance Polos" },
  { routePath: 'collections/outerwear', heading: 'Clubhouse Fleece & Layering' },
  { routePath: 'collections/headwear', heading: 'Tour Performance Headwear' },
  { routePath: 'collections/bundles', heading: 'Saturday Foursome Scramble Kits' },
  { routePath: 'collections/weekender', heading: 'The Weekender Collection ($48)' },
  { routePath: 'collections/clubhouse', heading: 'The Clubhouse Collection ($66–$68)' },
  { routePath: 'collections/tournament', heading: 'The Tournament Allocation' },
];

const PAGE_ROUTES = [
  {
    paths: ['pages/craftsmanship', 'craftsmanship'],
    canonicalPath: '/pages/craftsmanship',
    title: 'Stay-Flat Collar & 100-Wash Craftsmanship | High Draw Golf',
    description:
      'Explore High Draw fused collar engineering, 180 GSM capillary micropique drape, and precision US left-chest embroidery.',
    ogTitle: 'Stay-Flat Collar & 100-Wash Craftsmanship | High Draw Golf',
    ogDescription: 'Guaranteed zero collar baconing after 100+ rounds and laundry cycles.',
    imageFile: 'og-craftsmanship.jpg',
    imageAlt: 'High Draw Golf collar construction close-up',
  },
  {
    paths: ['pages/reviews', 'reviews'],
    canonicalPath: '/pages/reviews',
    title: 'Verified Golfer Reviews (4.9/5) | High Draw Golf',
    description:
      'Read verified course reviews from weekend golfers, club champions, and foursomes wearing High Draw polos across all conditions.',
    ogTitle: 'Verified Golfer Reviews (4.9/5) | High Draw Golf',
    ogDescription:
      'Why golfers are trading $125 pro-shop markups for $48 Weekender and $66 Clubhouse polos.',
    imageFile: 'og-reviews.jpg',
    imageAlt: 'High Draw Golf verified course reviews',
  },
  {
    paths: ['pages/guarantee', 'guarantee'],
    canonicalPath: '/pages/guarantee',
    title: '100+ Washes & 30-Day Fairway Guarantee | High Draw Golf',
    description:
      'If your High Draw collar curls or loses structure within 30 days, we replace or refund it immediately. Tested for 100+ laundry cycles.',
    ogTitle: '100+ Washes & 30-Day Fairway Guarantee | High Draw Golf',
    ogDescription:
      'Zero risk fairway fit guarantee and complimentary US shipping on orders over $75.',
    imageFile: 'og-guarantee.jpg',
    imageAlt: 'High Draw Golf 100-wash collar guarantee',
  },
  {
    paths: ['pages/about', 'about'],
    canonicalPath: '/pages/about',
    title: 'Our Story — Dr. Ken & Lori Cyree | High Draw Golf',
    description:
      'Founded by 2.9 handicap golfer Dr. Ken Cyree after playing 47 US states: tour-grade golf apparel crafted without bloated boutique retail markup.',
    ogTitle: 'The High Draw Story | Designed for Sport, Crafted for Life',
    ogDescription:
      'Disciplined direct-to-golfer unit economics pairing Tour-grade fabrics with three purpose-built apparel tiers.',
    imageFile: 'og-about.jpg',
    imageAlt: 'High Draw Golf founders Ken and Lori Cyree story',
  },
  {
    paths: ['pages/logo-studio', 'logo-studio'],
    canonicalPath: '/pages/logo-studio',
    title: 'Embroidery Mark & Crest Studio | High Draw Golf',
    description:
      'Preview High Draw’s three official left-chest marks (Mark + Monogram, Ball Flight Tracer, and Wordmark) across thread and shirt colorways.',
    ogTitle: 'The High Draw Embroidery Studio',
    ogDescription:
      'Precision 2.5" men’s and 2.25" lower-aligned women’s chest embroidery stitched to order in the USA.',
    imageFile: 'og-logo-studio.jpg',
    imageAlt: 'High Draw Golf embroidery mark customizer',
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSocialHeadBlock(meta) {
  const productTags =
    meta.priceAmount && meta.priceCurrency
      ? `\n    <meta property="product:price:amount" content="${escapeHtml(meta.priceAmount)}" />\n    <meta property="product:price:currency" content="${escapeHtml(meta.priceCurrency)}" />`
      : '';

  return `<!-- SOCIAL_META_START -->
    <title>${escapeHtml(meta.title)}</title>
    <link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />
    <meta name="title" content="${escapeHtml(meta.title)}" />
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta property="og:type" content="${escapeHtml(meta.ogType)}" />
    <meta property="og:site_name" content="High Draw Golf" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${escapeHtml(meta.canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />
    <meta property="og:image" content="${escapeHtml(meta.ogImage)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(meta.ogImage)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="${OG_WIDTH}" />
    <meta property="og:image:height" content="${OG_HEIGHT}" />
    <meta property="og:image:alt" content="${escapeHtml(meta.ogImageAlt)}" />${productTags}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.ogDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(meta.ogImageAlt)}" />
    <!-- SOCIAL_META_END -->`;
}

function buildRouteEntries() {
  const entries = [];

  for (const prod of PRODUCT_ROUTES) {
    const meta = {
      canonicalUrl: `${CANONICAL_ORIGIN}/products/${prod.slug}`,
      title: `${prod.name} ($${prod.price}) | High Draw Golf`,
      description: prod.description,
      ogType: 'product',
      ogTitle: `${prod.name} — $${prod.price}`,
      ogDescription: `${prod.fabric} · ${prod.washGuarantee}. ${prod.description}`,
      ogImage: `${CANONICAL_ORIGIN}/assets/og/${prod.slug}.jpg`,
      ogImageAlt: `${prod.name} — High Draw Golf`,
      priceAmount: prod.price.toFixed(2),
      priceCurrency: 'USD',
    };
    entries.push({ outPath: `products/${prod.slug}`, meta });
    entries.push({ outPath: `products/${prod.id}`, meta });
  }

  for (const col of COLLECTION_ROUTES) {
    entries.push({
      outPath: col.routePath,
      meta: {
        canonicalUrl: `${CANONICAL_ORIGIN}/${col.routePath}`,
        title: `${col.heading} | High Draw Golf`,
        description:
          'Shop Tour-grade 180 GSM Weekender polos ($48), Clubhouse 57/43 cotton-poly fine pique ($66), and Saturday Foursome Kits ($160) with free US shipping over $75.',
        ogType: 'website',
        ogTitle: `${col.heading} | High Draw Golf`,
        ogDescription:
          'Three purpose-built golf tiers with stay-flat collars, bespoke left-chest embroidery, and zero $125 retail markup.',
        ogImage: `${CANONICAL_ORIGIN}/assets/og/og-collections.jpg`,
        ogImageAlt: `High Draw Golf — ${col.heading}`,
      },
    });
  }

  for (const page of PAGE_ROUTES) {
    const meta = {
      canonicalUrl: `${CANONICAL_ORIGIN}${page.canonicalPath}`,
      title: page.title,
      description: page.description,
      ogType: 'website',
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      ogImage: `${CANONICAL_ORIGIN}/assets/og/${page.imageFile}`,
      ogImageAlt: page.imageAlt,
    };
    for (const p of page.paths) {
      entries.push({ outPath: p, meta });
    }
  }

  return entries;
}

export async function prerenderSocialRoutes(distDir = DEFAULT_DIST_DIR) {
  const rootIndexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(rootIndexPath)) {
    throw new Error(`Missing built index.html at ${rootIndexPath}`);
  }

  const templateHtml = fs.readFileSync(rootIndexPath, 'utf8');
  const markerRegex = /<!--\s*SOCIAL_META_START\s*-->[\s\S]*?<!--\s*SOCIAL_META_END\s*-->/;
  if (!markerRegex.test(templateHtml)) {
    throw new Error('Built index.html is missing SOCIAL_META_START / SOCIAL_META_END markers');
  }

  const entries = buildRouteEntries();
  const written = [];

  for (const entry of entries) {
    const socialBlock = buildSocialHeadBlock(entry.meta);
    const routeHtml = templateHtml.replace(markerRegex, socialBlock);
    const destDir = path.join(distDir, entry.outPath);
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(path.join(destDir, 'index.html'), routeHtml, 'utf8');
    fs.writeFileSync(`${destDir}.html`, routeHtml, 'utf8');
    written.push(entry.outPath);
  }

  return written;
}

if (process.argv[1] === __filename) {
  prerenderSocialRoutes(DEFAULT_DIST_DIR)
    .then((routes) => {
      console.log(`Prerendered ${routes.length} social deep-link HTML entrypoints in dist/`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
