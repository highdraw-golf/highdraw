import React from 'react';
import { Check, X, Award } from 'lucide-react';

export const ComparisonMatrix: React.FC = () => {
  const metrics = [
    {
      label: 'Fabric Surface & Sheen',
      legacy: 'Slick synthetic gym-shirt shine',
      highDraw: 'Matte breathable micro-pique (zero shine)',
      isBetter: true,
    },
    {
      label: 'Collar Wash Life',
      legacy: 'Curls into bacon fold after 3 washes',
      highDraw: 'Fused stay-flat ribbed collar stand',
      isBetter: true,
    },
    {
      label: 'Logo & Branding',
      legacy: 'Loud chest billboard or corporate swag',
      highDraw: 'Understated 6,200-stitch nape yoke tracer',
      isBetter: true,
    },
    {
      label: 'Cut & Swing Freedom',
      legacy: 'Binds across upper back / untucks on follow-through',
      highDraw: 'Zero-distraction armhole drape & extended hem',
      isBetter: true,
    },
    {
      label: 'Price & Retail Tax',
      legacy: '$110 – $135 Country Club Tax',
      highDraw: '$48 Direct-to-Player Fair Price',
      isBetter: true,
    },
  ];

  return (
    <section id="dossier" className="py-20 px-6 max-w-7xl mx-auto hairline-b bg-[#FBFBFA]">
      
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C03221] font-semibold block">
          THE ECONOMIC ARBITRAGE
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-[#090C10] font-normal tracking-tight-editorial">
          Why Pay the $110 Country Club Tax?
        </h2>
        <p className="font-sans text-sm md:text-base text-slate-500 font-light leading-relaxed">
          Golfers paying $115 for boutique apparel aren’t buying triple the quality; they’re paying for traditional retail markup and corporate sponsorships.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="max-w-4xl mx-auto bg-white hairline-all shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-[#0D1B2A] text-white p-5 font-mono text-[11px] uppercase tracking-[0.2em]">
          <div className="col-span-5 md:col-span-4 text-slate-400">GARMENT METRIC</div>
          <div className="col-span-3 md:col-span-4 text-slate-400 hidden md:block">TYPICAL BRAND ($115)</div>
          <div className="col-span-7 md:col-span-4 text-[#C03221] font-semibold flex items-center gap-1.5">
            <Award size={14} />
            <span>HIGH DRAW ($48)</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-200">
          {metrics.map((m, idx) => (
            <div key={idx} className="grid grid-cols-12 p-5 items-center font-sans text-xs hover:bg-[#FBFBFA] transition-colors">
              <div className="col-span-5 md:col-span-4 font-mono font-medium text-[#090C10] text-[11px] uppercase tracking-wider">
                {m.label}
              </div>
              <div className="col-span-3 md:col-span-4 text-slate-500 font-light hidden md:flex items-center gap-2">
                <X size={14} className="text-rose-500 shrink-0" />
                <span>{m.legacy}</span>
              </div>
              <div className="col-span-7 md:col-span-4 font-medium text-[#090C10] flex items-center gap-2 bg-emerald-50/50 p-2 border border-emerald-200/60 rounded-sm">
                <Check size={14} className="text-emerald-700 shrink-0 font-bold" />
                <span className="text-emerald-950 font-semibold">{m.highDraw}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="bg-[#FBFBFA] p-5 hairline-t text-center font-mono text-[11px] text-slate-500">
          FULFILLED ON DEMAND VIA PRINTIFY &bull; ZERO WASTEFUL OVERHEAD &bull; 100% QUALITY GUARANTEE
        </div>

      </div>

    </section>
  );
};
