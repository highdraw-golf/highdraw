import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  Cell,
} from 'recharts';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import type { GeographiesProps } from 'react-simple-maps';
import QRCode from 'qrcode';
import usStatesTopology from 'us-atlas/states-10m.json';
import {
  ArrowLeft,
  CheckCircle2,
  Cloud,
  CloudOff,
  Copy,
  Download,
  ExternalLink,
  FileDown,
  Lock,
  Plus,
  QrCode,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Tag,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { getOwnerApiHeaders } from '../lib/auth';
import {
  getConfiguredMetaPixelId,
  setConfiguredMetaPixelId,
  isValidMetaPixelId,
} from '../lib/analytics';
import { readLocalFunnelCounters } from '../lib/attribution';
import type { LocalFunnelCounters } from '../lib/attribution';
import {
  buildDashboardDataset,
  buildTrackedMarketingUrl,
  computeBudgetAllocation,
  createDefaultMarketingLedger,
  HUNDRED_SHIRT_MILESTONE,
  loadLocalMarketingLedger,
  normalizeCloudLedger,
  saveLocalMarketingLedger,
  WHOLESALE_SAMPLE_SHIRT_COST,
} from '../lib/marketingEngine';
import type {
  ExperimentChannel,
  ExperimentStatus,
  ExperimentVerdict,
  MarketingCloudLedger,
  MarketingExperiment,
  MarketingOverviewResponse,
  OutreachLead,
  OutreachLeadCategory,
  OutreachLeadStage,
} from '../lib/marketingEngine';

export interface MarketingCommandPageProps {
  onNavigateBack: () => void;
  onLockSession: () => void;
}

type CommandTabId = 'overview' | 'experiments' | 'outreach' | 'studio' | 'playbook';

const TABS: Array<{ id: CommandTabId; label: string }> = [
  { id: 'overview', label: '1. Executive Overview' },
  { id: 'experiments', label: "2. What's Tried & Verdicts" },
  { id: 'outreach', label: '3. Outreach CRM & US Map' },
  { id: 'studio', label: '4. FB Ads & QR Studio' },
  { id: 'playbook', label: '5. Start-Small Budget & Playbook' },
];

const CHANNELS: ExperimentChannel[] = [
  'Facebook / Meta Ads',
  'Tournament & Outing Outreach',
  'Creator & Ambassador Seeding',
  'QR Card / Peer Referral',
  'Clubhouse / Work-to-Course',
];

const LEAD_CATEGORIES: OutreachLeadCategory[] = [
  'Charity Scramble',
  'Alumni / Corporate Outing',
  'Golf Connector / Buddy',
  'Micro-Creator (<25k)',
  'Country Club Pro',
];

const LEAD_STAGES: OutreachLeadStage[] = [
  'Lead',
  'Sample Sent',
  'Follow-Up Due',
  'Quoted',
  'Closed Won',
  'Passed',
];

const EXPERIMENT_STATUSES: ExperimentStatus[] = [
  'planned',
  'running',
  'completed',
  'paused',
  'killed',
];

const STATE_NAME_TO_CODE: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  'District of Columbia': 'DC',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

const VERDICT_BADGE_MAP: Record<ExperimentVerdict, string> = {
  SCALE: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  ITERATE: 'bg-amber-100 text-amber-900 border-amber-300',
  FOLLOW_UP: 'bg-sky-100 text-sky-900 border-sky-300',
  KILL: 'bg-rose-100 text-rose-900 border-rose-300',
  TESTING: 'bg-slate-100 text-slate-800 border-slate-300',
  PLANNED: 'bg-stone-100 text-stone-700 border-stone-300',
};

const SCATTER_COLORS: Record<string, string> = {
  SCALE: '#059669',
  ITERATE: '#D97706',
  FOLLOW_UP: '#0284C7',
  KILL: '#B12535',
  TESTING: '#475569',
  PLANNED: '#94A3B8',
};

const FB_AD_ANGLES = [
  {
    id: 'angle-a',
    label: 'Ad A — Price & 2-Polo Pair Offer (Conversion Workhorse)',
    utmContent: 'ad_pair_86',
    headline: 'Two Tour-Grade Polos. $86 Total + Free Shipping.',
    primaryText:
      'Skip the $125 pro-shop markup. High Draw blends 180 GSM micro-pique drape with structured collar stay-flat engineering and subtle 2.25" chest embroidery. Mix & match any 2 polos for $10 off + free US shipping.',
    cta: 'Shop Now',
  },
  {
    id: 'angle-b',
    label: 'Ad B — Dr. Ken Founder Fit Story (Trust Builder)',
    utmContent: 'ad_founder_fit',
    headline: 'A 3.8-Index Retired Business Dean Fixed Golf Polo Fit.',
    primaryText:
      'Most "athletic" golf polos bunch in the shoulders or feel thin after two washes. Designed for real swings from tee to clubhouse — tour performance at $48 ($43 each in a 2-Polo Pair) with zero retail middlemen.',
    cta: 'Learn More',
  },
  {
    id: 'angle-c',
    label: 'Ad C — Lori Work-to-Course Fine Pique (Gift / Pair)',
    utmContent: 'ad_work_to_course',
    headline: 'Boardroom Sharp at 9 AM. 18 Holes Ready at 4 PM.',
    primaryText:
      'Clean 57/43 Clubhouse fine pique and lightweight Tour micro-pique with crisp collars and restrained left-chest embroidery. Grab two colors (men’s or women’s) to automatically unlock $10 off + free US shipping.',
    cta: 'Shop Now',
  },
];

const CHALLENGER_BENCHMARKS = [
  {
    brand: 'Holderness & Bourne',
    earlyMove: 'Personal trunk shows + 1-to-1 letters & seeded samples to club pros / amateur finalists.',
    capitalEfficiency: 'Ultra-high: proved collar & tailgate fit before running $10k/mo digital spend.',
    whatFailed: 'Overly formal ad shots without real-course motion underperformed compared to fit closeups.',
    highDrawMove: 'Ken mails/hands 2 wholesale Size L samples ($21.50 ea) per month to regional outing chairs & buddies.',
  },
  {
    brand: 'Rhoback',
    earlyMove: 'Seeded shirts to micro-creators (<15k followers) + weekend foursome buddies instead of pro sponsorships.',
    capitalEfficiency: 'High: 1 seeded $22 shirt generated repeatable organic photos and traceable promo code sales.',
    whatFailed: 'Gifting without a unique promo code or 7-day follow-up left zero attribution visibility.',
    highDrawMove: 'Every sample logged in Outreach CRM gets a 1-click Stripe code (e.g., KEN15) + automatic 7-day Follow-Up alert.',
  },
  {
    brand: 'Primo Golf',
    earlyMove: 'Raw iPhone founder videos comparing their fabric & price directly against overpriced pro-shop staples.',
    capitalEfficiency: 'Very High: low-fi 30-second phone clips beat polished studio shoots in early Meta cold audiences.',
    whatFailed: 'Single-item cold traffic stalls around $35+ CAC when AOV stays below $60.',
    highDrawMove: 'Ad clicks route to High Draw with automatic 2-Polo Pair (-$10 + Free Ship -> $86 AOV) raising allowable CAC to ~$41.',
  },
  {
    brand: 'Criquet & Swannies',
    earlyMove: 'Targeted charity scrambles, alumni outings & member-guest tournaments with clean crest polos.',
    capitalEfficiency: 'Extreme: one closed outing yields 24–48 shirts and pushes blank orders over 100-unit wholesale tiers.',
    whatFailed: 'Chasing 200+ cold clubs blindly instead of warm personal & alumni connectors.',
    highDrawMove: 'Zero-cash outreach sprints twice weekly anchored around Ken’s Ole Miss, academic, and club networks.',
  },
];

function fmtMoney(n: number): string {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: abs % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return n < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function MarketingCommandPage({
  onNavigateBack,
  onLockSession,
}: MarketingCommandPageProps) {
  const [activeTab, setActiveTab] = useState<CommandTabId>('overview');
  const [daysWindow, setDaysWindow] = useState<number>(90);
  const [ledger, setLedger] = useState<MarketingCloudLedger>(() => {
    const local = loadLocalMarketingLedger();
    const configuredPixel = getConfiguredMetaPixelId();
    if (!local.metaPixelId && configuredPixel) {
      return { ...local, metaPixelId: configuredPixel };
    }
    return local;
  });
  const [overview, setOverview] = useState<MarketingOverviewResponse | null>(null);
  const [funnelCounters, setFunnelCounters] = useState<LocalFunnelCounters>(() =>
    readLocalFunnelCounters()
  );
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [syncStatus, setSyncStatus] = useState<
    'idle' | 'syncing' | 'synced' | 'offline' | 'error'
  >('idle');
  const [cloudRevision, setCloudRevision] = useState<number>(0);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [hoveredStateInfo, setHoveredStateInfo] = useState<string>(
    'Hover a state to inspect Stripe orders, units, and seeded outreach leads.'
  );
  const [copiedId, setCopiedId] = useState<string>('');
  const [renderNowMs] = useState<number>(() => Date.now());

  // Experiment creation form state
  const [showNewExpForm, setShowNewExpForm] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpChannel, setNewExpChannel] = useState<ExperimentChannel>('Facebook / Meta Ads');
  const [newExpCampaign, setNewExpCampaign] = useState('fb_m1_test');
  const [newExpPromo, setNewExpPromo] = useState('');
  const [newExpCash, setNewExpCash] = useState('50');
  const [newExpSeeded, setNewExpSeeded] = useState('0');
  const [newExpHours, setNewExpHours] = useState('1.5');
  const [newExpHypothesis, setNewExpHypothesis] = useState('');
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // Outreach lead creation form state
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadOrg, setNewLeadOrg] = useState('');
  const [newLeadCity, setNewLeadCity] = useState('');
  const [newLeadState, setNewLeadState] = useState('MS');
  const [newLeadCategory, setNewLeadCategory] =
    useState<OutreachLeadCategory>('Charity Scramble');
  const [newLeadUnits, setNewLeadUnits] = useState('24');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // UTM / QR Studio state
  const [utmSource, setUtmSource] = useState('facebook');
  const [utmMedium, setUtmMedium] = useState('paid_social');
  const [utmCampaign, setUtmCampaign] = useState('fb_m1_pair86');
  const [utmContent, setUtmContent] = useState('ad_pair_86');
  const [utmRef, setUtmRef] = useState('KEN15');
  const [utmLanding, setUtmLanding] = useState('/');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Stripe Promo Code minter state
  const [promoCodeInput, setPromoCodeInput] = useState('KEN15');
  const [promoType, setPromoType] = useState<'percent' | 'amount'>('percent');
  const [promoValue, setPromoValue] = useState('15');
  const [promoMinOrder, setPromoMinOrder] = useState('80');
  const [promoChannel, setPromoChannel] = useState('Tournament & Outing Outreach');
  const [promoStatusMsg, setPromoStatusMsg] = useState('');
  const [isMintingPromo, setIsMintingPromo] = useState(false);

  // Pixel input state
  const [pixelDraft, setPixelDraft] = useState<string>(() => ledger.metaPixelId || '');

  const tabRefs = useRef<Record<CommandTabId, HTMLButtonElement | null>>({
    overview: null,
    experiments: null,
    outreach: null,
    studio: null,
    playbook: null,
  });
  const syncTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pushLedgerToCloud = useCallback(async (nextLedger: MarketingCloudLedger) => {
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/marketing?action=sync-ledger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getOwnerApiHeaders(),
        },
        body: JSON.stringify({ ledger: nextLedger }),
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 503) {
          setSyncStatus('offline');
          setSyncMessage('Saved locally on this browser (Stripe Cloud Sync active on live Vercel).');
          return;
        }
        const errData = await res.json().catch(() => ({}));
        setSyncStatus('error');
        setSyncMessage(errData.error || 'Could not sync ledger to cloud.');
        return;
      }

      const data = await res.json();
      setCloudRevision(Number(data.revision) || 1);
      setSyncStatus('synced');
      setSyncMessage(`Synced Rev #${Number(data.revision) || 1} to Stripe Cloud`);
    } catch {
      setSyncStatus('offline');
      setSyncMessage('Saved locally on this device (connect on live site to sync).');
    }
  }, []);

  const updateLedger = useCallback(
    (updater: (prev: MarketingCloudLedger) => MarketingCloudLedger) => {
      setLedger((prev) => {
        const next = {
          ...updater(prev),
          updatedAt: new Date().toISOString(),
        };
        saveLocalMarketingLedger(next);
        if (syncTimerRef.current) {
          window.clearTimeout(syncTimerRef.current);
        }
        syncTimerRef.current = window.setTimeout(() => {
          void pushLedgerToCloud(next);
        }, 900);
        return next;
      });
    },
    [pushLedgerToCloud]
  );

  const fetchOverview = useCallback(async () => {
    setIsLoadingOverview(true);
    setFunnelCounters(readLocalFunnelCounters());
    try {
      const res = await fetch(`/api/marketing?action=overview&days=${daysWindow}`, {
        headers: getOwnerApiHeaders(),
      });
      if (!res.ok) {
        setSyncStatus(res.status === 401 ? 'error' : 'offline');
        setSyncMessage(
          res.status === 401
            ? 'Session PIN expired. Re-lock and unlock with owner passcode.'
            : 'Showing saved local ledger (live Stripe telemetry connects on Vercel).'
        );
        setIsLoadingOverview(false);
        return;
      }
      const data = (await res.json()) as MarketingOverviewResponse;
      setOverview(data);
      if (data.cloudSync?.available) {
        setCloudRevision(data.cloudSync.revision || 0);
        if (data.cloudSync.ledger) {
          const cloudNormalized = normalizeCloudLedger(data.cloudSync.ledger);
          setLedger((localPrev) => {
            const cloudTime = Date.parse(cloudNormalized.updatedAt || '');
            const localTime = Date.parse(localPrev.updatedAt || '');
            if (cloudTime > localTime) {
              saveLocalMarketingLedger(cloudNormalized);
              if (cloudNormalized.metaPixelId) {
                setConfiguredMetaPixelId(cloudNormalized.metaPixelId);
                setPixelDraft(cloudNormalized.metaPixelId);
              }
              return cloudNormalized;
            }
            return localPrev;
          });
        }
        setSyncStatus('synced');
        setSyncMessage(
          data.cloudSync.revision > 0
            ? `Cloud Synced · Rev #${data.cloudSync.revision}`
            : 'Cloud Sync Connected (Ready)'
        );
      } else {
        setSyncStatus('offline');
        setSyncMessage('Stripe secret key not active in local preview — local ledger mode active.');
      }
    } catch {
      setSyncStatus('offline');
      setSyncMessage('Offline / Preview Mode — edits auto-saved locally.');
    } finally {
      setIsLoadingOverview(false);
    }
  }, [daysWindow]);

  useEffect(() => {
    void fetchOverview();
    return () => {
      if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
    };
  }, [fetchOverview]);

  const dataset = useMemo(() => buildDashboardDataset(overview, ledger), [overview, ledger]);
  const budgetPlan = useMemo(
    () => computeBudgetAllocation(ledger.monthlyBudgetDollars),
    [ledger.monthlyBudgetDollars]
  );

  const trackedUrl = useMemo(
    () =>
      buildTrackedMarketingUrl({
        landingPath: utmLanding,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        refCode: utmRef,
      }),
    [utmLanding, utmSource, utmMedium, utmCampaign, utmContent, utmRef]
  );

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(trackedUrl, {
      width: 560,
      margin: 2,
      color: { dark: '#1C2C24', light: '#FFFFFF' },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [trackedUrl]);

  const handleTabSelect = (id: CommandTabId) => {
    setActiveTab(id);
    tabRefs.current[id]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = TABS.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      const targetTab = TABS[nextIdx];
      handleTabSelect(targetTab.id);
      tabRefs.current[targetTab.id]?.focus();
    }
  };

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(''), 1800);
    } catch {
      // ignore clipboard restrictions
    }
  };

  const handleSavePixelId = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = setConfiguredMetaPixelId(pixelDraft);
    setPixelDraft(cleaned);
    updateLedger((prev) => ({
      ...prev,
      metaPixelId: cleaned,
    }));
  };

  const handleCreateExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim()) return;
    const exp: MarketingExperiment = {
      id: `exp-${Date.now().toString(36)}`,
      title: newExpTitle.trim(),
      channel: newExpChannel,
      status: 'running',
      landingPath: '/',
      utmCampaign: newExpCampaign.trim() || 'custom_test',
      utmContent: '',
      promoCode: newExpPromo.trim().toUpperCase(),
      hypothesis: newExpHypothesis.trim() || 'Testing paid or outreach offer hook.',
      cashSpentDollars: Number(newExpCash) || 0,
      seededShirts: Number(newExpSeeded) || 0,
      hoursSpent: Number(newExpHours) || 0,
      manualClicks: 0,
      manualOrders: 0,
      manualRevenueDollars: 0,
      manualUnits: 0,
      lastTouchedAt: new Date().toISOString().slice(0, 10),
      lessonLearned: '',
      nextAdjustment: '',
    };
    updateLedger((prev) => ({
      ...prev,
      experiments: [exp, ...prev.experiments],
    }));
    setNewExpTitle('');
    setNewExpHypothesis('');
    setShowNewExpForm(false);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadOrg.trim()) return;
    const lead: OutreachLead = {
      id: `lead-${Date.now().toString(36)}`,
      name: newLeadName.trim(),
      organization: newLeadOrg.trim(),
      city: newLeadCity.trim() || 'Local',
      stateCode: newLeadState.trim().toUpperCase().slice(0, 2) || 'MS',
      category: newLeadCategory,
      stage: 'Lead',
      estimatedUnits: Number(newLeadUnits) || 12,
      seededCostDollars: 0,
      notes: newLeadNotes.trim(),
      updatedAt: new Date().toISOString(),
    };
    updateLedger((prev) => ({
      ...prev,
      outreachLeads: [lead, ...prev.outreachLeads],
    }));
    setNewLeadName('');
    setNewLeadOrg('');
    setNewLeadCity('');
    setNewLeadNotes('');
    setShowNewLeadForm(false);
  };

  const handleMintPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (code.length < 3) {
      setPromoStatusMsg('Enter at least 3 alphanumeric characters.');
      return;
    }
    setIsMintingPromo(true);
    setPromoStatusMsg('');
    try {
      const res = await fetch('/api/marketing?action=create-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getOwnerApiHeaders(),
        },
        body: JSON.stringify({
          code,
          discountType: promoType,
          discountValue: Number(promoValue),
          minOrderDollars: Number(promoMinOrder) || 0,
          channel: promoChannel,
          campaign: utmCampaign,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoStatusMsg(data.error || 'Could not create Stripe promotion code.');
      } else {
        setPromoStatusMsg(
          `Minted Stripe code ${data.promo?.code || code} (${data.promo?.discountLabel || ''}).`
        );
        void fetchOverview();
      }
    } catch {
      setPromoStatusMsg('Connect on live Vercel deployment with Stripe key to mint live codes.');
    } finally {
      setIsMintingPromo(false);
    }
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(ledger, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `highdraw-marketing-ledger-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = normalizeCloudLedger(JSON.parse(text) as Partial<MarketingCloudLedger>);
      updateLedger(() => parsed);
      setSyncMessage('Imported JSON ledger backup and queued sync.');
    } catch {
      setSyncMessage('Invalid JSON ledger file.');
    }
    e.target.value = '';
  };

  // Combine Stripe state counts + CRM outreach counts for US Map
  const stateHeatData = useMemo(() => {
    const map: Record<
      string,
      { orders: number; units: number; revenueDollars: number; outreachCount: number }
    > = {};
    const rawCounts = overview?.stateCounts || {};
    for (const [code, val] of Object.entries(rawCounts)) {
      map[code] = { ...val, outreachCount: 0 };
    }
    for (const lead of ledger.outreachLeads) {
      const code = lead.stateCode.toUpperCase();
      if (!code) continue;
      if (!map[code]) {
        map[code] = { orders: 0, units: 0, revenueDollars: 0, outreachCount: 0 };
      }
      map[code].outreachCount += 1;
    }
    return map;
  }, [overview, ledger.outreachLeads]);

  const totalWeeklyChecklistHours = useMemo(
    () => ledger.weeklyChecklist.reduce((s, item) => s + item.targetHours, 0),
    [ledger.weeklyChecklist]
  );

  const paidOrdersCount = Math.max(dataset.kpis.totalOrders, funnelCounters.purchase);
  const funnelSteps = [
    { label: 'Storefront Visits', count: funnelCounters.page_views, note: 'All sessions' },
    { label: 'Product Detail Views', count: funnelCounters.view_item, note: 'Intent signal' },
    { label: 'Added to Bag', count: funnelCounters.add_to_cart, note: 'Target > 6%' },
    { label: 'Started Checkout', count: funnelCounters.begin_checkout, note: 'Stripe handoff' },
    { label: 'Paid Orders (Stripe)', count: paidOrdersCount, note: 'Confirmed fulfillment' },
  ];

  const { kpis } = dataset;

  return (
    <div className="min-h-screen bg-[#f4f5f3] text-slate-900">
      {/* Top Executive Bar */}
      <header className="sticky top-0 z-30 bg-[#1C2C24] text-white border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Storefront</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold tracking-wide">
                  High Draw Marketing Command Center
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  Start-Small OS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Zero-Cost Stripe Cloud Ledger &bull; Month 1 Target: {fmtMoney(ledger.monthlyBudgetDollars)}/mo
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Cloud Sync Status Pill */}
            <button
              type="button"
              onClick={() => void pushLedgerToCloud(ledger)}
              title={syncMessage}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-mono font-bold border transition-colors ${
                syncStatus === 'synced'
                  ? 'bg-emerald-950/60 border-emerald-400/40 text-emerald-200'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-950/60 border-amber-400/40 text-amber-200'
                  : syncStatus === 'error'
                  ? 'bg-rose-950/60 border-rose-400/40 text-rose-200'
                  : 'bg-slate-800 border-slate-600 text-slate-200'
              }`}
            >
              {syncStatus === 'synced' ? (
                <Cloud size={13} className="text-emerald-300" />
              ) : syncStatus === 'syncing' ? (
                <RefreshCw size={13} className="animate-spin text-amber-300" />
              ) : (
                <CloudOff size={13} className="text-slate-300" />
              )}
              <span>
                {syncStatus === 'synced'
                  ? `Cloud Synced · Rev #${cloudRevision}`
                  : syncStatus === 'syncing'
                  ? 'Syncing...'
                  : 'Sync Cloud'}
              </span>
            </button>

            {/* Timeframe Selector */}
            <div className="inline-flex rounded-sm border border-white/20 overflow-hidden text-[11px] font-mono">
              {[30, 90, 365].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDaysWindow(d)}
                  className={`px-2.5 py-1.5 font-bold transition-colors ${
                    daysWindow === d
                      ? 'bg-[#D9A726] text-[#1C2C24]'
                      : 'bg-transparent text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {d === 365 ? 'All' : `${d}d`}
                </button>
              ))}
            </div>

            {/* Download Executive PDF */}
            <a
              href="/High_Draw_Start_Small_Marketing_Playbook_Colon_Hyphen_Bracket.pdf"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#FDE022] hover:bg-yellow-300 text-[#1C2C24] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <FileDown size={14} />
              <span>Download PDF (For Ken)</span>
            </a>

            <button
              type="button"
              onClick={onLockSession}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-white/10 hover:bg-rose-700 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Lock size={13} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>

        {/* Accessible Single-Row Tab Strip */}
        <div className="bg-white text-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Marketing Command Center Views"
              className="hd-tabs-strip flex-1"
            >
              {TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => handleTabSelect(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-2 py-1.5">
              <button
                type="button"
                onClick={() => void fetchOverview()}
                className="text-[11px] font-mono text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-200"
              >
                <RefreshCw size={12} className={isLoadingOverview ? 'animate-spin' : ''} />
                <span>Refresh Telemetry</span>
              </button>
              <button
                type="button"
                onClick={handleExportBackup}
                className="text-[11px] font-mono text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-200"
              >
                <Download size={12} />
                <span>Export JSON</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-mono text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-200"
              >
                <Upload size={12} />
                <span>Import</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {syncMessage && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-600 font-mono">
            <span>
              <strong className="text-slate-800">Sync Ledger:</strong> {syncMessage}
            </span>
            <button
              type="button"
              onClick={() => {
                const defaults = createDefaultMarketingLedger();
                updateLedger(() => defaults);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline"
            >
              Reset Starter Playbook Rows
            </button>
          </div>
        )}

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        <section role="tabpanel" hidden={activeTab !== 'overview'} className="space-y-6">
          {/* Sunday CFO Digest + 100-Shirt Milestone */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-[#0b4628]" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#1C2C24]">
                    Sunday 15-Minute CFO Digest (What Needs Action Now)
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Deterministic Rules Engine
                </span>
              </div>
              <ul className="space-y-2">
                {dataset.digestActions.map((action, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-[#f8fafc] border-l-4 border-[#1C2C24] text-sm text-slate-800"
                  >
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1C2C24] text-white rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300">
                  Scale Unlock Milestone
                </span>
                <h2 className="text-lg font-serif font-bold mt-1">
                  Road to 100 Shirts Sold
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Reaching {HUNDRED_SHIRT_MILESTONE} total shirts unlocks wholesale blank pricing + custom
                  woven High Draw neck labels (+$6.00 extra gross margin per shirt).
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
                  <span className="text-lg font-bold text-[#FDE022]">
                    {kpis.totalUnitsAllTime} / {kpis.milestoneTargetUnits} shirts
                  </span>
                  <span>{kpis.milestonePct}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full bg-[#FDE022] transition-all duration-500"
                    style={{ width: `${kpis.milestonePct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 6 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Gross Revenue ({daysWindow}d)
              </div>
              <div className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {fmtMoney(kpis.grossRevenue)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {kpis.totalOrders} orders &bull; {kpis.windowUnits} shirts
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Margin Before Ads (CM1)
              </div>
              <div className="text-2xl font-serif font-bold text-[#0b4628] mt-1">
                {fmtMoney(kpis.cm1BeforeMarketing)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                After Printify COGS + Stripe
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Marketing Outlay
              </div>
              <div className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {fmtMoney(kpis.totalMarketingOutlay)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Ads + {fmtMoney(WHOLESALE_SAMPLE_SHIRT_COST)} samples
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Net Cash After Mktg
              </div>
              <div
                className={`text-2xl font-serif font-bold mt-1 ${
                  kpis.netProfitAfterMarketing >= 0 ? 'text-emerald-700' : 'text-[#B12535]'
                }`}
              >
                {fmtMoney(kpis.netProfitAfterMarketing)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                CM1 minus all outlays
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Blended CAC vs Max
              </div>
              <div className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {kpis.blendedCac !== null ? fmtMoney(kpis.blendedCac) : '—'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Allowable Max: {fmtMoney(kpis.allowableCac)}/ord
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Avg Order (AOV) & MER
              </div>
              <div className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {kpis.aov > 0 ? fmtMoney(kpis.aov) : '$86 Target'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                MER: {kpis.mer !== null ? `${kpis.mer}x` : 'N/A'} (Target &ge; 2.5x)
              </div>
            </div>
          </div>

          {/* Primary Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 hd-panel-contain">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Weekly Revenue, Marketing Outlay & Net Cash
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live Stripe orders grouped by Monday week-start vs logged experiment outlays.
                  </p>
                </div>
                <TrendingUp size={18} className="text-[#0b4628]" />
              </div>
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dataset.weeklySeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      formatter={(val) => [`$${Number(val || 0).toFixed(2)}`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <ReferenceLine y={0} stroke="#64748b" />
                    <Bar dataKey="revenue" name="Gross Sales ($)" fill="#1C2C24" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spend" name="Mktg Outlay ($)" fill="#D9A726" radius={[4, 4, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="netProfit"
                      name="Net Cash ($)"
                      stroke="#059669"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Contribution Waterfall ({daysWindow}d)
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Gross sales minus Printify blanks, postage, Stripe fees & marketing spend.
              </p>
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataset.waterfallData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <YAxis type="category" dataKey="step" width={88} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val) => [`$${Number(val || 0).toFixed(2)}`, 'Amount']}
                    />
                    <ReferenceLine x={0} stroke="#475569" />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                      {dataset.waterfallData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Channel CAC & Storefront Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 hd-panel-contain">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Channel Actual CAC vs. Allowable Margin Ceiling
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Green line ($46) shows max allowable CAC per average 2-Polo Pair order.
              </p>
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataset.channelBars}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="channel" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(val) => [`$${Number(val || 0).toFixed(2)}`, '']} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <ReferenceLine y={46} stroke="#059669" strokeDasharray="4 4" label="$46 Max" />
                    <Bar dataKey="actualCac" name="Actual CAC / Outlay" fill="#B12535" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" name="Attributed Sales ($)" fill="#1C2C24" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Live Storefront Conversion Funnel
                </h3>
                <p className="text-xs text-slate-500">
                  Combines on-site GA4 / Meta Pixel telemetry steps with verified Stripe paid orders.
                </p>
              </div>
              <div className="space-y-3">
                {funnelSteps.map((step, i) => {
                  const maxBase = Math.max(1, funnelSteps[0].count, paidOrdersCount);
                  const pct = Math.min(100, Math.round((step.count / maxBase) * 100));
                  return (
                    <div key={step.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800">
                          {i + 1}. {step.label}
                        </span>
                        <span className="font-mono text-slate-600">
                          <strong>{step.count}</strong> &bull; {step.note}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#0b4628] rounded-full transition-all"
                          style={{ width: `${Math.max(step.count > 0 ? 6 : 0, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* TAB 2: WHAT'S TRIED & VERDICTS */}
        <section role="tabpanel" hidden={activeTab !== 'experiments'} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 hd-panel-contain">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Experiment ROI Quadrant (Outlay vs. Net Cash Contributed)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Top-left = capital-efficient winners (SCALE). Bottom-right = cash bleeders (KILL).
                  </p>
                </div>
              </div>
              <div className="h-80 w-full min-w-0">
                {dataset.scatterSeries.length > 0 ? (
                  <ResponsiveScatterPlot
                    data={dataset.scatterSeries}
                    margin={{ top: 24, right: 28, bottom: 56, left: 68 }}
                    xScale={{ type: 'linear', min: 0, max: 'auto' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                    blendMode="normal"
                    colors={(node) => SCATTER_COLORS[String(node.serieId)] || '#1C2C24'}
                    nodeSize={14}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      legend: 'Total Experiment Outlay ($ Cash + Sample COGS)',
                      legendPosition: 'middle',
                      legendOffset: 42,
                      format: (v) => `$${v}`,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      legend: 'Net Cash Profit ($)',
                      legendPosition: 'middle',
                      legendOffset: -54,
                      format: (v) => `$${v}`,
                    }}
                    legends={[
                      {
                        anchor: 'top-right',
                        direction: 'row',
                        translateY: -22,
                        itemWidth: 74,
                        itemHeight: 16,
                        symbolSize: 10,
                      },
                    ]}
                    tooltip={({ node }) => (
                      <div className="bg-white border border-slate-300 shadow-lg rounded-md px-3 py-2 text-xs">
                        <div className="font-bold text-slate-900">
                          {String((node.data as { title?: string }).title || node.serieId)}
                        </div>
                        <div className="font-mono text-slate-600 mt-0.5">
                          Outlay: ${node.data.x} &bull; Net Profit: ${node.data.y}
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    Log an experiment below to populate the ROI scatter plot.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Automated CFO Verdict Rules
                </h3>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="p-2.5 rounded border border-emerald-200 bg-emerald-50">
                    <strong className="text-emerald-900">SCALE:</strong> &ge;3 orders, positive net cash, and CAC &le; 85% of margin ceiling.
                  </div>
                  <div className="p-2.5 rounded border border-amber-200 bg-amber-50">
                    <strong className="text-amber-900">ITERATE:</strong> 40+ clicks with 0 orders, or 1–2 orders under $75 AOV (push 2-Polo Pair).
                  </div>
                  <div className="p-2.5 rounded border border-sky-200 bg-sky-50">
                    <strong className="text-sky-900">FOLLOW_UP:</strong> Seeded sample(s) sent &ge;7 days ago with zero order logged yet.
                  </div>
                  <div className="p-2.5 rounded border border-rose-200 bg-rose-50">
                    <strong className="text-rose-900">KILL:</strong> &ge;$75 spent with 0 orders, or negative profit after &ge;2 orders.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewExpForm((s) => !s)}
                className="w-full py-2.5 px-4 rounded-md bg-[#1C2C24] hover:bg-[#142019] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                <span>{showNewExpForm ? 'Hide Experiment Form' : 'Log New Experiment'}</span>
              </button>
            </div>
          </div>

          {/* Add Experiment Form */}
          {showNewExpForm && (
            <form
              onSubmit={handleCreateExperiment}
              className="bg-white border-2 border-[#1C2C24] rounded-xl p-5 space-y-4"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C2C24]">
                Log New Marketing Test
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <label className="text-xs font-semibold text-slate-700">
                  Experiment Title*
                  <input
                    required
                    value={newExpTitle}
                    onChange={(e) => setNewExpTitle(e.target.value)}
                    placeholder="e.g., FB Ad B — Founder Fit Video"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Channel
                  <select
                    value={newExpChannel}
                    onChange={(e) => setNewExpChannel(e.target.value as ExperimentChannel)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  >
                    {CHANNELS.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  UTM Campaign Key
                  <input
                    value={newExpCampaign}
                    onChange={(e) => setNewExpCampaign(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Promo Code (Optional)
                  <input
                    value={newExpPromo}
                    onChange={(e) => setNewExpPromo(e.target.value.toUpperCase())}
                    placeholder="KEN15"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono uppercase"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Ad Cash Spent ($)
                  <input
                    type="number"
                    min="0"
                    value={newExpCash}
                    onChange={(e) => setNewExpCash(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Seeded Shirts (# @ $21.50)
                  <input
                    type="number"
                    min="0"
                    value={newExpSeeded}
                    onChange={(e) => setNewExpSeeded(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Hours Invested
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newExpHours}
                    onChange={(e) => setNewExpHours(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Hypothesis
                  <input
                    value={newExpHypothesis}
                    onChange={(e) => setNewExpHypothesis(e.target.value)}
                    placeholder="What should happen?"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewExpForm(false)}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#1C2C24] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save & Sync Experiment
                </button>
              </div>
            </form>
          )}

          {/* Experiments Table */}
          <div className="space-y-2 hd-panel-contain">
            <h3 id="exp-table-heading" className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Experiment Ledger &amp; Diagnosis
            </h3>
            <div tabIndex={0} role="region" aria-labelledby="exp-table-heading" className="hd-table-wrapper">
              <table className="hd-table">
                <thead>
                  <tr>
                    <th scope="col">Experiment &amp; Channel</th>
                    <th scope="col">Status</th>
                    <th scope="col">Verdict</th>
                    <th scope="col">Outlay</th>
                    <th scope="col">Orders / Sales</th>
                    <th scope="col">CAC / Max</th>
                    <th scope="col">Diagnosis &amp; What We Learned</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.evaluatedExperiments.map((exp) => (
                    <tr key={exp.id}>
                      <th scope="row">
                        <div className="text-slate-900">{exp.title}</div>
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                          {exp.channel} &bull; <code className="font-mono">{exp.utmCampaign}</code>
                          {exp.promoCode ? ` / ${exp.promoCode}` : ''}
                        </div>
                      </th>
                      <td data-label="Status">
                        <select
                          value={exp.status}
                          aria-label={`Status for ${exp.title}`}
                          onChange={(e) => {
                            const nextStatus = e.target.value as ExperimentStatus;
                            updateLedger((prev) => ({
                              ...prev,
                              experiments: prev.experiments.map((item) =>
                                item.id === exp.id ? { ...item, status: nextStatus } : item
                              ),
                            }));
                          }}
                          className="px-2 py-1 border border-slate-300 rounded text-xs bg-white font-semibold"
                        >
                          {EXPERIMENT_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td data-label="Verdict">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-mono font-bold rounded border ${VERDICT_BADGE_MAP[exp.verdict]}`}
                        >
                          {exp.verdict}
                        </span>
                      </td>
                      <td data-label="Outlay" className="font-mono text-xs">
                        <div>{fmtMoney(exp.totalOutlayDollars)}</div>
                        <div className="text-[11px] text-slate-500">
                          Cash ${exp.cashSpentDollars} + {exp.seededShirts} shirts
                        </div>
                      </td>
                      <td data-label="Orders / Sales" className="font-mono text-xs">
                        <div>
                          {exp.attributedOrders} ord / {fmtMoney(exp.attributedRevenueDollars)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {exp.manualClicks} clicks &bull; {exp.roas}x ROAS
                        </div>
                      </td>
                      <td data-label="CAC / Max" className="font-mono text-xs">
                        <div>
                          {exp.actualCacDollars !== null ? fmtMoney(exp.actualCacDollars) : '—'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Max {fmtMoney(exp.allowableCacDollars)}
                        </div>
                      </td>
                      <td data-label="Diagnosis">
                        <div className="text-xs text-slate-800">{exp.verdictReason}</div>
                        {editingExpId === exp.id ? (
                          <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              <label className="text-[11px] font-mono">
                                Cash ($)
                                <input
                                  type="number"
                                  value={exp.cashSpentDollars}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 0;
                                    updateLedger((prev) => ({
                                      ...prev,
                                      experiments: prev.experiments.map((item) =>
                                        item.id === exp.id ? { ...item, cashSpentDollars: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full px-2 py-1 border rounded bg-white"
                                />
                              </label>
                              <label className="text-[11px] font-mono">
                                Clicks
                                <input
                                  type="number"
                                  value={exp.manualClicks}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 0;
                                    updateLedger((prev) => ({
                                      ...prev,
                                      experiments: prev.experiments.map((item) =>
                                        item.id === exp.id ? { ...item, manualClicks: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full px-2 py-1 border rounded bg-white"
                                />
                              </label>
                              <label className="text-[11px] font-mono">
                                Samples (#)
                                <input
                                  type="number"
                                  value={exp.seededShirts}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 0;
                                    updateLedger((prev) => ({
                                      ...prev,
                                      experiments: prev.experiments.map((item) =>
                                        item.id === exp.id ? { ...item, seededShirts: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full px-2 py-1 border rounded bg-white"
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={exp.lessonLearned}
                              placeholder="What worked / what to change next..."
                              onChange={(e) => {
                                const val = e.target.value;
                                updateLedger((prev) => ({
                                  ...prev,
                                  experiments: prev.experiments.map((item) =>
                                    item.id === exp.id ? { ...item, lessonLearned: val } : item
                                  ),
                                }));
                              }}
                              className="w-full px-2 py-1 text-xs border rounded bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => setEditingExpId(null)}
                              className="text-[11px] font-bold text-[#0b4628] underline"
                            >
                              Done Editing
                            </button>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-3">
                            {exp.lessonLearned && (
                              <span className="text-[11px] text-slate-500 italic">
                                Note: {exp.lessonLearned}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setEditingExpId(exp.id)}
                              className="text-[11px] font-bold text-[#0b4628] underline"
                            >
                              Edit Metrics / Notes
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TAB 3: OUTREACH CRM & US DEMAND MAP */}
        <section role="tabpanel" hidden={activeTab !== 'outreach'} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 hd-panel-contain">
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    US Customer Demand &amp; Seeding Footprint Map
                  </h2>
                  <p className="text-xs text-slate-500">
                    Combines Stripe verified shipping states + local founder seeding pins.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
                  {hoveredStateInfo}
                </span>
              </div>

              <div className="w-full overflow-hidden rounded-lg bg-[#f8fafc] border border-slate-200">
                <ComposableMap projection="geoAlbersUsa" width={800} height={460} className="w-full h-auto">
                  <Geographies geography={usStatesTopology as unknown as GeographiesProps['geography']}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const stateName = String((geo.properties as { name?: string })?.name || '');
                        const code = STATE_NAME_TO_CODE[stateName] || '';
                        const stats = stateHeatData[code];
                        const heat = (stats?.orders || 0) * 3 + (stats?.outreachCount || 0);
                        const fill =
                          heat >= 6
                            ? '#0b4628'
                            : heat >= 3
                            ? '#2f6f4e'
                            : heat >= 1
                            ? '#a7d7bc'
                            : '#e2e8f0';
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fill}
                            stroke="#ffffff"
                            strokeWidth={0.8}
                            onMouseEnter={() => {
                              setHoveredStateInfo(
                                stats
                                  ? `${stateName} (${code}): ${stats.orders} Stripe orders (${stats.units} shirts, $${stats.revenueDollars.toFixed(
                                      0
                                    )}) · ${stats.outreachCount} outreach leads`
                                  : `${stateName} (${code}): 0 orders logged yet`
                              );
                            }}
                            style={{ cursor: 'pointer', transition: 'fill 150ms ease' }}
                          />
                        );
                      })
                    }
                  </Geographies>
                  <Marker coordinates={[-89.5192, 34.3665]}>
                    <circle r={6} fill="#D9A726" stroke="#1C2C24" strokeWidth={2} />
                    <text
                      textAnchor="middle"
                      y={-11}
                      style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, fill: '#1C2C24' }}
                    >
                      Oxford, MS
                    </text>
                  </Marker>
                  <Marker coordinates={[-79.0558, 35.9132]}>
                    <circle r={6} fill="#B12535" stroke="#ffffff" strokeWidth={2} />
                    <text
                      textAnchor="middle"
                      y={-11}
                      style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, fill: '#1C2C24' }}
                    >
                      Chapel Hill, NC
                    </text>
                  </Marker>
                </ComposableMap>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Word-of-Mouth &amp; Sample Seeding Rules
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct outreach converts at higher AOV than cold Facebook clicks because one Size L sample
                  ($21.50 wholesale) unlocks tournament orders of 24–48 shirts.
                </p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-xl font-serif font-bold text-[#1C2C24]">
                      {ledger.outreachLeads.length}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">Active Leads</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-xl font-serif font-bold text-[#0b4628]">
                      {ledger.outreachLeads.reduce((s, l) => s + (l.estimatedUnits || 0), 0)}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">Est. Shirt Pipeline</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewLeadForm((s) => !s)}
                className="w-full py-2.5 px-4 rounded-md bg-[#1C2C24] hover:bg-[#142019] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                <span>{showNewLeadForm ? 'Hide Lead Form' : 'Add Outreach / Sample Lead'}</span>
              </button>
            </div>
          </div>

          {showNewLeadForm && (
            <form
              onSubmit={handleCreateLead}
              className="bg-white border-2 border-[#1C2C24] rounded-xl p-5 space-y-4"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C2C24]">
                Add Outing Chair, Club Connector, or Micro-Creator
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className="text-xs font-semibold text-slate-700">
                  Contact Name*
                  <input
                    required
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    placeholder="John Miller"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Club / Organization / Channel*
                  <input
                    required
                    value={newLeadOrg}
                    onChange={(e) => setNewLeadOrg(e.target.value)}
                    placeholder="Rotary Charity Scramble"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Category
                  <select
                    value={newLeadCategory}
                    onChange={(e) => setNewLeadCategory(e.target.value as OutreachLeadCategory)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  >
                    {LEAD_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  City
                  <input
                    value={newLeadCity}
                    onChange={(e) => setNewLeadCity(e.target.value)}
                    placeholder="Oxford"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  State (2-Letter)
                  <input
                    maxLength={2}
                    value={newLeadState}
                    onChange={(e) => setNewLeadState(e.target.value.toUpperCase())}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono uppercase"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Est. Shirt Potential (#)
                  <input
                    type="number"
                    min="1"
                    value={newLeadUnits}
                    onChange={(e) => setNewLeadUnits(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </label>
              </div>
              <label className="block text-xs font-semibold text-slate-700">
                Outreach Notes / Next Step
                <input
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Meeting Tuesday after morning nine; bring Navy L Tour polo sample."
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeadForm(false)}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#1C2C24] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save Lead
                </button>
              </div>
            </form>
          )}

          {/* Outreach CRM Table */}
          <div className="space-y-2 hd-panel-contain">
            <h3 id="outreach-table-heading" className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Outreach &amp; Sample Seeding CRM
            </h3>
            <div tabIndex={0} role="region" aria-labelledby="outreach-table-heading" className="hd-table-wrapper">
              <table className="hd-table">
                <thead>
                  <tr>
                    <th scope="col">Contact &amp; Organization</th>
                    <th scope="col">Location</th>
                    <th scope="col">Stage</th>
                    <th scope="col">Est. Units</th>
                    <th scope="col">Sample Action</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.outreachLeads.map((lead) => {
                    const daysSinceSample = lead.sampleShippedAt
                      ? Math.floor((renderNowMs - Date.parse(lead.sampleShippedAt)) / 86400000)
                      : 0;
                    const isOverdue =
                      lead.stage === 'Follow-Up Due' ||
                      (lead.stage === 'Sample Sent' && daysSinceSample >= 7);
                    return (
                      <tr key={lead.id} className={isOverdue ? 'bg-amber-50/70' : undefined}>
                        <th scope="row">
                          <div>{lead.name}</div>
                          <div className="text-[11px] font-normal text-slate-500">
                            {lead.organization} &bull; {lead.category}
                          </div>
                        </th>
                        <td data-label="Location" className="font-mono text-xs">
                          {lead.city}, {lead.stateCode}
                        </td>
                        <td data-label="Stage">
                          <select
                            value={lead.stage}
                            aria-label={`Stage for ${lead.name}`}
                            onChange={(e) => {
                              const nextStage = e.target.value as OutreachLeadStage;
                              updateLedger((prev) => ({
                                ...prev,
                                outreachLeads: prev.outreachLeads.map((item) =>
                                  item.id === lead.id
                                    ? { ...item, stage: nextStage, updatedAt: new Date().toISOString() }
                                    : item
                                ),
                              }));
                            }}
                            className="px-2 py-1 border border-slate-300 rounded text-xs bg-white font-semibold"
                          >
                            {LEAD_STAGES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          {isOverdue && (
                            <div className="text-[11px] font-bold text-amber-800 mt-1 inline-flex items-center gap-1">
                              <ShieldAlert size={12} />
                              <span>7-Day Follow-Up Due!</span>
                            </div>
                          )}
                        </td>
                        <td data-label="Est. Units" className="font-mono text-xs">
                          {lead.estimatedUnits} shirts
                        </td>
                        <td data-label="Sample Action">
                          {lead.sampleShippedAt ? (
                            <span className="text-[11px] font-mono text-slate-600">
                              Sent {lead.sampleShippedAt.slice(0, 10)} (${lead.seededCostDollars})
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateLedger((prev) => ({
                                  ...prev,
                                  outreachLeads: prev.outreachLeads.map((item) =>
                                    item.id === lead.id
                                      ? {
                                          ...item,
                                          stage: 'Sample Sent',
                                          sampleShippedAt: new Date().toISOString(),
                                          seededCostDollars: WHOLESALE_SAMPLE_SHIRT_COST,
                                          updatedAt: new Date().toISOString(),
                                        }
                                      : item
                                  ),
                                }));
                              }}
                              className="px-2.5 py-1 rounded border border-[#1C2C24] text-[#1C2C24] hover:bg-[#1C2C24] hover:text-white text-[11px] font-bold"
                            >
                              Mark Sample Sent ($21.50)
                            </button>
                          )}
                        </td>
                        <td data-label="Notes" className="text-xs text-slate-700">
                          {lead.notes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TAB 4: FB ADS, PIXEL & QR / PROMO STUDIO */}
        <section role="tabpanel" hidden={activeTab !== 'studio'} className="space-y-6">
          {/* Meta Pixel + Month 1 Facebook Campaign Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    1. Connect Meta (Facebook) Pixel
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    High Draw already fires PageView, ViewContent, AddToCart, InitiateCheckout &amp; Purchase once saved.
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                    isValidMetaPixelId(ledger.metaPixelId)
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {isValidMetaPixelId(ledger.metaPixelId) ? 'Pixel Armed' : 'Pending Pixel ID'}
                </span>
              </div>

              <form onSubmit={handleSavePixelId} className="flex gap-2">
                <input
                  value={pixelDraft}
                  onChange={(e) => setPixelDraft(e.target.value)}
                  placeholder="Enter 15-16 digit Meta Pixel / Dataset ID"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md font-mono text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#1C2C24] hover:bg-[#142019] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save &amp; Sync Pixel
                </button>
              </form>

              <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <div className="font-bold text-slate-900">Exact Month 1 Facebook Ads Manager Setup ($150 Test):</div>
                <div>&bull; <strong>Objective:</strong> Sales &rarr; Website &rarr; <strong>Purchase</strong> event (NEVER click &ldquo;Boost Post&rdquo;).</div>
                <div>&bull; <strong>Budget:</strong> 1 Campaign CBO at <strong>$10/day for 15 consecutive days ($150)</strong>.</div>
                <div>&bull; <strong>Audience:</strong> United States, Age 35–65+, Broad Golf / Country Club / PGA interest.</div>
                <div>&bull; <strong>Placements:</strong> Manual / Advantage+ Feeds &amp; Reels <strong>with Audience Network UNCHECKED</strong>.</div>
              </div>
            </div>

            {/* 1-Click Stripe Promo Code Minter */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Tag size={17} className="text-[#0b4628]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  2. Mint Traceable Stripe Promo Code
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Creates a live Promotion Code usable directly inside Stripe Checkout (`allow_promotion_codes` is enabled).
              </p>

              <form onSubmit={handleMintPromoCode} className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Code
                    <input
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="mt-1 w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs uppercase"
                    />
                  </label>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Type
                    <select
                      value={promoType}
                      onChange={(e) => setPromoType(e.target.value as 'percent' | 'amount')}
                      className="mt-1 w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                    >
                      <option value="percent">% Off</option>
                      <option value="amount">$ Off</option>
                    </select>
                  </label>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Value
                    <input
                      type="number"
                      min="1"
                      value={promoValue}
                      onChange={(e) => setPromoValue(e.target.value)}
                      className="mt-1 w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                    />
                  </label>
                  <label className="text-[11px] font-semibold text-slate-700">
                    Min Order ($)
                    <input
                      type="number"
                      min="0"
                      value={promoMinOrder}
                      onChange={(e) => setPromoMinOrder(e.target.value)}
                      className="mt-1 w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <select
                    value={promoChannel}
                    onChange={(e) => setPromoChannel(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    {CHANNELS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={isMintingPromo}
                    className="px-4 py-2 rounded-md bg-[#1C2C24] hover:bg-[#142019] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-60"
                  >
                    {isMintingPromo ? 'Minting...' : 'Create Live Stripe Code'}
                  </button>
                </div>
                {promoStatusMsg && (
                  <p className="text-xs font-mono text-[#0b4628] bg-emerald-50 border border-emerald-200 px-3 py-2 rounded">
                    {promoStatusMsg}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* 3 Copy-Paste Facebook Ads Creatives */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              3 Ready-to-Paste Month 1 Facebook Ad Creatives
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {FB_AD_ANGLES.map((ad) => (
                <div key={ad.id} className="p-4 rounded-lg border border-slate-200 bg-[#f8fafc] flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#1C2C24]">{ad.label}</div>
                    <div className="text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                      Headline: {ad.headline}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{ad.primaryText}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setUtmCampaign('fb_m1_pair86');
                        setUtmContent(ad.utmContent);
                      }}
                      className="text-[11px] font-mono font-bold text-[#0b4628] underline"
                    >
                      Load UTM Link Below
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyText(ad.id, `${ad.headline}\n\n${ad.primaryText}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1C2C24] text-white text-[11px] font-bold"
                    >
                      <Copy size={12} />
                      <span>{copiedId === ad.id ? 'Copied!' : 'Copy Ad Copy'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UTM Link Builder + 300-DPI QR Code Card Generator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-[#0b4628]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  UTM Link &amp; Bag-Tag QR Code Generator
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="text-xs font-semibold text-slate-700">
                  Source
                  <input
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Medium
                  <input
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Campaign
                  <input
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Ad / Creative (`utm_content`)
                  <input
                    value={utmContent}
                    onChange={(e) => setUtmContent(e.target.value)}
                    className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Ref Code (`ref`)
                  <input
                    value={utmRef}
                    onChange={(e) => setUtmRef(e.target.value.toUpperCase())}
                    className="mt-1 w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs uppercase"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Destination Path
                  <select
                    value={utmLanding}
                    onChange={(e) => setUtmLanding(e.target.value)}
                    className="mt-1 w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="/">Home (All Collection + Pair Hero)</option>
                    <option value="/products/mens-tour-performance-polo">Men&apos;s Tour Polo ($48)</option>
                    <option value="/products/mens-clubhouse-fine-pique-polo">Men&apos;s Clubhouse Polo ($66)</option>
                    <option value="/products/the-saturday-foursome-scramble-kit">Foursome Kit ($160)</option>
                  </select>
                </label>
              </div>
              <div className="p-3 bg-slate-900 text-emerald-300 rounded-md font-mono text-xs break-all flex items-center justify-between gap-3">
                <span>{trackedUrl}</span>
                <button
                  type="button"
                  onClick={() => handleCopyText('utm-url', trackedUrl)}
                  className="shrink-0 px-3 py-1.5 rounded bg-emerald-600 text-white font-bold inline-flex items-center gap-1"
                >
                  <Copy size={12} />
                  <span>{copiedId === 'utm-url' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="High Draw tracked campaign QR code"
                  className="w-40 h-40 border border-slate-200 rounded-lg p-1 bg-white"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-500">
                  Generating QR...
                </div>
              )}
              <div className="text-xs text-slate-600">
                Print for golf bag cards &amp; outing boxes ({utmCampaign})
              </div>
              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`highdraw-qr-${utmCampaign || 'campaign'}.png`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1C2C24] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Download size={13} />
                  <span>Download 300-DPI QR PNG</span>
                </a>
              )}
            </div>
          </div>

          {/* Live Stripe Promo Redemption Table */}
          <div className="space-y-2 hd-panel-contain">
            <h3 id="promo-table-heading" className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Active Stripe Promotion Codes &amp; Redemptions
            </h3>
            <div tabIndex={0} role="region" aria-labelledby="promo-table-heading" className="hd-table-wrapper">
              <table className="hd-table">
                <thead>
                  <tr>
                    <th scope="col">Promo Code</th>
                    <th scope="col">Discount</th>
                    <th scope="col">Channel Tag</th>
                    <th scope="col">Times Redeemed</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overview?.promos && overview.promos.length > 0 ? (
                    overview.promos.map((p) => (
                      <tr key={p.id}>
                        <th scope="row" className="font-mono">{p.code}</th>
                        <td data-label="Discount">{p.discountLabel}</td>
                        <td data-label="Channel">{p.channel || 'General'}</td>
                        <td data-label="Redeemed" className="font-mono font-bold">{p.timesRedeemed}</td>
                        <td data-label="Status">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                            {p.active ? 'Active' : 'Paused'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <th scope="row" className="font-mono text-slate-500">2-POLO-PAIR (Auto)</th>
                      <td data-label="Discount">-$5 / Polo + Free US Shipping</td>
                      <td data-label="Channel">Storefront &amp; Stripe Native</td>
                      <td data-label="Redeemed" className="font-mono">Automatic</td>
                      <td data-label="Status">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                          Always Live
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TAB 5: START-SMALL BUDGET SIMULATOR & PLAYBOOK */}
        <section role="tabpanel" hidden={activeTab !== 'playbook'} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Interactive &ldquo;Start-Small&rdquo; Budget Simulator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{budgetPlan.modeLabel}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[150, 200, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => updateLedger((prev) => ({ ...prev, monthlyBudgetDollars: amt }))}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold border ${
                      ledger.monthlyBudgetDollars === amt
                        ? 'bg-[#1C2C24] text-white border-[#1C2C24]'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    ${amt}/mo{amt === 200 ? ' ★' : ''}
                  </button>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span>Monthly Marketing Budget:</span>
                  <strong className="text-sm text-[#1C2C24]">
                    {fmtMoney(ledger.monthlyBudgetDollars)}
                  </strong>
                </div>
                <input
                  type="range"
                  min={150}
                  max={1000}
                  step={10}
                  value={ledger.monthlyBudgetDollars}
                  onChange={(e) =>
                    updateLedger((prev) => ({
                      ...prev,
                      monthlyBudgetDollars: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#1C2C24]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-[#f8fafc] border border-slate-200">
                  <div className="text-lg font-serif font-bold text-[#1C2C24]">
                    ${budgetPlan.facebookAdsDollars}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">Facebook Ads</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {budgetPlan.facebookDaysAtTenPerDay} days @ $10/day
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#f8fafc] border border-slate-200">
                  <div className="text-lg font-serif font-bold text-[#0b4628]">
                    ${budgetPlan.seedingShirtsDollars}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">Sample Polos</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {budgetPlan.estimatedSampleShirtsCount} wholesale L shirts
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#f8fafc] border border-slate-200">
                  <div className="text-lg font-serif font-bold text-slate-800">
                    ${budgetPlan.qrCardsAndPostageDollars}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">QR Bag Cards</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Break-even: {budgetPlan.breakEvenPairOrders} Pair ord
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Weekly 4.5-Hr Checklist */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Ken&apos;s Weekly Time Allocation ({totalWeeklyChecklistHours} hrs/wk)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Focused founder hours beat random daily social posting.
                  </p>
                </div>
                <CheckCircle2 size={18} className="text-[#0b4628]" />
              </div>

              <div className="space-y-2">
                {ledger.weeklyChecklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      item.completed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-[#f8fafc] border-slate-200 text-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {
                        updateLedger((prev) => ({
                          ...prev,
                          weeklyChecklist: prev.weeklyChecklist.map((c) =>
                            c.id === item.id ? { ...c, completed: !c.completed } : c
                          ),
                        }));
                      }}
                      className="mt-0.5 accent-[#0b4628]"
                    />
                    <div className="flex-1 text-xs">
                      <div className={item.completed ? 'line-through font-semibold' : 'font-semibold'}>
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {item.category} &bull; {item.targetHours} hrs/week
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Challenger Golf Brand Benchmark Matrix */}
          <div className="space-y-2 hd-panel-contain">
            <div className="flex items-center justify-between">
              <h3 id="benchmark-table-heading" className="text-sm font-bold uppercase tracking-wider text-slate-900">
                What Successful Challenger Golf Brands Actually Did Early On
              </h3>
              <a
                href="/High_Draw_Start_Small_Marketing_Playbook_Colon_Hyphen_Bracket.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0b4628] inline-flex items-center gap-1 underline"
              >
                <span>Open Full PDF Brief</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <div tabIndex={0} role="region" aria-labelledby="benchmark-table-heading" className="hd-table-wrapper">
              <table className="hd-table">
                <thead>
                  <tr>
                    <th scope="col">Challenger Brand</th>
                    <th scope="col">What Worked Early</th>
                    <th scope="col">Capital Efficiency</th>
                    <th scope="col">What Failed / Wasted Cash</th>
                    <th scope="col">High Draw $200/mo Translation</th>
                  </tr>
                </thead>
                <tbody>
                  {CHALLENGER_BENCHMARKS.map((row) => (
                    <tr key={row.brand}>
                      <th scope="row">{row.brand}</th>
                      <td data-label="What Worked">{row.earlyMove}</td>
                      <td data-label="Efficiency">{row.capitalEfficiency}</td>
                      <td data-label="What Failed">{row.whatFailed}</td>
                      <td data-label="High Draw Move" className="font-semibold text-[#0b4628]">
                        {row.highDrawMove}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MarketingCommandPage;
