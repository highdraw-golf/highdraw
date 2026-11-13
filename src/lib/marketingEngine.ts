// High Draw Golf — Deterministic CFO Marketing Engine & Cloud Ledger Model
// Tier 1 Zero-AI Financial Rules Engine: 0ms latency, $0 AI token cost, exact unit-economics math.

export type ExperimentChannel =
  | 'Facebook / Meta Ads'
  | 'Tournament & Outing Outreach'
  | 'Creator & Ambassador Seeding'
  | 'QR Card / Peer Referral'
  | 'Clubhouse / Work-to-Course';

export type ExperimentStatus = 'planned' | 'running' | 'completed' | 'paused' | 'killed';

export type ExperimentVerdict =
  | 'SCALE'
  | 'ITERATE'
  | 'FOLLOW_UP'
  | 'TESTING'
  | 'PLANNED'
  | 'KILL';

export interface MarketingExperiment {
  id: string;
  title: string;
  channel: ExperimentChannel;
  status: ExperimentStatus;
  landingPath: string;
  utmCampaign: string;
  utmContent: string;
  promoCode: string;
  hypothesis: string;
  cashSpentDollars: number;
  seededShirts: number;
  hoursSpent: number;
  manualClicks: number;
  manualOrders: number;
  manualRevenueDollars: number;
  manualUnits: number;
  lastTouchedAt: string;
  lessonLearned: string;
  nextAdjustment: string;
}

export type OutreachLeadStage =
  | 'Lead'
  | 'Sample Sent'
  | 'Follow-Up Due'
  | 'Quoted'
  | 'Closed Won'
  | 'Passed';

export type OutreachLeadCategory =
  | 'Charity Scramble'
  | 'Alumni / Corporate Outing'
  | 'Golf Connector / Buddy'
  | 'Micro-Creator (<25k)'
  | 'Country Club Pro';

export interface OutreachLead {
  id: string;
  name: string;
  organization: string;
  city: string;
  stateCode: string;
  category: OutreachLeadCategory;
  stage: OutreachLeadStage;
  estimatedUnits: number;
  sampleShippedAt?: string;
  seededCostDollars: number;
  promoCode?: string;
  notes: string;
  updatedAt: string;
}

export interface WeeklyChecklistItem {
  id: string;
  label: string;
  category: string;
  targetHours: number;
  completed: boolean;
}

export interface MarketingCloudLedger {
  version: 1;
  updatedAt: string;
  updatedBy: string;
  metaPixelId: string;
  monthlyBudgetDollars: number;
  weeklyHoursBudget: number;
  experiments: MarketingExperiment[];
  outreachLeads: OutreachLead[];
  weeklyChecklist: WeeklyChecklistItem[];
}

