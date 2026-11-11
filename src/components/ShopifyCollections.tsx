import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  X,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Bell,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import type { Product } from '../data/products';
import { LogoCustomizer } from './ui/LogoCustomizer';
import {
  CHEST_LOGO_STYLE_OPTIONS,
  getLogoAssetPath,
  formatCustomizationSummary,
} from './brand/HighDrawLogo';
import type { LogoStyle, LogoVariant } from './brand/HighDrawLogo';
import { InteractiveTracerStage } from './motion/InteractiveTracerStage';
import { resolvePrintifyFulfillment, getFactoryThreadColor } from '../lib/fulfillmentResolver';
import { SPRING_LAYOUT, DURATION, EASE_ACCENT } from '../lib/motion/tokens';
import { useMotionPreference } from './motion/MotionProvider';

export type { Product };

interface ShopifyCollectionsProps {
  activeCategory: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles';
  onSelectCategory: (category: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles') => void;
  activeTier?: 'all' | 'weekender' | 'clubhouse' | 'tournament';
  onSelectTier?: (tier: 'all' | 'weekender' | 'clubhouse' | 'tournament') => void;
  onAddToCart: (item: {
    id: string;
    name: string;
    price: number;
    color: string;
    size: string;
    image: string;
    logoStyle?: LogoStyle;
    logoColor?: LogoVariant;
    sovereignSku?: string;
    printifyProductId?: string;
    printifyVariantId?: number;
  }) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ShopifyCollections: React.FC<ShopifyCollectionsProps> = ({
  activeCategory,
  onSelectCategory,
  activeTier = 'all',
  onSelectTier,
  onAddToCart,
  onSelectProduct,
}) => {
  const { isReduced } = useMotionPreference();
  const [internalTier, setInternalTier] = useState<'all' | 'weekender' | 'clubhouse' | 'tournament'>('all');
  const currentTier = onSelectTier ? activeTier : internalTier;
  const setTier = onSelectTier || setInternalTier;

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Deep Midnight Navy');
  const [selectedLogoStyle, setSelectedLogoStyle] = useState<LogoStyle>('mark_monogram');
  const [selectedLogoColor, setSelectedLogoColor] = useState<LogoVariant>('white');
  const [activeCardImages, setActiveCardImages] = useState<Record<string, string>>({});
  const [activeCardColorNames, setActiveCardColorNames] = useState<Record<string, string>>({});
  const [addedId, setAddedId] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  // Interactive Homepage Studio Showcase State (3 Official Marks + Live Contrast)
  const [showcaseStyle, setShowcaseStyle] = useState<LogoStyle>('mark_monogram');
  const [showcaseShirtHex, setShowcaseShirtHex] = useState<string>('#1E293B');
  const [showcaseShirtName, setShowcaseShirtName] = useState<string>('Deep Midnight Navy');
  const [showcaseMockupSlug, setShowcaseMockupSlug] = useState<string>('true-navy');

  const products: Product[] = PRODUCTS;

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesTier =
      currentTier === 'all' ||
      p.tier === currentTier ||
      (currentTier === 'weekender' && p.category === 'bundles');
    return matchesCategory && matchesTier;
  });

  const handleColorSwatchClick = (
    product: Product,
    color: { name: string; hex: string; image?: string },
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setActiveCardColorNames(prev => ({ ...prev, [product.id]: color.name }));
    const resolved = resolvePrintifyFulfillment({
      id: product.id,
      color: color.name,
      size: product.sizes?.[0] || 'L',
      logoStyle: 'mark_monogram',
    });
    const nextImg = resolved.officialMockupUrl || color.image || product.image;
    setActiveCardImages(prev => ({ ...prev, [product.id]: nextImg }));
  };

