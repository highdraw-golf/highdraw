import printifyLedger from '../data/printify_ledger.json';
import {
  SILHOUETTE_SPECS,
  generateSovereignSku,
  type SilhouetteId,
  type SkuBuildInput,
} from './taxonomy';
import type { LogoStyle, LogoVariant } from '../components/brand/HighDrawLogo';

export interface ResolvedFulfillmentItem {
  sovereignSku: string;
  silhouetteId: SilhouetteId;
  printifyProductId: string;
  printifyVariantId: number;
  printifyColorTitle: string;
  size: string;
  logoStyle: LogoStyle;
  logoColor: LogoVariant;
  decorationMethod: 'embroidery' | 'dtf' | 'none';
  placeholderPosition: string;
  isStockAvailable: boolean;
  officialMockupUrl: string | null;
}

interface LedgerVariant {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
}

interface LedgerProduct {
  id: string;
  title: string;
  blueprint_id: number;
  print_provider_id: number;
  variants: LedgerVariant[];
}

const LEDGER_PRODUCTS: LedgerProduct[] = (
  Array.isArray((printifyLedger as { products?: LedgerProduct[] }).products)
    ? (printifyLedger as { products: LedgerProduct[] }).products
    : []
);

const SILHOUETTE_PREFIX_MAP: Array<{ prefix: string; id: SilhouetteId }> = [
  { prefix: 'women-polo-lst740', id: 'women-polo-lst740' },
  { prefix: 'men-polo-st740', id: 'men-polo-st740' },
  { prefix: 'women-polo-lk830', id: 'women-polo-lk830' },
  { prefix: 'men-polo-k830', id: 'men-polo-k830' },
  { prefix: 'outerwear-f218-fleece', id: 'outerwear-f218-fleece' },
  { prefix: 'outerwear-st443', id: 'outerwear-f218-fleece' },
  { prefix: 'headwear-flexfit-mesh', id: 'headwear-flexfit-mesh' },
  { prefix: 'bundle-foursome-01', id: 'bundle-foursome-01' },
  { prefix: 'tournament-tour-spec-polo', id: 'tournament-tour-spec-polo' },
];

const LOGO_MOCKUP_SLUG: Record<Exclude<LogoStyle, 'none' | 'monogram'>, string> = {
  mark_only: 'mark-only',
  mark_monogram: 'mark-monogram',
  mark_text: 'mark-wordmark',
};

const SILHOUETTE_MOCKUP_PREFIX: Partial<Record<SilhouetteId, string>> = {
  'men-polo-st740': 'high-draw-weekender-men-s-polo',
  'women-polo-lst740': 'high-draw-weekender-women-s-polo',
  'men-polo-k830': 'high-draw-clubhouse-men-s-polo',
  'women-polo-lk830': 'high-draw-clubhouse-women-s-polo',
  'outerwear-f218-fleece': 'high-draw-clubhouse-fleece-quarter-zip',
};

