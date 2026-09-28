import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface FullscreenHeroProps {
  heroImage: string;
  onScrollToShop: () => void;
  onScrollToWhy: () => void;
}

export const FullscreenHero: React.FC<FullscreenHeroProps> = ({
  heroImage,
  onScrollToShop,
  onScrollToWhy,
}) => {
  return (
    <div>
      <section className="relative w-full h-[88vh] min-h-[640px] max-h-[880px] flex items-end sm:items-center justify-start overflow-hidden bg-[#15191E] text-white">
        
        {/* Picture-Heavy Full Bleed Lifestyle Photography */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="High Draw Golf Tour Performance Lifestyle" 
            className="w-full h-full object-cover object-top sm:object-center transition-all duration-700 brightness-95"
          />
          {/* Subtle Film Grain & Luxury Radial Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#15191E] via-black/40 to-transparent sm:bg-gradient-to-r sm:from-[#15191E]/90 sm:via-[#15191E]/40 sm:to-transparent"></div>
        </div>

        {/* Hero Content (Clean Peter Millar / Straight Down Editorial Architecture) */}
        <div className="relative z-10 max-w-3xl mx-auto sm:mx-0 sm:ml-12 md:ml-20 lg:ml-28 p-6 sm:p-0 pb-16 sm:pb-0 space-y-7 text-left">
          
          {/* Official Brand Badge with Cyan Tracer Mark */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider text-slate-100 shadow-xl">
            <img 
              src="/assets/logo_tracer_cyan.png" 
              alt="High Draw Tracer" 
              className="h-4 w-auto object-contain" 
            />
            <span className="font-mono text-[11px] tracking-widest text-[#38BDF8] uppercase font-bold">
              180 GSM TOUR MICRO-PIQUE &bull; $48
            </span>
          </div>

          {/* Luxury Editorial Headline */}
          <div className="space-y-2">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.02] text-white drop-shadow-lg tracking-tight">
              Designed for Sport. <br />
              <span className="font-normal italic text-slate-200">Crafted for Life.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-200 max-w-xl font-normal leading-relaxed pt-2">
              Tour-grade micro-pique drape, fused stay-flat collar architecture, and zero $125 country club markup. Built for 18 holes and the clubhouse.
            </p>
          </div>

          {/* Action Suite: Primary CTA + Craftsmanship Link */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onScrollToShop}
              className="px-8 py-4 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-[0.15em] transition-all rounded-xs shadow-2xl flex items-center justify-center gap-3 group active:scale-95 cursor-pointer"
            >
              <span>SHOP MEN'S POLOS &bull; $48</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onScrollToWhy}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-xs uppercase tracking-[0.15em] transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>THE CRAFTSMANSHIP LAB</span>
            </button>
          </div>

          {/* Direct Reassurance Micro-Copy */}
          <div className="flex flex-wrap items-center gap-6 pt-3 text-[12px] text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#38BDF8] shrink-0" />
              <span>Matte Micro-Pique Drape</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#38BDF8] shrink-0" />
              <span>Stay-Flat Fused Collar Stand</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
              <span>100+ Washes Guarantee</span>
            </div>
          </div>

        </div>

      </section>

      {/* Sub-Hero 4-Column Luxury Architecture Ribbon (Straight Down / Peter Millar Standard) */}
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
              <span className="font-bold text-white uppercase tracking-wider block text-[11px]">Stay-Flat Collar Stand</span>
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">Fused interlining holds its crisp shape under quarter-zips or open.</span>
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
              <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">Boutique country club quality without the $125 markup.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
