import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHmac } from 'node:crypto';
import * as stripeGateway from '../api/stripe.ts';

interface LedgerJson {
  products: Array<{
    id: string;
    title: string;
    blueprint_id: number;
    variants: Array<{
      id: number;
      title: string;
    }>;
  }>;
}

const LEDGER_PATH = path.resolve(process.cwd(), 'src/data/printify_ledger.json');
const LEDGER_DATA: LedgerJson = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));

function createMockRes() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body: unknown = null;
  let ended = false;

  const res = {
    setHeader(key: string, value: string) {
      headers[key.toLowerCase()] = value;
      return res;
    },
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(payload: unknown) {
      body = payload;
      ended = true;
      return res;
    },
    end() {
      ended = true;
      return res;
    },
  };

  return {
    res,
    get statusCode() {
      return statusCode;
    },
    get body() {
      return body as Record<string, any>;
    },
    get headers() {
      return headers;
    },
    get ended() {
      return ended;
    },
  };
}

function getGatewayExports() {
  const mod = stripeGateway as Record<string, any>;
  assert.equal(typeof mod.SERVER_PRINTIFY_LEDGER, 'object', 'Expected SERVER_PRINTIFY_LEDGER export in api/stripe.ts');
  assert.equal(typeof mod.resolveServerFulfillmentItems, 'function', 'Expected resolveServerFulfillmentItems export in api/stripe.ts');
  assert.equal(typeof mod.createStripeGatewayHandler, 'function', 'Expected createStripeGatewayHandler export in api/stripe.ts');
  return {
    SERVER_PRINTIFY_LEDGER: mod.SERVER_PRINTIFY_LEDGER as Record<string, { id: string; blueprintId: number; title: string; variants: Record<string, number> }>,
    resolveServerFulfillmentItems: mod.resolveServerFulfillmentItems as (input: {
      id: string;
      color?: string;
      size?: string;
      logoStyle?: string;
      userTypeLabel?: string;
      quantity?: number;
    }) => Array<{ product_id: string; variant_id: number; quantity: number }>,
    createStripeGatewayHandler: mod.createStripeGatewayHandler as (deps?: {
      stripeSecretKey?: string;
      stripeWebhookSecret?: string;
      printifyApiToken?: string;
      printifyShopId?: string;
      fetchImpl?: typeof fetch;
    }) => (req: any, res: any) => Promise<any>,
  };
}

test('1. SERVER_PRINTIFY_LEDGER has 1-to-1 parity across all 16 products and 728 variants in printify_ledger.json', () => {
  const { SERVER_PRINTIFY_LEDGER } = getGatewayExports();
  const ledgerKeys = Object.keys(SERVER_PRINTIFY_LEDGER);
  assert.equal(ledgerKeys.length, LEDGER_DATA.products.length);

  let totalVariants = 0;
  for (const prod of LEDGER_DATA.products) {
    const serverProd = SERVER_PRINTIFY_LEDGER[prod.id];
    assert.ok(serverProd, `Missing product ${prod.id} (${prod.title}) in SERVER_PRINTIFY_LEDGER`);
    assert.equal(serverProd.blueprintId, prod.blueprint_id);
    assert.equal(Object.keys(serverProd.variants).length, prod.variants.length);
    for (const v of prod.variants) {
      assert.equal(serverProd.variants[v.title], v.id, `Mismatch for ${prod.id} variant "${v.title}"`);
      totalVariants++;
    }
  }
  assert.equal(totalVariants, 728);
});

