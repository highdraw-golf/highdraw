import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Play } from 'lucide-react';

interface FounderSpotlightProps {
  onLearnMore?: () => void;
  onShopNow?: () => void;
}

export const FounderSpotlight: React.FC<FounderSpotlightProps> = ({
  onLearnMore,
  onShopNow,
}) => {
  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-[#1C2C24] text-white border-b border-slate-800 relative overflow-hidden">
      
      {/* Background Accent Grid / Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Pill & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#38BDF8] text-[11px] font-mono tracking-widest uppercase">
              <Compass size={14} />
              <span>THE CO-FOUNDER'S PERSPECTIVE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              40 Years of Golf. 47 States Played. <br />
              <span className="italic font-normal text-slate-300">One Obsession: The $48 Honest Tour Polo.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {onLearnMore && (
              <button
                onClick={onLearnMore}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-xs cursor-pointer border border-white/15 transition-all inline-flex items-center gap-2"
              >
                <span>Read Full Story</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Feature Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Visual Showcase (Tee Shot & Family Portrait) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 relative aspect-[4/5] rounded-xs overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src="/assets/founder/ken_tee_shot_backswing.jpg" 
                alt="Dr. Ken Cyree driver backswing" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" 
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xs border border-white/10 text-xs font-mono">
                <span className="text-white font-bold block">Dr. Ken Cyree &bull; 3.8 Index</span>
                <span className="text-[#38BDF8] text-[10px]">Tee Shot Apex Coil &bull; 40+ Years on Tour-Grade Fairways</span>
              </div>
            </div>

            <div className="sm:col-span-4 flex flex-col gap-4">
              <div className="relative aspect-square rounded-xs overflow-hidden border border-white/10 shadow-xl group">
                <img 
                  src="/assets/founder/ken_and_lori_portrait.jpg" 
                  alt="Ken and Lori Cyree" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Handicap Index</div>
                <div className="font-mono text-2xl font-bold text-[#38BDF8]">3.8</div>
                <div className="text-[11px] text-slate-300">Senior Athletic Drape</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">National Quest</div>
                <div className="font-mono text-2xl font-bold text-white">47 / 50</div>
                <div className="text-[11px] text-slate-400">States Played</div>
              </div>
            </div>
          </div>

          {/* Narrative & Quote */}
          <div className="lg:col-span-6 space-y-7">
            <blockquote className="text-lg sm:text-2xl font-serif leading-relaxed text-slate-100 italic border-l-4 border-[#38BDF8] pl-5 sm:pl-6">
              &ldquo;I traveled across 47 states playing golf. Paying $125 for a shirt you sweat through in Mississippi heat never sat right with me as a finance professor. High Draw captures the pure joy of a solid shot at an honest $48 price point.&rdquo;
            </blockquote>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Founded by <strong>Dr. Ken Cyree</strong> (Professor of Finance, former Dean of Business at Ole Miss) and his family, High Draw was born on real fairways. Ken is renowned for playing a consistent draw on every shot—the most coveted ball flight in golf for distance, control, and that unforgettable feeling of pure impact.
              </p>
              <p>
                By cutting out tour player sponsorships and luxury boutique markups, High Draw delivers tour-grade 180 GSM yarn-dyed micro-pique and a tailored athletic fit at less than half the price of legacy brands.
              </p>
            </div>

            {/* Hallmarks Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#38BDF8] mt-0.5 shrink-0" />
                <span className="text-xs text-slate-200">
                  <strong>Senior Athletic Cut:</strong> Comfort through the torso without baggy excess.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Play size={18} className="text-[#38BDF8] mt-0.5 shrink-0" />
                <span className="text-xs text-slate-200">
                  <strong>Signature High Draw:</strong> Engineered for rotational freedom through the swing.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="px-7 py-3.5 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg inline-flex items-center gap-2 transition-all hover:scale-102"
                >
                  <span>SHOP KEN'S PICK &bull; $48</span>
                  <ArrowRight size={14} />
                </button>
              )}
              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="text-xs font-mono text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Watch Ken's Range Swing Video &rarr;
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
