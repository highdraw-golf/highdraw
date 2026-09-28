import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
  onGoToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToHome,
  onGoToShop,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="bg-[#1C2C24] text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/assets/logo_tracer_cyan.png" alt="Tracer" className="h-4 w-auto object-contain" />
              <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                THE HIGH DRAW STORY
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold">
              Designed for Sport. Crafted for Life.
            </h1>
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
              Why we founded High Draw: to build tour-grade golf apparel for dedicated weekenders at an honest $48 price point.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1F26]">
            The Most Coveted Shot in Golf
          </h2>
          <p>
            In golf, the "high draw" is the signature shot of players who understand control. It starts out right, catches the apex, and curves gracefully back toward the flag with distance and soft landing. That same pursuit of precision and restraint inspired our apparel brand.
          </p>
        </div>

        <div className="aspect-[16/9] rounded-sm overflow-hidden border border-slate-200 shadow-md">
          <img src="/assets/lifestyle_coastal_18th.jpg" alt="Coastal 18th Fairway" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1F26]">
            Ending the $125 Country Club Tax
          </h2>
          <p>
            Walk into any pro shop or boutique golf retailer, and you will see synthetic performance polos priced between $115 and $140. We audited the manufacturing: the micro-pique yarn, fused collar stand, and pearl buttons cost identical amounts. The extra $80 goes to PGA Tour player endorsement retainers and boutique distributor margins.
          </p>
          <p>
            High Draw delivers directly to you: the player who plays on Saturday mornings, loves the game, and wants a collar that doesn't roll after three washes.
          </p>
        </div>

        <div className="p-8 bg-slate-50 border border-slate-200 rounded-xs space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#1A1F26]">Contact Our Team</h3>
          <p className="text-xs text-slate-600">
            For order inquiries, corporate scrambles, or sizing questions:
          </p>
          <div className="text-sm font-mono font-bold text-[#1C2C24]">
            highdrawgear@gmail.com
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-200">
          <button
            onClick={onGoToShop}
            className="px-8 py-4 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg inline-flex items-center gap-2"
          >
            <span>SHOP THE CORE POLO COLLECTION &bull; $48</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
