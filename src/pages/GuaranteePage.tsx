import React from 'react';
import { ArrowLeft, ShieldCheck, RefreshCw, Truck, ArrowRight } from 'lucide-react';

interface GuaranteePageProps {
  onBackToHome: () => void;
  onGoToShop: () => void;
}

export const GuaranteePage: React.FC<GuaranteePageProps> = ({
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
              <ShieldCheck size={18} className="text-[#38BDF8]" />
              <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                100% RISK-FREE FAIRWAY TRIAL
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold">
              The 30-Day Fairway Guarantee &amp; 100+ Washes Warranty
            </h1>
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
              We stand behind every shirt we stitch. Sweat in it on the course, wash it repeatedly. If it doesn't outperform your $120 polos, we'll refund you completely.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-xs space-y-4">
            <ShieldCheck size={32} className="text-emerald-700" />
            <h3 className="font-serif text-2xl font-bold text-[#1A1F26]">
              30-Day Play &amp; Wash Trial
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take High Draw to your home club. Play 18 holes, put it through your home washing machine, and dry it. If you aren't completely thrilled with the collar stiffness, fabric drape, and fit, return it within 30 days for a full refund or free size exchange.
            </p>
          </div>

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-xs space-y-4">
            <RefreshCw size={32} className="text-[#38BDF8]" />
            <h3 className="font-serif text-2xl font-bold text-[#1A1F26]">
              100+ Washes Collar Memory
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our fused interlining collar stand is warrantied to stay crisp through 100+ laundry cycles. If the collar curls into bacon, frays, or shrinks abnormally under care guidelines, contact highdrawgear@gmail.com and we will ship a replacement immediately.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-slate-200">
          <button
            onClick={onGoToShop}
            className="px-8 py-4 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg inline-flex items-center gap-2"
          >
            <span>SHOP RISK-FREE WITH 30-DAY TRIAL &bull; $48</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
