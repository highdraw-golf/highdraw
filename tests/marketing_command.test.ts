import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as bundlePricing from '../src/lib/bundlePricing.ts';
import * as stripeGateway from '../api/stripe.ts';
import * as marketingGateway from '../api/marketing.ts';
import * as marketingEngine from '../src/lib/marketingEngine.ts';

function createMockRes() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body: unknown = null;

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
      return res;
    },
    end() {
      return res;
    },
  };

  return {
    res,
    getStatus: () => statusCode,
    getBody: () => body as Record<string, any>,
    getHeaders: () => headers,
  };
}

function hashPin(rawPin: string): string {
  return createHash('sha256')
    .update(`highdraw-salt-2026:${rawPin.trim().toLowerCase()}`)
    .digest('hex');
}

test('1. calculateCartPricing applies -$5/polo 2-Polo Pair savings & $75 Free US Shipping', () => {
  const single = bundlePricing.calculateCartPricing([
    { id: 'men-polo-st740', price: 48, quantity: 1 },
  ]);
  assert.equal(single.rawSubtotal, 48);
  assert.equal(single.pairDiscountDollars, 0);
  assert.equal(single.shippingDollars, 8);
  assert.equal(single.totalDollars, 56);

  const twoTourPolos = bundlePricing.calculateCartPricing([
    { id: 'men-polo-st740', price: 48, quantity: 1 },
    { id: 'women-polo-lst740', price: 48, quantity: 1 },
  ]);
  assert.equal(twoTourPolos.pairEligibleUnits, 2);
  assert.equal(twoTourPolos.pairDiscountDollars, 10);
  assert.equal(twoTourPolos.discountedSubtotal, 86);
  assert.equal(twoTourPolos.shippingDollars, 0);
  assert.equal(twoTourPolos.totalDollars, 86);

  const mixedPair = bundlePricing.calculateCartPricing([
    { id: 'men-polo-st740', price: 48, quantity: 1 },
    { id: 'men-polo-k830', price: 66, quantity: 1 },
  ]);
  assert.equal(mixedPair.pairEligibleUnits, 2);
  assert.equal(mixedPair.pairDiscountDollars, 10);
  assert.equal(mixedPair.discountedSubtotal, 104);
  assert.equal(mixedPair.shippingDollars, 0);

  // Upsell ($40), cap ($28), and Foursome ($160) must never double-count pair discounts
  const withUpsellAndFoursome = bundlePricing.calculateCartPricing([
    { id: 'men-polo-st740-upsell', price: 40, quantity: 1 },
    { id: 'bundle-saturday-foursome', price: 160, quantity: 1 },
    { id: 'headwear-flexfit-mesh-cap', price: 28, quantity: 1 },
  ]);
  assert.equal(withUpsellAndFoursome.pairEligibleUnits, 0);
  assert.equal(withUpsellAndFoursome.pairDiscountDollars, 0);
});

