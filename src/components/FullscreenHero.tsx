import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { RiseLines, FadeUp } from './motion/EditorialMotion';
import { BallFlightReveal } from './motion/HighDrawBespokeMotion';

interface FullscreenHeroProps {
  heroImage: string;
  onScrollToShop: () => void;
  onShopMens?: () => void;
  onShopWomens?: () => void;
  onShopClubhouse?: () => void;
  onScrollToWhy: () => void;
}

export const FullscreenHero: React.FC<FullscreenHeroProps> = ({
  heroImage,
  onScrollToShop,
  onShopMens,
  onShopWomens,
  onShopClubhouse,
  onScrollToWhy,
}) => {
  return (
    <div>
      <section className="relative w-full min-h-[700px] lg:h-[88vh] lg:max-h-[900px] flex items-end lg:items-center justify-between overflow-hidden bg-[#15191E] text-white py-14 lg:py-0">
        
        {/* Picture-Heavy Full Bleed Lifestyle Photography (LCP Candidate) */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="High Draw Golf Tour Performance Lifestyle" 
            {...({ fetchpriority: 'high' } as any)}
            className="w-full h-full object-cover object-top sm:object-center transition-all duration-700 brightness-95"
          />
          {/* Luxury Multi-Stop Editorial Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] via-[#15191E]/65 to-black/25 sm:bg-gradient-to-r sm:from-[#15191E]/95 sm:via-[#15191E]/55 sm:to-black/20"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end lg:items-center">
          
          {/* LEFT: Hero Editorial Content & Men's / Women's / Clubhouse Action Suite */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Official Brand Badge with Signature Mark + Monogram */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider text-slate-100 shadow-xl">
              <img 
                src="/assets/brand/logos/mark_monogram_cyan.png" 
                alt="High Draw Mark + Monogram" 
                className="h-5 w-auto object-contain" 
              />
              <span className="font-mono text-[11px] tracking-widest text-[#38BDF8] uppercase font-bold">
                WEEKENDER ($48) &amp; THE CLUBHOUSE ($66) &bull; BESPOKE EMBROIDERY
              </span>
            </div>

            {/* Luxury Editorial Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.02] text-white drop-shadow-lg tracking-tight">
                <RiseLines
                  immediate
                  lines={[
                    'Designed for Sport.',
                    <span key="sub" className="font-normal italic text-slate-200">
                      Crafted for Life.
                    </span>,
                  ]}
                />
              </h1>
              <FadeUp immediate delay={0.25}>
                <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed pt-1">
                  Tour-grade apparel without the $125 boutique retail tax. Choose our featherweight UPF 50+ <strong>Weekender ($48)</strong> for hot summer rounds or heathered 57/43 cotton-poly <strong>Clubhouse Fine Pique ($66)</strong> for evening dining—stitched to order with your choice of 3 signature High Draw chest marks.
                </p>
              </FadeUp>
            </div>

            {/* Primary Action Suite: SHOP POLOS + Direct Men's / Women's / Clubhouse Selection */}
            <FadeUp immediate delay={0.35} className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onShopMens || onScrollToShop}
                  className="px-7 py-4 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-[0.15em] transition-all rounded-xs shadow-2xl flex items-center justify-center gap-2.5 group t-press active:scale-95 cursor-pointer"
                >
                  <span>MEN&rsquo;S POLOS &bull; $48</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Split Women's & Clubhouse Quick Decision Suite */}
                <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center">
                  <button
                    onClick={onShopWomens || onScrollToShop}
                    className="px-5 py-4 bg-white/15 hover:bg-white text-white hover:text-[#15191E] backdrop-blur-md border border-white/30 font-bold text-xs uppercase tracking-[0.13em] transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg t-press"
                  >
                    <span>WOMEN&rsquo;S</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={onShopClubhouse || onScrollToShop}
                    className="px-5 py-4 bg-[#1C2C24]/85 hover:bg-white text-white hover:text-[#15191E] backdrop-blur-md border border-[#38BDF8]/40 font-bold text-xs uppercase tracking-[0.13em] transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg t-press"
                  >
                    <span>CLUBHOUSE &bull; $66</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={onScrollToWhy}
                  className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#38BDF8] hover:text-white link-swipe cursor-pointer transition-colors"
                >
                  Explore The Craftsmanship Lab &rarr;
                </button>
                <span className="text-white/30 hidden sm:inline">&bull;</span>
                <span className="text-[11px] font-mono text-slate-300">
                  Available in Men&rsquo;s XS–4XL &amp; Women&rsquo;s XS–4XL
                </span>
              </div>
            </FadeUp>

            {/* Direct Reassurance Micro-Copy */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-[12px] text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#38BDF8] shrink-0" />
                <span>3-Tier Fabric System ($48 &amp; $66)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#38BDF8] shrink-0" />
                <span>3 Signature Embroidered Marks</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <span>100+ Washes Guarantee</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Elevated Bespoke 3-Mark Embroidery Suite Card */}
          <div className="lg:col-span-5 hidden md:block">
            <BallFlightReveal delay={0.2}>
              <div className="bg-[#15191E]/85 backdrop-blur-xl border border-white/20 rounded-xs p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#38BDF8]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8] font-bold">
                      BESPOKE 3-MARK CHEST SUITE
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 uppercase font-semibold">
                    Included ($0)
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-white">
                    Stitched to Order on Every Silhouette
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Select any of our 3 official High Draw chest marks—calibrated to 2.5&Prime; on Men&rsquo;s cuts and 2.25&Prime; lower-aligned on Women&rsquo;s cuts.
                  </p>
                </div>

                {/* 3 Official Chest Lockups Visual Stack */}
                <div className="space-y-2.5">
                  <div
                    onClick={onScrollToShop}
                    className="p-3 rounded-xs bg-[#1E293B]/90 border border-white/15 hover:border-[#38BDF8] transition-all cursor-pointer flex items-center justify-between gap-3 t-press"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-11 rounded-2xs bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0 p-1.5">
                        <img
                          src="/assets/brand/logos/mark_monogram_white.png"
                          alt="Mark + Monogram"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">Mark + Monogram (H | D)</span>
                        <span className="text-[10px] font-mono text-[#38BDF8] uppercase block">Signature Crest &bull; H &middot; Tracer &middot; D</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#38BDF8]/15 text-[#38BDF8] rounded-2xs shrink-0 font-bold">
                      POPULAR
                    </span>
                  </div>

                  <div
                    onClick={onScrollToShop}
                    className="p-3 rounded-xs bg-[#1E293B]/90 border border-white/15 hover:border-[#38BDF8] transition-all cursor-pointer flex items-center justify-between gap-3 t-press"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-11 rounded-2xs bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0 p-1.5">
                        <img
                          src="/assets/brand/logos/mark_only_white.png"
                          alt="Mark-Only"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">Mark-Only (Apex Tracer)</span>
                        <span className="text-[10px] font-mono text-slate-300 uppercase block">Minimalist Tour Ball Flight + Pin</span>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-slate-400 shrink-0" />
                  </div>

                  <div
                    onClick={onScrollToShop}
                    className="p-3 rounded-xs bg-[#1E293B]/90 border border-white/15 hover:border-[#38BDF8] transition-all cursor-pointer flex items-center justify-between gap-3 t-press"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-11 rounded-2xs bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0 p-1.5">
                        <img
                          src="/assets/brand/logos/mark_text_white.png"
                          alt="Mark + Wordmark"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">Mark + Wordmark</span>
                        <span className="text-[10px] font-mono text-slate-300 uppercase block">Full HIGH DRAW Championship Lockup</span>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* Contrast Calibration Footer */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase text-slate-400">Contrast Thread:</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-white/40" title="Crisp White Thread on Dark & Heathered Garments" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#00A3FF] border border-white/40" title="Light Blue Tracer Thread on Crisp White Garments" />
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 font-semibold">Free US Shipping $75+</span>
                </div>
              </div>
            </BallFlightReveal>
          </div>

        </div>

      </section>

      {/* Sub-Hero 4-Column Luxury Architecture Ribbon */}
      <div className="bg-[#1C2C24] text-white border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#38BDF8] font-mono font-bold text-xs">01</span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">Weekender &bull; $48</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">180 GSM UPF 50+ micropique engineered for hot summer rounds.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#38BDF8] font-mono font-bold text-xs">02</span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">The Clubhouse &bull; $66</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">57/43 combed cotton-poly fine pique heathers &amp; $68 fleece 1/4-zip.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#38BDF8] font-mono font-bold text-xs">03</span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">3 Signature Marks</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">Choose Mark + Monogram, Mark-Only, or Mark + Wordmark at $0 extra.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#38BDF8] font-mono font-bold text-xs">04</span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">100+ Washes Guarantee</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">30-Day Fairway Trial. Won&rsquo;t shrink, fade, or curl into bacon.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
