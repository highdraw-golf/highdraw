import { PRODUCTS } from '../data/products.ts';

export const CANONICAL_ORIGIN = 'https://www.highdrawgear.com';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export interface SocialMetadata {
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

function normalizeBaseOrigin(baseOrigin: string): string {
  return baseOrigin.replace(/\/+$/, '') || CANONICAL_ORIGIN;
}

function findProductForSlug(rawSlug: string) {
  const slug = rawSlug.trim().toLowerCase();
  let prod = PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  if (!prod) {
    if (slug.includes('clubhouse') && slug.includes('women')) {
      prod = PRODUCTS.find((p) => p.id === 'women-polo-lk830');
    } else if (slug.includes('clubhouse')) {
      prod = PRODUCTS.find((p) => p.id === 'men-polo-k830');
    } else if (slug.includes('women')) {
      prod = PRODUCTS.find((p) => p.id.includes('women') || p.slug.includes('women'));
    } else if (
      slug.includes('zip') ||
      slug.includes('pullover') ||
      slug.includes('fleece') ||
      slug.includes('outerwear')
    ) {
      prod = PRODUCTS.find((p) => p.id === 'outerwear-f218-fleece');
    } else if (slug.includes('cap') || slug.includes('hat') || slug.includes('headwear')) {
      prod = PRODUCTS.find((p) => p.category === 'headwear');
    } else if (slug.includes('scramble') || slug.includes('foursome') || slug.includes('bundle')) {
      prod = PRODUCTS.find((p) => p.category === 'bundles');
    } else if (slug.includes('polo') || slug.includes('men')) {
      prod = PRODUCTS.find((p) => p.id === 'men-polo-st740');
    }
  }
  return prod;
}

function buildCollectionMeta(
  category: string,
  tier: string | undefined,
  origin: string
): SocialMetadata {
  const cleanCat = category.toLowerCase();
  const validTier =
    tier === 'weekender' || tier === 'clubhouse' || tier === 'tournament' ? tier : undefined;

  const canonicalPath =
    validTier && ['all', 'polos', 'outerwear', 'headwear', 'bundles'].includes(cleanCat)
      ? `/collections/${cleanCat}?tier=${validTier}`
      : `/collections/${cleanCat || 'all'}`;

  const tierLabel = validTier
    ? `${validTier.charAt(0).toUpperCase()}${validTier.slice(1)} Tier`
    : '';

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

  const baseHeading = categoryTitles[cleanCat] || 'Golf Apparel Collections';
  const heading = tierLabel && cleanCat !== validTier ? `${tierLabel} — ${baseHeading}` : baseHeading;

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
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
  };
}

