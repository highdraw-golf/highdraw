import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface FullscreenHeroProps {
  heroImage: string;
  onScrollToShop: () => void;
  onOpenPipes: () => void;
  activeBoard: string;
}

export const FullscreenHero: React.FC<FullscreenHeroProps> = ({
  heroImage,
  onScrollToShop,
  onOpenPipes,
  activeBoard,
}) => {
  return (
    <section className="relative w-full h-screen min-h-[650px] flex items-end sm:items-center justify-start overflow-hidden bg-[#32363F] text-white">
      
      {/* Picture-Heavy Full Bleed Lifestyle Photography */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="High Draw Golf Lifestyle" 
          className="w-full h-full object-cover object-top sm:object-center transition-all duration-700"
        />
        {/* Soft Natural Gradient Overlay (Text Light, Picture Heavy) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/40 sm:to-transparent"></div>
      </div>

      {/* Hero Content (Minimal Text, Unmissable CTA) */}
      <div className="relative z-10 max-w-2xl mx-auto sm:mx-0 sm:ml-12 md:ml-20 p-6 sm:p-0 pb-12 sm:pb-0 space-y-6 text-left">
        
        {/* Pipe Board Badge */}
        <div 
          onClick={onOpenPipes}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-slate-200 cursor-pointer hover:bg-white/20 transition-all"
        >
          <Sparkles size={12} className="text-[#FDE022]" />
          <span>PIPE CURATED: {activeBoard}</span>
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

        {/* Unmissable Direct Buy Button */}
        <div className="pt-2">
          <button
            onClick={onScrollToShop}
            className="w-full sm:w-auto px-8 py-4 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-sm uppercase tracking-wider transition-all rounded-sm shadow-xl flex items-center justify-center gap-3 group"
          >
            <span>SHOP MEN'S POLOS &bull; $48</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Matte Micro-Pique Drape</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Stay-Flat Collar Stand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>30-Day Guarantee</span>
          </div>
        </div>

      </div>

    </section>
  );
};
