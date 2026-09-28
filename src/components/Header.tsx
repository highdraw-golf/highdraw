import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollToSection: (id: string) => void;
  onOpenPipes: () => void;
  activeBoard: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onScrollToSection,
  onOpenPipes,
  activeBoard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-[#32363F] transition-all">
      
      {/* Top Announcement Ticker */}
      <div className="bg-[#2A4236] text-white py-2 px-4 text-center text-[11px] font-semibold tracking-wider flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FDE022]"></span>
        <span>FREE SHIPPING ON ORDERS OVER $75 &bull; TOUR-GRADE drape AT $48</span>
        <span className="hidden md:inline opacity-50">|</span>
        <span className="hidden md:inline text-slate-200">CURATED VIA HIGH DRAW GOLF PIPE</span>
      </div>

      {/* Main Single-Line Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Left Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-700">
          <button onClick={() => onScrollToSection('polos')} className="hover:text-black transition-colors">MEN'S POLOS</button>
          <button onClick={() => onScrollToSection('headwear')} className="hover:text-black transition-colors">HEADWEAR</button>
          <button onClick={() => onScrollToSection('bundles')} className="hover:text-black transition-colors">BUNDLES</button>
          <button onClick={onOpenPipes} className="text-[#2A4236] font-bold flex items-center gap-1.5 hover:underline">
            <Sparkles size={13} className="text-[#B12535]" />
            <span>PIPE: {activeBoard.toUpperCase()}</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#32363F] p-2"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Center Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="font-serif text-2xl font-bold tracking-widest text-[#32363F] uppercase whitespace-nowrap">
            HIGH DRAW
          </span>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#B12535] shrink-0">
            <path d="M4 26C10 26 18 20 24 10C26 6.5 27.5 4.5 28 4" stroke="#B12535" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="28" cy="4" r="2" fill="#B12535"/>
          </svg>
        </div>

        {/* Right Action Suite */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onScrollToSection('polos')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#B12535] hover:bg-[#8e1d29] text-white text-xs font-bold uppercase tracking-wider transition-all rounded-sm shadow-sm whitespace-nowrap"
          >
            <span>SHOP POLOS &bull; $48</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 text-[#32363F] hover:bg-slate-100 rounded-sm transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={20} />
            <span className="w-5 h-5 rounded-full bg-[#B12535] text-white text-[11px] flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 text-xs font-semibold uppercase tracking-wider text-slate-800">
          <button onClick={() => { setMobileMenuOpen(false); onScrollToSection('polos'); }} className="block w-full text-left py-2">MEN'S POLOS ($48)</button>
          <button onClick={() => { setMobileMenuOpen(false); onScrollToSection('headwear'); }} className="block w-full text-left py-2">HEADWEAR ($32)</button>
          <button onClick={() => { setMobileMenuOpen(false); onScrollToSection('bundles'); }} className="block w-full text-left py-2">SCRAMBLE BUNDLES ($160)</button>
          <button onClick={() => { setMobileMenuOpen(false); onOpenPipes(); }} className="block w-full text-left py-2 text-[#2A4236] font-bold">HIGH DRAW PIPE (KEN SIRI)</button>
          <button
            onClick={() => { setMobileMenuOpen(false); onScrollToSection('polos'); }}
            className="w-full py-3 bg-[#B12535] text-white font-bold text-center mt-2 flex items-center justify-center gap-2 rounded-sm"
          >
            <span>SHOP MEN'S POLOS &bull; $48</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </header>
  );
};