export function resolveSocialMetadata(
  pathname: string,
  search = '',
  baseOrigin = CANONICAL_ORIGIN
): SocialMetadata {
  const origin = normalizeBaseOrigin(baseOrigin);
  const cleanPath = (pathname || '/').split('?')[0].toLowerCase().replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
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
        ogDescription: `${product.specs.fabric} · ${product.washGuarantee}. ${product.description}`,
        ogImage: `${origin}/assets/og/${product.slug}.jpg`,
        ogImageAlt: `${product.name} — High Draw Golf`,
        ogImageWidth: OG_IMAGE_WIDTH,
        ogImageHeight: OG_IMAGE_HEIGHT,
        priceAmount: product.price.toFixed(2),
        priceCurrency: 'USD',
      };
    }
  }

  if (cleanPath.startsWith('/collections/')) {
    const seg = cleanPath.replace('/collections/', '').trim() || 'all';
    if (seg === 'weekender' || seg === 'clubhouse' || seg === 'tournament') {
      return buildCollectionMeta(seg, undefined, origin);
    }
    return buildCollectionMeta(seg, queryTier, origin);
  }

  if (cleanPath === '/pages/craftsmanship' || cleanPath === '/craftsmanship') {
    return {
      canonicalUrl: `${origin}/pages/craftsmanship`,
      title: 'Stay-Flat Collar & 100-Wash Craftsmanship | High Draw Golf',
      description:
        'Explore High Draw fused collar engineering, 180 GSM capillary micropique drape, and precision US left-chest embroidery.',
      ogType: 'website',
      ogTitle: 'Stay-Flat Collar & 100-Wash Craftsmanship | High Draw Golf',
      ogDescription:
        'Guaranteed zero collar baconing after 100+ rounds and laundry cycles.',
      ogImage: `${origin}/assets/og/og-craftsmanship.jpg`,
      ogImageAlt: 'High Draw Golf collar construction close-up',
      ogImageWidth: OG_IMAGE_WIDTH,
      ogImageHeight: OG_IMAGE_HEIGHT,
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
      ogImageWidth: OG_IMAGE_WIDTH,
      ogImageHeight: OG_IMAGE_HEIGHT,
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
      ogDescription:
        'Zero risk fairway fit guarantee and complimentary US shipping on orders over $75.',
      ogImage: `${origin}/assets/og/og-guarantee.jpg`,
      ogImageAlt: 'High Draw Golf 100-wash collar guarantee',
      ogImageWidth: OG_IMAGE_WIDTH,
      ogImageHeight: OG_IMAGE_HEIGHT,
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
      ogImageWidth: OG_IMAGE_WIDTH,
      ogImageHeight: OG_IMAGE_HEIGHT,
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
      ogImageWidth: OG_IMAGE_WIDTH,
      ogImageHeight: OG_IMAGE_HEIGHT,
    };
  }

  if (cleanPath === '/admin/marketing' || cleanPath === '/pages/marketing-command') {
    return {
      canonicalUrl: `${origin}/admin/marketing`,
      title: 'Marketing & Growth Command Center | High Draw Golf',
      description:
        'Owner command center for High Draw’s Month 1 ($150–$250) Facebook Ads experiments, 2-Polo Pair conversion tracking, outreach CRM, and Stripe-backed cloud telemetry.',
      ogType: 'website',
      ogTitle: 'High Draw Marketing & Growth Command Center',
      ogDescription:
        'PIN-protected cloud-synced marketing analytics, experiment verdicts, US state demand map, and campaign studio.',
      ogImage: `${origin}/assets/og/og-home.jpg`,
      ogImageAlt: 'High Draw Golf Marketing Command Center',
      ogImageWidth: OG_IMAGE_WIDTH,
      ogImageHeight: OG_IMAGE_HEIGHT,
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
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
  };
}

function upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string): void {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attrName: 'name' | 'property', attrValue: string): void {
  const el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (el) el.remove();
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function syncDocumentSocialMetadata(pathname: string, search = ''): void {
  if (typeof document === 'undefined') return;
  const meta = resolveSocialMetadata(pathname, search, CANONICAL_ORIGIN);

  document.title = meta.title;
  upsertCanonical(meta.canonicalUrl);
  upsertMeta('name', 'title', meta.title);
  upsertMeta('name', 'description', meta.description);

  upsertMeta('property', 'og:type', meta.ogType);
  upsertMeta('property', 'og:site_name', 'High Draw Golf');
  upsertMeta('property', 'og:locale', 'en_US');
  upsertMeta('property', 'og:url', meta.canonicalUrl);
  upsertMeta('property', 'og:title', meta.ogTitle);
  upsertMeta('property', 'og:description', meta.ogDescription);
  upsertMeta('property', 'og:image', meta.ogImage);
  upsertMeta('property', 'og:image:secure_url', meta.ogImage);
  upsertMeta('property', 'og:image:type', 'image/jpeg');
  upsertMeta('property', 'og:image:width', String(meta.ogImageWidth));
  upsertMeta('property', 'og:image:height', String(meta.ogImageHeight));
  upsertMeta('property', 'og:image:alt', meta.ogImageAlt);

  if (meta.priceAmount && meta.priceCurrency) {
    upsertMeta('property', 'product:price:amount', meta.priceAmount);
    upsertMeta('property', 'product:price:currency', meta.priceCurrency);
  } else {
    removeMeta('property', 'product:price:amount');
    removeMeta('property', 'product:price:currency');
  }

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', meta.ogTitle);
  upsertMeta('name', 'twitter:description', meta.ogDescription);
  upsertMeta('name', 'twitter:image', meta.ogImage);
  upsertMeta('name', 'twitter:image:alt', meta.ogImageAlt);
}
