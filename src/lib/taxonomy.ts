import type { LogoStyle, LogoVariant } from '../components/brand/HighDrawLogo';

export type TierId = 'weekender' | 'clubhouse' | 'tournament' | 'core';

export type SilhouetteId =
  | 'men-polo-st740'
  | 'women-polo-lst740'
  | 'men-polo-k830'
  | 'women-polo-lk830'
  | 'outerwear-f218-fleece'
  | 'outerwear-st443'
  | 'headwear-flexfit-mesh'
  | 'bundle-foursome-01'
  | 'tournament-tour-spec-polo';

export interface SilhouetteBlueprintSpec {
  id: SilhouetteId;
  skuCode: string;
  tier: TierId;
  humanName: string;
  shortName: string;
  blueprintId: number;
  printProviderId: number;
  printProviderName: string;
  placeholderPosition: string;
  decorationMethod: 'embroidery' | 'dtf';
  priceCents: number;
  sizes: string[];
  colorMap: Record<string, {
    code: string;
    printifyColorTitle: string;
    hex: string;
    recommendedThread: LogoVariant;
  }>;
}

export const LOGO_SKU_CODES: Record<LogoStyle, string> = {
  mark_monogram: 'MM',
  mark_only: 'MO',
  monogram: 'HD',
  mark_text: 'TX',
  none: 'NL',
};

export const THREAD_SKU_CODES: Record<LogoVariant, string> = {
  cyan: 'CYN',
  gold: 'GLD',
  white: 'WHT',
  black: 'BLK',
};