test('2. Checkout action accepts all SKUs, ignores tampered client prices, sets {CHECKOUT_SESSION_ID}, and embeds metadata', async () => {
  const { createStripeGatewayHandler } = getGatewayExports();

  let capturedStripeBody = '';
  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    assert.equal(url, 'https://api.stripe.com/v1/checkout/sessions');
    capturedStripeBody = String(init?.body || '');
    return new Response(
      JSON.stringify({ id: 'cs_test_checkout123', url: 'https://checkout.stripe.com/c/pay/cs_test_checkout123' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const handler = createStripeGatewayHandler({
    stripeSecretKey: 'rk_test_mock_123',
    printifyApiToken: 'pt_mock_123',
    printifyShopId: '29111523',
    fetchImpl: mockFetch as typeof fetch,
  });

  // 2a: All SKUs + tampered price on Clubhouse men-polo-k830 + shipping ($66 + $8)
  const mockRes = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { origin: 'https://www.highdrawgear.com' },
      query: { action: 'checkout' },
      body: {
        orderId: 'HD-2026-1001',
        items: [
          {
            id: 'men-polo-k830',
            name: "The Clubhouse Fine Pique Polo — Men's",
            price: 1, // Attempted price tamper
            color: 'Aegean Blue Heather',
            size: 'L',
            logoStyle: 'mark_only',
            quantity: 1,
          },
        ],
      },
    },
    mockRes.res
  );

  assert.equal(mockRes.statusCode, 200);
  const params = new URLSearchParams(capturedStripeBody);
  assert.equal(params.get('line_items[0][price_data][unit_amount]'), '6600');
  assert.equal(params.get('line_items[0][price_data][product_data][metadata][fulfillment_type]'), 'printify');
  const unitItems = JSON.parse(params.get('line_items[0][price_data][product_data][metadata][unit_fulfillment_items]') || '[]');
  assert.deepEqual(unitItems, [{ product_id: '6af3a8c1cb8adff71a02ba5b', variant_id: 125301, quantity: 1 }]);
  assert.equal(params.get('line_items[1][price_data][unit_amount]'), '800');
  assert.equal(params.get('line_items[1][price_data][product_data][metadata][fulfillment_type]'), 'shipping');
  assert.ok(
    params.get('success_url')?.includes('?payment=success&orderId=HD-2026-1001&session_id={CHECKOUT_SESSION_ID}'),
    `Expected unescaped {CHECKOUT_SESSION_ID} in success_url, got: ${params.get('success_url')}`
  );

  // 2b: Check remaining catalog SKUs + upsell pricing rules
  const multiRes = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { origin: 'https://www.highdrawgear.com' },
      query: { action: 'checkout' },
      body: {
        orderId: 'HD-2026-1002',
        items: [
          { id: 'men-polo-st740', price: 40, color: 'Deep Midnight Navy', size: 'L', quantity: 1 },
          { id: 'women-polo-lst740', price: 48, color: 'Carolina Blue', size: '2XL', quantity: 1 },
          { id: 'women-polo-lk830', price: 66, color: 'Black Heather', size: 'L', quantity: 1 },
          { id: 'outerwear-f218-fleece', price: 68, color: 'Iron Grey', size: 'XL', quantity: 1 },
          { id: 'headwear-flexfit-mesh', price: 28, color: 'Pure White', size: 'S/M', quantity: 1 },
          { id: 'bundle-foursome-01', price: 160, color: 'Mixed Foursome Selection', size: 'L', quantity: 1 },
        ],
      },
    },
    multiRes.res
  );

  assert.equal(multiRes.statusCode, 200);
  const p2 = new URLSearchParams(capturedStripeBody);
  // men-polo-st740 upsell ($40) stays $40; the 2 base polos (women-polo-lst740 + women-polo-lk830) trigger 2+ Polo Pair (-$5 each)
  assert.equal(p2.get('line_items[0][price_data][unit_amount]'), '4000');
  assert.equal(p2.get('line_items[1][price_data][unit_amount]'), '4300');
  assert.equal(p2.get('line_items[2][price_data][unit_amount]'), '6100');
  assert.equal(p2.get('line_items[3][price_data][unit_amount]'), '6800');
  assert.equal(p2.get('line_items[4][price_data][unit_amount]'), '2800');
  assert.equal(p2.get('line_items[5][price_data][unit_amount]'), '16000');
  assert.equal(p2.get('allow_promotion_codes'), 'true');
  // Subtotal >= $75 => no shipping line item
  assert.equal(p2.get('line_items[6][price_data][unit_amount]'), null);

  // 2c: Standalone cap upsell tampering without a garment charges full $35 (3500)
  const capOnlyRes = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { origin: 'https://www.highdrawgear.com' },
      query: { action: 'checkout' },
      body: {
        orderId: 'HD-2026-1003',
        items: [{ id: 'headwear-flexfit-mesh', price: 28, color: 'Pure White', size: 'S/M', quantity: 1 }],
      },
    },
    capOnlyRes.res
  );
  assert.equal(capOnlyRes.statusCode, 200);
  const p3 = new URLSearchParams(capturedStripeBody);
  assert.equal(p3.get('line_items[0][price_data][unit_amount]'), '3500');
});

