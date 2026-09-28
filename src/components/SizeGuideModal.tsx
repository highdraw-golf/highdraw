import React from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white text-[#1A1F26] rounded-sm p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#B12535] uppercase font-bold">
              PERFECT FAIRWAY FIT GUARANTEE
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1A1F26]">
              High Draw Sizing Guide &amp; Fit Advisor
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-black transition-colors cursor-pointer"
            aria-label="Close Size Guide"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fit Philosophy */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C2C24]">
            <CheckCircle2 size={16} className="text-emerald-700" />
            <span>Classic Fairway Drape (Engineered for 40+ Golfers)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our polos are tailored through the chest and shoulders for a crisp athletic silhouette, with a comfortable, unrestricted drape over the midsection. They are cut 1.5 inches longer than standard street tees so they stay neatly tucked through full driver swings.
          </p>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#1C2C24] text-white">
                <th className="py-2.5 px-3 font-bold">Size</th>
                <th className="py-2.5 px-3 font-bold">Chest (in)</th>
                <th className="py-2.5 px-3 font-bold">Length (in)</th>
                <th className="py-2.5 px-3 font-bold">Sleeve (in)</th>
                <th className="py-2.5 px-3 font-bold">Typical Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold font-sans">S</td>
                <td className="py-2.5 px-3">37 - 39</td>
                <td className="py-2.5 px-3">29.0</td>
                <td className="py-2.5 px-3">9.0</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">145 - 165 lbs</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold font-sans">M</td>
                <td className="py-2.5 px-3">40 - 42</td>
                <td className="py-2.5 px-3">29.5</td>
                <td className="py-2.5 px-3">9.5</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">165 - 185 lbs</td>
              </tr>
              <tr className="bg-emerald-50/60 font-semibold">
                <td className="py-2.5 px-3 font-bold font-sans text-[#1C2C24]">L (Most Popular)</td>
                <td className="py-2.5 px-3 text-[#1C2C24]">43 - 45</td>
                <td className="py-2.5 px-3 text-[#1C2C24]">30.5</td>
                <td className="py-2.5 px-3 text-[#1C2C24]">10.0</td>
                <td className="py-2.5 px-3 font-sans text-slate-700">185 - 210 lbs</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold font-sans">XL</td>
                <td className="py-2.5 px-3">46 - 48</td>
                <td className="py-2.5 px-3">31.5</td>
                <td className="py-2.5 px-3">10.5</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">210 - 235 lbs</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold font-sans">2XL</td>
                <td className="py-2.5 px-3">49 - 52</td>
                <td className="py-2.5 px-3">32.5</td>
                <td className="py-2.5 px-3">11.0</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">235 - 260 lbs</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold font-sans">3XL</td>
                <td className="py-2.5 px-3">53 - 56</td>
                <td className="py-2.5 px-3">33.5</td>
                <td className="py-2.5 px-3">11.5</td>
                <td className="py-2.5 px-3 font-sans text-slate-500">260+ lbs</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 30-Day Guarantee Footer */}
        <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 border-t border-slate-200">
          <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
          <span>If the fit isn’t 100% ideal, we provide free domestic size exchanges under our 30-Day Fairway Guarantee.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#1C2C24] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
        >
          GOT IT — BACK TO SELECTION
        </button>

      </div>
    </div>
  );
};
