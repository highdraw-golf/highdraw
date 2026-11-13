export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  setHeader(name: string, value: string): unknown;
  status(code: number): ApiResponse;
  json(payload: unknown): unknown;
  end(): unknown;
}

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN || "";
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || "29111523";

const ALLOWED_ORIGINS = new Set([
  'https://www.highdrawgear.com',
  'https://highdrawgear.com',
  'https://highdraw.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (/^https:\/\/highdraw-[a-z0-9]+-high-draw-gear\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const rawOrigin = req.headers.origin;
  const requestOrigin = Array.isArray(rawOrigin) ? rawOrigin[0] : rawOrigin;
  const corsOrigin = isAllowedOrigin(requestOrigin) ? requestOrigin! : 'https://www.highdrawgear.com';

  // Strict CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!PRINTIFY_API_TOKEN) {
    return res.status(503).json({ error: 'Fulfillment gateway configuration pending.' });
  }

  const rawAction = req.query.action;
  const action = Array.isArray(rawAction) ? rawAction[0] : rawAction;

  try {
    // 1. Fetch Products (Read-Only Catalog)
    if (req.method === 'GET' && action === 'products') {
      const response = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json`, {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'User-Agent': 'HighDrawGolf-Backend/2.0',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Printify products fetch failed' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    // 2. Create Automated Order (With Strict Schema Validation & Idempotency)
    if (req.method === 'POST' && action === 'order') {
      // Verify request comes from an allowed origin or internal webhook
      if (requestOrigin && !isAllowedOrigin(requestOrigin)) {
        return res.status(403).json({ error: 'Forbidden origin' });
      }

      const orderPayload = req.body as Record<string, any> | undefined;
      if (
        !orderPayload ||
        typeof orderPayload !== 'object' ||
        !Array.isArray(orderPayload.line_items) ||
        orderPayload.line_items.length === 0 ||
        orderPayload.line_items.length > 25 ||
        !orderPayload.address_to ||
        typeof orderPayload.address_to.email !== 'string'
      ) {
        return res.status(400).json({ error: 'Invalid order payload structure' });
      }

      const externalId = typeof orderPayload.external_id === 'string' ? orderPayload.external_id.trim() : '';
      if (externalId) {
        const existingRes = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json?limit=50`, {
          headers: {
            'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
            'User-Agent': 'HighDrawGolf-Backend/2.0',
          },
        });
        if (existingRes.ok) {
          const existingJson = (await existingRes.json()) as { data?: Array<Record<string, any>> };
          const existing = (existingJson.data || []).find(
            o => o?.metadata?.shop_order_id === externalId || o?.metadata?.shop_order_label === externalId
          );
          if (existing) {
            return res.status(200).json({ id: existing.id, status: existing.status, alreadyFulfilled: true });
          }
        }
      }

      const sanitizedPayload = {
        ...orderPayload,
        line_items: orderPayload.line_items.map((li: Record<string, any>) => ({
          product_id: String(li.product_id || ''),
          variant_id: Number(li.variant_id),
          quantity: Math.max(1, Math.floor(Number(li.quantity) || 1)),
        })),
      };

      const response = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'User-Agent': 'HighDrawGolf-Backend/2.0',
        },
        body: JSON.stringify(sanitizedPayload),
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Printify order creation failed' });
      }

      const data = (await response.json()) as { id: string; status: string };
      return res.status(200).json({ id: data.id, status: data.status });
    }

    return res.status(400).json({ error: 'Invalid action or method' });
  } catch (error) {
    console.error('Printify backend error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