  const handleQuickAdd = () => {
    if (!quickViewProduct || quickViewProduct.isComingSoon) return;

    const resolved = resolvePrintifyFulfillment({
      id: quickViewProduct.id,
      color: selectedColor,
      size: selectedSize,
      logoStyle: selectedLogoStyle,
      logoColor: selectedLogoColor,
    });

    const isCap = quickViewProduct.category === 'headwear';
    const customSummary = formatCustomizationSummary(selectedLogoStyle, resolved.logoColor);

    onAddToCart({
      id: `${quickViewProduct.id}-${selectedColor}-${selectedSize}-${selectedLogoStyle}-${resolved.logoColor}`,
      name: `${quickViewProduct.name} — ${selectedColor}`,
      price: quickViewProduct.price,
      color: isCap ? selectedColor : `${selectedColor} • ${customSummary}`,
      size: selectedSize,
      image: resolved.officialMockupUrl || activeCardImages[quickViewProduct.id] || quickViewProduct.image,
      logoStyle: selectedLogoStyle,
      logoColor: resolved.logoColor,
      sovereignSku: resolved.sovereignSku,
      printifyProductId: resolved.printifyProductId,
      printifyVariantId: resolved.printifyVariantId,
    });

    setAddedId(quickViewProduct.id);
    setTimeout(() => {
      setAddedId(null);
      setQuickViewProduct(null);
    }, 1000);
  };