export interface TelemetryOrder {
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

export interface PromoSummary {
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

export interface MarketingOverviewResponse {
  ok: boolean;
  generatedAt: string;
  daysWindow: number;
  orders: TelemetryOrder[];
  promos: PromoSummary[];
  stateCounts: Record<string, { orders: number; units: number; revenueDollars: number }>;
  channelCounts: Record<
    string,
    { orders: number; units: number; revenueDollars: number; cm1Dollars: number }
  >;
  totalGarmentUnitsAllTime: number;
  cloudSync: {
    available: boolean;
    revision: number;
    updatedAt: string | null;
    ledger: Partial<MarketingCloudLedger> | null;
  };
}

export interface EvaluatedExperiment extends MarketingExperiment {
  seededCogsDollars: number;
  totalOutlayDollars: number;
  attributedOrders: number;
  attributedUnits: number;
  attributedRevenueDollars: number;
  attributedCm1Dollars: number;
  netProfitAfterMarketing: number;
  roas: number;
  actualCacDollars: number | null;
  allowableCacDollars: number;
  aovDollars: number;
  daysSinceLastTouch: number;
  verdict: ExperimentVerdict;
  verdictReason: string;
}

export interface BudgetSplitPlan {
  monthlyBudgetDollars: number;
  facebookAdsDollars: number;
  facebookDaysAtTenPerDay: number;
  seedingShirtsDollars: number;
  estimatedSampleShirtsCount: number;
  qrCardsAndPostageDollars: number;
  breakEvenPairOrders: number;
  modeLabel: string;
}

export const WHOLESALE_SAMPLE_SHIRT_COST = 21.5;
export const HUNDRED_SHIRT_MILESTONE = 100;
export const LOCAL_LEDGER_STORAGE_KEY = 'highdraw_marketing_ledger_v1';

export function createDefaultMarketingLedger(): MarketingCloudLedger {
  const now = new Date().toISOString();
  return {
    version: 1,
    updatedAt: now,
    updatedBy: 'Dr. Ken & Kyle Cyree',
    metaPixelId: '',
    monthlyBudgetDollars: 200,
    weeklyHoursBudget: 4.5,
    experiments: [
      {
        id: 'exp-fb-pair-86',
        title: 'FB Sprint #1 — "2-Polo Pair ($86 Free Ship)" Hook',
        channel: 'Facebook / Meta Ads',
        status: 'planned',
        landingPath: '/collections/polos',
        utmCampaign: 'm1_pair_hook',
        utmContent: 'pair_86',
        promoCode: '',
        hypothesis:
          'Sending Facebook traffic to our Mix & Match 2-Polo Pair ($86 + Free Shipping) yields ~$36.44 contribution margin vs. losing money on a single $48 shirt.',
        cashSpentDollars: 0,
        seededShirts: 0,
        hoursSpent: 0,
        manualClicks: 0,
        manualOrders: 0,
        manualRevenueDollars: 0,
        manualUnits: 0,
        lastTouchedAt: now,
        lessonLearned: '',
        nextAdjustment: 'Configure Meta Pixel ID, then launch 15-day $10/day CBO test alongside 2 sister creatives.',
      },
      {
        id: 'exp-fb-collar-proof',
        title: 'FB Sprint #2 — "Stay-Flat Collar vs. $125 Pro Shop" Video',
        channel: 'Facebook / Meta Ads',
        status: 'planned',
        landingPath: '/products/mens-clubhouse-fine-pique-polo',
        utmCampaign: 'm1_pair_hook',
        utmContent: 'collar_test',
        promoCode: '',
        hypothesis:
          'An unpolished 30-second video comparing High Draw against a curled $115 pro-shop shirt builds immediate product trust and drives 2-shirt Clubhouse orders ($122 Free Ship).',
        cashSpentDollars: 0,
        seededShirts: 0,
        hoursSpent: 0,
        manualClicks: 0,
        manualOrders: 0,
        manualRevenueDollars: 0,
        manualUnits: 0,
        lastTouchedAt: now,
        lessonLearned: '',
        nextAdjustment: 'Film 30s kitchen-table collar comparison on iPhone and drop into the single Month 1 Meta ad set.',
      },
      {
        id: 'exp-fb-spouse-gift',
        title: 'FB Sprint #3 — "Spouse & Holiday Gifting (Pair / Foursome Kit)"',
        channel: 'Facebook / Meta Ads',
        status: 'planned',
        landingPath: '/products/the-saturday-foursome-scramble-kit',
        utmCampaign: 'm1_pair_hook',
        utmContent: 'spouse_gift',
        promoCode: '',
        hypothesis:
          'Spouses and holiday shoppers convert with multi-shirt baskets ($86–$160) and half the return rate of cold self-buyers.',
        cashSpentDollars: 0,
        seededShirts: 0,
        hoursSpent: 0,
        manualClicks: 0,
        manualOrders: 0,
        manualRevenueDollars: 0,
        manualUnits: 0,
        lastTouchedAt: now,
        lessonLearned: '',
        nextAdjustment: 'Copy-paste gift ad angle in FB Ads Studio tab once Meta Pixel fires PageView + AddToCart.',
      },
      {
        id: 'exp-ken-seed-pair',
        title: 'Connector & Tournament Chair Seed (2 Wholesale Polos)',
        channel: 'Creator & Ambassador Seeding',
        status: 'planned',
        landingPath: '/',
        utmCampaign: 'm1_seed',
        utmContent: 'ken_connector',
        promoCode: 'KEN15',
        hypothesis:
          'Putting 1 Clubhouse K830 on a regional scramble organizer and wearing 1 on camera produces filming proof + high-margin group order conversations ($800+ profit per event).',
        cashSpentDollars: 0,
        seededShirts: 0,
        hoursSpent: 0,
        manualClicks: 0,
        manualOrders: 0,
        manualRevenueDollars: 0,
        manualUnits: 0,
        lastTouchedAt: now,
        lessonLearned: '',
        nextAdjustment: 'Mint promo code KEN15 in Studio tab and send sample to first tournament target.',
      },
    ],
    outreachLeads: [
      {
        id: 'lead-oxford-charity',
        name: 'Charity Scramble Chair #1',
        organization: 'Regional Spring/Fall Charity Golf Classic',
        city: 'Oxford',
        stateCode: 'MS',
        category: 'Charity Scramble',
        stage: 'Lead',
        estimatedUnits: 40,
        seededCostDollars: 0,
        promoCode: '',
        notes: 'Starter target: offer 1 Size L sample polo at cost to win a 36–48 shirt outing order ($42/shirt).',
        updatedAt: now,
      },
      {
        id: 'lead-alumni-outing',
        name: 'Alumni Golf Coordinator',
        organization: 'University / Fraternity Alumni Outing',
        city: 'Chapel Hill',
        stateCode: 'NC',
        category: 'Alumni / Corporate Outing',
        stage: 'Lead',
        estimatedUnits: 32,
        seededCostDollars: 0,
        promoCode: '',
        notes: 'Pitch "2+ Polo Pair" or 4-pack Foursome Kits as tournament prize upgrades.',
        updatedAt: now,
      },
    ],
    weeklyChecklist: [
      {
        id: 'chk-outreach',
        label: 'Mon/Wed: Send 5 warm messages to charity scramble, alumni, or corporate outing chairs',
        category: 'Outreach (Zero Ad Cost)',
        targetHours: 2.0,
        completed: false,
      },
      {
        id: 'chk-seeding',
        label: 'Thu/Sat Round: Wear High Draw on course & hand 2 QR Bag Cards to golf buddies',
        category: 'Seeding & Word of Mouth',
        targetHours: 1.0,
        completed: false,
      },
      {
        id: 'chk-video',
        label: 'Fri: Film two raw 30-second iPhone proof clips (collar test or $48 vs $125 value)',
        category: 'Facebook Ad Creative',
        targetHours: 0.75,
        completed: false,
      },
      {
        id: 'chk-cfo',
        label: 'Sun Evening: Review Command Center MER, CAC & Kill/Scale verdicts (update notes)',
        category: 'CFO Telemetry Review',
        targetHours: 0.75,
        completed: false,
      },
    ],
  };
}

export function normalizeCloudLedger(
  candidate: Partial<MarketingCloudLedger> | null | undefined
): MarketingCloudLedger {
  const defaults = createDefaultMarketingLedger();
  if (!candidate || typeof candidate !== 'object') return defaults;
  return {
    version: 1,
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : defaults.updatedAt,
    updatedBy: typeof candidate.updatedBy === 'string' ? candidate.updatedBy : defaults.updatedBy,
    metaPixelId: typeof candidate.metaPixelId === 'string' ? candidate.metaPixelId : '',
    monthlyBudgetDollars:
      Number(candidate.monthlyBudgetDollars) >= 100
        ? Number(candidate.monthlyBudgetDollars)
        : defaults.monthlyBudgetDollars,
    weeklyHoursBudget:
      Number(candidate.weeklyHoursBudget) >= 1
        ? Number(candidate.weeklyHoursBudget)
        : defaults.weeklyHoursBudget,
    experiments: Array.isArray(candidate.experiments) ? candidate.experiments : defaults.experiments,
    outreachLeads: Array.isArray(candidate.outreachLeads) ? candidate.outreachLeads : defaults.outreachLeads,
    weeklyChecklist:
      Array.isArray(candidate.weeklyChecklist) && candidate.weeklyChecklist.length > 0
        ? candidate.weeklyChecklist
        : defaults.weeklyChecklist,
  };
}

export function loadLocalMarketingLedger(): MarketingCloudLedger {
  if (typeof window === 'undefined') return createDefaultMarketingLedger();
  try {
    const raw = localStorage.getItem(LOCAL_LEDGER_STORAGE_KEY);
    if (!raw) return createDefaultMarketingLedger();
    return normalizeCloudLedger(JSON.parse(raw) as Partial<MarketingCloudLedger>);
  } catch {
    return createDefaultMarketingLedger();
  }
}

export function saveLocalMarketingLedger(ledger: MarketingCloudLedger): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_LEDGER_STORAGE_KEY, JSON.stringify(ledger));
  } catch {
    // ignore storage errors
  }
}

