import type { VercelRequest, VercelResponse } from '@vercel/node';

const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN || "";
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || "29111523";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    // 1. Fetch Products
    if (req.method === 'GET' && action === 'products') {
      const response = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json`, {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'User-Agent': 'HighDrawGolf-Backend/1.0',
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return res.status(response.status).json({ error: err.message || 'Printify products fetch failed' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    // 2. Fetch Shops
    if (req.method === 'GET' && action === 'shops') {
      const response = await fetch('https://api.printify.com/v1/shops.json', {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'User-Agent': 'HighDrawGolf-Backend/1.0',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch Printify shops' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    // 3. Create Automated Order
    if (req.method === 'POST' && action === 'order') {
      const orderPayload = req.body;
      const response = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'User-Agent': 'HighDrawGolf-Backend/1.0',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return res.status(response.status).json({ error: err.message || 'Printify order creation failed' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Invalid action or method' });
  } catch (error: any) {
    console.error('Printify backend error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
