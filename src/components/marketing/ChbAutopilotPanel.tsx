import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Mail,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import {
  AUTOPILOT_LANE_LABELS,
  clampSummary,
  createSeededChbAutopilotLeads,
  draftHighDrawOutreach,
} from '../../lib/chbOutreachAutopilot';
import type {
  AutopilotLane,
  AutopilotStatus,
  ChbAutopilotLead,
} from '../../lib/chbOutreachAutopilot';
import { getOwnerApiHeaders } from '../../lib/auth';

interface ChbAutopilotPanelProps {
  items: ChbAutopilotLead[];
  onChangeItems: (next: ChbAutopilotLead[]) => void;
}

type StatusFilter = 'all' | AutopilotStatus;
type LaneFilter = 'all' | AutopilotLane;

export const ChbAutopilotPanel: React.FC<ChbAutopilotPanelProps> = ({
  items,
  onChangeItems,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [laneFilter, setLaneFilter] = useState<LaneFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live URL Auditor / Custom Lead Stager (forked from chb-marketing-engine auditor.js)
  const [auditUrl, setAuditUrl] = useState('');
  const [auditOrg, setAuditOrg] = useState('');
  const [auditLane, setAuditLane] = useState<AutopilotLane>('club_scramble');
  const [auditLocation, setAuditLocation] = useState('Oxford / Mid-South');
  const [auditing, setAuditing] = useState(false);
  const [auditBanner, setAuditBanner] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = {
      all: items.filter(i => i.status !== 'dismissed').length,
      pending: 0,
      ask_dad: 0,
      approved: 0,
      sent: 0,
      dismissed: 0,
    };
    for (const item of items) {
      c[item.status] = (c[item.status] || 0) + 1;
    }
    return c;
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = items.filter(item => {
      if (statusFilter === 'all') {
        if (item.status === 'dismissed') return false;
      } else if (item.status !== statusFilter) {
        return false;
      }
      if (laneFilter !== 'all' && item.lane !== laneFilter) return false;
      if (!q) return true;
      return (
        item.organization.toLowerCase().includes(q) ||
        item.contactName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.fitSummary.toLowerCase().includes(q)
      );
    });

    if (statusFilter === 'sent') {
      return [...list].sort((a, b) => (b.sentAt || '').localeCompare(a.sentAt || ''));
    }
    return list;
  }, [items, statusFilter, laneFilter, searchQuery]);

  const updateItem = (id: string, patch: Partial<ChbAutopilotLead>) => {
    onChangeItems(items.map(it => (it.id === id ? { ...it, ...patch } : it)));
  };

  const handleRehydrateDefaults = () => {
    const existingIds = new Set(items.map(i => i.id));
    const defaults = createSeededChbAutopilotLeads();
    const missing = defaults.filter(d => !existingIds.has(d.id));
    if (missing.length === 0) {
      setAuditBanner('All 10 curated Mid-South & Podcast targets are already in your queue.');
      return;
    }
    onChangeItems([...missing, ...items]);
    setAuditBanner(`Added ${missing.length} curated regional golf & Ole Miss targets.`);
  };

  const handleAuditAndStageUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawUrl = auditUrl.trim();
    if (!rawUrl) return;

    setAuditing(true);
    setAuditBanner(null);
    try {
      const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
      let discoveredEmail = '';
      let discoveredTitle = auditOrg.trim();
      let discoveredDesc = '';

      try {
        const res = await fetch('/api/marketing?action=audit-site', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getOwnerApiHeaders(),
          },
          body: JSON.stringify({ url: normalizedUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.email) discoveredEmail = data.email;
          if (!discoveredTitle && data.title) discoveredTitle = data.title;
          if (data.description) discoveredDesc = data.description;
        }
      } catch {
        // Fallback cleanly to deterministic local staging if offline
      }

      const orgName =
        discoveredTitle ||
        new URL(normalizedUrl).hostname.replace(/^www\./, '').split('.')[0].toUpperCase();

      const fitSummary = clampSummary(
        discoveredDesc ||
          `${AUTOPILOT_LANE_LABELS[auditLane]} target in ${auditLocation}; staged via CHB Site Auditor.`
      );

      const drafted = draftHighDrawOutreach({
        organization: orgName,
        contactName: 'Team',
        lane: auditLane,
        location: auditLocation,
        fitSummary,
      });

      const nextStatus: AutopilotStatus = auditLane === 'ask_dad' ? 'ask_dad' : 'pending';
      const created: ChbAutopilotLead = {
        id: `chb-custom-${Date.now()}`,
        organization: orgName,
        contactName: 'Golf / Events Team',
        roleTitle: AUTOPILOT_LANE_LABELS[auditLane],
        email: discoveredEmail,
        siteUrl: normalizedUrl,
        location: auditLocation,
        lane: auditLane,
        status: nextStatus,
        fitSummary,
        subject: drafted.subject,
        body: drafted.body,
        promoHook: drafted.promoHook,
        estimatedReachOrUnits: auditLane === 'podcast_guest' ? 'Podcast Episode' : '24+ Outing Polos',
        sourceTag: 'Live Site Audit',
        createdAt: new Date().toISOString(),
      };

      onChangeItems([created, ...items]);
      setStatusFilter(nextStatus);
      setExpandedId(created.id);
      setAuditUrl('');
      setAuditOrg('');
      setAuditBanner(
        discoveredEmail
          ? `Audited ${orgName} — discovered contact ${discoveredEmail} and drafted pitch.`
          : `Audited ${orgName} and staged tailored High Draw outreach draft.`
      );
    } catch {
      setAuditBanner('Please enter a valid website URL (e.g., springcreekranch.org).');
    } finally {
      setAuditing(false);
    }
  };

  const handleExportAskDadBatch = () => {
    const askDadList = items.filter(i => i.status === 'ask_dad');
    const lines = [
      'HIGH DRAW GOLF — "ASK DAD" WARM INTRO & NETWORK BRIEF',
      `Generated: ${new Date().toLocaleDateString()}`,
      '==============================================================',
      '',
      ...askDadList.map(
        (it, idx) =>
          `${idx + 1}. ${it.organization} (${it.location})\n` +
          `   Why it fits: ${it.fitSummary}\n` +
          `   Note for Dad: ${it.dadNote || 'Do we have a warm contact or personal intro here?'}\n` +
          `   Website: ${it.siteUrl}\n`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'High_Draw_Ask_Dad_Warm_Intros.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPitch = async (item: ChbAutopilotLead) => {
    const full = `Subject: ${item.subject}\n\n${item.body}`;
    await navigator.clipboard.writeText(full);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header & Forked CHB Summary Counters (Clickable Buttons) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0b4628]">
              <Sparkles size={14} />
              <span>CHB Autonomous Outreach Engine &bull; High Draw Fork</span>
            </div>
            <h2 className="font-serif text-2xl text-slate-900 mt-0.5">
              Podcasts, Club Scrambles &amp; &ldquo;Ask Dad&rdquo; Warm Queue
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Discover Mid-South clubs, regional golf podcasts, and Ole Miss executive outings, review scannable fit summaries, or batch-export warm intros for Dr. Ken Cyree. All changes cloud-sync automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRehydrateDefaults}
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Sync Regional Seeds</span>
            </button>
            <button
              type="button"
              onClick={handleExportAskDadBatch}
              className="px-3.5 py-2 rounded-lg bg-[#0b4628] hover:bg-[#08351e] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Export &ldquo;Ask Dad&rdquo; Brief ({counts.ask_dad})</span>
            </button>
          </div>
        </div>

        {/* Clickable Top Summary Counter Buttons (Matching CHB Engine a4a810e) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {[
            { id: 'pending', label: 'Pending Review', count: counts.pending, tone: 'border-amber-200 bg-amber-50/70 text-amber-950' },
            { id: 'ask_dad', label: 'Ask Dad Queue', count: counts.ask_dad, tone: 'border-sky-200 bg-sky-50/70 text-sky-950' },
            { id: 'approved', label: 'Approved / Ready', count: counts.approved, tone: 'border-emerald-200 bg-emerald-50/70 text-emerald-950' },
            { id: 'sent', label: 'Sent', count: counts.sent, tone: 'border-slate-200 bg-slate-50 text-slate-900' },
            { id: 'all', label: 'All Active', count: counts.all, tone: 'border-slate-200 bg-white text-slate-800' },
          ].map(card => {
            const active = statusFilter === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setStatusFilter(card.id as StatusFilter)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${card.tone} ${
                  active ? 'ring-2 ring-[#0b4628] shadow-xs' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
                  {card.label}
                </div>
                <div className="text-2xl font-bold tabular-nums mt-0.5">{card.count}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Target Website Auditor & Pitch Generator */}
      <form
        onSubmit={handleAuditAndStageUrl}
        className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 inline-flex items-center gap-1.5">
            <Globe size={14} className="text-[#0b4628]" />
            <span>Audit Website &amp; Auto-Draft High Draw Pitch</span>
          </span>
          {auditBanner && (
            <span className="text-xs font-medium text-[#0b4628]">{auditBanner}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          <input
            type="text"
            value={auditUrl}
            onChange={e => setAuditUrl(e.target.value)}
            placeholder="https://club-or-podcast.com"
            aria-label="Target website URL"
            className="md:col-span-4 px-3 py-2 border border-slate-300 rounded-lg text-xs"
          />
          <input
            type="text"
            value={auditOrg}
            onChange={e => setAuditOrg(e.target.value)}
            placeholder="Organization name (optional)"
            aria-label="Organization name"
            className="md:col-span-3 px-3 py-2 border border-slate-300 rounded-lg text-xs"
          />
          <select
            value={auditLane}
            onChange={e => setAuditLane(e.target.value as AutopilotLane)}
            aria-label="Outreach lane"
            className="md:col-span-3 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
          >
            <option value="club_scramble">Clubs &amp; Scrambles</option>
            <option value="podcast_guest">Regional Golf Podcasts</option>
            <option value="ole_miss_exec">Ole Miss / Executive Outings</option>
            <option value="ask_dad">Ask Dad Warm Intro</option>
          </select>
          <button
            type="submit"
            disabled={auditing}
            className="md:col-span-2 px-4 py-2 bg-[#0b4628] hover:bg-[#08351e] text-white text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Plus size={14} />
            <span>{auditing ? 'Auditing...' : 'Audit & Stage'}</span>
          </button>
        </div>
      </form>

      {/* Lane Filter Pills + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Lanes' },
            { id: 'podcast_guest', label: 'Podcasts' },
            { id: 'club_scramble', label: 'Clubs & Scrambles' },
            { id: 'ole_miss_exec', label: 'Ole Miss / Banking' },
            { id: 'ask_dad', label: 'Ask Dad Warm' },
          ].map(pill => {
            const active = laneFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setLaneFilter(pill.id as LaneFilter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search Oxford, Collierville, podcast..."
          aria-label="Filter outreach queue"
          className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:w-64"
        />
      </div>

      {/* Compact Scannable Rows (<=180-char Fit Summary + Expand Toggle, Matching CHB 55ca1b8) */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No leads in this view. Switch status pills above or audit a new club/podcast website.
          </div>
        ) : (
          filteredItems.map(item => {
            const isExpanded = expandedId === item.id;
            const isCopied = copiedId === item.id;
            const mailtoHref = `mailto:${encodeURIComponent(item.email || '')}?subject=${encodeURIComponent(
              item.subject
            )}&body=${encodeURIComponent(item.body)}`;

            return (
              <div key={item.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                {/* Compact Row Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">
                        {item.organization}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {item.location}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium">
                        {AUTOPILOT_LANE_LABELS[item.lane]}
                      </span>
                      <span className="text-[11px] text-slate-500 tabular-nums">
                        {item.estimatedReachOrUnits}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">
                      {item.fitSummary}
                    </p>
                  </div>

                  {/* Quick Row Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {item.status !== 'ask_dad' && item.status !== 'sent' && (
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, { status: 'ask_dad' })}
                        className="px-2.5 py-1.5 rounded-md border border-sky-300 bg-sky-50 text-xs font-semibold text-sky-900 hover:bg-sky-100 inline-flex items-center gap-1 cursor-pointer"
                        title="Flag for Dr. Ken Cyree warm intro check"
                      >
                        <UserCheck size={13} />
                        <span>Ask Dad</span>
                      </button>
                    )}

                    {item.status !== 'approved' && item.status !== 'sent' && (
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, { status: 'approved' })}
                        className="px-2.5 py-1.5 rounded-md bg-[#0b4628] text-white text-xs font-semibold hover:bg-[#08351e] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={13} />
                        <span>Approve</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopyPitch(item)}
                      className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={13} />
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    {item.status !== 'sent' && (
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(item.id, {
                            status: 'sent',
                            sentAt: new Date().toISOString(),
                          })
                        }
                        className="px-2.5 py-1.5 rounded-md border border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Send size={12} />
                        <span>Mark Sent</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Draft Editor & Contact Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-200 space-y-3 bg-slate-50/80 p-3.5 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          value={item.contactName}
                          onChange={e => updateItem(item.id, { contactName: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Recipient Email
                        </label>
                        <input
                          type="email"
                          value={item.email}
                          placeholder="Add verified email..."
                          onChange={e => updateItem(item.id, { email: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Note for Dad / Warm Angle
                        </label>
                        <input
                          type="text"
                          value={item.dadNote || ''}
                          placeholder="e.g. Former Ole Miss board peer..."
                          onChange={e => updateItem(item.id, { dadNote: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        value={item.subject}
                        onChange={e => updateItem(item.id, { subject: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Plain-Text Outreach Draft ({item.promoHook})
                      </label>
                      <textarea
                        rows={9}
                        value={item.body}
                        onChange={e => updateItem(item.id, { body: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-xs leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-3 text-xs">
                        <a
                          href={item.siteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0b4628] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <span>Visit {item.organization}</span>
                          <ExternalLink size={12} />
                        </a>
                        <a
                          href={mailtoHref}
                          className="px-3 py-1.5 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 inline-flex items-center gap-1.5"
                        >
                          <Mail size={12} />
                          <span>Open in Mail App</span>
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => updateItem(item.id, { status: 'dismissed' })}
                        className="text-xs text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <X size={13} />
                        <span>Dismiss Lead</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
