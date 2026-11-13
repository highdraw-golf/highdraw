// High Draw Golf — Deterministic 2+ Polo Pair & Cart Pricing Engine

export const FREE_SHIPPING_THRESHOLD_DOLLARS = 75;
export const STANDARD_SHIPPING_DOLLARS = 8;
export const PAIR_DISCOUNT_PER_POLO_DOLLARS = 5;

export const PAIR_ELIGIBLE_POLO_PREFIXES = [
  'men-polo-st740',
  'women-polo-lst740',
  'men-polo-k830',
  'women-polo-lk830',
] as const;

export interface PricingCartItemInput {
  id: string;
  price: number;
  quantity?: number;
}

export interface CartPricingSummary {
  totalUnits: number;
  rawSubtotal: number;
  pairEligibleUnits: number;
  pairDiscountDollars: number;
  discountedSubtotal: number;
  shippingDollars: number;
  totalDollars: number;
  remainingForFreeShipping: number;
  freeShippingProgress: number;
}

/**
 * Resolves whether a cart line item qualifies for the Mix & Match 2+ Polo Pair
 * automatic savings (-$5/polo when 2+ eligible individual polos are in the bag).
 * Excludes the $40 headwear cap-bundle upsell (`men-polo-st740` at price 40) and
 * the already-discounted $160 Saturday Foursome Kit (`bundle-foursome-01`).
 */
export function isPairEligiblePoloItem(item: PricingCartItemInput): boolean {
  const id = String(item?.id || '').trim();
  if (!id) return false;
  if (id === 'men-polo-st740-upsell') return false;
  if (id.startsWith('men-polo-st740') && Number(item.price) === 40) return false;
  return PAIR_ELIGIBLE_POLO_PREFIXES.some((prefix) => id.startsWith(prefix));
}

export function calculateCartPricing(items: PricingCartItemInput[]): CartPricingSummary {
  let totalUnits = 0;
  let rawSubtotal = 0;
  let pairEligibleUnits = 0;

  for (const item of items) {
    const qty = Math.max(1, Math.floor(Number(item?.quantity) || 1));
    const unitPrice = Math.max(0, Number(item?.price) || 0);
    totalUnits += qty;
    rawSubtotal += unitPrice * qty;
    if (isPairEligiblePoloItem(item)) {
      pairEligibleUnits += qty;
    }
  }

  const pairDiscountDollars =
    pairEligibleUnits >= 2 ? pairEligibleUnits * PAIR_DISCOUNT_PER_POLO_DOLLARS : 0;
  const discountedSubtotal = Math.max(0, rawSubtotal - pairDiscountDollars);
  const shippingDollars =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD_DOLLARS || discountedSubtotal === 0
      ? 0
      : STANDARD_SHIPPING_DOLLARS;
  const totalDollars = discountedSubtotal + shippingDollars;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_DOLLARS - discountedSubtotal
  );
  const freeShippingProgress = Math.min(
    1,
    discountedSubtotal / FREE_SHIPPING_THRESHOLD_DOLLARS
  );

  return {
    totalUnits,
    rawSubtotal,
    pairEligibleUnits,
    pairDiscountDollars,
    discountedSubtotal,
    shippingDollars,
    totalDollars,
    remainingForFreeShipping,
    freeShippingProgress,
  };
}