export const SILHOUETTE_SPECS: Record<SilhouetteId, SilhouetteBlueprintSpec> = {
  'men-polo-st740': {
    id: 'men-polo-st740',
    skuCode: 'MST740',
    tier: 'weekender',
    humanName: "The Weekender Performance Polo — Men's",
    shortName: "Men's Weekender Polo",
    blueprintId: 1984,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'front_left_chest',
    decorationMethod: 'embroidery',
    priceCents: 4800,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colorMap: {
      'Deep Midnight Navy': {
        code: 'NVY',
        printifyColorTitle: 'True Navy',
        hex: '#1E293B',
        recommendedThread: 'gold',
      },
      'Carolina Blue': {
        code: 'CAR',
        printifyColorTitle: 'Carolina Blue',
        hex: '#6BA4B8',
        recommendedThread: 'white',
      },
      'Crisp White': {
        code: 'WHT',
        printifyColorTitle: 'White',
        hex: '#FFFFFF',
        recommendedThread: 'cyan',
      },
      'Onyx Black': {
        code: 'BLK',
        printifyColorTitle: 'Black',
        hex: '#111827',
        recommendedThread: 'cyan',
      },
      'Forest Green': {
        code: 'GRN',
        printifyColorTitle: 'Forest Green',
        hex: '#1E3A2F',
        recommendedThread: 'gold',
      },
      'Deep Red': {
        code: 'RED',
        printifyColorTitle: 'Deep Red',
        hex: '#991B1B',
        recommendedThread: 'white',
      },
      'Graphite': {
        code: 'GRP',
        printifyColorTitle: 'Graphite',
        hex: '#4B5563',
        recommendedThread: 'cyan',
      },
      'Grey Concrete': {
        code: 'GRY',
        printifyColorTitle: 'Grey Concrete',
        hex: '#9CA3AF',
        recommendedThread: 'black',
      },
      'True Royal': {
        code: 'RYL',
        printifyColorTitle: 'True Royal',
        hex: '#1D4ED8',
        recommendedThread: 'white',
      },
    },
  },
  'women-polo-lst740': {
    id: 'women-polo-lst740',
    skuCode: 'WLST740',
    tier: 'weekender',
    humanName: "The Weekender Performance Polo — Women's",
    shortName: "Women's Weekender Polo",
    blueprintId: 3322,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'left_chest_dtf',
    decorationMethod: 'dtf',
    priceCents: 4800,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colorMap: {
      'Carolina Blue': {
        code: 'CAR',
        printifyColorTitle: 'Carolina Blue',
        hex: '#6BA4B8',
        recommendedThread: 'black',
      },
      'Onyx Black': {
        code: 'BLK',
        printifyColorTitle: 'Black',
        hex: '#111827',
        recommendedThread: 'gold',
      },
      'Crisp White': {
        code: 'WHT',
        printifyColorTitle: 'White',
        hex: '#FFFFFF',
        recommendedThread: 'cyan',
      },
      'Deep Midnight Navy': {
        code: 'NVY',
        printifyColorTitle: 'True Navy',
        hex: '#1E293B',
        recommendedThread: 'white',
      },
      'Deep Red': {
        code: 'RED',
        printifyColorTitle: 'Deep Red',
        hex: '#991B1B',
        recommendedThread: 'white',
      },
      'True Royal': {
        code: 'RYL',
        printifyColorTitle: 'True Royal',
        hex: '#1D4ED8',
        recommendedThread: 'white',
      },
      'Grey Concrete': {
        code: 'GRY',
        printifyColorTitle: 'Grey Concrete',
        hex: '#9CA3AF',
        recommendedThread: 'black',
      },
      'Graphite': {
        code: 'GRP',
        printifyColorTitle: 'Graphite',
        hex: '#4B5563',
        recommendedThread: 'cyan',
      },
    },
  },
  'outerwear-st443': {
    id: 'outerwear-st443',
    skuCode: 'MST443',
    tier: 'core',
    humanName: "The Tour Tech Quarter-Zip Pullover — Men's",
    shortName: 'Tour Tech 1/4-Zip',
    blueprintId: 4133,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'left_chest_dtf',
    decorationMethod: 'dtf',
    priceCents: 5600,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colorMap: {
      'True Navy / White': {
        code: 'NVW',
        printifyColorTitle: 'True Navy/ White',
        hex: '#1E293B',
        recommendedThread: 'cyan',
      },
      'Black / White': {
        code: 'BKW',
        printifyColorTitle: 'Black/ White',
        hex: '#111827',
        recommendedThread: 'cyan',
      },
      'Iron Grey / White': {
        code: 'IGW',
        printifyColorTitle: 'Iron Grey/ White',
        hex: '#4B5563',
        recommendedThread: 'cyan',
      },
      'True Royal / White': {
        code: 'RYW',
        printifyColorTitle: 'True Royal/ White',
        hex: '#1D4ED8',
        recommendedThread: 'white',
      },
      'Black / Deep Red': {
        code: 'BKR',
        printifyColorTitle: 'Black/ Deep Red',
        hex: '#7F1D1D',
        recommendedThread: 'white',
      },
    },
  },
  'headwear-flexfit-mesh': {
    id: 'headwear-flexfit-mesh',
    skuCode: 'CAP',
    tier: 'core',
    humanName: 'The Tour Performance Poly-Mesh Cap',
    shortName: 'Tour Poly-Mesh Cap',
    blueprintId: 5272,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'front_left_dtf',
    decorationMethod: 'dtf',
    priceCents: 3500,
    sizes: ['S/M', 'L/XL'],
    colorMap: {
      'Pure White': {
        code: 'WHT',
        printifyColorTitle: 'White',
        hex: '#FFFFFF',
        recommendedThread: 'cyan',
      },
      'Deep Midnight Navy': {
        code: 'NVY',
        printifyColorTitle: 'True Navy',
        hex: '#1E293B',
        recommendedThread: 'cyan',
      },
      'Onyx Black': {
        code: 'BLK',
        printifyColorTitle: 'Black',
        hex: '#111827',
        recommendedThread: 'cyan',
      },
      'Charcoal Grey Heather': {
        code: 'GHT',
        printifyColorTitle: 'Grey Heather',
        hex: '#64748B',
        recommendedThread: 'black',
      },
      'Magnet Slate': {
        code: 'MAG',
        printifyColorTitle: 'Magnet',
        hex: '#374151',
        recommendedThread: 'cyan',
      },
      'True Red': {
        code: 'RED',
        printifyColorTitle: 'True Red',
        hex: '#B91C1C',
        recommendedThread: 'white',
      },
      'True Royal': {
        code: 'RYL',
        printifyColorTitle: 'True Royal',
        hex: '#1D4ED8',
        recommendedThread: 'white',
      },
    },
  },
  'bundle-foursome-01': {
    id: 'bundle-foursome-01',
    skuCode: 'BNDL4',
    tier: 'core',
    humanName: 'The Saturday Foursome Scramble Kit (4 Polos)',
    shortName: 'Foursome Scramble Kit',
    blueprintId: 1984,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'front_left_chest',
    decorationMethod: 'embroidery',
    priceCents: 16000,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    colorMap: {
      'Deep Midnight Navy (x4)': {
        code: 'NVY4',
        printifyColorTitle: 'True Navy',
        hex: '#1E293B',
        recommendedThread: 'gold',
      },
      'Carolina Blue (x4)': {
        code: 'CAR4',
        printifyColorTitle: 'Carolina Blue',
        hex: '#6BA4B8',
        recommendedThread: 'white',
      },
      'Crisp White (x4)': {
        code: 'WHT4',
        printifyColorTitle: 'White',
        hex: '#FFFFFF',
        recommendedThread: 'cyan',
      },
      'Mixed Club Pack (Navy, Carolina, White, Black)': {
        code: 'MIX4',
        printifyColorTitle: 'True Navy',
        hex: '#0F172A',
        recommendedThread: 'gold',
      },
    },
  },
  'men-polo-k830': {
    id: 'men-polo-k830',
    skuCode: 'MK830',
    tier: 'clubhouse',
    humanName: "The Clubhouse Fine Pique Polo — Men's",
    shortName: "Men's Clubhouse Polo",
    blueprintId: 2038,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'front_left_chest',
    decorationMethod: 'embroidery',
    priceCents: 6600,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colorMap: {
      'Aegean Blue Heather': {
        code: 'ABH',
        printifyColorTitle: 'Aegean Blue Heather',
        hex: '#4A6B82',
        recommendedThread: 'white',
      },
      'Black Heather': {
        code: 'BKH',
        printifyColorTitle: 'Black Heather',
        hex: '#2B2B2B',
        recommendedThread: 'white',
      },
      'Charcoal Heather': {
        code: 'CHH',
        printifyColorTitle: 'Charcoal Heather',
        hex: '#4A4A4A',
        recommendedThread: 'white',
      },
      'Dark Teal Heather': {
        code: 'DTH',
        printifyColorTitle: 'Dark Teal Heather',
        hex: '#1F4E5B',
        recommendedThread: 'white',
      },
      'River Blue Navy Heather': {
        code: 'RBN',
        printifyColorTitle: 'River Blue Navy Heather',
        hex: '#22384D',
        recommendedThread: 'white',
      },
    },
  },
  'women-polo-lk830': {
    id: 'women-polo-lk830',
    skuCode: 'WLK830',
    tier: 'clubhouse',
    humanName: "The Clubhouse Fine Pique Polo — Women's",
    shortName: "Women's Clubhouse Polo",
    blueprintId: 2026,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'front_left_chest',
    decorationMethod: 'embroidery',
    priceCents: 6600,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    colorMap: {
      'Aegean Blue Heather': {
        code: 'ABH',
        printifyColorTitle: 'Aegean Blue Heather',
        hex: '#4A6B82',
        recommendedThread: 'white',
      },
      'Black Heather': {
        code: 'BKH',
        printifyColorTitle: 'Black Heather',
        hex: '#2B2B2B',
        recommendedThread: 'white',
      },
      'Charcoal Heather': {
        code: 'CHH',
        printifyColorTitle: 'Charcoal Heather',
        hex: '#4A4A4A',
        recommendedThread: 'white',
      },
    },
  },
  'outerwear-f218-fleece': {
    id: 'outerwear-f218-fleece',
    skuCode: 'MF218',
    tier: 'clubhouse',
    humanName: 'The Clubhouse Value Fleece 1/4-Zip Pullover',
    shortName: 'Clubhouse Fleece 1/4-Zip',
    blueprintId: 3630,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'front_left_chest',
    decorationMethod: 'embroidery',
    priceCents: 6800,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
    colorMap: {
      'Black': {
        code: 'BLK',
        printifyColorTitle: 'Black',
        hex: '#111827',
        recommendedThread: 'white',
      },
      'Iron Grey': {
        code: 'IGY',
        printifyColorTitle: 'Iron Grey',
        hex: '#4B5563',
        recommendedThread: 'white',
      },
      'True Navy': {
        code: 'NVY',
        printifyColorTitle: 'True Navy',
        hex: '#1E293B',
        recommendedThread: 'white',
      },
    },
  },
  'tournament-tour-spec-polo': {
    id: 'tournament-tour-spec-polo',
    skuCode: 'TRN01',
    tier: 'tournament',
    humanName: 'The Tournament Tour-Spec Performance Polo',
    shortName: 'Tournament Tour Polo',
    blueprintId: 1984,
    printProviderId: 217,
    printProviderName: 'Fulfill Engine',
    placeholderPosition: 'front_left_chest',
    decorationMethod: 'embroidery',
    priceCents: 11000,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colorMap: {
      'Tour Midnight': {
        code: 'TMN',
        printifyColorTitle: 'True Navy',
        hex: '#0A1128',
        recommendedThread: 'gold',
      },
      'Tour Ice White': {
        code: 'TIW',
        printifyColorTitle: 'White',
        hex: '#FFFFFF',
        recommendedThread: 'cyan',
      },
    },
  },
};

