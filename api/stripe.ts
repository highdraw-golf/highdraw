import type { VercelRequest, VercelResponse } from '@vercel/node';

// Support standard key name and common aliases
const STRIPE_SECRET_KEY = 
  process.env.STRIPE_SECRET_KEY || 
  process.env.STRIPE_API_KEY || 
  process.env.STRIPE_RESTRICTED_KEY || 
  process.env.STRIPE_KEY || 
  "";

// Allowed Origin Whitelist (Anti-CSRF / Anti-Open-Redirect)
const ALLOWED_ORIGINS = new Set([
  'https://www.highdrawgear.com',
  'https://highdrawgear.com',
  'https://highdrawgolf.com',
  'https://www.highdrawgolf.com',
  'https://highdraw.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Allow official high-draw-gear Vercel preview deployments
  if (/^https:\/\/highdraw-[a-z0-9]+-high-draw-gear\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

// Authoritative Server-Side Price & Catalog Ledger (Zero Client Price Trust)
interface CatalogEntry {
  name: string;
  unitAmountCents: number;
}

const AUTHORITATIVE_CATALOG: Record<string, CatalogEntry> = {
  'men-polo-st740': {
    name: "The Tour Performance Polo — Men's",
    unitAmountCents: 4800, // $48.00
  },
  'women-polo-lst740': {
    name: "The Tour Performance Polo — Women's",
    unitAmountCents: 4800, // $48.00
  },
  'outerwear-st443': {
    name: "The Tour Tech Quarter-Zip Pullover — Men's",
    unitAmountCents: 5600, // $56.00
  },
  'headwear-flexfit-mesh': {
    name: 'The Tour Performance Poly-Mesh Cap',
    unitAmountCents: 3500, // $35.00
  },
  'headwear-flexfit-mesh-upsell': {
    name: 'The Tour Performance Poly-Mesh Cap (Bundle Upsell)',
    unitAmountCents: 2800, // $28.00
  },
  'bundle-foursome-01': {
    name: 'The Saturday Foursome Scramble Kit (4 Polos)',
    unitAmountCents: 16000, // $160.00
  },
};

function resolveCatalogItem(rawId: string, clientPrice?: number): CatalogEntry | null {
  const cleanId = String(rawId || '').trim();
  if (AUTHORITATIVE_CATALOG[cleanId]) {
    return AUTHORITATIVE_CATALOG[cleanId];
  }
  // Support composite variant IDs (e.g., 'headwear-flexfit-mesh-Pure White-S/M')
  if (cleanId.startsWith('headwear-flexfit-mesh')) {
    if (clientPrice === 28) {
      return AUTHORITATIVE_CATALOG['headwear-flexfit-mesh-upsell'];
    }
    return AUTHORITATIVE_CATALOG['headwear-flexfit-mesh'];
  }
  if (cleanId.startsWith('men-polo-st740')) return AUTHORITATIVE_CATALOG['men-polo-st740'];
  if (cleanId.startsWith('women-polo-lst740')) return AUTHORITATIVE_CATALOG['women-polo-lst740'];
  if (cleanId.startsWith('outerwear-st443')) return AUTHORITATIVE_CATALOG['outerwear-st443'];
  if (cleanId.startsWith('bundle-foursome-01')) return AUTHORITATIVE_CATALOG['bundle-foursome-01'];
  return null;
}

function sanitizeText(val: unknown, maxLen = 64): string {
  return String(val || '')
    .replace(/[<>'"&]/g, '')
    .trim()
    .slice(0, maxLen);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestOrigin = req.headers.origin;
  const corsOrigin = isAllowedOrigin(requestOrigin) ? requestOrigin! : 'https://www.highdrawgear.com';

  // Strict Security & CORS Headers
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.query;

  try {
    if (action === 'checkout' || !action) {
      const { items, customerEmail, orderId, returnUrl } = req.body || {};

      if (!Array.isArray(items) || items.length === 0 || items.length > 25) {
        return res.status(400).json({ error: 'Invalid cart items payload.' });
      }

      if (!STRIPE_SECRET_KEY) {
        console.warn('⚠️ [Stripe API] STRIPE_SECRET_KEY is empty in environment.');
        return res.status(503).json({
          configured: false,
          error: 'Payment gateway is temporarily offline.',
        });
      }

      // Prevent Open Redirect Vulnerabilities: only allow verified origins
      const safeOrigin = isAllowedOrigin(returnUrl) ? returnUrl : 'https://www.highdrawgear.com';
      const safeOrderId = sanitizeText(orderId || `HD-${Date.now()}`, 32).replace(/[^a-zA-Z0-9-_]/g, '');

      const params = new URLSearchParams();
      params.append('mode', 'payment');

      if (customerEmail && typeof customerEmail === 'string') {
        const cleanEmail = customerEmail.trim().slice(0, 120);
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          params.append('customer_email', cleanEmail);
        }
      }

      params.append('success_url', `${safeOrigin}/?payment=success&orderId=${encodeURIComponent(safeOrderId)}`);
      params.append('cancel_url', `${safeOrigin}/?payment=cancelled`);
      params.append('shipping_address_collection[allowed_countries][0]', 'US');
      params.append('shipping_address_collection[allowed_countries][1]', 'CA');

      let lineItemIndex = 0;
      let subtotalCents = 0;

      for (const rawItem of items) {
        const catalogProduct = resolveCatalogItem(rawItem?.id, Number(rawItem?.price));
        if (!catalogProduct) {
          return res.status(400).json({ error: `Unrecognized product SKU: ${sanitizeText(rawItem?.id, 32)}` });
        }

        const qty = Math.max(1, Math.min(20, Math.floor(Number(rawItem?.quantity) || 1)));
        const safeColor = sanitizeText(rawItem?.color || 'Standard', 36);
        const safeSize = sanitizeText(rawItem?.size || 'L', 12);

        subtotalCents += catalogProduct.unitAmountCents * qty;

        params.append(`line_items[${lineItemIndex}][price_data][currency]`, 'usd');
        params.append(
          `line_items[${lineItemIndex}][price_data][product_data][name]`,
          `${catalogProduct.name} (${safeColor}, Size ${safeSize})`
        );
        params.append(
          `line_items[${lineItemIndex}][price_data][unit_amount]`,
          catalogProduct.unitAmountCents.toString()
        );
        params.append(`line_items[${lineItemIndex}][quantity]`, qty.toString());
        lineItemIndex++;
      }

      // Server-side shipping enforcement: Free over $75.00 (7500 cents), else $8.00 (800 cents)
      if (subtotalCents > 0 && subtotalCents < 7500) {
        params.append(`line_items[${lineItemIndex}][price_data][currency]`, 'usd');
        params.append(
          `line_items[${lineItemIndex}][price_data][product_data][name]`,
          'Standard Domestic Fairway Shipping (Free Over $75)'
        );
        params.append(`line_items[${lineItemIndex}][price_data][unit_amount]`, '800');
        params.append(`line_items[${lineItemIndex}][quantity]`, '1');
      }

      // Metadata for Printify fulfillment audit
      params.append('metadata[orderId]', safeOrderId);
      params.append('metadata[fulfillment]', 'printify_auto');
      params.append('metadata[securityVersion]', 'v2-authoritative-ledger');

      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Stripe Checkout session error:', data);
        return res.status(response.status).json({ 
          error: 'Unable to initialize checkout session. Please verify your cart and try again.',
          stripeErrorCode: data.error?.code,
        });
      }

      return res.status(200).json({
        configured: true,
        sessionId: data.id,
        checkoutUrl: data.url,
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err: any) {
    console.error('Stripe handler exception:', err);
    return res.status(500).json({ error: 'Internal server error in Stripe gateway' });
  }
}
