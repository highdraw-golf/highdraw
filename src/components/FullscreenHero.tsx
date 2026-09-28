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
    <section className="relative w-full h-screen min-h-[680px] flex items-end sm:items-center justify-start overflow-hidden bg-[#1E2229] text-white">
      
      {/* Picture-Heavy Full Bleed Lifestyle Photography */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="High Draw Golf Lifestyle" 
          className="w-full h-full object-cover object-top sm:object-center transition-all duration-700 brightness-95"
        />
        {/* Soft Natural Gradient Overlay (Text Light, Picture Heavy) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent sm:bg-gradient-to-r sm:from-black/85 sm:via-black/45 sm:to-transparent"></div>
      </div>

      {/* Hero Content (Minimal Text, Clean Peter Millar / Straight Down Aesthetic) */}
      <div className="relative z-10 max-w-2xl mx-auto sm:mx-0 sm:ml-12 md:ml-20 p-6 sm:p-0 pb-14 sm:pb-0 space-y-6 text-left">
        
        {/* Official Brand Badge with Cyan Tracer Mark */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold tracking-wider text-slate-100 shadow-md">
          <img 
            src="/assets/logo_tracer_cyan.png" 
            alt="High Draw Tracer" 
            className="h-4 w-auto object-contain" 
          />
          <span className="font-mono text-[11px] tracking-widest text-[#7DD3FC]">
            TOUR-GRADE MICRO-PIQUE &bull; $48
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-white drop-shadow-md">
          Designed for Sport. <br />
          <span className="font-normal italic text-slate-200">Crafted for Life.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-200 max-w-lg font-normal leading-relaxed">
          Tour-grade micro-pique polos at $48. Zero $115 country club tax. Built for 18 holes and dinner.
        </p>

        {/* Unmissable Direct Buy Button + Learn More */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onScrollToShop}
            className="px-8 py-4 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-sm uppercase tracking-wider transition-all rounded-sm shadow-xl flex items-center justify-center gap-3 group active:scale-95"
          >
            <span>SHOP MEN'S POLOS &bull; $48</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onScrollToWhy}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-all rounded-sm flex items-center justify-center gap-2"
          >
            <span>EXPLORE CRAFTSMANSHIP</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#38BDF8] shrink-0" />
            <span>Matte Micro-Pique Drape</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#38BDF8] shrink-0" />
            <span>Stay-Flat Collar Stand</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#38BDF8] shrink-0" />
            <span>100+ Washes Guarantee</span>
          </div>
        </div>

      </div>

    </section>
  );
};