export interface SkuBuildInput {
  productId: string;
  colorName: string;
  logoStyle: LogoStyle;
  logoColor: LogoVariant;
  size: string;
}

export interface ParsedSovereignSku {
  sku: string;
  silhouetteId: SilhouetteId;
  silhouetteCode: string;
  colorName: string;
  colorCode: string;
  printifyColorTitle: string;
  logoStyle: LogoStyle;
  logoCode: string;
  logoColor: LogoVariant;
  threadCode: string;
  size: string;
  humanTitle: string;
  blueprintId: number;
  printProviderId: number;
}

/**
 * Deterministically builds a clean, canonical High Draw SKU
 * Format: HD-[SILHOUETTE]-[COLOR]-[LOGO]-[THREAD]-[SIZE]
 * Example: HD-MST740-NVY-MM-GLD-L
 */
export function generateSovereignSku(input: SkuBuildInput): string {
  const spec = SILHOUETTE_SPECS[input.productId as SilhouetteId] || SILHOUETTE_SPECS['men-polo-st740'];
  const cleanColorName = input.colorName.split('•')[0].trim();
  const colorEntry =
    spec.colorMap[cleanColorName] ||
    Object.values(spec.colorMap)[0] || {
      code: 'STD',
      printifyColorTitle: 'True Navy',
      hex: '#1E293B',
      recommendedThread: 'cyan' as LogoVariant,
    };

  const logoCode = LOGO_SKU_CODES[input.logoStyle] || 'MM';
  const threadCode = input.logoStyle === 'none' ? 'NONE' : THREAD_SKU_CODES[input.logoColor] || 'CYN';
  const cleanSize = input.size.replace('/', '');

  return `HD-${spec.skuCode}-${colorEntry.code}-${logoCode}-${threadCode}-${cleanSize}`;
}

/**
 * Compute total possible combinations across all High Draw silhouettes, colors, logos, threads, and sizes
 */
export function getMatrixStats() {
  let totalPermutations = 0;
  const breakdown: Array<{
    id: SilhouetteId;
    name: string;
    colors: number;
    sizes: number;
    logoCombinations: number;
    total: number;
  }> = [];

  // 4 logo styles * 4 thread colors + 1 unbranded = 17 branding options per garment color/size
  const logoCombinations = 4 * 4 + 1;

  (Object.keys(SILHOUETTE_SPECS) as SilhouetteId[]).forEach(key => {
    if (key === 'bundle-foursome-01') return;
    const spec = SILHOUETTE_SPECS[key];
    const colorCount = Object.keys(spec.colorMap).length;
    const sizeCount = spec.sizes.length;
    const subTotal = colorCount * sizeCount * logoCombinations;
    totalPermutations += subTotal;
    breakdown.push({
      id: key,
      name: spec.humanName,
      colors: colorCount,
      sizes: sizeCount,
      logoCombinations,
      total: subTotal,
    });
  });

  return {
    totalPermutations,
    logoCombinations,
    breakdown,
  };
}
