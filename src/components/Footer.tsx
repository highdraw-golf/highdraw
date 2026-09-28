import React, { useState } from 'react';
import { X, ShieldCheck, Truck, Lock, FileText } from 'lucide-react';

interface FooterProps {
  onSelectCategoryAndScroll?: (category: 'polos' | 'outerwear' | 'headwear' | 'bundles') => void;
  onScrollToSection?: (id: string) => void;
  onNavigate?: (view: 'home' | 'collection' | 'craftsmanship' | 'reviews' | 'guarantee' | 'about', category?: 'polos' | 'outerwear' | 'headwear' | 'bundles') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategoryAndScroll,
  onScrollToSection,
  onNavigate,
  onOpenAdmin,
}) => {
  const [modalType, setModalType] = useState<'guarantee' | 'shipping' | 'privacy' | 'terms' | null>(null);

  const handleNav = (
    view: 'home' | 'collection' | 'craftsmanship' | 'reviews' | 'guarantee' | 'about',
    category?: 'polos' | 'outerwear' | 'headwear' | 'bundles',
    sectionId?: string
  ) => {
    if (onNavigate) {
      onNavigate(view, category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (category && onSelectCategoryAndScroll) {
      onSelectCategoryAndScroll(category);
    } else if (sectionId && onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  return (
    <footer className="w-full bg-[#181C21] text-white pt-20 pb-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Brand & Category Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
          
          {/* Far Left Brand Identity */}
          <div className="md:col-span-5 space-y-4">
            <div 
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => handleNav('home')}
            >
              <img 
                src="/assets/logo_tracer_cyan.png" 
                alt="High Draw Ball Flight Tracer" 
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black tracking-[0.2em] text-white uppercase leading-none">
                  HIGH DRAW
                </span>
                <span className="text-[9px] font-mono tracking-[0.3em] text-slate-400 uppercase mt-0.5">
                  GOLF APPAREL CO.
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-sm">
              Designed for Sport. Crafted for Life. Tour-grade 180 GSM micro-pique performance drape, stay-flat fused collar engineering, zero $125 country club markup.
            </p>

            <div className="pt-2 text-xs text-slate-400">
              <span className="block font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1">Direct Brand Contact</span>
              <a href="mailto:highdrawgear@gmail.com" className="text-[#38BDF8] hover:underline font-mono">
                highdrawgear@gmail.com
              </a>
            </div>
          </div>

          {/* Navigation Links (All 100% Functional) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs text-slate-300">
            <div className="space-y-3">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">Collections</span>
              <button 
                onClick={() => handleNav('collection', 'polos')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                Men's Polos ($48)
              </button>
              <button 
                onClick={() => handleNav('collection', 'outerwear')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                Outerwear ($68)
              </button>
              <button 
                onClick={() => handleNav('collection', 'headwear')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                Visor Rope Caps ($32)
              </button>
              <button 
                onClick={() => handleNav('collection', 'bundles')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                Saturday Scramble Kits ($160)
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">Craft &amp; Proof</span>
              <button 
                onClick={() => handleNav('craftsmanship', undefined, 'why')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                Stay-Flat Collar Engineering
              </button>
              <button 
                onClick={() => handleNav('guarantee', undefined, 'why')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                100+ Washes Guarantee
              </button>
              <button 
                onClick={() => handleNav('reviews', undefined, 'reviews')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                Verified Course Reviews
              </button>
              <button 
                onClick={() => handleNav('about')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                The High Draw Story
              </button>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">Guarantees &amp; Policy</span>
              <button 
                onClick={() => handleNav('guarantee')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                30-Day Fairway Guarantee
              </button>
              <button 
                onClick={() => setModalType('shipping')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                Free Domestic Shipping ($75+)
              </button>
              <button 
                onClick={() => setModalType('privacy')} 
                className="block text-left hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                Privacy &amp; Data Security
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Owner Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 High Draw Golf Co. All rights reserved. &bull; highdrawgear.com
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setModalType('privacy')} className="hover:text-slate-300 transition-colors">Privacy</button>
            <button onClick={() => setModalType('terms')} className="hover:text-slate-300 transition-colors">Terms of Service</button>
            {onOpenAdmin && (
              <button 
                onClick={onOpenAdmin} 
                className="text-slate-400 hover:text-white transition-colors border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono"
              >
                Owner Admin
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Informational Policy Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white text-[#1A1F26] rounded-sm p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                {modalType === 'guarantee' && <ShieldCheck className="text-emerald-700" size={20} />}
                {modalType === 'shipping' && <Truck className="text-[#38BDF8]" size={20} />}
                {modalType === 'privacy' && <Lock className="text-[#B12535]" size={20} />}
                {modalType === 'terms' && <FileText className="text-slate-700" size={20} />}
                <h3 className="font-serif text-xl font-bold">
                  {modalType === 'guarantee' && '30-Day Fairway Guarantee'}
                  {modalType === 'shipping' && 'Complimentary Shipping Over $75'}
                  {modalType === 'privacy' && 'Customer Privacy Policy'}
                  {modalType === 'terms' && 'Terms of Service'}
                </h3>
              </div>
              <button onClick={() => setModalType(null)} className="p-1 hover:bg-slate-100 rounded text-slate-500">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              {modalType === 'guarantee' && (
                <>
                  <p>Play 18 holes, sweat in it, and machine wash it. If the stay-flat collar curls or the drape does not exceed your expectations, return it within 30 days for a full refund or exchange — no questions asked.</p>
                  <p className="font-bold text-[#1C2C24]">We back our 100+ Washes Guarantee with 100% domestic coverage.</p>
                </>
              )}
              {modalType === 'shipping' && (
                <>
                  <p>All orders over $75 qualify for complimentary standard domestic shipping across the continental United States. Orders are routed directly via our automated Print-On-Demand production facility with 2–4 business day dispatch and USPS/FedEx tracking.</p>
                </>
              )}
              {modalType === 'privacy' && (
                <>
                  <p>High Draw Gear values customer privacy. We never sell, rent, or trade your personal information, address, or email to third-party data brokers. Payment information is securely encrypted via SSL checkout.</p>
                </>
              )}
              {modalType === 'terms' && (
                <>
                  <p>High Draw Gear products are engineered for recreational and competitive golf play. All direct purchases are covered by our 30-Day Fairway Guarantee and manufacturer defect warranty.</p>
                </>
              )}
            </div>

            <button 
              onClick={() => setModalType(null)}
              className="w-full py-2.5 bg-[#1C2C24] text-white font-bold text-xs uppercase tracking-wider rounded-xs mt-2"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

    </footer>
  );
};