export function computeBudgetAllocation(monthlyBudgetDollars: number): BudgetSplitPlan {
  const budget = Math.max(100, Math.round(Number(monthlyBudgetDollars) || 200));

  if (budget <= 250) {
    // Month 1 Lean Validation calibration: concentrate enough budget in 1 Facebook CBO Sales sprint ($10/day)
    // so Meta exits learning noise while reserving $6 for QR bag cards and buying wholesale sample shirts.
    const facebookAdsDollars = budget <= 165 ? 120 : 150;
    const remainder = Math.max(0, budget - facebookAdsDollars);
    const estimatedSampleShirtsCount = Math.max(
      1,
      Math.floor(Math.max(0, remainder - 6) / WHOLESALE_SAMPLE_SHIRT_COST)
    );
    const seedingShirtsDollars = Math.min(remainder, Math.round(estimatedSampleShirtsCount * 22));
    const qrCardsAndPostageDollars = Math.max(0, budget - facebookAdsDollars - seedingShirtsDollars);
    const modeLabel =
      budget <= 175
        ? 'Lean Micro-Test (12-Day FB Sprint + 1 Sample Shirt)'
        : 'Recommended Month 1 Start-Small (15-Day FB $10/d Sprint + 2 Sample Shirts)';

    return {
      monthlyBudgetDollars: budget,
      facebookAdsDollars,
      facebookDaysAtTenPerDay: Math.floor(facebookAdsDollars / 10),
      seedingShirtsDollars,
      estimatedSampleShirtsCount,
      qrCardsAndPostageDollars,
      breakEvenPairOrders: Math.max(1, Math.ceil(budget / 36.5)),
      modeLabel,
    };
  }

  const facebookAdsDollars = Math.round(budget * 0.5);
  const seedingShirtsDollars = Math.round(budget * 0.35);
  const qrCardsAndPostageDollars = Math.max(0, budget - facebookAdsDollars - seedingShirtsDollars);
  return {
    monthlyBudgetDollars: budget,
    facebookAdsDollars,
    facebookDaysAtTenPerDay: Math.floor(facebookAdsDollars / 10),
    seedingShirtsDollars,
    estimatedSampleShirtsCount: Math.max(1, Math.floor(seedingShirtsDollars / WHOLESALE_SAMPLE_SHIRT_COST)),
    qrCardsAndPostageDollars,
    breakEvenPairOrders: Math.max(1, Math.ceil(budget / 42)),
    modeLabel: budget < 750 ? 'Validated Scale Tier' : 'Seasonal Growth Push Tier',
  };
}