test('3. resolveServerFulfillmentItems fixes XXL (BP 3322), L/XL (BP 5272), Clubhouse SKUs, Fleece, and Foursome bundles', () => {
  const { resolveServerFulfillmentItems } = getGatewayExports();

  // BP 3322 Women's Weekender 2XL -> XXL / Carolina Blue (189254)
  assert.deepEqual(
    resolveServerFulfillmentItems({
      id: 'women-polo-lst740',
      color: 'Carolina Blue',
      size: '2XL',
      logoStyle: 'mark_text',
      quantity: 1,
    }),
    [{ product_id: '6af3aaa484c3e9e3630db3bf', variant_id: 189254, quantity: 1 }]
  );

  // BP 5272 Cap L/XL -> L/XL / True Navy (243304)
  assert.deepEqual(
    resolveServerFulfillmentItems({
      id: 'headwear-flexfit-mesh',
      color: 'Deep Midnight Navy',
      size: 'L/XL',
      quantity: 1,
    }),
    [{ product_id: '6abac00a7ed05bbe6f073036', variant_id: 243304, quantity: 1 }]
  );

  // BP 2038 Men's Clubhouse Mark-Only
  assert.deepEqual(
    resolveServerFulfillmentItems({
      id: 'men-polo-k830',
      color: 'Aegean Blue Heather',
      size: 'L',
      logoStyle: 'mark_only',
      quantity: 1,
    }),
    [{ product_id: '6af3a8c1cb8adff71a02ba5b', variant_id: 125301, quantity: 1 }]
  );

  // BP 2026 Women's Clubhouse Mark + Monogram
  assert.deepEqual(
    resolveServerFulfillmentItems({
      id: 'women-polo-lk830',
      color: 'Black Heather',
      size: 'L',
      logoStyle: 'mark_monogram',
      quantity: 1,
    }),
    [{ product_id: '6af3a9c684c3e9e3630db348', variant_id: 124483, quantity: 1 }]
  );

  // BP 3630 Clubhouse Fleece 1/4-Zip Mark + Wordmark
  assert.deepEqual(
    resolveServerFulfillmentItems({
      id: 'outerwear-f218-fleece',
      color: 'Iron Grey',
      size: 'XL',
      logoStyle: 'mark_text',
      quantity: 1,
    }),
    [{ product_id: '6af356e339e9d7101d062c32', variant_id: 202389, quantity: 1 }]
  );

  // Foursome Scramble Kit: Mixed Foursome Selection + 2 Men's + 2 Women's
  assert.deepEqual(
    resolveServerFulfillmentItems({
      id: 'bundle-foursome-01',
      color: "Mixed Foursome Selection • Mark + Monogram • White Thread (2 Men's + 2 Women's)",
      size: 'L',
      logoStyle: 'mark_monogram',
      userTypeLabel: "2 Men's + 2 Women's",
      quantity: 1,
    }),
    [
      { product_id: '6af3a55dcb8adff71a02b775', variant_id: 122461, quantity: 1 }, // Men's L True Navy
      { product_id: '6af3a55dcb8adff71a02b775', variant_id: 122456, quantity: 1 }, // Men's L Carolina Blue
      { product_id: '6af3aaa1edb592ae87061652', variant_id: 189164, quantity: 1 }, // Women's L White
      { product_id: '6af3aaa1edb592ae87061652', variant_id: 189185, quantity: 1 }, // Women's L Black
    ]
  );

  // Foursome Scramble Kit: All Carolina Blue -> quantity 4 Men's XL Carolina Blue
  assert.deepEqual(
    resolveServerFulfillmentItems({
      id: 'bundle-foursome-01',
      color: 'All Carolina Blue',
      size: 'XL',
      logoStyle: 'mark_monogram',
      quantity: 1,
    }),
    [{ product_id: '6af3a55dcb8adff71a02b775', variant_id: 122483, quantity: 4 }]
  );
});

test('4. fulfill-session rejects unpaid sessions with 402 and zero Printify calls', async () => {
  const { createStripeGatewayHandler } = getGatewayExports();

  const calls: string[] = [];
  const mockFetch = async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);
    if (url.startsWith('https://api.stripe.com/v1/checkout/sessions/')) {
      return new Response(
        JSON.stringify({ id: 'cs_test_unpaid', payment_status: 'unpaid', status: 'open', line_items: { data: [] } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    throw new Error(`Unexpected fetch to ${url}`);
  };

  const handler = createStripeGatewayHandler({
    stripeSecretKey: 'rk_test_mock_123',
    printifyApiToken: 'pt_mock_123',
    printifyShopId: '29111523',
    fetchImpl: mockFetch as typeof fetch,
  });

  const mockRes = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { origin: 'https://www.highdrawgear.com' },
      query: { action: 'fulfill-session' },
      body: { sessionId: 'cs_test_unpaid', orderId: 'HD-2026-9001' },
    },
    mockRes.res
  );

  assert.equal(mockRes.statusCode, 402);
  assert.equal(calls.length, 1);
});

