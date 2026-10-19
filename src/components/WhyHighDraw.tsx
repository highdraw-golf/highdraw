import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw, Shirt, ArrowRight, Award } from 'lucide-react';

interface WhyHighDrawProps {
  onScrollToShop?: () => void;
}

export const WhyHighDraw: React.FC<WhyHighDrawProps> = ({ onScrollToShop }) => {
  return (
    <section id="why" className="w-full py-28 lg:py-36 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-[#FBFBFA] border-b border-slate-200">
      
      {/* Editorial Section Header */}
      <div className="max-w-4xl mx-auto text-center space-y-5 mb-24 lg:mb-32">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C2C24]/10 text-[#1C2C24] text-[11px] font-mono tracking-widest uppercase">
          <img 
            src="/assets/brand/logo_tracer_cyan.png" 
            alt="Tracer" 
            className="h-3.5 w-auto object-contain"
          />
          <span>THE HIGH DRAW CRAFTSMANSHIP STANDARD</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1A1F26] font-bold tracking-tight">
          Built for Dedicated Weekenders. <br />
          <span className="italic font-normal text-slate-500">Engineered for 100+ Fairways.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
          We eliminated the $125 legacy boutique retail tax to build the ultimate mid-market golf shirt: tour-grade 4-way stretch drape, breathable 4-way stretch drape, and honest  pricing.
        </p>
      </div>

      {/* Spaced-Out Editorial Feature Spreads (Zero Boxed Cards) */}
      <div className="max-w-7xl mx-auto space-y-28 lg:space-y-36">
        
        {/* Feature 1: The Stay-Flat Collar Construction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-7">
            <div className="flex items-center gap-2 text-[#B12535] text-xs font-bold uppercase tracking-widest">
              <Shirt size={16} />
              <span>CRAFTSMANSHIP PILLAR 01</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1F26] font-bold leading-tight">
              Senior Athletic Fit & Freedom of Motion
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              Most golf shirts are either suffocatingly tight modern slim cuts or baggy gym shirts that cling awkwardly. High Draw is engineered around real golfer feedback: structured cleanly across the shoulders and chest with comfortable ease through the torso, giving you total freedom of movement through the driver apex.
            </p>

            {/* Master Tailor's Challenge (Editorial Hairline Callout) */}
            <div className="pt-6 pb-2 border-y border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C2C24]">
                <Award size={16} className="text-[#B12535]" />
                <span>40+ Years of Golfer Feedback</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Take any $120 polo in your closet and wash it next to High Draw 10 times. If our fused collar stand rolls or curls into bacon, we will ship a replacement or refund you 100%.
              </p>
            </div>

            {/* Two Hallmarks Divided by Clean Hairline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C2C24]">
                  <RefreshCw size={14} className="text-[#38BDF8]" />
                  <span>100+ Washes Guarantee</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Won&rsquo;t fray, bacon, or lose its shape in cold or warm machine wash cycles.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C2C24]">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  <span>Clean 3-Button Placket</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mother-of-pearl engraved buttons set on a reinforced structured 3-button placket.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-xs overflow-hidden shadow-xl border border-slate-200/60 group">
            <img 
              src="/assets/founder/ken_tee_shot_backswing.jpg" 
              alt="High Draw Stay-Flat Collar Craftsmanship" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute bottom-5 left-5 bg-black/80 backdrop-blur-md text-white text-[11px] font-mono px-3.5 py-1.5 rounded-xs flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#38BDF8]" />
              <span>SENIOR ATHLETIC FAIRWAY CUT</span>
            </div>
          </div>

        </div>

        {/* Feature 2: Tour Drape & Zero Gym Sheen (Alternating Magazine Spread) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 relative aspect-[4/3] order-2 lg:order-1 rounded-xs overflow-hidden shadow-xl border border-slate-200/60 group">
            <img 
              src="/assets/products/editorial/men_polo_navy_course.jpg" 
              alt="High Draw Fairway Drape in Action" 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute bottom-5 left-5 bg-black/80 backdrop-blur-md text-white text-[11px] font-mono px-3.5 py-1.5 rounded-xs flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#38BDF8]" />
              <span>180 GSM MATTE MICRO-PIQUE</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-7 order-1 lg:order-2">
            <div className="flex items-center gap-2 text-[#B12535] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={16} />
              <span>CRAFTSMANSHIP PILLAR 02</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1F26] font-bold leading-tight">
              Matte Micro-Pique. <br />
              <span className="font-normal italic text-slate-500">Zero Synthetic Gym Sheen.</span>
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              Cheap athletic polyester has a shiny gloss that clings to your stomach. High Draw utilizes an ultra-fine 180 GSM yarn-dyed micro-pique with a refined matte drape. It breathes in 90-degree summer humidity, hides perspiration, and looks tailored for the clubhouse dining room.
            </p>

            {/* Three Typographic Hallmarks */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 pb-3 border-b border-slate-200/70">
                <span className="font-mono text-xs font-bold text-[#B12535] mt-0.5">01</span>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1A1F26]">4-Way Mechanical Stretch</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Complete rotational freedom through full driver swings without pulling out of your waistband.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pb-3 border-b border-slate-200/70">
                <span className="font-mono text-xs font-bold text-[#B12535] mt-0.5">02</span>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1A1F26]">UPF 50+ Solar Shield</h4>
                  <p className="text-xs text-slate-500 mt-0.5">All-day UV protection woven directly into the technical yarns, not chemical dip-coatings that wash out.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="font-mono text-xs font-bold text-[#B12535] mt-0.5">03</span>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1A1F26]">Tailored Fit for Dedicated Weekenders</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Structured across the shoulders and chest with a flattering, unrestrictive drape through the midsection.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature 3: The Mid-Market Value Ledger (Architectural Ledger Table, Not Boxed Cards) */}
        <div className="bg-[#1C2C24] text-white py-14 px-6 sm:px-12 lg:px-16 rounded-xs shadow-2xl space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
              THE HONEST MID-MARKET MATH
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
              Why We Charge $48 Instead of $125
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-xl mx-auto">
              Golfers paying $115 to $135 for legacy boutique brands aren&rsquo;t paying for 3x the fabric quality — they&rsquo;re paying for corporate tour sponsorships, multi-tier distributor markups, and country-club retail overhead.
            </p>
          </div>

          {/* Architectural Comparison Ledger */}
          <div className="max-w-4xl mx-auto overflow-hidden border border-white/15 rounded-xs">
            <div className="grid grid-cols-12 bg-white/5 border-b border-white/15 text-xs font-mono uppercase tracking-wider py-3.5 px-4 sm:px-6 font-bold">
              <div className="col-span-6 sm:col-span-7 text-slate-300">Cost &amp; Quality Breakdown</div>
              <div className="col-span-3 sm:col-span-3 text-right text-slate-400">Legacy Boutique</div>
              <div className="col-span-3 sm:col-span-2 text-right text-[#38BDF8]">High Draw</div>
            </div>

            <div className="divide-y divide-white/10 text-xs sm:text-sm font-sans">
              <div className="grid grid-cols-12 py-3 px-4 sm:px-6 items-center">
                <div className="col-span-6 sm:col-span-7 text-slate-200">
                  <span className="font-semibold block">180 GSM Micro-Pique Fabric &amp; Stay-Flat Collar</span>
                  <span className="text-[11px] text-slate-400">Yarn-dyed 4-way stretch knit &amp; fused placket</span>
                </div>
                <div className="col-span-3 sm:col-span-3 text-right font-mono text-slate-300">$22.00</div>
                <div className="col-span-3 sm:col-span-2 text-right font-mono text-white font-bold">$22.00</div>
              </div>

              <div className="grid grid-cols-12 py-3 px-4 sm:px-6 items-center">
                <div className="col-span-6 sm:col-span-7 text-slate-200">
                  <span className="font-semibold block">Tour Endorsement Contracts</span>
                  <span className="text-[11px] text-slate-400">Paying pro tour players to wear logos on TV</span>
                </div>
                <div className="col-span-3 sm:col-span-3 text-right font-mono text-red-400">$32.00</div>
                <div className="col-span-3 sm:col-span-2 text-right font-mono text-[#38BDF8] font-bold">$0.00</div>
              </div>

              <div className="grid grid-cols-12 py-3 px-4 sm:px-6 items-center">
                <div className="col-span-6 sm:col-span-7 text-slate-200">
                  <span className="font-semibold block">Wholesale Middlemen &amp; Distributor Markups</span>
                  <span className="text-[11px] text-slate-400">Multiple corporate middleman profit cuts</span>
                </div>
                <div className="col-span-3 sm:col-span-3 text-right font-mono text-red-400">$45.00</div>
                <div className="col-span-3 sm:col-span-2 text-right font-mono text-[#38BDF8] font-bold">$0.00</div>
              </div>

              <div className="grid grid-cols-12 py-3 px-4 sm:px-6 items-center">
                <div className="col-span-6 sm:col-span-7 text-slate-200">
                  <span className="font-semibold block">Direct Platform &amp; Fair Maker Margin</span>
                  <span className="text-[11px] text-slate-400">Honest craft pricing delivered direct to fairways</span>
                </div>
                <div className="col-span-3 sm:col-span-3 text-right font-mono text-slate-300">$26.00</div>
                <div className="col-span-3 sm:col-span-2 text-right font-mono text-white font-bold">$26.00</div>
              </div>

              {/* Total Row */}
              <div className="grid grid-cols-12 py-4 px-4 sm:px-6 bg-white/10 items-center font-bold">
                <div className="col-span-6 sm:col-span-7 text-white font-serif text-base sm:text-lg">
                  Final Golfer Retail Price
                </div>
                <div className="col-span-3 sm:col-span-3 text-right font-mono text-lg sm:text-xl text-red-400 line-through">
                  $125.00
                </div>
                <div className="col-span-3 sm:col-span-2 text-right font-mono text-xl sm:text-2xl text-[#38BDF8]">
                  $48.00
                </div>
              </div>
            </div>
          </div>

          {onScrollToShop && (
            <div className="text-center pt-2">
              <button
                onClick={onScrollToShop}
                className="px-8 py-4 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xs shadow-lg inline-flex items-center gap-2 cursor-pointer"
              >
                <span>EXPERIENCE TOUR DRAPE &bull; $48</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
