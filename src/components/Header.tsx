import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (view: 'home' | 'collection' | 'craftsmanship' | 'reviews' | 'guarantee' | 'about', category?: 'polos' | 'outerwear' | 'headwear' | 'bundles') => void;
  tickerText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
  tickerText = 'FREE SHIPPING ON ORDERS OVER $75 • TOUR-GRADE DRAPE AT $48',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200 text-[#1A1F26] transition-all">
      
      {/* Top Announcement Ticker */}
      <div className="bg-[#1C2C24] text-white py-2 px-4 text-center text-[11px] font-semibold tracking-wider flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
        <span className="uppercase">{tickerText}</span>
        <span className="hidden md:inline opacity-40">•</span>
        <span className="hidden md:inline text-slate-300">HONEST MID-MARKET GOLF APPAREL</span>
      </div>

      {/* Main Single-Line Navbar: Logo on Far Left */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* FAR LEFT: Official High Draw Logo & Wordmark */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          onClick={() => onNavigate('home')}
          title="High Draw Golf — Home"
        >
          {/* Official High Draw Cyan Tracer Mark */}
          <img 
            src="/assets/logo_tracer_cyan.png" 
            alt="High Draw Ball Flight Tracer" 
            className="h-10 w-auto object-contain hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-black tracking-[0.2em] text-[#1A1F26] uppercase leading-none">
              HIGH DRAW
            </span>
            <span className="text-[9px] font-mono tracking-[0.3em] text-slate-500 uppercase mt-0.5">
              GOLF APPAREL CO.
            </span>
          </div>
        </div>

        {/* CENTER / NAVIGATION LINKS: Real Multi-Page Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-700">
          <button 
            onClick={() => onNavigate('collection', 'polos')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            MEN'S POLOS ($48)
          </button>
          <button 
            onClick={() => onNavigate('collection', 'outerwear')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            OUTERWEAR ($68)
          </button>
          <button 
            onClick={() => onNavigate('collection', 'headwear')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            HEADWEAR ($32)
          </button>
          <button 
            onClick={() => onNavigate('collection', 'bundles')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            FOURSOME KITS
          </button>
          <button 
            onClick={() => onNavigate('craftsmanship')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            THE CRAFTSMANSHIP
          </button>
          <button 
            onClick={() => onNavigate('reviews')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            GOLFER REVIEWS
          </button>
        </nav>

        {/* FAR RIGHT: Direct Action Suite */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onNavigate('collection', 'polos')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#B12535] hover:bg-[#8e1d29] text-white text-xs font-bold uppercase tracking-wider transition-all rounded-sm shadow-sm whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <span>SHOP POLOS &bull; $48</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 text-[#1A1F26] hover:bg-slate-100 rounded-sm transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={21} />
            <span className="w-5 h-5 rounded-full bg-[#B12535] text-white text-[11px] flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#1A1F26] p-2 hover:bg-slate-100 rounded cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xl">
          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'polos'); }} 
            className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535]"
          >
            MEN'S POLOS ($48)
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'outerwear'); }} 
            className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535]"
          >
            OUTERWEAR &amp; LAYERING ($68)
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'headwear'); }} 
            className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535]"
          >
            STRUCTURED ROPE CAPS ($32)
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'bundles'); }} 
            className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535]"
          >
            FOURSOME SCRAMBLE KITS ($160)
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigate('craftsmanship'); }} 
            className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535]"
          >
            THE CRAFTSMANSHIP &amp; COLLAR
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigate('reviews'); }} 
            className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535]"
          >
            GOLFER REVIEWS
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigate('guarantee'); }} 
            className="block w-full text-left py-2 hover:text-[#B12535]"
          >
            30-DAY FAIRWAY GUARANTEE
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'polos'); }}
            className="w-full py-3.5 bg-[#B12535] text-white font-bold text-center mt-3 flex items-center justify-center gap-2 rounded-sm shadow-md"
          >
            <span>SHOP MEN'S POLOS &bull; $48</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </header>
  );
};
