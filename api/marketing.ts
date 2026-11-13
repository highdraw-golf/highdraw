import { createHash, timingSafeEqual } from 'node:crypto';
import { deflateRawSync, inflateRawSync } from 'node:zlib';

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

export interface MarketingGatewayDeps {
  stripeSecretKey?: string;
  printifyApiToken?: string;
  printifyShopId?: string;
  authorizedDigests?: string[];
  fetchImpl?: typeof fetch;
}

export interface OrderTelemetryRecord {
  sessionId: string;
  orderId: string;
  createdAt: string;
  weekKey: string;
  revenueDollars: number;
  subtotalDollars: number;
  discountDollars: number;
  shippingCollectedDollars: number;
  stripeFeeDollars: number;
  cogsDollars: number;
  printifyShippingDollars: number;
  cogsSource: 'printify_actual' | 'estimated_blueprint';
  contributionMarginDollars: number;
  garmentUnits: number;
  stateCode: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  refCode: string;
  promoCode: string;
  channel: string;
  pairDiscountApplied: boolean;
  printifyOrderId?: string;
  printifyStatus: string;
  itemsSummary: string[];
}

export interface PromoCodeSummary {
  id: string;
  code: string;
  active: boolean;
  timesRedeemed: number;
  discountLabel: string;
  minOrderDollars: number;
  channel: string;
  campaign: string;
  notes: string;
  createdAt: string;
}

const DEFAULT_AUTHORIZED_DIGESTS = [
  '729ae8191cf99466d8796afa10982918761abfceeaf019b33ee6f4e9b468e213',
  '7e9eeedd4d153c6523aed4b7b7fcb588b0c6eeb0095bb6597127545c7376a26f',
  'aef907f45f279065bc44c9a221a0e3fd1bec71a7b529dd3d78c9737e3a6f6f2b',
];

const LEDGER_CUSTOMER_EMAIL = 'ledger-sync@internal.highdrawgear.com';
const CHUNK_CHAR_LIMIT = 450;
const MAX_CHUNKS = 46;

const US_STATE_NAME_TO_CODE: Record<string, string> = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  'district of columbia': 'DC',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
};

const ALLOWED_ORIGINS = new Set([
  'https://www.highdrawgear.com',
  'https://highdrawgear.com',
  'https://highdraw.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:4174',
  'http://localhost:3000',
]);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (/^https:\/\/highdraw-[a-z0-9-]+-high-draw-gear\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

function getHeader(
  headers: Record<string, string | string[] | undefined> | undefined,
  name: string
): string | undefined {
  if (!headers) return undefined;
  const target = name.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === target) {
      return Array.isArray(v) ? v[0] : v;
    }
  }
  return undefined;
}

function sanitizeText(val: unknown, maxLen = 120): string {
  if (typeof val !== 'string' && typeof val !== 'number') return '';
  return String(val)
    .replace(/[\r\n\t<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function normalizeStateCode(raw: unknown): string {
  const clean = sanitizeText(raw, 40);
  if (!clean) return 'Unknown';
  const upper = clean.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper)) return upper;
  return US_STATE_NAME_TO_CODE[clean.toLowerCase()] || upper;
}

function verifyPinAgainstDigests(rawPin: string | undefined, validDigests: string[]): boolean {
  const clean = String(rawPin || '').trim().toLowerCase();
  if (!clean) return false;
  const candidateHex = createHash('sha256')
    .update(`highdraw-salt-2026:${clean}`)
    .digest('hex');
  const candidateBuf = Buffer.from(candidateHex, 'hex');

  for (const digest of validDigests) {
    if (!/^[0-9a-f]{64}$/i.test(digest)) continue;
    const targetBuf = Buffer.from(digest, 'hex');
    if (candidateBuf.length === targetBuf.length && timingSafeEqual(candidateBuf, targetBuf)) {
      return true;
    }
  }
  return false;
}

function toIsoWeekKey(unixSeconds: number): string {
  const dt = new Date(unixSeconds * 1000);
  const utc = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() - day + 1);
  return utc.toISOString().slice(0, 10);
}

