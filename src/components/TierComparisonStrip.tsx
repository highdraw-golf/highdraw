import React, { useState } from 'react';
import { ArrowRight, Sun, Wine, Trophy, Check, Bell } from 'lucide-react';
import { Stagger, StaggerItem, Hairline } from './motion/EditorialMotion';

interface TierComparisonStripProps {
  onExploreTier: (tier: 'weekender' | 'clubhouse' | 'tournament') => void;
  onSelectClubhousePolo?: () => void;
  onSelectWeekenderPolo?: () => void;
}

export const TierComparisonStrip: React.FC<TierComparisonStripProps> = ({
  onExploreTier,
  onSelectClubhousePolo,
  onSelectWeekenderPolo,
}) => {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem('highdraw_tournament_waitlist') || '[]');
      existing.push({ email: waitlistEmail.trim(), tier: 'tournament', at: new Date().toISOString() });
      localStorage.setItem('highdraw_tournament_waitlist', JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    setWaitlistSubmitted(true);
  };

  return (
    <section className="w-full py-16 lg:py-24 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-[#FBFBFA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#B12535] font-bold">
              <span>THE HIGH DRAW 3-TIER APPAREL ARCHITECTURE</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1F26] tracking-tight leading-[1.08]">
              Three Fabric Systems.{' '}
              <span className="italic font-normal text-slate-500">Every Hour of Golf.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              Whether you&rsquo;re playing 36 holes in August humidity, heading straight into the clubhouse dining room, or competing under tournament pressure, every silhouette is tailored and stitched to order.
            </p>
          </div>

          <div className="text-left md:text-right font-mono text-[11px] text-slate-500 space-y-1">
            <span className="block text-[#1C2C24] font-bold uppercase tracking-wider">
              3 Signature Chest Lockups Included
            </span>
            <span className="block">Mark-Only &bull; Mark + Monogram &bull; Mark + Wordmark</span>
          </div>
        </div>

        <Hairline className="bg-slate-200" />

        {/* 3-Column Editorial Spine (Divided by Hairlines, Zero Nested Cards) */}
        <Stagger
          staggerChildren={0.07}
          className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 border border-slate-200 bg-white rounded-xs shadow-2xs"
        >
          {/* TIER 01: THE WEEKENDER */}
          <StaggerItem className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C2C24] flex items-center gap-1.5">
                  <Sun size={14} className="text-[#38BDF8]" />
                  <span>01 / WEEKENDER</span>
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-2xs bg-[#1C2C24]/8 text-[#1C2C24]">
                  $48 DIRECT
                </span>
              </div>

              <div className="aspect-[16/10] bg-[#F7F7F6] rounded-xs overflow-hidden border border-slate-200/80 relative group">
                <img
                  src="/assets/products/printify_mockups/high-draw-weekender-men-s-polo-mark-monogram--true-navy.jpg"
                  alt="High Draw Weekender Men's Polo"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-2xs">
                  UPF 50+ Technical Micropique
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl font-bold text-[#1A1F26]">
                  On-Course Fairway Drape
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Built on 180 GSM technical polyester micropique (<span className="font-mono text-[11px] font-semibold text-[#1C2C24]">ST740</span> Men&rsquo;s &amp; <span className="font-mono text-[11px] font-semibold text-[#1C2C24]">LST740</span> Women&rsquo;s). Featherlight capillary airflow, UPF 50+ solar block, and zero cling through summer humidity.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-700 shrink-0" />
                  <span>9 Men&rsquo;s &amp; 8 Women&rsquo;s Colorways (XS–4XL)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-700 shrink-0" />
                  <span>3 Official Chest Marks &bull; Tailor-Matched Contrast</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-700 shrink-0" />
                  <span>100+ Machine Washes Guarantee</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => (onSelectWeekenderPolo ? onSelectWeekenderPolo() : onExploreTier('weekender'))}
                className="w-full py-3 px-4 bg-[#1C2C24] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer t-press"
              >
                <span>SHOP WEEKENDER &bull; $48</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </StaggerItem>

          {/* TIER 02: THE CLUBHOUSE */}
          <StaggerItem className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#FBFBFA]/60">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#B12535] flex items-center gap-1.5">
                  <Wine size={14} className="text-[#B12535]" />
                  <span>02 / THE CLUBHOUSE</span>
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-2xs bg-[#B12535]/10 text-[#B12535]">
                  $66 – $68
                </span>
              </div>

              <div className="aspect-[16/10] bg-[#F7F7F6] rounded-xs overflow-hidden border border-slate-200/80 relative group">
                <img
                  src="/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--aegean-blue-heather.jpg"
                  alt="High Draw Clubhouse Fine Pique Polo"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-[#1C2C24]/90 backdrop-blur-md text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-2xs">
                  57/43 Combed Cotton-Poly Fine Pique
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl font-bold text-[#1A1F26]">
                  19th Hole &amp; Evening Dining
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rich heathered 57% combed cotton / 43% poly fine pique (<span className="font-mono text-[11px] font-semibold text-[#1C2C24]">K830</span> Men&rsquo;s &amp; <span className="font-mono text-[11px] font-semibold text-[#1C2C24]">LK830</span> Women&rsquo;s, $66) plus our 8.3-oz Fleece 1/4-Zip ($68). Natural matte hand with zero gym sheen.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/70">
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-700 shrink-0" />
                  <span>Elevated Heathers: Aegean Blue, River Navy, Dark Teal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-700 shrink-0" />
                  <span>Crisp White Embroidery (2.5&Prime; Men&rsquo;s / 2.25&Prime; Women&rsquo;s)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-700 shrink-0" />
                  <span>Includes Midweight Fleece 1/4-Zip Pullover ($68)</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => (onSelectClubhousePolo ? onSelectClubhousePolo() : onExploreTier('clubhouse'))}
                className="w-full py-3 px-4 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer t-press shadow-xs"
              >
                <span>EXPLORE THE CLUBHOUSE &bull; $66</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </StaggerItem>

          {/* TIER 03: TOURNAMENT EDITION */}
          <StaggerItem className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#0D1520] text-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#38BDF8] flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-400" />
                  <span>03 / TOURNAMENT</span>
                </span>
                <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-2xs bg-white/10 text-amber-300 uppercase">
                  SUMMER 2026 &bull; $110
                </span>
              </div>

              <div className="aspect-[16/10] bg-slate-900 rounded-xs overflow-hidden border border-white/15 relative group">
                <img
                  src="/assets/founder/ken_overcast_apex_swing.jpg"
                  alt="High Draw Tournament Prototype Testing"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 brightness-90"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md text-[#38BDF8] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-2xs">
                  3.4 oz Bonded Tour Prototype
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl font-bold text-white">
                  Tour-Spec Competition Chassis
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Currently in final on-course prototype testing. Ultra-high gauge micro-knit composite with laser-cut bonded stay-flat collar stand and zero-drag seams.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-[#38BDF8] shrink-0" />
                  <span>3.4 oz Featherlight Competition Micro-Knit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-[#38BDF8] shrink-0" />
                  <span>Laser-Bonded Stay-Flat Collar Architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="text-[#38BDF8] shrink-0" />
                  <span>Limited Numbered Private Allocation</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              {waitlistSubmitted ? (
                <div className="p-3 rounded-xs bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 font-medium">
                  <Check size={15} className="text-emerald-400 shrink-0" />
                  <span>Priority Summer &rsquo;26 allocation reserved.</span>
                </div>
              ) : (
                <form onSubmit={handleWaitlist} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={e => setWaitlistEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="Email for priority allocation..."
                      aria-label="Email for Tournament allocation waitlist"
                      className="flex-1 min-w-0 px-3 py-2.5 bg-white/10 border border-white/20 rounded-xs text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#38BDF8]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2.5 bg-[#38BDF8] hover:bg-sky-300 text-[#090C10] font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer t-press shrink-0 flex items-center gap-1.5"
                    >
                      <Bell size={13} />
                      <span>JOIN</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
};