export function evaluateExperimentVerdict(
  exp: MarketingExperiment,
  orders: TelemetryOrder[]
): EvaluatedExperiment {
  const camp = exp.utmCampaign.trim().toLowerCase();
  const content = exp.utmContent.trim().toLowerCase();
  const promo = exp.promoCode.trim().toUpperCase();

  const matchedOrders = orders.filter((o) => {
    const oCamp = o.utmCampaign.trim().toLowerCase();
    const oCont = o.utmContent.trim().toLowerCase();
    const oPromo = o.promoCode.trim().toUpperCase();
    const oRef = o.refCode.trim().toUpperCase();

    if (promo && (oPromo === promo || oRef === promo)) return true;
    if (camp && oCamp === camp) {
      return !content || oCont === content;
    }
    return false;
  });

  const liveOrdersCount = matchedOrders.length;
  const liveUnits = matchedOrders.reduce((s, o) => s + o.garmentUnits, 0);
  const liveRev = matchedOrders.reduce((s, o) => s + o.revenueDollars, 0);
  const liveCm1 = matchedOrders.reduce((s, o) => s + o.contributionMarginDollars, 0);

  const attributedOrders = liveOrdersCount + (Number(exp.manualOrders) || 0);
  const attributedUnits = liveUnits + (Number(exp.manualUnits) || 0);
  const attributedRevenueDollars = Number(
    (liveRev + (Number(exp.manualRevenueDollars) || 0)).toFixed(2)
  );
  const manualEstCm1 = (Number(exp.manualRevenueDollars) || 0) * 0.5;
  const attributedCm1Dollars = Number((liveCm1 + manualEstCm1).toFixed(2));

  const seededCogsDollars = Number(
    ((Number(exp.seededShirts) || 0) * WHOLESALE_SAMPLE_SHIRT_COST).toFixed(2)
  );
  const totalOutlayDollars = Number(
    ((Number(exp.cashSpentDollars) || 0) + seededCogsDollars).toFixed(2)
  );
  const netProfitAfterMarketing = Number(
    (attributedCm1Dollars - totalOutlayDollars).toFixed(2)
  );
  const roas =
    totalOutlayDollars > 0
      ? Number((attributedRevenueDollars / totalOutlayDollars).toFixed(2))
      : 0;
  const actualCacDollars =
    attributedOrders > 0 ? Number((totalOutlayDollars / attributedOrders).toFixed(2)) : null;
  const aovDollars =
    attributedOrders > 0 ? Number((attributedRevenueDollars / attributedOrders).toFixed(2)) : 0;
  const allowableCacDollars =
    attributedOrders > 0
      ? Number((attributedCm1Dollars / attributedOrders).toFixed(2))
      : 46;

  const touchedMs = Date.parse(exp.lastTouchedAt) || Date.now();
  const daysSinceLastTouch = Math.max(0, Math.floor((Date.now() - touchedMs) / 86400000));

  let verdict: ExperimentVerdict = 'TESTING';
  let verdictReason = 'Collecting initial traffic and order signals before making a hard call.';

  if (exp.status === 'killed') {
    verdict = 'KILL';
    verdictReason = 'Manually paused/killed after failing unit-economics thresholds.';
  } else if (
    exp.status === 'planned' &&
    totalOutlayDollars === 0 &&
    attributedOrders === 0 &&
    (Number(exp.manualClicks) || 0) === 0
  ) {
    verdict = 'PLANNED';
    verdictReason = 'Ready in queue — flip status to Running once launched.';
  } else if (totalOutlayDollars > 65 && attributedOrders === 0) {
    verdict = 'KILL';
    verdictReason = `Spent $${totalOutlayDollars.toFixed(
      0
    )} (> 1.5x allowable CAC) with 0 orders — cut spend and swap creative angle.`;
  } else if (attributedOrders >= 5 && netProfitAfterMarketing < 0) {
    verdict = 'KILL';
    verdictReason = `${attributedOrders} orders generated but net contribution is -$${Math.abs(
      netProfitAfterMarketing
    ).toFixed(2)} — CAC exceeds garment margin.`;
  } else if (
    attributedOrders >= 3 &&
    netProfitAfterMarketing > 0 &&
    actualCacDollars !== null &&
    actualCacDollars <= allowableCacDollars * 0.85
  ) {
    verdict = 'SCALE';
    verdictReason = `Winner: ${attributedOrders} orders at $${actualCacDollars.toFixed(
      2
    )} CAC vs. $${allowableCacDollars.toFixed(2)} allowable margin (+$${netProfitAfterMarketing.toFixed(
      2
    )} net). Safe to increase daily budget.`;
  } else if (attributedOrders >= 1 && attributedOrders <= 2 && aovDollars > 0 && aovDollars < 75) {
    verdict = 'ITERATE';
    verdictReason = `Hook converts ($${aovDollars.toFixed(
      0
    )} AOV) but cart is below $75 Free Shipping / $86 2-Polo Pair — route ad link to Polo Pair or Foursome Kit.`;
  } else if ((Number(exp.manualClicks) || 0) >= 40 && attributedOrders === 0) {
    verdict = 'ITERATE';
    verdictReason = `${exp.manualClicks} clicks with 0 checkouts — creative hook works, improve destination landing offer or price framing.`;
  } else if ((Number(exp.seededShirts) || 0) > 0 && attributedOrders === 0 && daysSinceLastTouch >= 7) {
    verdict = 'FOLLOW_UP';
    verdictReason = `${exp.seededShirts} seeded shirt(s) logged ${daysSinceLastTouch} days ago — follow up for photo feedback or tournament quote.`;
  }

  return {
    ...exp,
    seededCogsDollars,
    totalOutlayDollars,
    attributedOrders,
    attributedUnits,
    attributedRevenueDollars,
    attributedCm1Dollars,
    netProfitAfterMarketing,
    roas,
    actualCacDollars,
    allowableCacDollars,
    aovDollars,
    daysSinceLastTouch,
    verdict,
    verdictReason,
  };
}