test('2. api/stripe checkout enforces server-side 2-Polo Pair pricing, allow_promotion_codes & sanitized UTMs', async () => {
  const capturedBodies: string[] = [];
  const handler = stripeGateway.createStripeGatewayHandler({
    stripeSecretKey: 'sk_test_mock_123',
    fetchImpl: async (url, init) => {
      assert.equal(String(url), 'https://api.stripe.com/v1/checkout/sessions');
      capturedBodies.push(String(init?.body || ''));
      return new Response(
        JSON.stringify({ id: 'cs_test_pair_01', url: 'https://checkout.stripe.com/c/pay/cs_test_pair_01' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    },
  });

  const mock = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { host: 'www.highdrawgear.com', origin: 'https://www.highdrawgear.com' },
      query: { action: 'checkout' },
      body: {
        orderId: 'HD-TEST-9001',
        attribution: {
          utm_source: 'facebook',
          utm_medium: 'paid_social',
          utm_campaign: 'fb_m1_pair86<script>',
          utm_content: 'ad_founder_fit',
          ref_code: 'KEN15',
          landing_path: '/products/mens-tour-performance-polo',
        },
        items: [
          { id: 'men-polo-st740', price: 1, quantity: 1, color: 'Black', size: 'L' },
          { id: 'women-polo-lst740', price: 1, quantity: 1, color: 'Carolina Blue', size: 'M' },
          { id: 'men-polo-k830', price: 1, quantity: 1, color: 'Deep Forest Green', size: 'L' },
          { id: 'headwear-flexfit-mesh-01', price: 28, quantity: 1, color: 'Black', size: 'S/M' },
          { id: 'men-polo-st740-upsell', price: 40, quantity: 1, color: 'White', size: 'L' },
        ],
      },
    },
    mock.res
  );

  assert.equal(mock.getStatus(), 200);
  const params = new URLSearchParams(capturedBodies[0]);
  assert.equal(params.get('allow_promotion_codes'), 'true');
  assert.equal(params.get('metadata[pairDiscountApplied]'), 'true');
  assert.equal(params.get('metadata[pairEligibleUnits]'), '3');
  assert.equal(params.get('metadata[utm_source]'), 'facebook');
  assert.equal(params.get('metadata[utm_campaign]'), 'fb_m1_pair86script');
  assert.equal(params.get('metadata[ref_code]'), 'KEN15');
  assert.equal(params.get('line_items[0][price_data][unit_amount]'), '4300');
  assert.equal(params.get('line_items[1][price_data][unit_amount]'), '4300');
  assert.equal(params.get('line_items[2][price_data][unit_amount]'), '6100');
  assert.equal(params.get('line_items[3][price_data][unit_amount]'), '2800');
  assert.equal(params.get('line_items[4][price_data][unit_amount]'), '4000');
});

test('3. api/marketing enforces timing-safe PIN auth, cloud ledger compression round-trip, overview & promo minting', async () => {
  const testPin = 'ken-test-2026';
  const testDigest = hashPin(testPin);

  // Chunked compression round-trip
  const sampleLedger = marketingEngine.createDefaultMarketingLedger();
  sampleLedger.metaPixelId = '123456789012345';
  sampleLedger.experiments[0].cashSpentDollars = 150;
  const encoded = marketingGateway.encodeCloudLedgerChunks(sampleLedger, 2, 7);
  assert.equal(encoded.revision, 7);
  assert.ok(encoded.chunkCount >= 1);
  const metaRecord: Record<string, string> = {};
  for (const [k, v] of encoded.metadataEntries) {
    if (v) metaRecord[k] = v;
    assert.ok(v.length <= 450, `Chunk ${k} exceeded Stripe 500-char limit`);
  }
  const decoded = marketingGateway.decodeCloudLedgerMetadata(metaRecord);
  assert.equal(decoded.revision, 7);
  assert.equal(decoded.ledger?.metaPixelId, '123456789012345');
  assert.equal(decoded.ledger?.experiments?.[0]?.cashSpentDollars, 150);

  const nowUnix = Math.floor(Date.now() / 1000);
  const mockFetch: typeof fetch = async (url, init) => {
    const u = String(url);
    if (u.startsWith('https://api.stripe.com/v1/checkout/sessions')) {
      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'cs_paid_1',
              status: 'complete',
              payment_status: 'paid',
              created: nowUnix,
              amount_total: 8600,
              amount_subtotal: 9600,
              total_details: { amount_discount: 1000, amount_shipping: 0, breakdown: { discounts: [] } },
              shipping_details: { address: { state: 'Mississippi' } },
              metadata: {
                orderId: 'HD-MKT-101',
                utm_source: 'facebook',
                utm_medium: 'paid_social',
                utm_campaign: 'fb_m1_pair86',
                utm_content: 'ad_pair_86',
                pairDiscountApplied: 'true',
              },
              line_items: {
                data: [
                  { description: "Men's Tour Performance Polo", quantity: 1, amount_total: 4300, price: { product: { metadata: {} } } },
                  { description: "Women's Tour Performance Polo", quantity: 1, amount_total: 4300, price: { product: { metadata: {} } } },
                ],
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (u.startsWith('https://api.stripe.com/v1/promotion_codes') && (!init?.method || init.method === 'GET')) {
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }
    if (u.startsWith('https://api.stripe.com/v1/customers') && (!init?.method || init.method === 'GET')) {
      return new Response(
        JSON.stringify({
          data: [{ id: 'cus_ledger_01', email: 'ledger-sync@internal.highdrawgear.com', metadata: metaRecord }],
        }),
        { status: 200 }
      );
    }
    if (u.includes('/v1/coupons') && init?.method === 'POST') {
      return new Response(JSON.stringify({ id: 'coup_ken15', percent_off: 15 }), { status: 200 });
    }
    if (u.includes('/v1/promotion_codes') && init?.method === 'POST') {
      return new Response(
        JSON.stringify({ id: 'promo_ken15', code: 'KEN15', active: true, times_redeemed: 0 }),
        { status: 200 }
      );
    }
    if (u.includes('api.printify.com')) {
      return new Response(
        JSON.stringify({
          data: [
            {
              metadata: { shop_order_id: 'cs_paid_1' },
              total_price: 4100,
              total_shipping: 725,
              status: 'fulfilled',
              line_items: [{ quantity: 2 }],
            },
          ],
        }),
        { status: 200 }
      );
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };

  const handler = marketingGateway.createMarketingGatewayHandler({
    stripeSecretKey: 'sk_test_mock_123',
    printifyApiToken: 'pt_mock',
    printifyShopId: 'shop_mock',
    authorizedDigests: [testDigest],
    fetchImpl: mockFetch,
  });

  // 401 when PIN missing or invalid
  const unauthRes = createMockRes();
  await handler(
    { method: 'GET', headers: { origin: 'https://www.highdrawgear.com' }, query: { action: 'overview' } },
    unauthRes.res
  );
  assert.equal(unauthRes.getStatus(), 401);

  // 200 overview with actual Printify COGS + normalized 'MS' state
  const okRes = createMockRes();
  await handler(
    {
      method: 'GET',
      headers: { origin: 'https://www.highdrawgear.com', 'x-owner-pin': testPin },
      query: { action: 'overview', days: '30' },
    },
    okRes.res
  );
  assert.equal(okRes.getStatus(), 200);
  const ovBody = okRes.getBody();
  assert.equal(ovBody.ok, true);
  assert.equal(ovBody.orders.length, 1);
  assert.equal(ovBody.orders[0].cogsSource, 'printify_actual');
  assert.equal(ovBody.orders[0].cogsDollars, 41);
  assert.equal(ovBody.orders[0].stateCode, 'MS');
  assert.equal(ovBody.stateCounts.MS.orders, 1);
  assert.equal(ovBody.cloudSync.revision, 7);

  // POST create-promo
  const promoRes = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { origin: 'https://www.highdrawgear.com', 'x-owner-pin': testPin },
      query: { action: 'create-promo' },
      body: {
        code: 'ken15',
        discountType: 'percent',
        discountValue: 15,
        minOrderDollars: 80,
        channel: 'Tournament & Outing Outreach',
      },
    },
    promoRes.res
  );
  assert.equal(promoRes.getStatus(), 200);
  assert.equal(promoRes.getBody().promo.code, 'KEN15');
  assert.equal(promoRes.getBody().promo.discountLabel, '15% Off');
});

test('4. marketingEngine deterministic CFO budget split & experiment verdict rules', () => {
  const split200 = marketingEngine.computeBudgetAllocation(200);
  assert.equal(split200.facebookAdsDollars, 150);
  assert.equal(split200.facebookDaysAtTenPerDay, 15);
  assert.equal(split200.seedingShirtsDollars, 44);
  assert.equal(split200.estimatedSampleShirtsCount, 2);
  assert.equal(split200.qrCardsAndPostageDollars, 6);

  const baseExp: marketingEngine.MarketingExperiment = {
    id: 'exp-1',
    title: 'Test',
    channel: 'Facebook / Meta Ads',
    status: 'running',
    landingPath: '/',
    utmCampaign: 'cmp_a',
    utmContent: '',
    promoCode: '',
    hypothesis: 'Test',
    cashSpentDollars: 0,
    seededShirts: 0,
    hoursSpent: 1,
    manualClicks: 0,
    manualOrders: 0,
    manualRevenueDollars: 0,
    manualUnits: 0,
    lastTouchedAt: new Date().toISOString().slice(0, 10),
    lessonLearned: '',
    nextAdjustment: '',
  };

  // KILL: $80 cash spent with 0 orders
  const killed = marketingEngine.evaluateExperimentVerdict(
    { ...baseExp, cashSpentDollars: 80 },
    []
  );
  assert.equal(killed.verdict, 'KILL');

  // SCALE: $60 spent, 3 $86 orders ($138 total CM1 -> $20 CAC <= 85% of $46 allowable)
  const sampleOrders: marketingEngine.TelemetryOrder[] = [1, 2, 3].map((i) => ({
    sessionId: `cs_${i}`,
    orderId: `HD-${i}`,
    createdAt: new Date().toISOString(),
    weekKey: '2026-11-09',
    revenueDollars: 86,
    subtotalDollars: 96,
    discountDollars: 10,
    shippingCollectedDollars: 0,
    stripeFeeDollars: 2.79,
    cogsDollars: 41,
    printifyShippingDollars: 7.25,
    cogsSource: 'printify_actual',
    contributionMarginDollars: 34.96,
    garmentUnits: 2,
    stateCode: 'MS',
    utmSource: 'facebook',
    utmMedium: 'paid_social',
    utmCampaign: 'cmp_a',
    utmContent: '',
    refCode: '',
    promoCode: '',
    channel: 'Facebook / Meta Ads',
    pairDiscountApplied: true,
    printifyStatus: 'fulfilled',
    itemsSummary: ['2x Polo'],
  }));
  const scaled = marketingEngine.evaluateExperimentVerdict(
    { ...baseExp, cashSpentDollars: 60 },
    sampleOrders
  );
  assert.equal(scaled.verdict, 'SCALE');

  // ITERATE: 50 clicks, 0 orders
  const iterateClicks = marketingEngine.evaluateExperimentVerdict(
    { ...baseExp, cashSpentDollars: 35, manualClicks: 50 },
    []
  );
  assert.equal(iterateClicks.verdict, 'ITERATE');

  // FOLLOW_UP: 1 sample shirt sent 9 days ago, 0 orders
  const nineDaysAgo = new Date(Date.now() - 9 * 86400000).toISOString().slice(0, 10);
  const followUp = marketingEngine.evaluateExperimentVerdict(
    { ...baseExp, seededShirts: 1, lastTouchedAt: nineDaysAgo },
    []
  );
  assert.equal(followUp.verdict, 'FOLLOW_UP');
});
