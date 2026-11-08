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
}

/**
 * Resolves any High Draw storefront item into its exact Printify factory
 * `product_id` and numeric `variant_id`, plus Sovereign SKU.
 */
export function resolvePrintifyFulfillment(input: {
  id: string;
  color: string;
  size: string;
  logoStyle?: LogoStyle;
  logoColor?: LogoVariant;
}): ResolvedFulfillmentItem {
  // Determine base silhouette ID
  let silhouetteId: SilhouetteId = 'men-polo-st740';
  if (input.id.startsWith('women-polo-lst740')) {
    silhouetteId = 'women-polo-lst740';
  } else if (input.id.startsWith('outerwear-st443')) {
    silhouetteId = 'outerwear-st443';
  } else if (input.id.startsWith('headwear-flexfit-mesh')) {
    silhouetteId = 'headwear-flexfit-mesh';
  } else if (input.id.startsWith('bundle-foursome-01')) {
    silhouetteId = 'bundle-foursome-01';
  }

  const spec = SILHOUETTE_SPECS[silhouetteId];
  const cleanColorName = (input.color || '').split('•')[0].trim();

  // Lookup color mapping in taxonomy
  const colorEntry =
    spec.colorMap[cleanColorName] ||
    Object.values(spec.colorMap)[0] || {
      code: 'NVY',
      printifyColorTitle: 'True Navy',
      hex: '#1E293B',
      recommendedThread: 'gold' as LogoVariant,
    };

  const logoStyle: LogoStyle = input.logoStyle || 'mark_monogram';
  const logoColor: LogoVariant = input.logoColor || colorEntry.recommendedThread;
  const cleanSize = (input.size || 'L').trim();

  const skuInput: SkuBuildInput = {
    productId: silhouetteId,
    colorName: cleanColorName,
    logoStyle,
    logoColor,
    size: cleanSize,
  };

  const sovereignSku = generateSovereignSku(skuInput);

  // Resolve numeric Printify variant ID from ledger
  const ledgerKey = silhouetteId === 'bundle-foursome-01' ? 'men-polo-st740' : silhouetteId;
  const ledgerSilhouette = (printifyLedger.silhouettes as Record<string, any>)[ledgerKey];

  const printifyProductId: string =
    ledgerSilhouette?.canonicalShopProductId || '6aefb534afdf3f8ff4025e42';
  const colorMapInLedger: Record<string, number> | undefined =
    ledgerSilhouette?.colors?.[colorEntry.printifyColorTitle];

  const exactVariantId = colorMapInLedger?.[cleanSize];
  const fallbackVariantId = colorMapInLedger
    ? Object.values(colorMapInLedger)[0]
    : 122460; // Default Men's L Grey Concrete

  return {
    sovereignSku,
    silhouetteId,
    printifyProductId,
    printifyVariantId: exactVariantId || fallbackVariantId,
    printifyColorTitle: colorEntry.printifyColorTitle,
    size: cleanSize,
    logoStyle,
    logoColor,
    decorationMethod: logoStyle === 'none' ? 'none' : spec.decorationMethod,
    placeholderPosition: spec.placeholderPosition,
    isStockAvailable: Boolean(exactVariantId),
  };
}