function inferChannelName(meta: {
  utmSource: string;
  utmMedium: string;
  promoCode: string;
  refCode: string;
}): string {
  const src = meta.utmSource.toLowerCase();
  const med = meta.utmMedium.toLowerCase();
  const ref = meta.refCode.toUpperCase();
  const promo = meta.promoCode.toUpperCase();

  if (src.includes('facebook') || src.includes('meta') || src === 'fb' || src === 'ig' || med.includes('paid_social')) {
    return 'Facebook / Meta Ads';
  }
  if (med.includes('tournament') || promo.includes('SCRAMBLE') || promo.includes('ROTARY') || promo.includes('OUTING')) {
    return 'Tournament & Outing Outreach';
  }
  if (med.includes('creator') || med.includes('seeding') || ref.startsWith('CREATOR')) {
    return 'Creator & Ambassador Seeding';
  }
  if (ref || promo || med.includes('qr') || med.includes('referral')) {
    return 'QR Card / Peer Referral';
  }
  if (src === 'direct' || !src) {
    return 'Direct / Organic';
  }
  return meta.utmSource;
}

function estimateGarmentCostDollars(description: string, qty: number): { cogs: number; garmentUnits: number } {
  const lower = description.toLowerCase();
  if (lower.includes('foursome') || lower.includes('scramble kit')) {
    return { cogs: 82.0 * qty, garmentUnits: 4 * qty };
  }
  if (lower.includes('fleece') || lower.includes('1/4-zip') || lower.includes('quarter-zip') || lower.includes('pullover')) {
    return { cogs: 27.5 * qty, garmentUnits: qty };
  }
  if (lower.includes('clubhouse')) {
    return { cogs: 24.75 * qty, garmentUnits: qty };
  }
  if (lower.includes('cap') || lower.includes('hat') || lower.includes('headwear') || lower.includes('mesh')) {
    return { cogs: 14.5 * qty, garmentUnits: qty };
  }
  if (lower.includes('weekender') || lower.includes('polo') || lower.includes('tour performance')) {
    return { cogs: 20.5 * qty, garmentUnits: qty };
  }
  return { cogs: 21.5 * qty, garmentUnits: qty };
}

function estimateShippingDollars(garmentUnits: number): number {
  if (garmentUnits <= 0) return 0;
  return Number((5.5 + Math.max(0, garmentUnits - 1) * 1.75).toFixed(2));
}

export function encodeCloudLedgerChunks(
  ledger: unknown,
  previousChunkCount = 0,
  nextRevision = 1
): {
  revision: number;
  updatedAt: string;
  chunkCount: number;
  metadataEntries: Array<[string, string]>;
} {
  const updatedAt = new Date().toISOString();
  const payload = JSON.stringify(ledger);
  const compressedB64 = deflateRawSync(Buffer.from(payload, 'utf8')).toString('base64');

  if (compressedB64.length > MAX_CHUNKS * CHUNK_CHAR_LIMIT) {
    throw new Error('LEDGER_TOO_LARGE');
  }

  const chunks: string[] = [];
  for (let i = 0; i < compressedB64.length; i += CHUNK_CHAR_LIMIT) {
    chunks.push(compressedB64.slice(i, i + CHUNK_CHAR_LIMIT));
  }

  const metadataEntries: Array<[string, string]> = [
    ['ledger_version', '1'],
    ['revision', String(nextRevision)],
    ['updated_at', updatedAt],
    ['chunk_count', String(chunks.length)],
  ];

  chunks.forEach((chunk, idx) => {
    const padded = String(idx).padStart(2, '0');
    metadataEntries.push([`chunk_${padded}`, chunk]);
  });

  // Clear leftover chunks if ledger shrank
  for (let i = chunks.length; i < previousChunkCount; i++) {
    const padded = String(i).padStart(2, '0');
    metadataEntries.push([`chunk_${padded}`, '']);
  }

  return {
    revision: nextRevision,
    updatedAt,
    chunkCount: chunks.length,
    metadataEntries,
  };
}

