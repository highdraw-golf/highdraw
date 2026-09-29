import type { VercelRequest, VercelResponse } from '@vercel/node';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

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
    // 1. Create Stripe Checkout Session
    if (req.method === 'POST' && (action === 'checkout' || !action)) {
      const { items, customerEmail, orderId, returnUrl } = req.body;

      if (!items || !items.length) {
        return res.status(400).json({ error: 'No items provided for checkout.' });
      }

      // Check if real Stripe key is provided in Vercel environment
      if (!STRIPE_SECRET_KEY) {
        console.warn('⚠️ [Stripe API] STRIPE_SECRET_KEY is not configured yet. Returning simulated checkout ready response.');
        return res.status(200).json({
          configured: false,
          message: 'Stripe integration is prepped and ready. Add STRIPE_SECRET_KEY in Vercel environment variables to activate live credit card processing.',
          simulated: true,
          orderId: orderId || `HD-${Date.now()}`,
        });
      }

      const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.highdrawgear.com';
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const origin = returnUrl || `${protocol}://${host}`;

      const params = new URLSearchParams();
      params.append('payment_method_types[0]', 'card');
      params.append('mode', 'payment');
      if (customerEmail) {
        params.append('customer_email', customerEmail);
      }
      params.append('success_url', `${origin}/?payment=success&orderId=${orderId || 'LIVE'}`);
      params.append('cancel_url', `${origin}/?payment=cancelled`);
      params.append('shipping_address_collection[allowed_countries][0]', 'US');
      params.append('shipping_address_collection[allowed_countries][1]', 'CA');

      // Add line items
      items.forEach((item: any, index: number) => {
        params.append(`line_items[${index}][price_data][currency]`, 'usd');
        params.append(`line_items[${index}][price_data][product_data][name]`, `${item.name} (${item.color}, Size ${item.size})`);
        params.append(`line_items[${index}][price_data][unit_amount]`, Math.round(item.price * 100).toString());
        params.append(`line_items[${index}][quantity]`, (item.quantity || 1).toString());
      });

      // Metadata for Printify fulfillment webhook
      params.append('metadata[orderId]', orderId || '');
      params.append('metadata[fulfillment]', 'printify_auto');

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
        return res.status(response.status).json({ error: data.error?.message || 'Failed to create Stripe checkout session' });
      }

      return res.status(200).json({
        configured: true,
        sessionId: data.id,
        checkoutUrl: data.url,
      });
    }

    return res.status(400).json({ error: 'Invalid action or method' });
  } catch (err: any) {
    console.error('Stripe handler exception:', err);
    return res.status(500).json({ error: err.message || 'Internal server error in Stripe gateway' });
  }
}
