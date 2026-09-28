import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#2E3033] text-white pt-20 pb-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-t border-slate-800">
      <div className="w-full space-y-16">
        
        {/* Brand & Category Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-700">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-widest text-white uppercase">
                HIGH DRAW
              </span>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 26C10 26 18 20 24 10C26 6.5 27.5 4.5 28 4" stroke="#B12535" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-xs text-slate-300 font-normal leading-relaxed max-w-md">
              Designed for Sport. Crafted for Life. Tour-grade micro-pique performance drape, stay-flat collar engineering, zero $110 country club markup.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs text-slate-300">
            <div className="space-y-3">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">Collections</span>
              <a href="#polos" className="block hover:text-white transition-colors">Men's Polos ($48)</a>
              <a href="#polos" className="block hover:text-white transition-colors">Outerwear & Layering</a>
              <a href="#polos" className="block hover:text-white transition-colors">Visors & Rope Caps</a>
              <a href="#polos" className="block hover:text-white transition-colors">Saturday Scramble Kits</a>
            </div>

            <div className="space-y-3">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">Customer Support</span>
              <a href="#reviews" className="block hover:text-white transition-colors">Verified Golfer Reviews</a>
              <span className="block text-slate-400">30-Day Fairway Guarantee</span>
              <span className="block text-slate-400">Complimentary Domestic Shipping</span>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">Contact & Pipe</span>
              <span className="block text-slate-200">kensiri@gmail.com</span>
              <span className="block text-slate-400">High Draw Golf Pipe (Clark)</span>
              <span className="block text-slate-400">Est. 2001 &bull; Edition 001</span>
            </div>
          </div>

        </div>

        {/* Bottom Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; 2026 High Draw Golf Co. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Vite + React Storefront</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
