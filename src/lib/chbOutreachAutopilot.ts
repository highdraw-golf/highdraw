// High Draw Golf — Forked CHB Autonomous Outreach & "Ask Dad" Engine
// Adapted from /Users/kendallkylecyree/Developer/chb-marketing-engine
// Retargeted to Regional Golf Podcasts, Mid-South Clubs, Ole Miss Executive Outings, and Dr. Ken Cyree Warm Intros.

export type AutopilotLane =
  | 'podcast_guest'
  | 'club_scramble'
  | 'ole_miss_exec'
  | 'ask_dad';

export type AutopilotStatus =
  | 'pending'
  | 'ask_dad'
  | 'approved'
  | 'sent'
  | 'dismissed';

export interface ChbAutopilotLead {
  id: string;
  organization: string;
  contactName: string;
  roleTitle: string;
  email: string;
  siteUrl: string;
  location: string;
  lane: AutopilotLane;
  status: AutopilotStatus;
  fitSummary: string; // Strictly <= 180 chars for scannable row display
  subject: string;
  body: string;
  promoHook: string;
  estimatedReachOrUnits: string;
  sourceTag: string;
  createdAt: string;
  sentAt?: string;
  dadNote?: string;
}

export const AUTOPILOT_LANE_LABELS: Record<AutopilotLane, string> = {
  podcast_guest: 'Regional Golf Podcasts',
  club_scramble: 'Clubs & Charity Scrambles',
  ole_miss_exec: 'Ole Miss & MS Executive Outings',
  ask_dad: 'Ask Dad Warm Intros',
};

export function clampSummary(text: string, max = 178): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function draftHighDrawOutreach(params: {
  organization: string;
  contactName: string;
  lane: AutopilotLane;
  location: string;
  fitSummary: string;
}): { subject: string; body: string; promoHook: string } {
  const firstName = (params.contactName || '').split(/\s+/)[0] || 'there';
  const greeting =
    firstName === 'Team' || firstName === 'Host' || firstName.length < 2
      ? `Hi ${params.organization} team,`
      : `Hi ${firstName},`;

  if (params.lane === 'podcast_guest') {
    return {
      promoHook: 'Host gift polo + 15% listener code',
      subject: `Guest idea: Former Ole Miss Business Dean who launched High Draw Golf`,
      body: `${greeting}

I've enjoyed following ${params.organization}. My dad, Dr. Ken Cyree (former Dean of the Business School at Ole Miss and a 2.9 handicap who plays Country Club of Oxford and Spring Creek Ranch in Collierville), recently co-founded High Draw Golf (https://www.highdrawgear.com).

After 40+ years of golf across 47 states, he got tired of paying $125+ in pro shops for shirts that lose their collar shape, so we built a stitched-to-order golf apparel line ($48 Weekender micropique and $66 Clubhouse fine pique).

If you're ever looking for a great conversation mixing Mid-South club golf, the business of golf retail, and playing good golf past 50, Ken would be glad to join for 25 minutes. Happy to send you a polo in your size ahead of time and set up a custom listener code for your audience.

Best,
Kyle & Dr. Ken Cyree
High Draw Golf • Oxford, MS
https://www.highdrawgear.com`,
    };
  }

  if (params.lane === 'ole_miss_exec' || params.lane === 'ask_dad') {
    return {
      promoHook: '$40/shirt Foursome & Corporate Outing Rate',
      subject: `Quick hello from Oxford / High Draw Golf polos for ${params.organization}`,
      body: `${greeting}

Hope you're having a great week in ${params.location || 'Mississippi'}. Dr. Ken Cyree (former Dean of the Ole Miss School of Business Administration) and I recently launched High Draw Golf (https://www.highdrawgear.com) right out of the Oxford / Mid-South golf community.

Whenever ${params.organization} hosts client golf days, charity scrambles, or executive outings, we offer our tour-grade 180 GSM Weekender polos and 57/43 Clubhouse fine pique polos at our $40/shirt group rate—stitched to order in the USA in Men's & Women's XS–4XL.

Would love to send over a sample shirt so you can feel the fabric firsthand before your next golf event. What size and colorway do you prefer?

Warm regards,
Dr. Ken Cyree & Kyle Cyree
High Draw Golf
https://www.highdrawgear.com`,
    };
  }

  return {
    promoHook: '$40/shirt Tournament & Member Scramble Rate',
    subject: `Member tournament & scramble polos — High Draw Golf (${params.location || 'Mid-South'})`,
    body: `${greeting}

Dr. Ken Cyree (2.9 index, regular at Oxford Country Club & Spring Creek Ranch) and I run High Draw Golf (https://www.highdrawgear.com).

For upcoming member-guest events, charity scrambles, or foursome prizes at ${params.organization}, we supply stitched-to-order Men's and Women's performance polos (XS–4XL) at a $40/shirt foursome & tournament rate with zero minimum inventory risk.

If you'd like to inspect our collar construction and 180 GSM matte micropique weave in person, we'd be glad to ship a complimentary sample polo to the golf shop. What size should we send?

Best regards,
Kyle & Dr. Ken Cyree
High Draw Golf
https://www.highdrawgear.com`,
  };
}