function slugifyColor(colorTitle: string): string {
  return colorTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Returns the local downloaded high-resolution Printify factory mockup URL
 * for any combination of silhouette, Printify color title, and official logo mark.
 */
export function getOfficialPrintifyMockup(
  silhouetteId: SilhouetteId,
  printifyColorTitle: string,
  logoStyle: LogoStyle
): string | null {
  const colorSlug = slugifyColor(printifyColorTitle);

  if (silhouetteId === 'headwear-flexfit-mesh') {
    return `/assets/products/printify_mockups/flexfit-cool-dry-poly-block-mesh-cap--${colorSlug}.jpg`;
  }

  const effectiveSil: SilhouetteId =
    silhouetteId === 'bundle-foursome-01' ? 'men-polo-st740' : silhouetteId;
  const basePrefix = SILHOUETTE_MOCKUP_PREFIX[effectiveSil];
  if (!basePrefix) return null;

  const normalizedLogo: Exclude<LogoStyle, 'none' | 'monogram'> =
    logoStyle === 'mark_only' || logoStyle === 'mark_text' ? logoStyle : 'mark_monogram';
  const logoSlug = LOGO_MOCKUP_SLUG[normalizedLogo];

  return `/assets/products/printify_mockups/${basePrefix}-${logoSlug}--${colorSlug}.jpg`;
}

/**
 * Resolves the exact Printify shop `product_id` matching the garment silhouette + logo lockup.
 */
function findPrintifyShopProduct(
  silhouetteId: SilhouetteId,
  logoStyle: LogoStyle
): LedgerProduct | undefined {
  if (silhouetteId === 'headwear-flexfit-mesh') {
    return LEDGER_PRODUCTS.find(p => p.blueprint_id === 5272);
  }

  const effectiveSil: SilhouetteId =
    silhouetteId === 'bundle-foursome-01' ? 'men-polo-st740' : silhouetteId;
  const targetBlueprint = SILHOUETTE_SPECS[effectiveSil]?.blueprintId || 1984;

  const normalizedLogo: Exclude<LogoStyle, 'none' | 'monogram'> =
    logoStyle === 'mark_only' || logoStyle === 'mark_text' ? logoStyle : 'mark_monogram';

  const candidates = LEDGER_PRODUCTS.filter(p => p.blueprint_id === targetBlueprint);
  if (candidates.length === 0) return LEDGER_PRODUCTS[0];

  const matchByKeyword = candidates.find(p => {
    const t = p.title.toLowerCase();
    if (normalizedLogo === 'mark_only') {
      return t.includes('mark-only') || t.includes('mark only');
    }
    if (normalizedLogo === 'mark_text') {
      return t.includes('wordmark');
    }
    return t.includes('monogram');
  });

  return matchByKeyword || candidates[0];
}

/**
 * Returns the factory-calibrated thread color for a given silhouette and garment color,
 * reflecting the exact embroidery/DTF contrast rules configured in Printify.
 */
export function getFactoryThreadColor(
  silhouetteId: SilhouetteId,
  colorName: string
): { variant: LogoVariant; label: string } {
  if (silhouetteId === 'men-polo-k830' || silhouetteId === 'women-polo-lk830' || silhouetteId === 'outerwear-f218-fleece') {
    return { variant: 'white', label: 'Crisp White Thread' };
  }
  const lower = colorName.toLowerCase();
  if (lower.includes('white')) {
    return { variant: 'cyan', label: 'Carolina / Cyan Tracer Thread' };
  }
  return { variant: 'white', label: 'Crisp White Thread' };
}

/**
 * Resolves any High Draw storefront item into its exact Printify factory
 * `product_id` and numeric `variant_id`, plus Sovereign SKU and official mockup URL.
 */
export function resolvePrintifyFulfillment(input: {
  id: string;
  color: string;
  size: string;
  logoStyle?: LogoStyle;
  logoColor?: LogoVariant;
}): ResolvedFulfillmentItem {
  let silhouetteId: SilhouetteId = 'men-polo-st740';
  for (const entry of SILHOUETTE_PREFIX_MAP) {
    if (input.id.startsWith(entry.prefix)) {
      silhouetteId = entry.id;
      break;
    }
  }

  const spec = SILHOUETTE_SPECS[silhouetteId] || SILHOUETTE_SPECS['men-polo-st740'];
  const cleanColorName = (input.color || '').split('•')[0].trim();

  const colorEntry =
    spec.colorMap[cleanColorName] ||
    Object.values(spec.colorMap)[0] || {
      code: 'NVY',
      printifyColorTitle: 'True Navy',
      hex: '#1E293B',
      recommendedThread: 'white' as LogoVariant,
    };

  const rawStyle = input.logoStyle || 'mark_monogram';
  const logoStyle: LogoStyle =
    rawStyle === 'mark_only' || rawStyle === 'mark_text' || rawStyle === 'mark_monogram'
      ? rawStyle
      : 'mark_monogram';

  const factoryThread = getFactoryThreadColor(silhouetteId, cleanColorName);
  const logoColor: LogoVariant = input.logoColor || factoryThread.variant;
  const cleanSize = (input.size || 'L').split('/')[0].trim() === 'S' && input.size.includes('S/M')
    ? 'S/M'
    : (input.size || 'L').trim();

  const skuInput: SkuBuildInput = {
    productId: silhouetteId,
    colorName: cleanColorName,
    logoStyle,
    logoColor,
    size: cleanSize,
  };

  const sovereignSku = generateSovereignSku(skuInput);
  const shopProduct = findPrintifyShopProduct(silhouetteId, logoStyle);
  const printifyProductId = shopProduct?.id || '6af3a55dcb8adff71a02b775';

  // Match variant in Printify product (`title` format: "L / True Navy", "XXL / White", or "L/XL / True Navy")
  const targetColorLower = colorEntry.printifyColorTitle.toLowerCase();
  const targetSizeUpper = cleanSize.toUpperCase();
  const validSizes =
    targetSizeUpper === '2XL' || targetSizeUpper === 'XXL'
      ? ['2XL', 'XXL']
      : targetSizeUpper === '3XL' || targetSizeUpper === 'XXXL'
      ? ['3XL', 'XXXL']
      : [targetSizeUpper];

  let matchedVariant: LedgerVariant | undefined;
  if (shopProduct?.variants) {
    matchedVariant = shopProduct.variants.find(v => {
      const parts = v.title.split(/\s+\/\s+/).map(s => s.trim());
      const hasColor = parts.some(p => p.toLowerCase() === targetColorLower);
      const hasSize = parts.some(p => validSizes.includes(p.toUpperCase()));
      return hasColor && hasSize;
    });

    if (!matchedVariant) {
      matchedVariant = shopProduct.variants.find(v =>
        v.title.toLowerCase().includes(targetColorLower)
      );
    }
  }

  const fallbackVariantId = shopProduct?.variants?.[0]?.id || 122463;
  const exactVariantId = matchedVariant?.id;

  const officialMockupUrl = getOfficialPrintifyMockup(
    silhouetteId,
    colorEntry.printifyColorTitle,
    logoStyle
  );

  return {
    sovereignSku,
    silhouetteId,
    printifyProductId,
    printifyVariantId: exactVariantId || fallbackVariantId,
    printifyColorTitle: colorEntry.printifyColorTitle,
    size: cleanSize,
    logoStyle,
    logoColor,
    decorationMethod: spec.decorationMethod,
    placeholderPosition: spec.placeholderPosition,
    isStockAvailable: Boolean(matchedVariant ? matchedVariant.is_enabled : true),
    officialMockupUrl,
  };
}

/**
 * Expands any storefront cart item (including 4-polo Saturday Foursome Scramble Kits)
 * into concrete Printify `{ product_id, variant_id, quantity }` line items and merges duplicates.
 */
export function resolvePrintifyOrderLineItems(input: {
  id: string;
  color: string;
  size: string;
  logoStyle?: LogoStyle;
  logoColor?: LogoVariant;
  userTypeLabel?: string;
  quantity?: number;
}): Array<{ product_id: string; variant_id: number; quantity: number }> {
  const qty = Math.max(1, Math.floor(Number(input.quantity) || 1));
  if (input.id.startsWith('bundle-foursome-01')) {
    const colorLower = (input.color || '').split('•')[0].trim().toLowerCase();
    let colors: [string, string, string, string] = [
      'Deep Midnight Navy',
      'Carolina Blue',
      'Crisp White',
      'Onyx Black',
    ];
    if (colorLower.includes('navy')) {
      colors = ['Deep Midnight Navy', 'Deep Midnight Navy', 'Deep Midnight Navy', 'Deep Midnight Navy'];
    } else if (colorLower.includes('carolina')) {
      colors = ['Carolina Blue', 'Carolina Blue', 'Carolina Blue', 'Carolina Blue'];
    } else if (colorLower.includes('white')) {
      colors = ['Crisp White', 'Crisp White', 'Crisp White', 'Crisp White'];
    }

    const cutHint = `${input.userTypeLabel || ''} ${input.color || ''}`.toLowerCase();
    let cuts: [SilhouetteId, SilhouetteId, SilhouetteId, SilhouetteId] = [
      'men-polo-st740',
      'men-polo-st740',
      'men-polo-st740',
      'men-polo-st740',
    ];
    if (cutHint.includes("2 men's + 2 women's") || cutHint.includes('2m-2w')) {
      cuts = ['men-polo-st740', 'men-polo-st740', 'women-polo-lst740', 'women-polo-lst740'];
    } else if (cutHint.includes("3 men's + 1 women's") || cutHint.includes('3m-1w')) {
      cuts = ['men-polo-st740', 'men-polo-st740', 'men-polo-st740', 'women-polo-lst740'];
    } else if (cutHint.includes("4 women's") || cutHint.includes('4-womens')) {
      cuts = ['women-polo-lst740', 'women-polo-lst740', 'women-polo-lst740', 'women-polo-lst740'];
    }

    const merged = new Map<string, { product_id: string; variant_id: number; quantity: number }>();
    for (let i = 0; i < 4; i++) {
      const resolved = resolvePrintifyFulfillment({
        id: cuts[i],
        color: colors[i],
        size: input.size,
        logoStyle: input.logoStyle,
        logoColor: input.logoColor,
      });
      const key = `${resolved.printifyProductId}:${resolved.printifyVariantId}`;
      const existing = merged.get(key);
      if (existing) {
        existing.quantity += qty;
      } else {
        merged.set(key, {
          product_id: resolved.printifyProductId,
          variant_id: resolved.printifyVariantId,
          quantity: qty,
        });
      }
    }
    return Array.from(merged.values());
  }

  const resolved = resolvePrintifyFulfillment(input);
  return [
    {
      product_id: resolved.printifyProductId,
      variant_id: resolved.printifyVariantId,
      quantity: qty,
    },
  ];
}