export function buildDashboardDataset(
  overview: MarketingOverviewResponse | null,
  ledger: MarketingCloudLedger
) {
  const orders = overview?.orders || [];
  const evaluatedExperiments = ledger.experiments.map((exp) => evaluateExperimentVerdict(exp, orders));

  const grossRevenue = orders.reduce((s, o) => s + o.revenueDollars, 0);
  const discounts = orders.reduce((s, o) => s + o.discountDollars, 0);
  const printifyCogs = orders.reduce((s, o) => s + o.cogsDollars, 0);
  const printifyShipping = orders.reduce((s, o) => s + o.printifyShippingDollars, 0);
  const stripeFees = orders.reduce((s, o) => s + o.stripeFeeDollars, 0);
  const cm1BeforeMarketing = orders.reduce((s, o) => s + o.contributionMarginDollars, 0);
  const totalOrders = orders.length;
  const windowUnits = orders.reduce((s, o) => s + o.garmentUnits, 0);
  const totalUnitsAllTime = Math.max(overview?.totalGarmentUnitsAllTime || 0, windowUnits);

  const leadsSeedCost = ledger.outreachLeads.reduce((s, l) => s + (Number(l.seededCostDollars) || 0), 0);
  const expOutlay = evaluatedExperiments.reduce((s, e) => s + e.totalOutlayDollars, 0);
  const totalMarketingOutlay = Number((expOutlay + leadsSeedCost).toFixed(2));
  const netProfitAfterMarketing = Number((cm1BeforeMarketing - totalMarketingOutlay).toFixed(2));

  const mer =
    totalMarketingOutlay > 0 ? Number((grossRevenue / totalMarketingOutlay).toFixed(2)) : null;
  const blendedCac =
    totalOrders > 0 && totalMarketingOutlay > 0
      ? Number((totalMarketingOutlay / totalOrders).toFixed(2))
      : null;
  const aov = totalOrders > 0 ? Number((grossRevenue / totalOrders).toFixed(2)) : 0;
  const allowableCac =
    totalOrders > 0 ? Number((cm1BeforeMarketing / totalOrders).toFixed(2)) : 46;

  // Weekly series
  const weekBuckets = new Map<string, { week: string; revenue: number; spend: number; cm1: number; orders: number }>();
  for (const o of orders) {
    const existing = weekBuckets.get(o.weekKey) || {
      week: o.weekKey,
      revenue: 0,
      spend: 0,
      cm1: 0,
      orders: 0,
    };
    existing.revenue += o.revenueDollars;
    existing.cm1 += o.contributionMarginDollars;
    existing.orders += 1;
    weekBuckets.set(o.weekKey, existing);
  }
  if (weekBuckets.size === 0) {
    const todayKey = new Date().toISOString().slice(0, 10);
    weekBuckets.set(todayKey, {
      week: todayKey,
      revenue: 0,
      spend: totalMarketingOutlay,
      cm1: 0,
      orders: 0,
    });
  } else if (totalMarketingOutlay > 0) {
    const keys = Array.from(weekBuckets.keys()).sort();
    const perWeekSpend = totalMarketingOutlay / keys.length;
    for (const k of keys) {
      const b = weekBuckets.get(k)!;
      b.spend = Number(perWeekSpend.toFixed(2));
    }
  }

  const weeklySeries = Array.from(weekBuckets.values())
    .sort((a, b) => a.week.localeCompare(b.week))
    .map((b) => ({
      week: b.week.slice(5),
      revenue: Number(b.revenue.toFixed(2)),
      spend: Number(b.spend.toFixed(2)),
      netProfit: Number((b.cm1 - b.spend).toFixed(2)),
      mer: b.spend > 0 ? Number((b.revenue / b.spend).toFixed(2)) : 0,
    }));

  // Channel comparison bars
  const channelMap = new Map<
    string,
    { channel: string; orders: number; revenue: number; spend: number; cm1: number }
  >();
  for (const o of orders) {
    const cur = channelMap.get(o.channel) || {
      channel: o.channel,
      orders: 0,
      revenue: 0,
      spend: 0,
      cm1: 0,
    };
    cur.orders += 1;
    cur.revenue += o.revenueDollars;
    cur.cm1 += o.contributionMarginDollars;
    channelMap.set(o.channel, cur);
  }
  for (const exp of evaluatedExperiments) {
    const cur = channelMap.get(exp.channel) || {
      channel: exp.channel,
      orders: 0,
      revenue: 0,
      spend: 0,
      cm1: 0,
    };
    cur.spend += exp.totalOutlayDollars;
    cur.orders += Number(exp.manualOrders) || 0;
    cur.revenue += Number(exp.manualRevenueDollars) || 0;
    cur.cm1 += (Number(exp.manualRevenueDollars) || 0) * 0.5;
    channelMap.set(exp.channel, cur);
  }
  const channelBars = Array.from(channelMap.values()).map((c) => ({
    channel: c.channel,
    orders: c.orders,
    revenue: Number(c.revenue.toFixed(2)),
    spend: Number(c.spend.toFixed(2)),
    actualCac: c.orders > 0 ? Number((c.spend / c.orders).toFixed(2)) : Number(c.spend.toFixed(2)),
    allowableCac: c.orders > 0 ? Number((c.cm1 / c.orders).toFixed(2)) : 46,
    netContribution: Number((c.cm1 - c.spend).toFixed(2)),
  }));

  // Profit waterfall data
  const waterfallData = [
    { step: 'Gross Sales', amount: Number(grossRevenue.toFixed(2)), fill: '#1C2C24' },
    { step: 'Printify COGS', amount: Number((-printifyCogs).toFixed(2)), fill: '#B12535' },
    { step: 'Postage', amount: Number((-printifyShipping).toFixed(2)), fill: '#DC2626' },
    { step: 'Stripe Fees', amount: Number((-stripeFees).toFixed(2)), fill: '#D97706' },
    { step: 'Mktg Outlay', amount: Number((-totalMarketingOutlay).toFixed(2)), fill: '#64748B' },
    {
      step: 'Net Cash',
      amount: Number(netProfitAfterMarketing.toFixed(2)),
      fill: netProfitAfterMarketing >= 0 ? '#059669' : '#B91C1C',
    },
  ];

  // Nivo Scatterplot groups
  const scatterGroups = new Map<
    string,
    Array<{
      x: number;
      y: number;
      title: string;
      units: number;
      verdict: ExperimentVerdict;
      roas: number;
    }>
  >();
  for (const ev of evaluatedExperiments) {
    const arr = scatterGroups.get(ev.verdict) || [];
    arr.push({
      x: ev.totalOutlayDollars,
      y: ev.netProfitAfterMarketing,
      title: ev.title,
      units: Math.max(1, ev.attributedUnits),
      verdict: ev.verdict,
      roas: ev.roas,
    });
    scatterGroups.set(ev.verdict, arr);
  }
  const scatterSeries = Array.from(scatterGroups.entries()).map(([id, data]) => ({
    id,
    data,
  }));

  // Sunday CFO Digest
  const digestActions: string[] = [];
  const killCandidates = evaluatedExperiments.filter((e) => e.verdict === 'KILL');
  const scaleCandidates = evaluatedExperiments.filter((e) => e.verdict === 'SCALE');
  const iterateCandidates = evaluatedExperiments.filter((e) => e.verdict === 'ITERATE');
  const overdueLeads = ledger.outreachLeads.filter((l) => {
    if (l.stage === 'Follow-Up Due') return true;
    if (l.stage === 'Sample Sent' && l.sampleShippedAt) {
      const days = Math.floor((Date.now() - Date.parse(l.sampleShippedAt)) / 86400000);
      return days >= 7;
    }
    return false;
  });

  if (killCandidates.length > 0) {
    digestActions.push(
      `STOP BLEED: ${killCandidates.length} experiment(s) exceeded safe CAC (${killCandidates[0].title}). Pause ad spend and redirect budget to winning offer.`
    );
  }
  if (overdueLeads.length > 0) {
    digestActions.push(
      `FOLLOW UP DUE: ${overdueLeads.length} sample/tournament lead(s) (${overdueLeads[0].organization}) passed 7 days — send 2-line check-in today.`
    );
  }
  if (scaleCandidates.length > 0) {
    digestActions.push(
      `SCALE WINNER: "${scaleCandidates[0].title}" has positive net cash (+$${scaleCandidates[0].netProfitAfterMarketing.toFixed(
        2
      )}). Raise daily cap cleanly by +25%.`
    );
  }
  if (iterateCandidates.length > 0) {
    digestActions.push(
      `FIX AOV: "${iterateCandidates[0].title}" is drawing single-shirt orders — route ads directly to the 2-Polo Pair ($86 Free Ship) landing view.`
    );
  }
  if (totalOrders === 0 && ledger.experiments.every((e) => e.status === 'planned')) {
    digestActions.push(
      `MONTH 1 LAUNCH READY: Paste your Meta Pixel ID in the FB Ads & QR Studio tab, mint promo code KEN15, and flip Sprint #1–#3 to Running when your $10/day campaign goes live.`
    );
  }
  if (digestActions.length === 0) {
    digestActions.push(
      `STEADY EXECUTION: ${totalUnitsAllTime} / ${HUNDRED_SHIRT_MILESTONE} shirts toward Stage 2 wholesale blank savings (~$6/shirt extra margin). Stay under $${ledger.monthlyBudgetDollars}/mo cap.`
    );
  }

  return {
    kpis: {
      grossRevenue: Number(grossRevenue.toFixed(2)),
      discounts: Number(discounts.toFixed(2)),
      printifyCogs: Number((printifyCogs + printifyShipping).toFixed(2)),
      stripeFees: Number(stripeFees.toFixed(2)),
      cm1BeforeMarketing: Number(cm1BeforeMarketing.toFixed(2)),
      totalMarketingOutlay,
      netProfitAfterMarketing,
      mer,
      blendedCac,
      allowableCac,
      aov,
      totalOrders,
      windowUnits,
      totalUnitsAllTime,
      milestoneTargetUnits: HUNDRED_SHIRT_MILESTONE,
      milestonePct: Math.min(100, Math.round((totalUnitsAllTime / HUNDRED_SHIRT_MILESTONE) * 100)),
    },
    evaluatedExperiments,
    weeklySeries,
    channelBars,
    waterfallData,
    scatterSeries,
    digestActions,
  };
}

export function buildTrackedMarketingUrl(params: {
  landingPath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  refCode?: string;
}): string {
  const cleanPath = params.landingPath.startsWith('/') ? params.landingPath : `/${params.landingPath}`;
  const url = new URL(`https://www.highdrawgear.com${cleanPath}`);
  if (params.utmSource.trim()) url.searchParams.set('utm_source', params.utmSource.trim());
  if (params.utmMedium.trim()) url.searchParams.set('utm_medium', params.utmMedium.trim());
  if (params.utmCampaign.trim()) url.searchParams.set('utm_campaign', params.utmCampaign.trim());
  if (params.utmContent?.trim()) url.searchParams.set('utm_content', params.utmContent.trim());
  if (params.refCode?.trim()) url.searchParams.set('ref', params.refCode.trim().toUpperCase());
  return url.toString();
}
