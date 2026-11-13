// High Draw Golf — First-Party UTM, Referral & Funnel Attribution

export interface AttributionTouch {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref?: string;
  fbclid?: string;
  landing_path: string;
  referrer: string;
  recordedAt: string;
}

export interface StoredAttributionState {
  firstTouch: AttributionTouch | null;
  lastTouch: AttributionTouch | null;
}

export type FunnelStepName = 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase';

export interface LocalFunnelCounters {
  page_views: number;
  view_item: number;
  add_to_cart: number;
  begin_checkout: number;
  purchase: number;
  updatedAt: string;
}

const ATTRIBUTION_KEY = 'highdraw_attribution_v1';
const FUNNEL_KEY = 'highdraw_funnel_v1';

function sanitizeAttrValue(raw: string | null | undefined, maxLen = 120): string | undefined {
  if (!raw) return undefined;
  const clean = String(raw)
    .replace(/[\r\n\t<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
  return clean || undefined;
}

export function readAttributionState(): StoredAttributionState {
  if (typeof window === 'undefined') return { firstTouch: null, lastTouch: null };
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return { firstTouch: null, lastTouch: null };
    const parsed = JSON.parse(raw) as StoredAttributionState;
    return {
      firstTouch: parsed?.firstTouch || null,
      lastTouch: parsed?.lastTouch || null,
    };
  } catch {
    return { firstTouch: null, lastTouch: null };
  }
}

export function captureAttributionOnLoad(
  explicitUrl?: string,
  explicitReferrer?: string
): StoredAttributionState {
  const existing = readAttributionState();
  const isBrowser = typeof window !== 'undefined';

  let pathname = '/';
  let search = '';
  let referrer = explicitReferrer || '';

  if (explicitUrl) {
    const parsed = new URL(explicitUrl, 'https://www.highdrawgear.com');
    pathname = parsed.pathname || '/';
    search = parsed.search || '';
  } else if (isBrowser) {
    pathname = window.location.pathname || '/';
    search = window.location.search || '';
    referrer = explicitReferrer ?? document.referrer ?? '';
  }

  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const utm_source = sanitizeAttrValue(params.get('utm_source'), 80);
  const utm_medium = sanitizeAttrValue(params.get('utm_medium'), 80);
  const utm_campaign = sanitizeAttrValue(params.get('utm_campaign'), 120);
  const utm_content = sanitizeAttrValue(params.get('utm_content'), 120);
  const utm_term = sanitizeAttrValue(params.get('utm_term'), 80);
  const ref = sanitizeAttrValue(params.get('ref') || params.get('promo'), 40)?.toUpperCase();
  const fbclid = sanitizeAttrValue(params.get('fbclid'), 120);

  let referrerDomain = '';
  try {
    if (referrer) {
      const refUrl = new URL(referrer);
      if (!refUrl.hostname.endsWith('highdrawgear.com') && refUrl.hostname !== 'localhost') {
        referrerDomain = refUrl.hostname.replace(/^www\./, '');
      }
    }
  } catch {
    referrerDomain = '';
  }

  const inferredSource =
    utm_source ||
    (fbclid ? 'facebook' : referrerDomain ? referrerDomain : undefined);
  const inferredMedium =
    utm_medium ||
    (fbclid ? 'paid_social' : ref ? 'qr_or_referral' : referrerDomain ? 'referral' : undefined);

  const hasExplicitSignal = Boolean(
    utm_source || utm_medium || utm_campaign || utm_content || utm_term || ref || fbclid || referrerDomain
  );

  const touch: AttributionTouch = {
    utm_source: inferredSource,
    utm_medium: inferredMedium,
    utm_campaign,
    utm_content,
    utm_term,
    ref,
    fbclid,
    landing_path: sanitizeAttrValue(pathname, 120) || '/',
    referrer: sanitizeAttrValue(referrerDomain || referrer, 120) || 'direct',
    recordedAt: new Date().toISOString(),
  };

  const nextState: StoredAttributionState = {
    firstTouch: existing.firstTouch || touch,
    lastTouch: hasExplicitSignal || !existing.lastTouch ? touch : existing.lastTouch,
  };

  if (isBrowser) {
    try {
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(nextState));
      const counters = readLocalFunnelCounters();
      counters.page_views += 1;
      counters.updatedAt = new Date().toISOString();
      localStorage.setItem(FUNNEL_KEY, JSON.stringify(counters));
    } catch {
      // ignore storage quota errors
    }
  }

  return nextState;
}

export function getCheckoutAttributionMetadata(): {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  ref_code: string;
  landing_path: string;
} {
  const state = readAttributionState();
  const last = state.lastTouch;
  const first = state.firstTouch;

  return {
    utm_source: last?.utm_source || first?.utm_source || 'direct',
    utm_medium: last?.utm_medium || first?.utm_medium || 'organic',
    utm_campaign: last?.utm_campaign || first?.utm_campaign || '',
    utm_content: last?.utm_content || first?.utm_content || '',
    ref_code: last?.ref || first?.ref || '',
    landing_path: last?.landing_path || first?.landing_path || '/',
  };
}

export function readLocalFunnelCounters(): LocalFunnelCounters {
  const empty: LocalFunnelCounters = {
    page_views: 0,
    view_item: 0,
    add_to_cart: 0,
    begin_checkout: 0,
    purchase: 0,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = localStorage.getItem(FUNNEL_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<LocalFunnelCounters>;
    return {
      page_views: Number(parsed.page_views) || 0,
      view_item: Number(parsed.view_item) || 0,
      add_to_cart: Number(parsed.add_to_cart) || 0,
      begin_checkout: Number(parsed.begin_checkout) || 0,
      purchase: Number(parsed.purchase) || 0,
      updatedAt: parsed.updatedAt || empty.updatedAt,
    };
  } catch {
    return empty;
  }
}

export function recordLocalFunnelStep(step: FunnelStepName): void {
  if (typeof window === 'undefined') return;
  try {
    const counters = readLocalFunnelCounters();
    counters[step] = (counters[step] || 0) + 1;
    counters.updatedAt = new Date().toISOString();
    localStorage.setItem(FUNNEL_KEY, JSON.stringify(counters));
  } catch {
    // ignore storage errors
  }
}
