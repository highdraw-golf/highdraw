import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { DURATION, EASE_ACCENT } from '../lib/motion/tokens';
import { useMotionPreference } from './motion/MotionProvider';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (
    view: 'home' | 'collection' | 'craftsmanship' | 'reviews' | 'guarantee' | 'about',
    category?: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles',
    tier?: 'all' | 'weekender' | 'clubhouse' | 'tournament'
  ) => void;
  tickerText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
  tickerText = 'FREE US SHIPPING OVER $75 • WEEKENDER ($48) & THE CLUBHOUSE ($66)',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isReduced } = useMotionPreference();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200 text-[#1A1F26] transition-all">
      
      {/* Top Announcement Ticker */}
      <div className="bg-[#1C2C24] text-white py-2 px-4 text-center text-[11px] font-semibold tracking-wider flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0"></span>
        <span className="uppercase truncate">{tickerText}</span>
        <span className="hidden md:inline opacity-40">&bull;</span>
        <span className="hidden md:inline text-slate-300">MEN&rsquo;S &amp; WOMEN&rsquo;S BESPOKE GOLF APPAREL</span>
      </div>

      {/* Main Single-Line Navbar: Logo on Far Left */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4 lg:gap-6">
        
        {/* FAR LEFT: Official High Draw Mark + Monogram & Wordmark */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          onClick={() => onNavigate('home')}
          title="High Draw Golf — Home"
        >
          <img 
            src="/assets/brand/logos/mark_monogram_cyan.png" 
            alt="High Draw Official Mark + Monogram" 
            className="h-11 w-auto object-contain hover:scale-105 transition-transform"
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

        {/* CENTER / NAVIGATION LINKS: Direct 3-Tier & Category Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold uppercase tracking-wider text-slate-700">
          <button 
            onClick={() => onNavigate('collection', 'polos', 'weekender')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer flex items-center gap-1.5"
          >
            <span>WEEKENDER</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-2xs bg-slate-100 text-slate-600">$48</span>
          </button>
          <button 
            onClick={() => onNavigate('collection', 'all', 'clubhouse')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer flex items-center gap-1.5"
          >
            <span>THE CLUBHOUSE</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-2xs bg-[#B12535]/10 text-[#B12535]">$66</span>
          </button>
          <button 
            onClick={() => onNavigate('collection', 'outerwear', 'all')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            1/4-ZIP FLEECE
          </button>
          <button 
            onClick={() => onNavigate('collection', 'headwear', 'all')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            CAPS
          </button>
          <button 
            onClick={() => onNavigate('about')} 
            className="text-[#1C2C24] hover:text-[#B12535] transition-colors py-2 cursor-pointer flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
            OUR STORY
          </button>
          <button 
            onClick={() => onNavigate('reviews')} 
            className="hover:text-[#B12535] transition-colors py-2 cursor-pointer"
          >
            REVIEWS
          </button>
        </nav>

        {/* FAR RIGHT: Direct Action Suite */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={() => onNavigate('collection', 'all', 'all')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#B12535] hover:bg-[#8e1d29] text-white text-xs font-bold uppercase tracking-wider transition-all rounded-xs shadow-sm whitespace-nowrap t-press cursor-pointer"
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 text-[#1A1F26] hover:bg-slate-100 rounded-xs transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer t-press"
            aria-label={`Shopping Bag (${cartCount} items)`}
          >
            <ShoppingBag size={21} />
            <span className="w-5 h-5 rounded-full bg-[#B12535] text-white text-[11px] flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#1A1F26] p-2 hover:bg-slate-100 rounded-xs cursor-pointer"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={isReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: DURATION.base, ease: EASE_ACCENT }}
            className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-3.5 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xl"
          >
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'polos', 'weekender'); }} 
              className="w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535] flex items-center justify-between cursor-pointer"
            >
              <span>01 / WEEKENDER POLOS (MEN&rsquo;S &amp; WOMEN&rsquo;S)</span>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-slate-100 text-[#1C2C24] rounded-2xs">$48</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'all', 'clubhouse'); }} 
              className="w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535] flex items-center justify-between cursor-pointer"
            >
              <span>02 / THE CLUBHOUSE COLLECTION</span>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-[#B12535]/10 text-[#B12535] rounded-2xs">$66–$68</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'all', 'tournament'); }} 
              className="w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535] flex items-center justify-between cursor-pointer"
            >
              <span>03 / TOURNAMENT EDITION WAITLIST</span>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-[#0D1520] text-[#38BDF8] rounded-2xs">SUMMER &rsquo;26</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'outerwear', 'all'); }} 
              className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535] cursor-pointer"
            >
              1/4-ZIP FLEECE OUTERWEAR ($68)
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'headwear', 'all'); }} 
              className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535] cursor-pointer"
            >
              TOUR PERFORMANCE CAPS ($35)
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'bundles', 'all'); }} 
              className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535] cursor-pointer"
            >
              SATURDAY FOURSOME SCRAMBLE KITS ($160)
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('about'); }} 
              className="w-full text-left py-2 border-b border-slate-100 text-[#1C2C24] font-black hover:text-[#B12535] flex items-center justify-between cursor-pointer"
            >
              <span>OUR STORY &bull; DR. KEN CYREE</span>
              <span className="text-[10px] font-mono text-[#38BDF8] bg-[#1C2C24] px-2 py-0.5 rounded-2xs">47 STATES</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('craftsmanship'); }} 
              className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535] cursor-pointer"
            >
              THE CRAFTSMANSHIP &amp; COLLAR LAB
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate('reviews'); }} 
              className="block w-full text-left py-2 border-b border-slate-100 hover:text-[#B12535] cursor-pointer"
            >
              VERIFIED GOLFER REVIEWS
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('collection', 'all', 'all'); }}
              className="w-full py-3.5 bg-[#B12535] text-white font-bold text-center mt-2 flex items-center justify-center gap-2 rounded-xs shadow-md cursor-pointer t-press"
            >
              <span>EXPLORE FULL COLLECTION</span>
              <ArrowRight size={14} />
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
};