test('5. fulfill-session dispatches paid 2026-09-30.endive session, enforces idempotency, and propagates Printify errors', async () => {
  const { createStripeGatewayHandler } = getGatewayExports();

  let printifyPostCount = 0;
  let lastPrintifyOrderBody: Record<string, any> | null = null;
  let existingPrintifyOrders: Array<Record<string, any>> = [];
  let forcePrintifyError = false;

  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith('https://api.stripe.com/v1/checkout/sessions/')) {
      return new Response(
        JSON.stringify({
          id: 'cs_test_paid_session_123',
          payment_status: 'paid',
          status: 'complete',
          amount_total: 7400,
          metadata: { orderId: 'HD-2026-7777' },
          customer_details: { email: 'ken@example.com', phone: '662-555-0199', name: 'Dr. Ken Cyree' },
          collected_information: {
            shipping_details: {
              name: 'Ken Cyree',
              address: {
                line1: '101 University Ave',
                line2: 'Suite 200',
                city: 'Oxford',
                state: 'MS',
                postal_code: '38677',
                country: 'US',
              },
            },
          },
          line_items: {
            data: [
              {
                description: "The Clubhouse Fine Pique Polo — Men's (Aegean Blue Heather, Size L)",
                quantity: 1,
                amount_total: 6600,
                price: {
                  product: {
                    metadata: {
                      fulfillment_type: 'printify',
                      unit_fulfillment_items: JSON.stringify([
                        { product_id: '6af3a8c1cb8adff71a02ba5b', variant_id: 125301, quantity: 1 },
                      ]),
                    },
                  },
                },
              },
              {
                description: 'Standard Domestic Fairway Shipping (Free Over $75)',
                quantity: 1,
                amount_total: 800,
                price: {
                  product: {
                    metadata: { fulfillment_type: 'shipping' },
                  },
                },
              },
            ],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (url.startsWith('https://api.printify.com/v1/shops/29111523/orders.json') && (!init?.method || init.method === 'GET')) {
      return new Response(JSON.stringify({ data: existingPrintifyOrders }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url === 'https://api.printify.com/v1/shops/29111523/orders.json' && init?.method === 'POST') {
      if (forcePrintifyError) {
        return new Response(JSON.stringify({ message: 'Invalid variant' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      printifyPostCount++;
      lastPrintifyOrderBody = JSON.parse(String(init.body || '{}'));
      const created = {
        id: '6bf000000000000000000001',
        status: 'pending',
        metadata: {
          order_type: 'external',
          shop_order_id: lastPrintifyOrderBody?.external_id,
          shop_order_label: lastPrintifyOrderBody?.label,
        },
      };
      existingPrintifyOrders.push(created);
      return new Response(JSON.stringify(created), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unexpected fetch URL: ${url}`);
  };

  const handler = createStripeGatewayHandler({
    stripeSecretKey: 'rk_test_mock_123',
    printifyApiToken: 'pt_mock_123',
    printifyShopId: '29111523',
    fetchImpl: mockFetch as typeof fetch,
  });

  // 5a: First fulfillment dispatches to Printify
  const res1 = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { origin: 'https://www.highdrawgear.com' },
      query: { action: 'fulfill-session' },
      body: { sessionId: 'cs_test_paid_session_123', orderId: 'HD-2026-7777' },
    },
    res1.res
  );

  assert.equal(res1.statusCode, 200);
  assert.equal(res1.body.fulfilled, true);
  assert.equal(res1.body.alreadyFulfilled, false);
  assert.equal(res1.body.printifyOrderId, '6bf000000000000000000001');
  assert.equal(res1.body.shipSummary, 'Oxford, MS');
  assert.equal(JSON.stringify(res1.body).includes('101 University Ave'), false, 'Response must not leak street address PII');
  assert.equal(printifyPostCount, 1);
  const postedOrder = lastPrintifyOrderBody as Record<string, any> | null;
  assert.ok(postedOrder, 'Expected Printify order payload to be posted');
  assert.equal(postedOrder.external_id, 'cs_test_paid_session_123');
  assert.equal(postedOrder.label, 'HD-2026-7777');
  assert.deepEqual(postedOrder.line_items, [
    { product_id: '6af3a8c1cb8adff71a02ba5b', variant_id: 125301, quantity: 1 },
  ]);
  assert.deepEqual(postedOrder.address_to, {
    first_name: 'Ken',
    last_name: 'Cyree',
    email: 'ken@example.com',
    phone: '662-555-0199',
    country: 'US',
    region: 'MS',
    address1: '101 University Ave',
    address2: 'Suite 200',
    city: 'Oxford',
    zip: '38677',
  });

  // 5b: Second call hits idempotency check and makes ZERO extra POST calls
  const res2 = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { origin: 'https://www.highdrawgear.com' },
      query: { action: 'fulfill-session' },
      body: { sessionId: 'cs_test_paid_session_123', orderId: 'HD-2026-7777' },
    },
    res2.res
  );

  assert.equal(res2.statusCode, 200);
  assert.equal(res2.body.fulfilled, true);
  assert.equal(res2.body.alreadyFulfilled, true);
  assert.equal(printifyPostCount, 1);

  // 5c: Printify error returns 502 with fulfilled: false
  existingPrintifyOrders = [];
  forcePrintifyError = true;
  const res3 = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { origin: 'https://www.highdrawgear.com' },
      query: { action: 'fulfill-session' },
      body: { sessionId: 'cs_test_paid_session_123', orderId: 'HD-2026-7777' },
    },
    res3.res
  );

  assert.equal(res3.statusCode, 502);
  assert.equal(res3.body.fulfilled, false);
});

test('6. webhook action verifies HMAC-SHA256 Stripe-Signature, rejects tampered signatures with 400, and fulfills checkout.session.completed', async () => {
  const { createStripeGatewayHandler } = getGatewayExports();

  const webhookSecret = 'whsec_test_secret_123';
  let printifyPostCount = 0;

  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith('https://api.stripe.com/v1/checkout/sessions/')) {
      return new Response(
        JSON.stringify({
          id: 'cs_test_webhook_999',
          payment_status: 'paid',
          status: 'complete',
          amount_total: 6600,
          metadata: { orderId: 'HD-2026-9999' },
          customer_details: { email: 'lori@example.com', name: 'Lori Cyree' },
          collected_information: {
            shipping_details: {
              name: 'Lori Cyree',
              address: {
                line1: '202 Clubhouse Ln',
                city: 'Chapel Hill',
                state: 'NC',
                postal_code: '27514',
                country: 'US',
              },
            },
          },
          line_items: {
            data: [
              {
                description: "The Clubhouse Fine Pique Polo — Women's (Black Heather, Size L)",
                quantity: 1,
                amount_total: 6600,
                price: {
                  product: {
                    metadata: {
                      fulfillment_type: 'printify',
                      unit_fulfillment_items: JSON.stringify([
                        { product_id: '6af3a9c684c3e9e3630db348', variant_id: 124483, quantity: 1 },
                      ]),
                    },
                  },
                },
              },
            ],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (url.startsWith('https://api.printify.com/v1/shops/29111523/orders.json') && (!init?.method || init.method === 'GET')) {
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url === 'https://api.printify.com/v1/shops/29111523/orders.json' && init?.method === 'POST') {
      printifyPostCount++;
      return new Response(JSON.stringify({ id: '6bf000000000000000000002', status: 'pending' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw new Error(`Unexpected URL ${url}`);
  };

  const handler = createStripeGatewayHandler({
    stripeSecretKey: 'rk_test_mock_123',
    stripeWebhookSecret: webhookSecret,
    printifyApiToken: 'pt_mock_123',
    printifyShopId: '29111523',
    fetchImpl: mockFetch as typeof fetch,
  });

  const payload = JSON.stringify({
    id: 'evt_test_1',
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_test_webhook_999' } },
  });
  const ts = Math.floor(Date.now() / 1000);
  const sig = createHmac('sha256', webhookSecret).update(`${ts}.${payload}`).digest('hex');

  // Bad signature => 400
  const badRes = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'stripe-signature': `t=${ts},v1=deadbeef` },
      query: { action: 'webhook' },
      body: payload,
    },
    badRes.res
  );
  assert.equal(badRes.statusCode, 400);
  assert.equal(printifyPostCount, 0);

  // Valid signature => 200 and dispatches Printify order
  const okRes = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'stripe-signature': `t=${ts},v1=${sig}` },
      query: { action: 'webhook' },
      body: payload,
    },
    okRes.res
  );
  assert.equal(okRes.statusCode, 200);
  assert.equal(okRes.body.received, true);
  assert.equal(okRes.body.fulfilled, true);
  assert.equal(printifyPostCount, 1);
});