  const handleTournamentWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem('highdraw_tournament_waitlist') || '[]');
      existing.push({ email: waitlistEmail.trim(), tier: 'tournament', at: new Date().toISOString() });
      localStorage.setItem('highdraw_tournament_waitlist', JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    setWaitlistJoined(true);
  };

  const showcaseThreadVariant: LogoVariant = showcaseShirtHex === '#FFFFFF' ? 'cyan' : 'white';
  const showcaseLogoSrc = getLogoAssetPath(showcaseStyle, showcaseThreadVariant);
  const showcaseMockupLogo =
    showcaseStyle === 'mark_only'
      ? 'mark-only'
      : showcaseStyle === 'mark_text'
      ? 'mark-wordmark'
      : 'mark-monogram';
  const showcaseMockupPath = `/assets/products/printify_mockups/high-draw-weekender-men-s-polo-${showcaseMockupLogo}--${showcaseMockupSlug}.jpg`;

  return (
    <section id="collections" className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-white border-b border-slate-200">
      {/* Anchor Targets for Direct Anchor Linking */}
      <div id="polos" className="-mt-24 pt-24"></div>
      <div id="outerwear" className="-mt-24 pt-24"></div>
      <div id="headwear" className="-mt-24 pt-24"></div>
      <div id="bundles" className="-mt-24 pt-24"></div>

      {/* Collections Tier Navigation Banner with Shared-Element Spring Pill */}
      <div className="mb-10 p-2 sm:p-2.5 bg-[#0D1520] border border-slate-800 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 px-3">
          <span className="font-mono text-[11px] tracking-widest text-[#38BDF8] uppercase font-bold">
            FILTER BY TIER:
          </span>
          <span className="hidden lg:inline text-xs text-slate-400 font-sans">
            Three distinct fabric systems crafted for fairway, dinner, and competition.
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {[
            { id: 'all', label: 'All Tiers', tag: 'Complete' },
            { id: 'weekender', label: 'Weekender', tag: '$48' },
            { id: 'clubhouse', label: 'The Clubhouse', tag: '$66' },
            { id: 'tournament', label: 'Tournament', tag: "Summer '26" },
          ].map(tier => {
            const isActive = currentTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setTier(tier.id as any)}
                className={`relative px-3.5 py-1.5 rounded-xs font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer t-press ${
                  isActive
                    ? 'text-white font-bold'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                {isActive && (
                  <m.span
                    layoutId={isReduced ? undefined : 'home-tier-active-pill'}
                    transition={SPRING_LAYOUT}
                    className="absolute inset-0 bg-[#B12535] rounded-xs shadow-md"
                  />
                )}
                <span className="relative z-10">{tier.label}</span>
                <span
                  className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-2xs ${
                    isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tier.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-slate-200 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/assets/brand/logos/mark_monogram_cyan.png"
              alt="High Draw Mark"
              className="h-5 w-auto object-contain"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-[#B12535]">
              HONEST DIRECT APPAREL &bull; WEEKENDER ($48) &amp; THE CLUBHOUSE ($66)
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1F26] font-bold tracking-tight">
            Crafted for Life on &amp; off the Fairway
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Zero $125 boutique retail markups. Every garment is stitched to order in the USA: select Men&rsquo;s or Women&rsquo;s cuts across our Weekender and Clubhouse fabric tiers with your choice of 3 official High Draw chest marks.
          </p>
        </div>

        {/* Category Filter Tabs with Shared-Element Spring Underline */}
        <div className="flex flex-wrap gap-2 sm:gap-4 font-mono text-xs uppercase tracking-wider">
          {[
            { id: 'all', label: 'All Gear' },
            { id: 'polos', label: 'Polos' },
            { id: 'outerwear', label: 'Outerwear' },
            { id: 'headwear', label: 'Headwear' },
            { id: 'bundles', label: 'Foursome Kits' },
          ].map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id as any)}
                className={`relative pb-2.5 px-2 transition-colors font-bold cursor-pointer ${
                  isActive ? 'text-[#1A1F26]' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <m.span
                    layoutId={isReduced ? undefined : 'home-category-active-underline'}
                    transition={SPRING_LAYOUT}
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#B12535]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Elevated Tournament Allocation Banner when Tournament Tier is Selected */}
      {currentTier === 'tournament' && (
        <div className="mb-14 p-6 sm:p-10 bg-[#0D1520] text-white rounded-xs border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#38BDF8] font-bold">
              <Bell size={14} />
              <span>TOURNAMENT EDITION &bull; PRIVATE SUMMER 2026 ALLOCATION</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Reserve Priority Access to Our 3.4 oz Tour-Spec Prototype
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Engineered alongside competitive ball-strikers with laser-bonded seams and an ultra-high gauge stretch chassis. Join the private allocation list to receive early sizing access before public release.
            </p>
          </div>
          <div className="lg:col-span-5">
            {waitlistJoined ? (
              <div className="p-4 bg-emerald-950/75 border border-emerald-500/40 rounded-xs text-xs text-emerald-200 flex items-center gap-2.5 font-semibold">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>You&rsquo;re registered for the Summer 2026 Tournament private drop.</span>
              </div>
            ) : (
              <form onSubmit={handleTournamentWaitlist} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="Enter your email for early access..."
                  aria-label="Tournament allocation waitlist email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xs text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#38BDF8]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer t-press whitespace-nowrap"
                >
                  JOIN WAITLIST
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Spaced-Out Editorial Collection Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 lg:gap-x-14 lg:gap-y-24">
        {filteredProducts.map((p, index) => {
          const currentImage = activeCardImages[p.id] || p.image;
          const activeColorLabel = activeCardColorNames[p.id];
          const cardSpecBadge = p.isComingSoon
            ? 'Tour Prototype'
            : p.tier === 'clubhouse' && p.category === 'polos'
            ? '57/43 Fine Pique'
            : p.category === 'polos'
            ? '3 Chest Marks • $48'
            : p.category === 'outerwear'
            ? '8.3 oz Midweight Fleece'
            : p.category === 'headwear'
            ? 'Flexfit® Poly-Mesh'
            : '4-Polo Kit • $40/Shirt';

          const topPillText = p.isComingSoon
            ? 'Summer 2026'
            : p.category === 'headwear'
            ? 'Pure Crown Mark'
            : '3 Embroidered Marks';

          return (
            <React.Fragment key={p.id}>
              {/* Editorial Lookbook Intermission after 3 items */}
              {index === 3 && (activeCategory === 'all' || activeCategory === 'polos') && currentTier === 'all' && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 my-6 py-12 px-6 sm:px-12 bg-[#1C2C24] text-white rounded-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-xl">
                  <div className="lg:col-span-5 relative aspect-[16/10] rounded-xs overflow-hidden shadow-lg border border-white/10">
                    <img
                      src="/assets/foursome_after.jpg"
                      alt="The High Draw Saturday Scramble Foursome"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-xs">
                      18TH HOLE AT PEBBLE &bull; VERIFIED FOURSOME
                    </div>
                  </div>
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                      THE SATURDAY SCRAMBLE FOURSOME INITIATIVE
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                      Equip Your Entire Foursome for $160 ($40/Shirt)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
                      Why show up to your club scramble in mismatching gym polos? Mix and match Men&rsquo;s and Women&rsquo;s cuts, shirt colorways, and any of our 3 signature High Draw chest marks for your group.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onSelectCategory('bundles')}
                        className="px-6 py-3 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-md inline-flex items-center gap-2 t-press"
                      >
                        <span>EXPLORE FOURSOME KITS &bull; $160</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Frameless Editorial Product Item */}
              <div
                onClick={() => {
                  if (onSelectProduct) {
                    onSelectProduct(p);
                  } else {
                    const initCol = p.colors[0]?.name || 'Deep Midnight Navy';
                    setQuickViewProduct(p);
                    setSelectedColor(initCol);
                    setSelectedLogoColor(getFactoryThreadColor(p.id as any, initCol).variant);
                    setSelectedSize(p.sizes?.[2] || p.sizes?.[0] || 'L');
                  }
                }}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Clean Frameless Imagery with Smooth Cross-Fade */}
                  <div className="aspect-[3/4] bg-[#F7F7F6] overflow-hidden relative mb-5 rounded-xs transition-all duration-500">
                    <img
                      src={currentImage}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />

                    {/* Secondary Detail Image Cross-Fade (only when user hasn't explicitly clicked a colorway swatch) */}
                    {!activeCardImages[p.id] && (
                      <img
                        src={p.secondaryImage}
                        alt={`${p.name} Detail`}
                        loading="lazy"
                        className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    )}

                    {/* Discreet Craftsmanship Tag / Tier Badge */}
                    <div className="absolute top-3.5 left-3.5 bg-[#1C2C24]/90 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-xs uppercase shadow-sm flex items-center gap-1.5">
                      {p.badge ? (
                        <span className="text-[#38BDF8] font-bold">{p.badge}</span>
                      ) : (
                        <>
                          <RefreshCw size={11} className="text-[#38BDF8]" />
                          <span>100+ Washes</span>
                        </>
                      )}
                    </div>

                    {/* Custom Logo Options Pill or Coming Soon */}
                    <div
                      className={`absolute top-3.5 right-3.5 backdrop-blur-md text-white text-[9px] font-mono tracking-wider px-2.5 py-1 rounded-xs uppercase shadow-sm ${
                        p.isComingSoon ? 'bg-[#B12535]' : 'bg-black/75'
                      }`}
                    >
                      {topPillText}
                    </div>

                    {/* Subtle Hover Action Button */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-[#1A1F26] text-[11px] font-bold tracking-wider px-4 py-2.5 rounded-xs shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                      <span>{p.isComingSoon ? 'JOIN ALLOCATION' : 'CUSTOMIZE & VIEW'}</span>
                      <ArrowUpRight size={13} />
                    </div>
                  </div>

                  {/* Tailor's Interactive Colorway Swatches */}
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap" onClick={e => e.stopPropagation()}>
                    {p.colors.map(c => {
                      const isSelectedSwatch = activeColorLabel === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          title={c.name}
                          onClick={e => handleColorSwatchClick(p, c, e)}
                          style={{ backgroundColor: c.hex }}
                          className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                            isSelectedSwatch
                              ? 'ring-2 ring-offset-1 ring-[#1C2C24] border-white scale-115'
                              : 'border-slate-300 hover:scale-120'
                          }`}
                          aria-label={`${p.name} in ${c.name}`}
                        />
                      );
                    })}
                    <span className="text-[11px] text-slate-400 font-medium ml-1">
                      {activeColorLabel || `${p.colors.length} Colorway${p.colors.length > 1 ? 's' : ''}`}
                    </span>
                  </div>

                  {/* Clean Editorial Typography */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#B12535] block">
                      {p.collectionLabel}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1A1F26] font-bold group-hover:text-[#B12535] transition-colors leading-snug">
                      {p.name}
                    </h3>
                  </div>
                </div>

                {/* Price & Value Line */}
                <div className="pt-3 border-t border-slate-100 mt-4 flex items-baseline justify-between font-sans">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-bold text-[#1A1F26]">${p.price}</span>
                    <span className="font-mono text-xs text-slate-400 line-through">${p.originalPrice}</span>
                  </div>
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#1C2C24] bg-[#1C2C24]/5 border border-[#1C2C24]/10 px-2 py-0.5 rounded-xs font-semibold">
                    {cardSpecBadge}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Interactive Bespoke Embroidery Studio Showcase Banner */}
      <div className="mt-24 p-6 sm:p-10 bg-[#15191E] text-white rounded-xs border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono uppercase tracking-widest text-[#38BDF8]">
              <Sparkles size={12} />
              <span>BESPOKE EMBROIDERY ARCHITECTURE &bull; INCLUDED ON EVERY ORDER</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
              Your Shirt. Your Mark. <br />
              <span className="italic font-normal text-slate-300">
                Three Official Chest Lockups, Stitched to Order.
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Every High Draw Weekender and Clubhouse garment is stitched to order in the USA. Preview our three signature marks—<strong>Mark + Monogram (H | D)</strong>, <strong>Mark-Only (Ball Flight Tracer)</strong>, and <strong>Mark + Wordmark (HIGH DRAW)</strong>—with factory-calibrated contrast thread.
            </p>

            {/* Interactive 3-Mark Style Switcher Pills */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                1. SELECT SIGNATURE CHEST MARK:
              </span>
              <div className="flex flex-wrap gap-2">
                {CHEST_LOGO_STYLE_OPTIONS.map(st => {
                  const active = showcaseStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setShowcaseStyle(st.id)}
                      className={`relative px-4 py-2 rounded-xs text-xs font-bold transition-colors cursor-pointer border t-press ${
                        active
                          ? 'text-white border-[#B12535]'
                          : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
                      }`}
                    >
                      {active && (
                        <m.span
                          layoutId={isReduced ? undefined : 'showcase-style-pill'}
                          transition={SPRING_LAYOUT}
                          className="absolute inset-0 bg-[#B12535] rounded-xs"
                        />
                      )}
                      <span className="relative z-10">{st.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Garment Swatch Switcher */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                2. PREVIEW ON LIVE STITCHED GARMENT COLORWAYS:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { name: 'Deep Midnight Navy', hex: '#1E293B', slug: 'true-navy' },
                  { name: 'Onyx Black', hex: '#111827', slug: 'black' },
                  { name: 'Carolina Blue', hex: '#6BA4B8', slug: 'carolina-blue' },
                  { name: 'Forest Green', hex: '#1E3A2F', slug: 'forest-green' },
                  { name: 'Crisp White', hex: '#FFFFFF', slug: 'white' },
                  { name: 'Deep Red', hex: '#991B1B', slug: 'deep-red' },
                ].map(sh => (
                  <button
                    key={sh.name}
                    type="button"
                    title={sh.name}
                    onClick={() => {
                      setShowcaseShirtHex(sh.hex);
                      setShowcaseShirtName(sh.name);
                      setShowcaseMockupSlug(sh.slug);
                    }}
                    style={{ backgroundColor: sh.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      showcaseShirtHex === sh.hex
                        ? 'border-[#38BDF8] scale-115 shadow-md'
                        : 'border-white/30 hover:scale-105'
                    }`}
                    aria-label={sh.name}
                  />
                ))}
                <span className="text-xs font-mono text-slate-300 ml-1">
                  {showcaseShirtName} &bull; {showcaseShirtHex === '#FFFFFF' ? 'Light Blue Thread' : 'Crisp White Thread'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Live Factory Mockup + Macro Emblem Preview Stage */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-xs border-2 border-white/20 shadow-2xl relative overflow-hidden bg-[#F7F7F6]">
              <AnimatePresence mode="wait">
                <m.img
                  key={showcaseMockupPath}
                  src={showcaseMockupPath}
                  alt={`High Draw ${showcaseShirtName} ${showcaseStyle} Stitched Preview`}
                  initial={isReduced ? { opacity: 1 } : { opacity: 0.25 }}
                  animate={{ opacity: 1 }}
                  exit={isReduced ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE_ACCENT }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              {/* Floating Macro Crest Loupe */}
              {showcaseLogoSrc && (
                <div
                  className="absolute top-3 right-3 w-16 h-16 rounded-xs border border-white/30 shadow-xl flex items-center justify-center p-2 transition-colors duration-200"
                  style={{ backgroundColor: showcaseShirtHex }}
                >
                  <img
                    src={showcaseLogoSrc}
                    alt="Macro Crest Preview"
                    className="max-h-full max-w-full object-contain drop-shadow-xs"
                  />
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/80 backdrop-blur-md text-white px-3.5 py-2 rounded-2xs text-[10px] font-mono">
                <span>{showcaseShirtName.toUpperCase()}</span>
                <span className="text-[#38BDF8] font-bold">
                  {formatCustomizationSummary(showcaseStyle, showcaseThreadVariant).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Layer Exploded Emblem & Animated Ball-Flight Tracer Stage */}
        <InteractiveTracerStage />
      </div>

      {/* Quick View & Fitting Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-4xl bg-white rounded-xs shadow-2xl overflow-hidden my-8">
            <div className="bg-[#1C2C24] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#38BDF8] block">
                  {quickViewProduct.collectionLabel} &bull; BESPOKE CUSTOMIZATION
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">{quickViewProduct.name}</h3>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
              <div className="md:col-span-5 aspect-[4/5] bg-slate-100 rounded-xs overflow-hidden border border-slate-200 relative">
                <img
                  src={activeCardImages[quickViewProduct.id] || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-7 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold font-mono text-[#1A1F26]">${quickViewProduct.price} USD</span>
                    <span className="text-sm text-slate-400 line-through">${quickViewProduct.originalPrice}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      SAVE ${quickViewProduct.originalPrice - quickViewProduct.price}
                    </span>
                  </div>

                  {/* Color Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block uppercase">
                      Colorway: <span className="text-[#1A1F26]">{selectedColor}</span>
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {quickViewProduct.colors.map(c => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setSelectedColor(c.name);
                            setSelectedLogoColor(getFactoryThreadColor(quickViewProduct.id as any, c.name).variant);
                            if (c.image) {
                              setActiveCardImages(prev => ({ ...prev, [quickViewProduct.id]: c.image! }));
                            }
                          }}
                          className={`px-3 py-1.5 text-xs border rounded-xs transition-all font-semibold flex items-center gap-2 cursor-pointer ${
                            selectedColor === c.name
                              ? 'bg-[#1A1F26] text-white border-[#1A1F26]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-400" style={{ backgroundColor: c.hex }} />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bespoke Logo Customizer */}
                  {quickViewProduct.category !== 'headwear' && !quickViewProduct.isComingSoon && (
                    <LogoCustomizer
                      selectedStyle={selectedLogoStyle}
                      onSelectStyle={setSelectedLogoStyle}
                      selectedColor={selectedLogoColor}
                      garmentHex={quickViewProduct.colors.find(c => c.name === selectedColor)?.hex || '#1E293B'}
                      garmentColorName={selectedColor}
                      compact
                    />
                  )}

                  {/* Size Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block uppercase">
                      Select Size: <span className="text-[#1A1F26]">{selectedSize}</span>
                    </span>
                    <div className="grid grid-cols-6 gap-2">
                      {(quickViewProduct.sizes || []).map(sz => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`py-2 text-xs border rounded-xs font-bold transition-all cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-[#1C2C24] text-white border-[#1C2C24]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    className={`w-full py-4 rounded-xs font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer t-press ${
                      addedId === quickViewProduct.id
                        ? 'bg-emerald-800 text-white'
                        : 'bg-[#B12535] hover:bg-[#8e1d29] text-white shadow-lg'
                    }`}
                  >
                    {addedId === quickViewProduct.id ? (
                      <>
                        <Check size={18} />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} />
                        <span>ADD CUSTOM ORDER TO BAG &bull; ${quickViewProduct.price}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span>Free Shipping Over $75 &bull; 30-Day Fairway Guarantee</span>
                  </div>

                  {onSelectProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        const prod = quickViewProduct;
                        setQuickViewProduct(null);
                        onSelectProduct(prod);
                      }}
                      className="w-full py-2.5 text-center text-xs font-bold text-slate-700 hover:text-black uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-300 rounded-xs hover:border-slate-500 transition-colors cursor-pointer"
                    >
                      <span>VIEW FULL DETAILS &amp; SIZING SPECS</span>
                      <ExternalLink size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
