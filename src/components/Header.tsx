import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { DURATION, EASE_ACCENT } from '../lib/motion/tokens';
import { useMotionPreference } from './motion/MotionProvider';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (
    view: 'home' | 'collection' | 'craftsmanship' | 'reviews' | 'guarantee' | 'about' | 'semi',
    category?: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles',
    tier?: 'all' | 'weekender' | 'clubhouse' | 'tournament'
  ) => void;
  tickerText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
  tickerText = 'Complimentary US Shipping on 2+ Polos ($75+) • Save $10 Automatically on Any Pair',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isReduced } = useMotionPreference();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/90 text-[#151B23] transition-colors">
      {/* Quiet Top Announcement Bar */}
      <div className="bg-[#14241D] text-stone-100 py-2 px-4 text-center text-[11.5px] font-medium tracking-[0.03em] flex items-center justify-center gap-2.5">
        <span className="truncate">{tickerText}</span>
        <span className="hidden md:inline text-stone-400">&middot;</span>
        <span className="hidden md:inline text-stone-300">Stitched to Order in the USA</span>
      </div>

      {/* Main Single-Line Editorial Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Lockup */}
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer select-none shrink-0 text-left bg-transparent border-0 p-0"
          onClick={() => onNavigate('home')}
          title="High Draw Golf — Home"
        >
          <img
            src="/assets/brand/logos/mark_monogram_black.png"
            alt="High Draw Mark + Monogram"
            width={34}
            height={44}
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-serif text-[22px] font-medium tracking-[0.06em] text-[#151B23] uppercase leading-none">
              High Draw
            </span>
            <span className="text-[10px] tracking-[0.12em] text-stone-500 uppercase mt-1 font-medium">
              Oxford &middot; Golf Apparel
            </span>
          </div>
        </button>

        {/* Clean Center Navigation — Zero Price Chips */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-7 xl:gap-9 text-[13px] font-medium text-stone-700"
        >
          <button
            type="button"
            onClick={() => onNavigate('collection', 'polos', 'weekender')}
            className="hover:text-[#14241D] transition-colors py-2 cursor-pointer"
          >
            Weekender Polos
          </button>
          <button
            type="button"
            onClick={() => onNavigate('collection', 'all', 'clubhouse')}
            className="hover:text-[#14241D] transition-colors py-2 cursor-pointer"
          >
            The Clubhouse
          </button>
          <button
            type="button"
            onClick={() => onNavigate('collection', 'outerwear', 'all')}
            className="hover:text-[#14241D] transition-colors py-2 cursor-pointer"
          >
            Quarter-Zips &amp; Caps
          </button>
          <button
            type="button"
            onClick={() => onNavigate('collection', 'bundles', 'all')}
            className="hover:text-[#14241D] transition-colors py-2 cursor-pointer"
          >
            Foursome Kits
          </button>
          <button
            type="button"
            onClick={() => onNavigate('semi')}
            className="hover:text-[#14241D] transition-colors py-2 cursor-pointer"
          >
            Women&rsquo;s Lookbook
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="hover:text-[#14241D] transition-colors py-2 cursor-pointer"
          >
            Our Story
          </button>
        </nav>

        {/* Right Action Suite */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('collection', 'all', 'all')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#14241D] hover:bg-[#0c1712] text-white text-xs font-semibold tracking-[0.06em] uppercase transition-colors rounded-xs cursor-pointer t-press"
          >
            <span>Shop All</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2.5 text-[#151B23] hover:bg-stone-200/60 rounded-xs transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer t-press"
            aria-label={`Shopping Bag (${cartCount} items)`}
          >
            <ShoppingBag size={20} strokeWidth={1.75} />
            <span className="w-5 h-5 rounded-full bg-[#14241D] text-white text-[11px] tabular-nums flex items-center justify-center font-semibold">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#151B23] p-2 hover:bg-stone-200/60 rounded-xs cursor-pointer"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={isReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: DURATION.base, ease: EASE_ACCENT }}
            className="lg:hidden bg-[#FAF9F6] border-b border-stone-200 px-6 py-6 space-y-1 text-sm font-medium text-stone-800 shadow-lg"
          >
            {[
              { label: 'Weekender Polos', sub: '$48', action: () => onNavigate('collection', 'polos', 'weekender') },
              { label: 'The Clubhouse Collection', sub: '$66–$68', action: () => onNavigate('collection', 'all', 'clubhouse') },
              { label: 'Quarter-Zip Fleece', sub: '$68', action: () => onNavigate('collection', 'outerwear', 'all') },
              { label: 'Performance Caps', sub: '$35', action: () => onNavigate('collection', 'headwear', 'all') },
              { label: 'Foursome Scramble Kits', sub: '$160', action: () => onNavigate('collection', 'bundles', 'all') },
              { label: "Women's Course Lookbook", sub: 'Editorial', action: () => onNavigate('semi') },
              { label: 'Our Story — Dr. Ken Cyree', sub: '', action: () => onNavigate('about') },
              { label: 'Craftsmanship & Fit', sub: '', action: () => onNavigate('craftsmanship') },
              { label: '100+ Washes Guarantee', sub: '', action: () => onNavigate('guarantee') },
            ].map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  item.action();
                }}
                className="w-full text-left py-3 border-b border-stone-200/70 hover:text-[#14241D] flex items-center justify-between cursor-pointer"
              >
                <span>{item.label}</span>
                {item.sub && (
                  <span className="tabular-nums text-xs text-stone-500">{item.sub}</span>
                )}
              </button>
            ))}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('collection', 'all', 'all');
                }}
                className="w-full py-3.5 bg-[#14241D] text-white text-center font-semibold text-xs uppercase tracking-[0.08em] rounded-xs cursor-pointer"
              >
                Shop Full Collection
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
};
