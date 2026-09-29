import React from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, RefreshCw, Shirt, ArrowRight } from 'lucide-react';

interface CraftsmanshipPageProps {
  onBackToHome: () => void;
  onGoToShop: () => void;
}

export const CraftsmanshipPage: React.FC<CraftsmanshipPageProps> = ({
  onBackToHome,
  onGoToShop,
}) => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Top Banner */}
      <div className="bg-[#1C2C24] text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#38BDF8] text-[11px] font-mono tracking-widest uppercase">
              <img src="/assets/brand/logo_tracer_cyan.png" alt="Tracer" className="h-3.5 w-auto object-contain" />
              <span>THE HIGH DRAW ENGINEERING LAB</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Collar Architecture &amp; The 10-Wash No-Bacon Guarantee
            </h1>
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
              Why traditional boutique golf polos curl into bacon after three washes — and how our fused interlining collar stand stays crisp through 100+ fairways.
            </p>
          </div>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        
        {/* Collar Deep Dive */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#B12535] text-xs font-bold uppercase tracking-widest">
            <Shirt size={16} />
            <span>INSPECTION POINT 01</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1A1F26]">
            The Anatomy of a Non-Curling Collar
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Most golf apparel brands cut corners by using standard single-layer self-fabric on the collar. The moment it hits warm water and dryer heat, the cotton fibers shrink at a different rate than the polyester knit, creating the notorious "bacon collar" that curls inward.
          </p>

          <div className="aspect-[16/9] rounded-sm overflow-hidden border border-slate-200 shadow-md">
            <img src="/assets/craft_collar_macro.jpg" alt="Macro Collar Detail" className="w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
              <span className="font-bold text-[#1C2C24] text-xs block">1. Fused Interlining Stand</span>
              <p className="text-xs text-slate-500">A heat-bonded micro-canvas spine embedded inside the collar prevents rolling.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
              <span className="font-bold text-[#1C2C24] text-xs block">2. Stay-Flat Placket</span>
              <p className="text-xs text-slate-500">Structured 3-button placket holds crisp vertical lines under sweaters.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
              <span className="font-bold text-[#1C2C24] text-xs block">3. 100+ Washes Memory</span>
              <p className="text-xs text-slate-500">Wash-tested across 100 industrial laundry cycles with zero collar deformation.</p>
            </div>
          </div>
        </div>

        {/* Fabric Drape & The $48 Honest Pricing */}
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 text-[#B12535] text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={16} />
            <span>INSPECTION POINT 02</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1A1F26]">
            180 GSM Matte Micro-Pique (Zero Gym Sheen)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Cheap athletic apparel has a high-sheen synthetic shine that accentuates every contour and clings to the midsection. High Draw utilizes an ultra-fine 180 GSM yarn-dyed micro-pique with a subtle matte texture. It drapes naturally over the waistband and provides complete swing rotation freedom without pulling.
          </p>

          <div className="aspect-[16/9] rounded-sm overflow-hidden border border-slate-200 shadow-md">
            <img src="/assets/lifestyle_coastal_18th.jpg" alt="Fairway Drape" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 bg-[#1C2C24] text-white rounded-sm text-center space-y-6">
          <h3 className="font-serif text-3xl font-bold">
            Experience the $48 Fairway Difference
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Try High Draw for 30 days. Play 18 holes, wash it repeatedly. If it’s not the best fitting polo in your closet, return it for a 100% refund.
          </p>
          <button
            onClick={onGoToShop}
            className="px-8 py-4 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg inline-flex items-center gap-2"
          >
            <span>SHOP MEN'S POLOS &bull; $48</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};
