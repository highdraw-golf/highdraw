import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, RefreshCw, Shirt, ArrowRight } from 'lucide-react';

interface WhyHighDrawProps {
  onScrollToShop?: () => void;
}

export const WhyHighDraw: React.FC<WhyHighDrawProps> = ({ onScrollToShop }) => {
  return (
    <section id="why" className="w-full py-24 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-[#F9F9F8] border-b border-slate-200">
      
      {/* Editorial Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C2C24]/10 text-[#1C2C24] text-[11px] font-bold tracking-widest uppercase">
          <img 
            src="/assets/logo_tracer_cyan.png" 
            alt="Tracer" 
            className="h-3.5 w-auto object-contain"
          />
          <span>THE HIGH DRAW CRAFTSMANSHIP STANDARD</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1A1F26] font-bold tracking-tight">
          Built for Dedicated Weekenders. <br />
          <span className="italic font-normal text-slate-600">Engineered for 100+ Fairways.</span>
        </h2>

        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We eliminated the $125 legacy retail markup to build the ultimate mid-market golf shirt: tour-grade 4-way stretch drape, fused stay-flat collar engineering, and zero synthetic gym sheen.
        </p>
      </div>

      {/* Editorial Split Feature Showcase */}
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Feature 1: The Stay-Flat Collar Construction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-slate-200 p-8 sm:p-12 rounded-sm shadow-xs">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-[#B12535] text-xs font-bold uppercase tracking-widest">
              <Shirt size={16} />
              <span>CRAFTSMANSHIP PILLAR 01</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1F26] font-bold leading-snug">
              The Permanent Stay-Flat Collar Stand
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The single biggest frustration in golf apparel is a collar that curls up or rolls flat after three washes. High Draw features a proprietary fused interlining collar stand engineered to maintain its tailored structure whether worn open under the sun or tucked under an autumn quarter-zip.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2C24]">
                  <RefreshCw size={14} className="text-[#38BDF8]" />
                  <span>100+ Washes Guarantee</span>
                </div>
                <p className="text-[12px] text-slate-500">Won’t fray, bacon, or lose its shape in cold or warm machine wash cycles.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2C24]">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>Fused Placket Memory</span>
                </div>
                <p className="text-[12px] text-slate-500">Mother-of-pearl engraved buttons set on a reinforced structured 3-button placket.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 shadow-md">
            <img 
              src="/assets/craft_collar_macro.jpg" 
              alt="High Draw Stay-Flat Collar Craftsmanship" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1.5 rounded-xs flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#38BDF8]" />
              <span>FUSED STAY-FLAT COLLAR STAND</span>
            </div>
          </div>

        </div>

        {/* Feature 2: Tour Drape & Zero Gym Sheen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-slate-200 p-8 sm:p-12 rounded-sm shadow-xs">
          
          <div className="lg:col-span-6 relative aspect-[4/3] order-2 lg:order-1 rounded-sm overflow-hidden border border-slate-200 shadow-md">
            <img 
              src="/assets/lifestyle_coastal_18th.jpg" 
              alt="High Draw Fairway Drape in Action" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1.5 rounded-xs flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#38BDF8]" />
              <span>180 GSM MATTE MICRO-PIQUE</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="flex items-center gap-2 text-[#B12535] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={16} />
              <span>CRAFTSMANSHIP PILLAR 02</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1F26] font-bold leading-snug">
              Matte Micro-Pique. <br />
              <span className="font-normal italic text-slate-600">Zero Synthetic Gym Sheen.</span>
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Cheap athletic polyester has a shiny gloss that clings to your stomach. High Draw utilizes an ultra-fine 180 GSM yarn-dyed micro-pique with a refined matte drape. It breathes in 90-degree summer humidity, hides perspiration, and looks tailored for the clubhouse dining room.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span><strong>4-Way Mechanical Stretch:</strong> Complete freedom on full driver shoulder turns without pulling out of your waistband.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span><strong>UPF 50+ Solar Shield:</strong> All-day UV skin protection woven directly into the technical yarns.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span><strong>Tailored Fit for Weekenders:</strong> Structured through the chest and shoulders, with comfortable drape around the waist.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Feature 3: The Mid-Market Value Breakdown ($48 vs $125) */}
        <div className="bg-[#1C2C24] text-white p-8 sm:p-14 rounded-sm space-y-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
              THE HONEST MID-MARKET MATH
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold">
              Why We Charge $48 Instead of $125
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Golfers paying $115 to $135 for legacy boutique brands aren't paying for 3x the fabric quality — they're paying for corporate tour sponsorships, multi-tier distributor markups, and luxury retail overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
            
            {/* The Traditional Boutique Brand */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xs space-y-4">
              <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Legacy Boutique Brand</span>
                <span className="font-mono text-2xl font-bold text-red-400">$125+</span>
              </div>
              <ul className="text-xs space-y-2.5 text-slate-300">
                <li className="flex justify-between"><span>Micro-pique technical fabric &amp; buttons</span> <span className="font-mono">$18.00</span></li>
                <li className="flex justify-between text-slate-400"><span>Tour player endorsement contracts</span> <span className="font-mono">$32.00</span></li>
                <li className="flex justify-between text-slate-400"><span>Multi-tier wholesale distribution layers</span> <span className="font-mono">$45.00</span></li>
                <li className="flex justify-between text-slate-400"><span>Boutique designer markup</span> <span className="font-mono">$30.00</span></li>
              </ul>
            </div>

            {/* The High Draw Direct Model */}
            <div className="bg-white/10 border-2 border-[#38BDF8] p-6 rounded-xs space-y-4 relative shadow-lg">
              <div className="absolute -top-3 right-4 bg-[#B12535] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                HIGH DRAW STANDARD
              </div>
              <div className="flex justify-between items-baseline border-b border-white/20 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white">The High Draw Tour Performance Polo</span>
                <span className="font-mono text-2xl font-bold text-[#38BDF8]">$48</span>
              </div>
              <ul className="text-xs space-y-2.5 text-slate-200">
                <li className="flex justify-between font-semibold"><span>Identical 180 GSM micro-pique &amp; stay-flat collar</span> <span className="font-mono">$18.00</span></li>
                <li className="flex justify-between text-slate-400"><span>PGA Tour player endorsement bloat</span> <span className="font-mono">$0.00</span></li>
                <li className="flex justify-between text-slate-400"><span>Multi-tier distribution markups</span> <span className="font-mono">$0.00</span></li>
                <li className="flex justify-between font-semibold text-[#38BDF8]"><span>Direct-to-golfer pricing</span> <span className="font-mono">$48.00 complete</span></li>
              </ul>
            </div>

          </div>

          {onScrollToShop && (
            <div className="text-center pt-4">
              <button
                onClick={onScrollToShop}
                className="px-8 py-4 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-wider transition-all rounded-sm shadow-lg inline-flex items-center gap-2"
              >
                <span>SHOP TOUR-GRADE POLOS &bull; $48</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
