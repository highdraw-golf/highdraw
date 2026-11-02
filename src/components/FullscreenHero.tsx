import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface FullscreenHeroProps {
  heroImage: string;
  onScrollToShop: () => void;
  onShopMens?: () => void;
  onShopWomens?: () => void;
  onScrollToWhy: () => void;
}

export const FullscreenHero: React.FC<FullscreenHeroProps> = ({
  heroImage,
  onScrollToShop,
  onShopMens,
  onShopWomens,
  onScrollToWhy,
}) => {
  return (
    <div>
      <section className="relative w-full min-h-[700px] lg:h-[88vh] lg:max-h-[900px] flex items-end lg:items-center justify-between overflow-hidden bg-[#15191E] text-white py-14 lg:py-0">
        
        {/* Picture-Heavy Full Bleed Lifestyle Photography */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="High Draw Golf Tour Performance Lifestyle" 
            className="w-full h-full object-cover object-top sm:object-center transition-all duration-700 brightness-95"
          />
          {/* Luxury Multi-Stop Editorial Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] via-[#15191E]/65 to-black/25 sm:bg-gradient-to-r sm:from-[#15191E]/95 sm:via-[#15191E]/55 sm:to-black/20"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end lg:items-center">
          
          {/* LEFT: Hero Editorial Content & Men's / Women's Action Suite */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Official Brand Badge with New Mark + Monogram */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider text-slate-100 shadow-xl">
              <img 
                src="/assets/brand/logos/mark_monogram_cyan.png" 
                alt="High Draw Mark + Monogram" 
                className="h-5 w-auto object-contain" 
              />
              <span className="font-mono text-[11px] tracking-widest text-[#38BDF8] uppercase font-bold">
                180 GSM TOUR MICRO-PIQUE &bull; CUSTOM EMBROIDERY &bull; $48
              </span>
            </div>

            {/* Luxury Editorial Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.02] text-white drop-shadow-lg tracking-tight">
                Designed for Sport. <br />
                <span className="font-normal italic text-slate-200">Crafted for Life.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed pt-1">
                Feel the fabric. The exact same 180 GSM micro-pique stretch blend as $125 legacy boutique brands, custom embroidered to order with your choice of 4 official High Draw marks and 4 thread colors—or optional clean finish. Direct for $48.
              </p>
            </div>

            {/* Primary Action Suite: SHOP POLOS + Direct Men's / Women's Selection */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={onScrollToShop}
                  className="px-8 py-4 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-[0.16em] transition-all rounded-xs shadow-2xl flex items-center justify-center gap-3 group active:scale-95 cursor-pointer"
                >
                  <span>SHOP POLOS &bull; $48</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Split Men's & Women's Quick Decision Suite */}
                <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center">
                  <button
                    onClick={onShopMens || onScrollToShop}
                    className="px-5 py-4 bg-white/15 hover:bg-white text-white hover:text-[#15191E] backdrop-blur-md border border-white/30 font-bold text-xs uppercase tracking-[0.14em] transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>MEN'S POLOS</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={onShopWomens || onScrollToShop}
                    className="px-5 py-4 bg-white/15 hover:bg-white text-white hover:text-[#15191E] backdrop-blur-md border border-white/30 font-bold text-xs uppercase tracking-[0.14em] transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>WOMEN'S POLOS</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={onScrollToWhy}
                  className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#38BDF8] hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Explore The Craftsmanship Lab &rarr;
                </button>
                <span className="text-white/30 hidden sm:inline">&bull;</span>
                <span className="text-[11px] font-mono text-slate-300">
                  Available in Men's S–4XL &amp; Women's XS–4XL
                </span>
              </div>
            </div>

            {/* Direct Reassurance Micro-Copy */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-[12px] text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#38BDF8] shrink-0" />
                <span>180 GSM Matte Micro-Pique</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#38BDF8] shrink-0" />
                <span>4 Official Logo Marks + Optional Clean</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <span>100+ Washes Guarantee</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Elevated Bespoke Embroidery Suite Showcase Card */}
          <div className="lg:col-span-5 hidden md:block">
            <div className="bg-[#15191E]/85 backdrop-blur-xl border border-white/20 rounded-xs p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#38BDF8]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8] font-bold">
                    BESPOKE EMBROIDERY SUITE
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 uppercase font-semibold">
                  Included Free
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-white">
                  Customize Every Shirt &amp; Colorway
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Select your preferred official High Draw lockup and thread color on any Men's or Women's garment—or order unbranded.
                </p>
              </div>

              {/* 4 Official Logo Lockups Visual Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={onScrollToShop}
                  className="p-3 rounded-xs bg-[#1E293B]/90 border border-white/15 hover:border-[#38BDF8] transition-all cursor-pointer flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-2xs bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0 p-1.5">
                    <img
                      src="/assets/brand/logos/mark_monogram_gold.png"
                      alt="Mark + Monogram"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-white block truncate">Mark + Monogram</span>
                    <span className="text-[9px] font-mono text-amber-400 uppercase block">H · Tracer · D</span>
                  </div>
                </div>

                <div
                  onClick={onScrollToShop}
                  className="p-3 rounded-xs bg-[#1E293B]/90 border border-white/15 hover:border-[#38BDF8] transition-all cursor-pointer flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-2xs bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0 p-1.5">
                    <img
                      src="/assets/brand/logos/mark_only_cyan.png"
                      alt="Mark-Only"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-white block truncate">Mark-Only</span>
                    <span className="text-[9px] font-mono text-[#38BDF8] uppercase block">Apex Tracer + Pin</span>
                  </div>
                </div>

                <div
                  onClick={onScrollToShop}
                  className="p-3 rounded-xs bg-[#1E293B]/90 border border-white/15 hover:border-[#38BDF8] transition-all cursor-pointer flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-2xs bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0 p-1.5">
                    <img
                      src="/assets/brand/logos/monogram_white.png"
                      alt="Monogram HD"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-white block truncate">Monogram (HD)</span>
                    <span className="text-[9px] font-mono text-slate-300 uppercase block">Serif Initials</span>
                  </div>
                </div>

                <div
                  onClick={onScrollToShop}
                  className="p-3 rounded-xs bg-[#1E293B]/90 border border-white/15 hover:border-[#38BDF8] transition-all cursor-pointer flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-2xs bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0 p-1.5">
                    <img
                      src="/assets/brand/logos/mark_text_cyan.png"
                      alt="Mark + Text"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-white block truncate">Mark + Text</span>
                    <span className="text-[9px] font-mono text-[#38BDF8] uppercase block">Full Lockup</span>
                  </div>
                </div>
              </div>

              {/* Thread Color Palette Footer */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase text-slate-400">Thread Colors:</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#00A3FF] border border-white/40" title="Cyan Tracer" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E5A900] border border-white/40" title="Championship Gold" />
                  <span className="w-3.5 h-3.5 rounded-full bg-white border border-white/40" title="Crisp White" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#111827] border border-white/60" title="Onyx Black" />
                </div>
                <span className="font-mono text-[10px] text-slate-300">+ Optional No-Logo</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Sub-Hero 4-Column Luxury Architecture Ribbon */}
      <div className="bg-[#1C2C24] text-white border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#38BDF8] font-mono font-bold text-xs">01</span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">180 GSM Micro-Pique</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">Subtle tailored drape with zero cling or synthetic gym shine.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#38BDF8] font-mono font-bold text-xs">02</span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">4 Official Marks + Clean</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">Choose Monogram, Mark-Only, Mark + Monogram, Mark + Text, or Unbranded.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#38BDF8] font-mono font-bold text-xs">03</span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">100+ Washes Guarantee</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">Machine wash cold. Won't shrink, fade, or roll into bacon.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#38BDF8] font-mono font-bold text-xs">04</span>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">Honest $48 Pricing</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">Boutique championship quality without the $125 retail markup.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