export function createSeededChbAutopilotLeads(): ChbAutopilotLead[] {
  const now = '2026-11-24T20:00:00.000Z';

  const rawSeeds: Array<{
    id: string;
    organization: string;
    contactName: string;
    roleTitle: string;
    email: string;
    siteUrl: string;
    location: string;
    lane: AutopilotLane;
    status: AutopilotStatus;
    fitSummary: string;
    estimatedReachOrUnits: string;
    sourceTag: string;
    dadNote?: string;
  }> = [
    {
      id: 'chb-hd-01',
      organization: 'Mississippi Golf Podcast',
      contactName: 'Brett Smith',
      roleTitle: 'Host • Golf Podcasts USA',
      email: 'brett@golfpodcasts.org',
      siteUrl: 'https://golfpodcasts.org',
      location: 'Mississippi',
      lane: 'podcast_guest',
      status: 'pending',
      fitSummary: '100% Mississippi golfer audience (~300–1,000/ep); ideal guest slot for former Ole Miss Dean.',
      estimatedReachOrUnits: '300–1,000 MS listeners/ep',
      sourceTag: 'CHB Podcast Discovery',
    },
    {
      id: 'chb-hd-02',
      organization: 'Spring Creek Ranch Golf Club',
      contactName: 'Golf Shop & Membership Director',
      roleTitle: 'Director of Golf',
      email: '',
      siteUrl: 'https://www.springcreekranch.org',
      location: 'Collierville, TN',
      lane: 'ask_dad',
      status: 'ask_dad',
      fitSummary: "Ken's favorite Collierville championship club; warm in-person intro beats cold email.",
      estimatedReachOrUnits: '24–48 member/foursome shirts',
      sourceTag: 'Ask Dad • Home Course',
      dadNote: 'Ask Dad who he knows in the Spring Creek pro shop or regular weekend group.',
    },
    {
      id: 'chb-hd-03',
      organization: 'Country Club of Oxford',
      contactName: 'Clubhouse & Pro Shop',
      roleTitle: 'General Manager / Head Golf Pro',
      email: '',
      siteUrl: 'https://www.ccofoxford.com',
      location: 'Oxford, MS',
      lane: 'ask_dad',
      status: 'ask_dad',
      fitSummary: 'Home Oxford club with deep Ole Miss faculty & alumni overlap; prime scramble & trunk-show partner.',
      estimatedReachOrUnits: '36+ scramble / member shirts',
      sourceTag: 'CHB MS Golf Discovery',
      dadNote: 'Check if Ken wants to wear/seed 2 polos with his regular Oxford foursome first.',
    },
    {
      id: 'chb-hd-04',
      organization: 'FNB Oxford Bank',
      contactName: 'Executive & Community Marketing',
      roleTitle: 'President / Marketing',
      email: '',
      siteUrl: 'https://www.fnboxford.com',
      location: 'Oxford, MS',
      lane: 'ask_dad',
      status: 'ask_dad',
      fitSummary: 'Flagship Oxford Square bank sponsoring charity scrambles & Ole Miss alumni golf outings.',
      estimatedReachOrUnits: '40+ corporate outing polos',
      sourceTag: 'CHB MS Banking Discovery',
      dadNote: 'High likelihood Ken knows FNB Oxford leadership from Ole Miss Business School.',
    },
    {
      id: 'chb-hd-05',
      organization: 'Tennessee Golf Foundation Podcast',
      contactName: 'TGF Media Team',
      roleTitle: 'Podcast Producer',
      email: 'info@tngolf.org',
      siteUrl: 'https://www.tngolf.org',
      location: 'Memphis / Franklin, TN',
      lane: 'podcast_guest',
      status: 'pending',
      fitSummary: 'Reaches traditional TN & Memphis/Collierville club golfers (500–1,500/ep) aligned with Spring Creek.',
      estimatedReachOrUnits: '500–1,500 TN golfers/ep',
      sourceTag: 'CHB Podcast Discovery',
    },
    {
      id: 'chb-hd-06',
      organization: 'The Whole Pro Podcast (TN PGA)',
      contactName: 'TN Section PGA',
      roleTitle: 'Host / Section Staff',
      email: 'tenn@pgahq.com',
      siteUrl: 'https://tennpga.com',
      location: 'Tennessee / Mid-South',
      lane: 'podcast_guest',
      status: 'pending',
      fitSummary: 'Listened to by club pros & merchandisers across Memphis, Collierville, and Tennessee.',
      estimatedReachOrUnits: '400–1,000 PGA pros & avid golfers',
      sourceTag: 'CHB Podcast Discovery',
    },
    {
      id: 'chb-hd-07',
      organization: 'Renasant Bank',
      contactName: 'Corporate Events & Sponsorships',
      roleTitle: 'EVP / Marketing',
      email: '',
      siteUrl: 'https://www.renasantbank.com',
      location: 'Tupelo / Oxford, MS',
      lane: 'ole_miss_exec',
      status: 'ask_dad',
      fitSummary: 'North MS regional bank active in SEC/Ole Miss golf hospitality and charity tournaments.',
      estimatedReachOrUnits: '60+ executive outing shirts',
      sourceTag: 'CHB MS Banking Discovery',
      dadNote: 'Ask Ken for warm Ole Miss Business School alumni contact at Renasant.',
    },
    {
      id: 'chb-hd-08',
      organization: 'Old Waverly Golf Club',
      contactName: 'Director of Golf',
      roleTitle: 'Golf Operations',
      email: '',
      siteUrl: 'https://www.oldwaverly.com',
      location: 'West Point, MS',
      lane: 'club_scramble',
      status: 'pending',
      fitSummary: 'Premier Mississippi championship golf destination hosting corporate & state amateur events.',
      estimatedReachOrUnits: '24–48 tournament gift shirts',
      sourceTag: 'CHB MS Golf Discovery',
    },
    {
      id: 'chb-hd-09',
      organization: 'Mossy Oak Golf Club',
      contactName: 'Golf Shop & Events',
      roleTitle: 'General Manager / Golf Pro',
      email: '',
      siteUrl: 'https://www.mossyoakgolf.com',
      location: 'West Point, MS',
      lane: 'club_scramble',
      status: 'pending',
      fitSummary: 'Gil Hanse national destination in North MS attracting group golf trips & foursomes.',
      estimatedReachOrUnits: '24–48 group trip polos',
      sourceTag: 'CHB MS Golf Discovery',
    },
    {
      id: 'chb-hd-10',
      organization: 'mTrade',
      contactName: 'Executive Team',
      roleTitle: 'Leadership',
      email: '',
      siteUrl: 'https://mtrade.com',
      location: 'Oxford, MS',
      lane: 'ole_miss_exec',
      status: 'pending',
      fitSummary: 'Oxford fintech firm whose executives host client golf outings and Ole Miss weekends.',
      estimatedReachOrUnits: '20–40 executive polos',
      sourceTag: 'CHB MS Banking Discovery',
    },
  ];

  return rawSeeds.map(seed => {
    const drafted = draftHighDrawOutreach({
      organization: seed.organization,
      contactName: seed.contactName,
      lane: seed.lane,
      location: seed.location,
      fitSummary: seed.fitSummary,
    });
    return {
      ...seed,
      fitSummary: clampSummary(seed.fitSummary, 178),
      subject: drafted.subject,
      body: drafted.body,
      promoHook: drafted.promoHook,
      createdAt: now,
    };
  });
}
