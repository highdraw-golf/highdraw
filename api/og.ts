export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  url?: string;
}

export interface ApiResponse {
  setHeader(name: string, value: string): unknown;
  status(code: number): ApiResponse;
  send?(body: string): unknown;
  end(body?: string): unknown;
}

interface CatalogSocialSpec {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  fabric: string;
  washGuarantee: string;
}

const CANONICAL_ORIGIN = 'https://www.highdrawgear.com';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const PRODUCT_SOCIAL_SPECS: CatalogSocialSpec[] = [
  {
    id: 'men-polo-st740',
    slug: 'mens-weekender-performance-polo',
    name: "The Weekender Performance Polo — Men's",
    price: 48,
    description:
      'Tour-grade 180 GSM micro-pique stretch blend with UPF 50+ solar protection, tailored flat-knit collar, and choice of 3 official High Draw chest marks stitched in the USA.',
    fabric: '100% Technical Polyester Micropique (4.3 oz/yd²)',
    washGuarantee: '100+ Washes Guarantee • Won’t Shrink, Curl, or Fade',
  },
  {
    id: 'women-polo-lst740',
    slug: 'womens-weekender-performance-polo',
    name: "The Weekender Performance Polo — Women's",
    price: 48,
    description:
      'Tour-grade micro-pique stretch blend with a contoured feminine silhouette, open Y-neck collar, and 2.25" lower-aligned chest embroidery.',
    fabric: '100% Technical Polyester Micropique (4.3 oz/yd²)',
    washGuarantee: '100+ Washes Guarantee • Wrinkle-Free Dry',
  },
  {
    id: 'headwear-flexfit-mesh',
    slug: 'tour-performance-poly-mesh-cap',
    name: 'The Tour Performance Poly-Mesh Cap',
    price: 35,
    description:
      'Official Flexfit Cool & Dry honeycomb poly-mesh cap with silver anti-glare underbill, moisture-wicking sweatband, and structured front crown embroidery.',
    fabric: '100% Polyester Cool & Dry Poly Block Mesh',
    washGuarantee: 'Sweat-Stain Resistant • Hand Wash Rinse',
  },
  {
    id: 'bundle-foursome-01',
    slug: 'the-saturday-foursome-scramble-kit',
    name: 'The Saturday Foursome Scramble Kit (4 Polos)',
    price: 160,
    description:
      'Outfit your weekend foursome in 4 tour-grade performance polos at $40/shirt ($32 bundle savings) in a luxury presentation box with balls and tees.',
    fabric: '100% Technical Polyester Micropique Across All 4 Polos',
    washGuarantee: 'Complete Foursome Guarantee • 100+ Washes per Shirt',
  },
  {
    id: 'men-polo-k830',
    slug: 'mens-clubhouse-fine-pique-polo',
    name: "The Clubhouse Fine Pique Polo — Men's",
    price: 66,
    description:
      'Crafted from Port Authority 57/43 cotton-poly fine pique knit (K830) with rich heather tones tailored for the 19th hole and dinner at the clubhouse.',
    fabric: '57% Combed Cotton / 43% Technical Polyester Fine Pique Knit',
    washGuarantee: 'Color-Lock Guaranteed • 100+ Washes without fading',
  },
  {
    id: 'women-polo-lk830',
    slug: 'womens-clubhouse-fine-pique-polo',
    name: "The Clubhouse Fine Pique Polo — Women's",
    price: 66,
    description:
      'Tailored 57/43 cotton-poly fine pique polo (LK830) with an open Y-neck placket and 2.25" lower-aligned white chest embroidery for clubhouse evenings.',
    fabric: '57% Cotton / 43% Polyester Fine Pique',
    washGuarantee: 'Color-Lock Guaranteed • 100+ Washes without fading',
  },
  {
    id: 'outerwear-f218-fleece',
    slug: 'clubhouse-value-fleece-quarter-zip',
    name: 'The Clubhouse Value Fleece 1/4-Zip Pullover',
    price: 68,
    description:
      'Year-round 8.3 oz low-pill midweight fleece with twill-taped neck, reverse coil zipper, and direct High Draw chest embroidery.',
    fabric: '100% Low-Pill Midweight Polyester Fleece',
    washGuarantee: 'Low-Pill Fleece Guarantee • 100+ Washes',
  },
  {
    id: 'tournament-tour-spec-polo',
    slug: 'tournament-tour-spec-polo',
    name: 'The Tournament Tour-Spec Performance Polo',
    price: 110,
    description:
      'Ultra-high thread count micro-knit championship prototype with laser-cut bonded seams, currently in final tour testing.',
    fabric: 'Tour-Spec Proprietary High-Tensile Micro-Knit',
    washGuarantee: 'Tour Grade Standard • Lifetime Quality Assurance',
  },
];