export function decodeCloudLedgerMetadata(
  metadata: Record<string, string | undefined> | undefined
): { ledger: Record<string, any> | null; revision: number; updatedAt: string | null; chunkCount: number } {
  if (!metadata) {
    return { ledger: null, revision: 0, updatedAt: null, chunkCount: 0 };
  }
  const chunkCount = Number(metadata.chunk_count) || 0;
  const revision = Number(metadata.revision) || 0;
  const updatedAt = metadata.updated_at || null;
  if (chunkCount <= 0) {
    return { ledger: null, revision, updatedAt, chunkCount: 0 };
  }

  let b64 = '';
  for (let i = 0; i < chunkCount; i++) {
    const key = `chunk_${String(i).padStart(2, '0')}`;
    const part = metadata[key];
    if (!part) return { ledger: null, revision, updatedAt, chunkCount };
    b64 += part;
  }

  try {
    const rawJson = inflateRawSync(Buffer.from(b64, 'base64')).toString('utf8');
    const parsed = JSON.parse(rawJson) as Record<string, any>;
    return { ledger: parsed, revision, updatedAt, chunkCount };
  } catch {
    return { ledger: null, revision, updatedAt, chunkCount };
  }
}

export function createMarketingGatewayHandler(deps: MarketingGatewayDeps = {}) {
  return async function handler(req: ApiRequest, res: ApiResponse) {
    const origin = getHeader(req.headers, 'origin');
    if (isAllowedOrigin(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin!);
      res.setHeader('Vary', 'Origin');
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'https://www.highdrawgear.com');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Owner-Pin');
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const pinHeader = getHeader(req.headers, 'x-owner-pin');
    const digests = deps.authorizedDigests || DEFAULT_AUTHORIZED_DIGESTS;
    if (!verifyPinAgainstDigests(pinHeader, digests)) {
      return res.status(401).json({ ok: false, error: 'Unauthorized: valid Owner PIN required.' });
    }

    const STRIPE_SECRET_KEY = deps.stripeSecretKey ?? process.env.STRIPE_SECRET_KEY;
    const PRINTIFY_API_TOKEN = deps.printifyApiToken ?? process.env.PRINTIFY_API_TOKEN;
    const PRINTIFY_SHOP_ID = deps.printifyShopId ?? process.env.PRINTIFY_SHOP_ID ?? '29111523';
    const fetchFn = deps.fetchImpl ?? fetch;

    if (!STRIPE_SECRET_KEY) {
      return res.status(503).json({
        ok: false,
        error: 'STRIPE_SECRET_KEY is not configured on this environment.',
      });
    }

    const rawAction = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action;
    const action = sanitizeText(rawAction || 'overview', 40).toLowerCase();

    async function findLedgerCustomer(): Promise<Record<string, any> | null> {
      const searchRes = await fetchFn(
        `https://api.stripe.com/v1/customers?email=${encodeURIComponent(LEDGER_CUSTOMER_EMAIL)}&limit=1`,
        { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } }
      );
      if (!searchRes.ok) return null;
      const searchJson = (await searchRes.json()) as { data?: Array<Record<string, any>> };
      return searchJson.data?.[0] || null;
    }

    try {
      if (req.method === 'GET' && action === 'overview') {
        const rawDays = Array.isArray(req.query?.days) ? req.query.days[0] : req.query?.days;
        const parsedDays = rawDays === 'all' ? 0 : Math.max(1, Math.min(3650, Number(rawDays) || 90));
        const cutoffEpochSec = parsedDays > 0 ? Math.floor(Date.now() / 1000) - parsedDays * 86400 : 0;

        const [sessionsRes, promosRes, printifyRes, ledgerCustomer] = await Promise.all([
          fetchFn('https://api.stripe.com/v1/checkout/sessions?limit=100', {
            headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
          }),
          fetchFn('https://api.stripe.com/v1/promotion_codes?limit=50&expand[]=data.coupon', {
            headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
          }),
          PRINTIFY_API_TOKEN
            ? fetchFn(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json?limit=50`, {
                headers: {
                  Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
                  'User-Agent': 'HighDrawGolf-MarketingTelemetry/1.0',
                },
              }).catch(() => null)
            : Promise.resolve(null),
          findLedgerCustomer(),
        ]);

        if (!sessionsRes.ok) {
          return res.status(502).json({
            ok: false,
            error: `Failed to query Stripe Checkout sessions (HTTP ${sessionsRes.status}).`,
          });
        }

        const sessionsJson = (await sessionsRes.json()) as { data?: Array<Record<string, any>> };
        const promosJson = promosRes.ok
          ? ((await promosRes.json()) as { data?: Array<Record<string, any>> })
          : { data: [] };
        const printifyJson =
          printifyRes && printifyRes.ok
            ? ((await printifyRes.json()) as { data?: Array<Record<string, any>> })
            : { data: [] };

        const printifyOrders = Array.isArray(printifyJson.data) ? printifyJson.data : [];
        const promoMapById = new Map<string, PromoCodeSummary>();
        const promos: PromoCodeSummary[] = (promosJson.data || []).map((p) => {
          const coupon = (p.coupon || {}) as Record<string, any>;
          const minCents = Number(p.restrictions?.minimum_amount) || 0;
          const discountLabel = coupon.percent_off
            ? `${coupon.percent_off}% Off`
            : coupon.amount_off
            ? `$${(Number(coupon.amount_off) / 100).toFixed(0)} Off`
            : 'Custom Promo';
          const summary: PromoCodeSummary = {
            id: String(p.id || ''),
            code: String(p.code || ''),
            active: Boolean(p.active),
            timesRedeemed: Number(p.times_redeemed) || 0,
            discountLabel,
            minOrderDollars: Math.round(minCents / 100),
            channel: sanitizeText(p.metadata?.channel || coupon.metadata?.channel || '', 64),
            campaign: sanitizeText(p.metadata?.campaign || coupon.metadata?.campaign || '', 80),
            notes: sanitizeText(p.metadata?.notes || coupon.metadata?.notes || '', 160),
            createdAt: p.created ? new Date(Number(p.created) * 1000).toISOString() : new Date().toISOString(),
          };
          if (summary.id) promoMapById.set(summary.id, summary);
          return summary;
        });

        const allPaidSessions = (sessionsJson.data || []).filter((s) => {
          if (s.payment_status !== 'paid') return false;
          const created = Number(s.created) || 0;
          return cutoffEpochSec === 0 || created >= cutoffEpochSec;
        });

        // Hydrate line_items & discount breakdown for up to 30 recent paid sessions
        const detailedSessions = await Promise.all(
          allPaidSessions.slice(0, 30).map(async (s) => {
            if (Array.isArray(s.line_items?.data) && s.line_items.data.length > 0) {
              return s;
            }
            try {
              const detRes = await fetchFn(
                `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(
                  String(s.id)
                )}?expand[]=line_items.data.price.product&expand[]=total_details.breakdown`,
                { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } }
              );
              if (!detRes.ok) return s;
              return (await detRes.json()) as Record<string, any>;
            } catch {
              return s;
            }
          })
        );

        const remainingSummaries = allPaidSessions.slice(30);
        const combinedPaid = [...detailedSessions, ...remainingSummaries];

        const orders: OrderTelemetryRecord[] = combinedPaid.map((s) => {
          const sessionId = String(s.id || '');
          const createdUnix = Number(s.created) || Math.floor(Date.now() / 1000);
          const meta = (s.metadata || {}) as Record<string, string>;
          const orderId = sanitizeText(meta.orderId || sessionId.slice(-8).toUpperCase(), 48);

          const matchedPrintify = printifyOrders.find((po) => {
            const shopOrderId = po?.metadata?.shop_order_id || po?.external_id;
            const shopOrderLabel = po?.metadata?.shop_order_label || po?.label;
            return shopOrderId === sessionId || (orderId && (shopOrderId === orderId || shopOrderLabel === orderId));
          });

          const rawItems = Array.isArray(s.line_items?.data) ? s.line_items.data : [];
          let estCogs = 0;
          let garmentUnits = 0;
          let shippingCollectedCents = Number(s.total_details?.amount_shipping) || 0;
          const itemsSummary: string[] = [];

          for (const li of rawItems) {
            const desc = String(li?.description || 'High Draw Garment');
            const pMeta =
              typeof li?.price?.product === 'object' && li.price.product !== null
                ? li.price.product.metadata || {}
                : {};
            const qty = Math.max(1, Math.floor(Number(li?.quantity) || 1));

            if (pMeta.fulfillment_type === 'shipping' || desc.toLowerCase().includes('fairway shipping')) {
              shippingCollectedCents += Number(li?.amount_total) || 0;
              continue;
            }

            itemsSummary.push(`${qty}x ${desc}`);
            const est = estimateGarmentCostDollars(desc, qty);
            estCogs += est.cogs;
            garmentUnits += est.garmentUnits;
          }

          if (matchedPrintify && Array.isArray(matchedPrintify.line_items) && matchedPrintify.line_items.length > 0) {
            const printifyUnits = matchedPrintify.line_items.reduce(
              (sum: number, item: Record<string, any>) => sum + Math.max(1, Number(item?.quantity) || 1),
              0
            );
            garmentUnits = Math.max(garmentUnits, printifyUnits);
          } else if (garmentUnits === 0 && (Number(s.amount_total) || 0) > 0) {
            // Fallback when session summary has no line_items expanded
            const approxDollars = (Number(s.amount_total) || 0) / 100;
            garmentUnits = Math.max(1, Math.round(approxDollars / 54));
            estCogs = Number((garmentUnits * 21.5).toFixed(2));
          }

          const revenueDollars = Number(((Number(s.amount_total) || 0) / 100).toFixed(2));
          const subtotalDollars = Number(((Number(s.amount_subtotal) || Number(s.amount_total) || 0) / 100).toFixed(2));
          const discountDollars = Number(((Number(s.total_details?.amount_discount) || 0) / 100).toFixed(2));
          const shippingCollectedDollars = Number((shippingCollectedCents / 100).toFixed(2));
          const stripeFeeDollars = revenueDollars > 0 ? Number((revenueDollars * 0.029 + 0.3).toFixed(2)) : 0;

          const hasActualPrintifyCost =
            matchedPrintify &&
            typeof matchedPrintify.total_price === 'number' &&
            matchedPrintify.total_price > 0;

          const cogsDollars = hasActualPrintifyCost
            ? Number((matchedPrintify.total_price / 100).toFixed(2))
            : Number(estCogs.toFixed(2));
          const printifyShippingDollars = hasActualPrintifyCost
            ? Number(((Number(matchedPrintify.total_shipping) || 0) / 100).toFixed(2))
            : estimateShippingDollars(garmentUnits);

          const contributionMarginDollars = Number(
            (revenueDollars - cogsDollars - printifyShippingDollars - stripeFeeDollars).toFixed(2)
          );

          const shipAddr =
            s.collected_information?.shipping_details?.address ||
            s.shipping_details?.address ||
            s.customer_details?.address ||
            {};
          const stateCode = normalizeStateCode(shipAddr.state);

          const discountsArr = Array.isArray(s.total_details?.breakdown?.discounts)
            ? s.total_details.breakdown.discounts
            : [];
          const firstPromoId = discountsArr[0]?.discount?.promotion_code
            ? String(discountsArr[0].discount.promotion_code)
            : '';
          const matchedPromo = firstPromoId ? promoMapById.get(firstPromoId) : undefined;
          const promoCode = matchedPromo?.code || sanitizeText(meta.promo_code || '', 32);

          const utmSource = sanitizeText(meta.utm_source || matchedPromo?.channel || 'direct', 80) || 'direct';
          const utmMedium = sanitizeText(meta.utm_medium || (matchedPromo ? 'promo' : 'organic'), 80) || 'organic';
          const utmCampaign = sanitizeText(meta.utm_campaign || matchedPromo?.campaign || '', 120);
          const utmContent = sanitizeText(meta.utm_content || '', 120);
          const refCode = sanitizeText(meta.ref_code || '', 40);

          const channel = inferChannelName({
            utmSource,
            utmMedium,
            promoCode,
            refCode,
          });

          return {
            sessionId,
            orderId,
            createdAt: new Date(createdUnix * 1000).toISOString(),
            weekKey: toIsoWeekKey(createdUnix),
            revenueDollars,
            subtotalDollars,
            discountDollars,
            shippingCollectedDollars,
            stripeFeeDollars,
            cogsDollars,
            printifyShippingDollars,
            cogsSource: hasActualPrintifyCost ? 'printify_actual' : 'estimated_blueprint',
            contributionMarginDollars,
            garmentUnits,
            stateCode,
            utmSource,
            utmMedium,
            utmCampaign,
            utmContent,
            refCode,
            promoCode,
            channel,
            pairDiscountApplied: meta.pairDiscountApplied === 'true',
            printifyOrderId: matchedPrintify?.id ? String(matchedPrintify.id) : undefined,
            printifyStatus: matchedPrintify?.status
              ? String(matchedPrintify.status)
              : 'pending_or_manual',
            itemsSummary,
          };
        });

        const decodedCloud = decodeCloudLedgerMetadata(ledgerCustomer?.metadata);

        const stateCounts: Record<string, { orders: number; units: number; revenueDollars: number }> = {};
        const channelCounts: Record<string, { orders: number; units: number; revenueDollars: number; cm1Dollars: number }> = {};
        const totalGarmentUnitsAllTime =
          parsedDays === 0
            ? orders.reduce((sum, o) => sum + o.garmentUnits, 0)
            : (sessionsJson.data || [])
                .filter((s) => s.payment_status === 'paid')
                .reduce((sum, s) => {
                  const found = orders.find((o) => o.sessionId === s.id);
                  if (found) return sum + found.garmentUnits;
                  return sum + Math.max(1, Math.round(((Number(s.amount_total) || 0) / 100) / 54));
                }, 0);

        for (const o of orders) {
          if (o.stateCode && o.stateCode !== 'Unknown') {
            if (!stateCounts[o.stateCode]) {
              stateCounts[o.stateCode] = { orders: 0, units: 0, revenueDollars: 0 };
            }
            stateCounts[o.stateCode].orders += 1;
            stateCounts[o.stateCode].units += o.garmentUnits;
            stateCounts[o.stateCode].revenueDollars = Number(
              (stateCounts[o.stateCode].revenueDollars + o.revenueDollars).toFixed(2)
            );
          }

          if (!channelCounts[o.channel]) {
            channelCounts[o.channel] = { orders: 0, units: 0, revenueDollars: 0, cm1Dollars: 0 };
          }
          channelCounts[o.channel].orders += 1;
          channelCounts[o.channel].units += o.garmentUnits;
          channelCounts[o.channel].revenueDollars = Number(
            (channelCounts[o.channel].revenueDollars + o.revenueDollars).toFixed(2)
          );
          channelCounts[o.channel].cm1Dollars = Number(
            (channelCounts[o.channel].cm1Dollars + o.contributionMarginDollars).toFixed(2)
          );
        }

        return res.status(200).json({
          ok: true,
          generatedAt: new Date().toISOString(),
          daysWindow: parsedDays,
          orders,
          promos,
          stateCounts,
          channelCounts,
          totalGarmentUnitsAllTime,
          cloudSync: {
            available: true,
            revision: decodedCloud.revision,
            updatedAt: decodedCloud.updatedAt,
            ledger: decodedCloud.ledger,
          },
        });
      }

      if (req.method === 'POST' && action === 'sync-ledger') {
        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, any>;
        const ledger = body.ledger;
        if (!ledger || typeof ledger !== 'object') {
          return res.status(400).json({ ok: false, error: 'Missing ledger payload.' });
        }

        const existingCustomer = await findLedgerCustomer();
        const decodedPrev = decodeCloudLedgerMetadata(existingCustomer?.metadata);
        const nextRevision = (decodedPrev.revision || 0) + 1;

        let encoded;
        try {
          encoded = encodeCloudLedgerChunks(ledger, decodedPrev.chunkCount, nextRevision);
        } catch (encErr: any) {
          if (encErr?.message === 'LEDGER_TOO_LARGE') {
            return res.status(413).json({
              ok: false,
              error: 'Marketing ledger exceeds cloud metadata capacity. Export and prune archived notes.',
            });
          }
          throw encErr;
        }

        const form = new URLSearchParams();
        if (!existingCustomer) {
          form.append('email', LEDGER_CUSTOMER_EMAIL);
          form.append('name', 'High Draw Marketing Cloud Ledger');
          form.append('description', 'Internal compressed cloud state for High Draw Marketing Command Center.');
        }
        for (const [k, v] of encoded.metadataEntries) {
          form.append(`metadata[${k}]`, v);
        }

        const endpoint = existingCustomer
          ? `https://api.stripe.com/v1/customers/${encodeURIComponent(String(existingCustomer.id))}`
          : 'https://api.stripe.com/v1/customers';

        const saveRes = await fetchFn(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: form.toString(),
        });

        if (!saveRes.ok) {
          return res.status(502).json({
            ok: false,
            error: `Stripe cloud ledger sync failed (HTTP ${saveRes.status}).`,
          });
        }

        const savedCustomer = (await saveRes.json()) as Record<string, any>;
        return res.status(200).json({
          ok: true,
          synced: true,
          customerId: savedCustomer.id,
          revision: encoded.revision,
          updatedAt: encoded.updatedAt,
        });
      }

      if (req.method === 'POST' && action === 'create-promo') {
        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, any>;
        const rawCode = String(body.code || '')
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9_-]/g, '');

        if (!/^[A-Z0-9_-]{3,24}$/.test(rawCode)) {
          return res.status(400).json({
            ok: false,
            error: 'Promo code must be 3–24 uppercase letters, numbers, underscores, or hyphens.',
          });
        }

        const discountType = body.discountType === 'amount' ? 'amount' : 'percent';
        const rawVal = Number(body.discountValue);
        if (!Number.isFinite(rawVal)) {
          return res.status(400).json({ ok: false, error: 'Invalid discount value.' });
        }

        const channel = sanitizeText(body.channel || 'Referral / QR', 64);
        const campaign = sanitizeText(body.campaign || rawCode.toLowerCase(), 80);
        const notes = sanitizeText(body.notes || '', 160);
        const minOrderDollars = Math.max(0, Math.min(500, Math.floor(Number(body.minOrderDollars) || 0)));

        const couponForm = new URLSearchParams();
        couponForm.append('name', `${rawCode} (${channel})`);
        couponForm.append('duration', 'once');
        if (discountType === 'percent') {
          const pct = Math.max(5, Math.min(40, Math.round(rawVal)));
          couponForm.append('percent_off', String(pct));
        } else {
          const amtDollars = Math.max(5, Math.min(50, Math.round(rawVal)));
          couponForm.append('amount_off', String(amtDollars * 100));
          couponForm.append('currency', 'usd');
        }
        couponForm.append('metadata[channel]', channel);
        couponForm.append('metadata[campaign]', campaign);
        if (notes) couponForm.append('metadata[notes]', notes);

        const couponRes = await fetchFn('https://api.stripe.com/v1/coupons', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: couponForm.toString(),
        });
        const couponData = (await couponRes.json()) as Record<string, any>;
        if (!couponRes.ok || !couponData.id) {
          return res.status(couponRes.status || 502).json({
            ok: false,
            error: couponData.error?.message || 'Unable to create Stripe coupon.',
          });
        }

        const promoForm = new URLSearchParams();
        promoForm.append('coupon', String(couponData.id));
        promoForm.append('code', rawCode);
        if (minOrderDollars > 0) {
          promoForm.append('restrictions[minimum_amount]', String(minOrderDollars * 100));
          promoForm.append('restrictions[minimum_amount_currency]', 'usd');
        }
        promoForm.append('metadata[channel]', channel);
        promoForm.append('metadata[campaign]', campaign);
        promoForm.append('metadata[created_by]', 'command_center');
        if (notes) promoForm.append('metadata[notes]', notes);

        const promoRes = await fetchFn('https://api.stripe.com/v1/promotion_codes', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: promoForm.toString(),
        });
        const promoData = (await promoRes.json()) as Record<string, any>;
        if (!promoRes.ok || !promoData.id) {
          return res.status(promoRes.status || 502).json({
            ok: false,
            error: promoData.error?.message || 'Unable to create Stripe promotion code.',
          });
        }

        const discountLabel =
          discountType === 'percent'
            ? `${couponData.percent_off}% Off`
            : `$${Math.round((Number(couponData.amount_off) || 0) / 100)} Off`;

        return res.status(200).json({
          ok: true,
          promo: {
            id: String(promoData.id),
            code: String(promoData.code),
            active: Boolean(promoData.active),
            timesRedeemed: Number(promoData.times_redeemed) || 0,
            discountLabel,
            minOrderDollars,
            channel,
            campaign,
            notes,
            createdAt: new Date().toISOString(),
          } satisfies PromoCodeSummary,
        });
      }

      return res.status(400).json({ ok: false, error: 'Unsupported marketing action.' });
    } catch (err) {
      console.error(
        'Marketing API exception:',
        err instanceof Error ? err.message : 'Unknown error'
      );
      return res.status(500).json({ ok: false, error: 'Internal server error in marketing gateway.' });
    }
  };
}

export default createMarketingGatewayHandler();