interface ResolvedSocial {
  canonicalUrl: string;
  title: string;
  description: string;
  ogType: 'website' | 'product';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  priceAmount?: string;
  priceCurrency?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function resolveTrustedOrigin(req: ApiRequest): string {
  const rawForwarded = req.headers['x-forwarded-host'];
  const rawHost = req.headers.host;
  const candidateRaw =
    (Array.isArray(rawForwarded) ? rawForwarded[0] : rawForwarded) ||
    (Array.isArray(rawHost) ? rawHost[0] : rawHost) ||
    '';

  const host = candidateRaw.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');
  if (!host) return CANONICAL_ORIGIN;
  if (host === 'www.highdrawgear.com' || host === 'highdrawgear.com') {
    return CANONICAL_ORIGIN;
  }
  if (
    host === 'highdraw.vercel.app' ||
    /^highdraw-[a-z0-9-]+-high-draw-gear\.vercel\.app$/.test(host)
  ) {
    return `https://${host}`;
  }
  return CANONICAL_ORIGIN;
}

function findProductForSlug(rawSlug: string): CatalogSocialSpec | undefined {
  const slug = rawSlug.trim().toLowerCase();
  let prod = PRODUCT_SOCIAL_SPECS.find((p) => p.slug === slug || p.id === slug);
  if (!prod) {
    if (slug.includes('clubhouse') && slug.includes('women')) {
      prod = PRODUCT_SOCIAL_SPECS.find((p) => p.id === 'women-polo-lk830');
    } else if (slug.includes('clubhouse')) {
      prod = PRODUCT_SOCIAL_SPECS.find((p) => p.id === 'men-polo-k830');
    } else if (slug.includes('women')) {
      prod = PRODUCT_SOCIAL_SPECS.find((p) => p.id.includes('women') || p.slug.includes('women'));
    } else if (
      slug.includes('zip') ||
      slug.includes('pullover') ||
      slug.includes('fleece') ||
      slug.includes('outerwear')
    ) {
      prod = PRODUCT_SOCIAL_SPECS.find((p) => p.id === 'outerwear-f218-fleece');
    } else if (slug.includes('cap') || slug.includes('hat') || slug.includes('headwear')) {
      prod = PRODUCT_SOCIAL_SPECS.find((p) => p.id === 'headwear-flexfit-mesh');
    } else if (slug.includes('scramble') || slug.includes('foursome') || slug.includes('bundle')) {
      prod = PRODUCT_SOCIAL_SPECS.find((p) => p.id === 'bundle-foursome-01');
    } else if (slug.includes('polo') || slug.includes('men')) {
      prod = PRODUCT_SOCIAL_SPECS.find((p) => p.id === 'men-polo-st740');
    }
  }
  return prod;
}

function resolveRouteSocial(rawPathInput: string, origin: string): ResolvedSocial {
  const [rawPathname, rawSearch = ''] = rawPathInput.split('?');
  const cleanPath = (rawPathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(rawSearch);
  const queryTier = params.get('tier')?.toLowerCase();

  if (cleanPath.startsWith('/products/')) {
    const slug = cleanPath.replace('/products/', '').trim();
    const product = findProductForSlug(slug);
    if (product) {
      return {
        canonicalUrl: `${origin}/products/${product.slug}`,
        title: `${product.name} ($${product.price}) | High Draw Golf`,
        description: product.description,
        ogType: 'product',
        ogTitle: `${product.name} — $${product.price}`,
        ogDescription: `${product.fabric} · ${product.washGuarantee}. ${product.description}`,
        ogImage: `${origin}/assets/og/${product.slug}.jpg`,
        ogImageAlt: `${product.name} — High Draw Golf`,
        priceAmount: product.price.toFixed(2),
        priceCurrency: 'USD',
      };
    }
  }

  if (cleanPath.startsWith('/collections/')) {
    const seg = cleanPath.replace('/collections/', '').trim() || 'all';
    const validTier =
      queryTier === 'weekender' || queryTier === 'clubhouse' || queryTier === 'tournament'
        ? queryTier
        : undefined;
    const isTierSeg = seg === 'weekender' || seg === 'clubhouse' || seg === 'tournament';
    const canonicalPath =
      !isTierSeg && validTier ? `/collections/${seg}?tier=${validTier}` : `/collections/${seg}`;

    const categoryTitles: Record<string, string> = {
      all: 'Complete Apparel Catalog',
      polos: "Men's & Women's Performance Polos",
      outerwear: 'Clubhouse Fleece & Layering',
      headwear: 'Tour Performance Headwear',
      bundles: 'Saturday Foursome Scramble Kits',
      weekender: 'The Weekender Collection ($48)',
      clubhouse: 'The Clubhouse Collection ($66–$68)',
      tournament: 'The Tournament Allocation',
    };
    const heading = categoryTitles[seg] || 'Golf Apparel Collections';
    return {
      canonicalUrl: `${origin}${canonicalPath}`,
      title: `${heading} | High Draw Golf`,
      description:
        'Shop Tour-grade 180 GSM Weekender polos ($48), Clubhouse 57/43 cotton-poly fine pique ($66), and Saturday Foursome Kits ($160) with free US shipping over $75.',
      ogType: 'website',
      ogTitle: `${heading} | High Draw Golf`,
      ogDescription:
        'Three purpose-built golf tiers with stay-flat collars, bespoke left-chest embroidery, and zero $125 retail markup.',
      ogImage: `${origin}/assets/og/og-collections.jpg`,
      ogImageAlt: `High Draw Golf — ${heading}`,
    };
  }

  if (cleanPath === '/pages/craftsmanship' || cleanPath === '/craftsmanship') {
    return {
      canonicalUrl: `${origin}/pages/craftsmanship`,
      title: 'Stay-Flat Collar & 100-Wash Craftsmanship | High Draw Golf',
      description:
        'Explore High Draw fused collar engineering, 180 GSM capillary micropique drape, and precision US left-chest embroidery.',
      ogType: 'website',
      ogTitle: 'Stay-Flat Collar & 100-Wash Craftsmanship | High Draw Golf',
      ogDescription: 'Guaranteed zero collar baconing after 100+ rounds and laundry cycles.',
      ogImage: `${origin}/assets/og/og-craftsmanship.jpg`,
      ogImageAlt: 'High Draw Golf collar construction close-up',
    };
  }

  if (cleanPath === '/pages/reviews' || cleanPath === '/reviews') {
    return {
      canonicalUrl: `${origin}/pages/reviews`,
      title: 'Verified Golfer Reviews (4.9/5) | High Draw Golf',
      description:
        'Read verified course reviews from weekend golfers, club champions, and foursomes wearing High Draw polos across all conditions.',
      ogType: 'website',
      ogTitle: 'Verified Golfer Reviews (4.9/5) | High Draw Golf',
      ogDescription:
        'Why golfers are trading $125 pro-shop markups for $48 Weekender and $66 Clubhouse polos.',
      ogImage: `${origin}/assets/og/og-reviews.jpg`,
      ogImageAlt: 'High Draw Golf verified course reviews',
    };
  }

  if (cleanPath === '/pages/guarantee' || cleanPath === '/guarantee') {
    return {
      canonicalUrl: `${origin}/pages/guarantee`,
      title: '100+ Washes & 30-Day Fairway Guarantee | High Draw Golf',
      description:
        'If your High Draw collar curls or loses structure within 30 days, we replace or refund it immediately. Tested for 100+ laundry cycles.',
      ogType: 'website',
      ogTitle: '100+ Washes & 30-Day Fairway Guarantee | High Draw Golf',
      ogDescription: 'Zero risk fairway fit guarantee and complimentary US shipping on orders over $75.',
      ogImage: `${origin}/assets/og/og-guarantee.jpg`,
      ogImageAlt: 'High Draw Golf 100-wash collar guarantee',
    };
  }

  if (cleanPath === '/pages/about' || cleanPath === '/about') {
    return {
      canonicalUrl: `${origin}/pages/about`,
      title: 'Our Story — Dr. Ken & Lori Cyree | High Draw Golf',
      description:
        'Founded by 2.9 handicap golfer Dr. Ken Cyree after playing 47 US states: tour-grade golf apparel crafted without bloated boutique retail markup.',
      ogType: 'website',
      ogTitle: 'The High Draw Story | Designed for Sport, Crafted for Life',
      ogDescription:
        'Disciplined direct-to-golfer unit economics pairing Tour-grade fabrics with three purpose-built apparel tiers.',
      ogImage: `${origin}/assets/og/og-about.jpg`,
      ogImageAlt: 'High Draw Golf founders Ken and Lori Cyree story',
    };
  }

  if (cleanPath === '/pages/logo-studio' || cleanPath === '/logo-studio') {
    return {
      canonicalUrl: `${origin}/pages/logo-studio`,
      title: 'Embroidery Mark & Crest Studio | High Draw Golf',
      description:
        'Preview High Draw’s three official left-chest marks (Mark + Monogram, Ball Flight Tracer, and Wordmark) across thread and shirt colorways.',
      ogType: 'website',
      ogTitle: 'The High Draw Embroidery Studio',
      ogDescription:
        'Precision 2.5" men’s and 2.25" lower-aligned women’s chest embroidery stitched to order in the USA.',
      ogImage: `${origin}/assets/og/og-logo-studio.jpg`,
      ogImageAlt: 'High Draw Golf embroidery mark customizer',
    };
  }

  return {
    canonicalUrl: `${origin}/`,
    title: 'High Draw Golf | Designed for Sport, Crafted for Life',
    description:
      'Tour-grade micro-pique performance polos at $48 & Clubhouse fine pique at $66. Stay-flat collar engineering, zero $125 overpriced retail markup.',
    ogType: 'website',
    ogTitle: 'High Draw Golf | Designed for Sport, Crafted for Life',
    ogDescription:
      'Tour-grade 180 GSM micro-pique performance drape ($48), Clubhouse 57/43 cotton-poly fine pique ($66), and Saturday Foursome Kits ($160).',
    ogImage: `${origin}/assets/og/og-home.jpg`,
    ogImageAlt: 'High Draw Golf apparel on coastal championship fairways',
  };
}

function renderCrawlerHtml(meta: ResolvedSocial): string {
  const productMetaTags =
    meta.priceAmount && meta.priceCurrency
      ? `\n    <meta property="product:price:amount" content="${escapeHtml(meta.priceAmount)}" />\n    <meta property="product:price:currency" content="${escapeHtml(meta.priceCurrency)}" />`
      : '';

  const structuredData =
    meta.ogType === 'product' && meta.priceAmount
      ? {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: meta.ogTitle,
          image: meta.ogImage,
          description: meta.description,
          brand: { '@type': 'Brand', name: 'High Draw Golf' },
          offers: {
            '@type': 'Offer',
            url: meta.canonicalUrl,
            priceCurrency: 'USD',
            price: meta.priceAmount,
            availability: 'https://schema.org/InStock',
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'High Draw Golf',
          url: CANONICAL_ORIGIN,
          logo: `${CANONICAL_ORIGIN}/assets/brand/logo_tracer_gold.png`,
          description: meta.description,
        };

  const jsonLd = JSON.stringify(structuredData).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    <meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />
    <meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />
    <meta property="og:image:alt" content="${escapeHtml(meta.ogImageAlt)}" />${productMetaTags}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.ogDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(meta.ogImageAlt)}" />
    <script type="application/ld+json">${jsonLd}</script>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(meta.ogTitle)}</h1>
      <p>${escapeHtml(meta.ogDescription)}</p>
      <p><a href="${escapeHtml(meta.canonicalUrl)}">${escapeHtml(meta.canonicalUrl)}</a></p>
    </main>
  </body>
</html>`;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const origin = resolveTrustedOrigin(req);
  const rawQueryPath = req.query?.path;
  const queryPath = Array.isArray(rawQueryPath) ? rawQueryPath[0] : rawQueryPath;
  const rawTier = req.query?.tier;
  const tierParam = Array.isArray(rawTier) ? rawTier[0] : rawTier;

  const basePath = typeof queryPath === 'string' && queryPath.trim() ? queryPath.trim() : '/';
  const fullPath =
    tierParam && !basePath.includes('tier=')
      ? `${basePath}${basePath.includes('?') ? '&' : '?'}tier=${encodeURIComponent(tierParam)}`
      : basePath;

  const meta = resolveRouteSocial(fullPath, origin);
  const html = renderCrawlerHtml(meta);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  const responseTarget = res.status(200);
  if (typeof responseTarget.send === 'function') {
    return responseTarget.send(html);
  }
  return responseTarget.end(html);
}
