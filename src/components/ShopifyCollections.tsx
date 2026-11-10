import React, { useState } from 'react';
import { ArrowUpRight, Check, X, ShieldCheck, ShoppingBag, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import type { Product } from '../data/products';
import { LogoCustomizer } from './ui/LogoCustomizer';
import {
  LOGO_STYLE_OPTIONS,
  LOGO_COLOR_OPTIONS,
  getLogoAssetPath,
  formatCustomizationSummary,
} from './brand/HighDrawLogo';
import type { LogoStyle, LogoVariant } from './brand/HighDrawLogo';
import { InteractiveTracerStage } from './motion/InteractiveTracerStage';

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
  const [internalTier, setInternalTier] = useState<'all' | 'weekender' | 'clubhouse' | 'tournament'>('all');
  const currentTier = onSelectTier ? activeTier : internalTier;
  const setTier = onSelectTier || setInternalTier;

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Deep Midnight Navy');
  const [selectedLogoStyle, setSelectedLogoStyle] = useState<LogoStyle>('mark_monogram');
  const [selectedLogoColor, setSelectedLogoColor] = useState<LogoVariant>('gold');
  const [activeCardImages, setActiveCardImages] = useState<Record<string, string>>({});
  const [activeCardColorNames, setActiveCardColorNames] = useState<Record<string, string>>({});
  const [addedId, setAddedId] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  // Interactive Homepage Studio Showcase State
  const [showcaseStyle, setShowcaseStyle] = useState<LogoStyle>('mark_monogram');
  const [showcaseColor, setShowcaseColor] = useState<LogoVariant>('cyan');
  const [showcaseShirtHex, setShowcaseShirtHex] = useState<string>('#1E293B');
  const [showcaseShirtName, setShowcaseShirtName] = useState<string>('Deep Midnight Navy');

  const products: Product[] = PRODUCTS;

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesTier = currentTier === 'all' || (p.tier === currentTier) || (currentTier === 'weekender' && p.category === 'bundles');
    return matchesCategory && matchesTier;
  });

  const handleColorSwatchClick = (productId: string, color: { name: string; hex: string; image?: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCardColorNames(prev => ({ ...prev, [productId]: color.name }));
    if (color.image) {
      setActiveCardImages(prev => ({ ...prev, [productId]: color.image! }));
    }
  };

  const handleQuickAdd = () => {
    if (!quickViewProduct) return;

    const customSummary = formatCustomizationSummary(selectedLogoStyle, selectedLogoColor);

    onAddToCart({
      id: `${quickViewProduct.id}-${selectedColor}-${selectedSize}-${selectedLogoStyle}-${selectedLogoColor}`,
      name: `${quickViewProduct.name} — ${selectedColor}`,
      price: quickViewProduct.price,
      color: `${selectedColor} • ${customSummary}`,
      size: selectedSize,
      image: activeCardImages[quickViewProduct.id] || quickViewProduct.image,
      logoStyle: selectedLogoStyle,
      logoColor: selectedLogoColor,
    });

    setAddedId(quickViewProduct.id);
    setTimeout(() => {
      setAddedId(null);
      setQuickViewProduct(null);
    }, 1200);
  };

  const showcaseLogoSrc = getLogoAssetPath(showcaseStyle, showcaseColor);

  return (
    <section id="collections" className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-white border-b border-slate-200">
      
      {/* Anchor Targets for Direct Anchor Linking */}
      <div id="polos" className="-mt-24 pt-24"></div>
      <div id="outerwear" className="-mt-24 pt-24"></div>
      <div id="headwear" className="-mt-24 pt-24"></div>
      <div id="bundles" className="-mt-24 pt-24"></div>

      {/* Collections Tier Navigation Banner */}
      <div className="mb-10 p-2 sm:p-2.5 bg-[#0D1520] border border-slate-800 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 px-3">
          <span className="font-mono text-[11px] tracking-widest text-[#38BDF8] uppercase font-bold">COLLECTION TIERS:</span>
          <span className="hidden lg:inline text-xs text-slate-400 font-sans">Three distinct fabric systems crafted for fairway, dinner, and competition.</span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {[
            { id: 'all', label: 'All Tiers', tag: 'Complete' },
            { id: 'weekender', label: 'Weekender', tag: '$48' },
            { id: 'clubhouse', label: 'The Clubhouse', tag: '$66' },
            { id: 'tournament', label: 'Tournament', tag: 'Summer 2026' },
          ].map(tier => (
            <button
              key={tier.id}
              onClick={() => setTier(tier.id as any)}
              className={`px-3.5 py-1.5 rounded-xs font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                currentTier === tier.id
                  ? 'bg-[#B12535] text-white font-bold shadow-md'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50'
              }`}
            >
              <span>{tier.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-2xs ${currentTier === tier.id ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {tier.tag}
              </span>
            </button>
          ))}
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
              MID-MARKET VALUE REVOLUTION &bull; $48 BESPOKE TOUR DRAPE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1F26] font-bold tracking-tight">
            Crafted for Life on the Fairway
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Zero $120 boutique retail markups. Every garment is custom-embroidered to your exact specification: choose between Men’s and Women’s cuts, 4 official High Draw marks, 4 thread colors, or an optional clean unbranded finish.
          </p>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 font-mono text-xs uppercase tracking-wider">
          {[
            { id: 'all', label: 'All Gear' },
            { id: 'polos', label: 'Polos' },
            { id: 'outerwear', label: 'Outerwear' },
            { id: 'headwear', label: 'Headwear' },
            { id: 'bundles', label: 'Foursome Kits' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as any)}
              className={`pb-2 px-2 transition-all font-bold cursor-pointer ${
                activeCategory === cat.id
                  ? 'text-[#1A1F26] border-b-2 border-[#B12535]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spaced-Out Editorial Collection Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 lg:gap-x-14 lg:gap-y-24">
        {filteredProducts.map((p, index) => {
          const currentImage = activeCardImages[p.id] || p.image;
          const cardSpecBadge =
            p.category === 'polos'
              ? '4 Logo Marks • $48'
              : p.category === 'outerwear'
              ? '4-Way Stretch Layer'
              : p.category === 'headwear'
              ? 'Flexfit® Poly-Mesh'
              : '4-Polo Kit • $40/Shirt';

          return (
            <React.Fragment key={p.id}>
              {/* Editorial Lookbook Intermission after 3 items */}
              {index === 3 && (activeCategory === 'all' || activeCategory === 'polos') && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 my-6 py-12 px-6 sm:px-12 bg-[#1C2C24] text-white rounded-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-xl">
                  <div className="lg:col-span-5 relative aspect-[16/10] rounded-xs overflow-hidden shadow-lg border border-white/10">
                    <img 
                      src="/assets/foursome_after.jpg" 
                      alt="The High Draw Saturday Scramble Foursome" 
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
                      Why show up to your club scramble in mismatching gym polos? Mix and match Men’s and Women’s cuts, shirt colorways, and any of our 4 signature High Draw embroidery marks for your group.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectCategory('bundles')}
                        className="px-6 py-3 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-md inline-flex items-center gap-2"
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
                    setQuickViewProduct(p);
                    setSelectedColor(p.colors[0]?.name || 'Deep Midnight Navy');
                    setSelectedLogoColor(p.colors[0]?.defaultLogoColor || 'gold');
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
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />
                    
                    {/* Secondary Detail Image Cross-Fade */}
                    <img 
                      src={p.secondaryImage} 
                      alt={`${p.name} Detail`} 
                      className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />

                    {/* Discreet Craftsmanship Tag / Tier Badge */}
                    <div className="absolute top-3.5 left-3.5 bg-[#1C2C24]/85 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-xs uppercase shadow-sm flex items-center gap-1.5">
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
                    <div className={`absolute top-3.5 right-3.5 backdrop-blur-md text-white text-[9px] font-mono tracking-wider px-2.5 py-1 rounded-xs uppercase shadow-sm ${p.isComingSoon ? 'bg-[#B12535]' : 'bg-black/75'}`}>
                      {p.isComingSoon ? 'Summer 2026' : '3 Marks (Embroidery)'}
                    </div>

                    {/* Subtle Hover Action Button */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-[#1A1F26] text-[11px] font-bold tracking-wider px-4 py-2.5 rounded-xs shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                      <span>{onSelectProduct ? 'CUSTOMIZE & VIEW' : 'QUICK CUSTOMIZE'}</span>
                      <ArrowUpRight size={13} />
                    </div>
                  </div>

                  {/* Tailor's Colorway Swatches */}
                  <div className="flex items-center gap-2 mb-2.5" onClick={(e) => e.stopPropagation()}>
                    {p.colors.map((c) => (
                      <button
                        key={c.name}
                        title={c.name}
                        onClick={(e) => handleColorSwatchClick(p.id, c, e)}
                        style={{ backgroundColor: c.hex }}
                        className="w-4 h-4 rounded-full border border-slate-300 hover:scale-125 transition-transform cursor-pointer"
                        aria-label={c.name}
                      />
                    ))}
                    <span className="text-[11px] text-slate-400 font-medium ml-1">
                      {p.colors.length} Colorway{p.colors.length > 1 ? 's' : ''}
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
              <span className="italic font-normal text-slate-300">Four Official Lockups or Pure Unbranded Drape.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Every High Draw garment is embroidered to order. Choose between our <strong>Mark + Monogram (`H | D`)</strong>, <strong>Mark-Only (`Ball Flight Tracer`)</strong>, <strong>Monogram (`HD` Serif Initials)</strong>, or <strong>Mark + Text (`HIGH DRAW`)</strong> across four thread colors—or select <strong>Optional No Logo</strong> for a completely unbranded silhouette.
            </p>

            {/* Interactive Style Switcher Pills */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                1. PREVIEW LOGO ARCHITECTURE:
              </span>
              <div className="flex flex-wrap gap-2">
                {LOGO_STYLE_OPTIONS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setShowcaseStyle(st.id)}
                    className={`px-3.5 py-2 rounded-xs text-xs font-bold transition-all cursor-pointer border ${
                      showcaseStyle === st.id
                        ? 'bg-[#B12535] text-white border-[#B12535] shadow-md'
                        : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
                    }`}
                  >
                    {st.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Thread Color + Shirt Color Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  2. SELECT THREAD COLOR:
                </span>
                <div className="flex items-center gap-2">
                  {LOGO_COLOR_OPTIONS.map((co) => (
                    <button
                      key={co.id}
                      type="button"
                      disabled={showcaseStyle === 'none'}
                      onClick={() => setShowcaseColor(co.id)}
                      className={`px-3 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        showcaseStyle === 'none'
                          ? 'opacity-40 cursor-not-allowed border-white/10 bg-white/5'
                          : showcaseColor === co.id
                          ? 'bg-white text-[#15191E] border-white font-bold'
                          : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-400"
                        style={{ backgroundColor: co.hex }}
                      />
                      <span>{co.shortLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  3. TEST ON GARMENT FABRIC:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { name: 'Midnight Navy', hex: '#1E293B' },
                    { name: 'Onyx Black', hex: '#111827' },
                    { name: 'Carolina Blue', hex: '#6BA4B8' },
                    { name: 'Forest Green', hex: '#1E3A2F' },
                    { name: 'Crisp White', hex: '#FFFFFF' },
                    { name: 'Deep Red', hex: '#991B1B' },
                  ].map((sh) => (
                    <button
                      key={sh.name}
                      type="button"
                      title={sh.name}
                      onClick={() => {
                        setShowcaseShirtHex(sh.hex);
                        setShowcaseShirtName(sh.name);
                      }}
                      style={{ backgroundColor: sh.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        showcaseShirtHex === sh.hex
                          ? 'border-[#38BDF8] scale-115 shadow-md'
                          : 'border-white/30 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Live High-Res Embroidery Preview Stage */}
          <div className="lg:col-span-5">
            <div
              className="aspect-[4/3] rounded-xs border-2 border-white/20 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-300"
              style={{ backgroundColor: showcaseShirtHex }}
            >
              {/* Subtle Micro-Pique Fabric Texture Grid */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {showcaseLogoSrc ? (
                  <img
                    src={showcaseLogoSrc}
                    alt="High Draw Official Embroidery Preview"
                    className="max-h-36 max-w-[220px] w-auto object-contain drop-shadow-md transition-all duration-300"
                  />
                ) : (
                  <div
                    className={`text-center space-y-1 px-6 py-4 rounded border ${
                      showcaseShirtHex === '#FFFFFF'
                        ? 'border-slate-300 text-slate-700 bg-slate-100/80'
                        : 'border-white/20 text-white bg-black/25'
                    }`}
                  >
                    <span className="font-mono text-xs uppercase tracking-widest font-bold block">
                      OPTIONAL CLEAN / UNBRANDED
                    </span>
                    <span className="text-[11px] opacity-80 block">
                      180 GSM Micro-Pique • Zero Exterior Logos
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/75 backdrop-blur-md text-white px-3.5 py-2 rounded-2xs text-[10px] font-mono">
                <span>FABRIC: {showcaseShirtName.toUpperCase()}</span>
                <span className="text-[#38BDF8] font-bold">
                  {formatCustomizationSummary(showcaseStyle, showcaseColor).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Layer Exploded Emblem & Animated Ball-Flight Tracer Stage */}
        <InteractiveTracerStage />
      </div>

      {/* Quick View & Fitting Slide-Over Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="bg-[#1C2C24] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#38BDF8] block">
                  {quickViewProduct.collectionLabel} &bull; BESPOKE CUSTOMIZATION
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {quickViewProduct.name}
                </h3>
              </div>
              <button 
                onClick={() => setQuickViewProduct(null)} 
                className="p-2 text-slate-300 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
              
              {/* Product Image */}
              <div className="md:col-span-5 aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                <img 
                  src={activeCardImages[quickViewProduct.id] || quickViewProduct.image} 
                  alt={quickViewProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Options & Checkout */}
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
                      Shirt Colorway: <span className="text-[#1A1F26]">{selectedColor}</span>
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {quickViewProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setSelectedColor(c.name);
                            if (c.defaultLogoColor) setSelectedLogoColor(c.defaultLogoColor);
                            if (c.image) {
                              setActiveCardImages(prev => ({ ...prev, [quickViewProduct.id]: c.image! }));
                            }
                          }}
                          className={`px-3 py-1.5 text-xs border rounded transition-all font-semibold flex items-center gap-2 ${
                            selectedColor === c.name
                              ? 'bg-[#1A1F26] text-white border-[#1A1F26]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-400" style={{ backgroundColor: c.hex }}></span>
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bespoke Logo Customizer */}
                  <LogoCustomizer
                    selectedStyle={selectedLogoStyle}
                    onSelectStyle={setSelectedLogoStyle}
                    selectedColor={selectedLogoColor}
                    onSelectColor={setSelectedLogoColor}
                    garmentHex={
                      quickViewProduct.colors.find(c => c.name === selectedColor)?.hex || '#1E293B'
                    }
                    garmentColorName={selectedColor}
                    recommendedColor={
                      quickViewProduct.colors.find(c => c.name === selectedColor)?.defaultLogoColor || 'cyan'
                    }
                    compact
                  />

                  {/* Size Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block uppercase">
                      Select Size: <span className="text-[#1A1F26]">{selectedSize}</span>
                    </span>
                    <div className="grid grid-cols-6 gap-2">
                      {(quickViewProduct.sizes || []).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`py-2 text-xs border rounded font-bold transition-all ${
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

                {/* Direct Add to Bag CTA */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <button
                    onClick={handleQuickAdd}
                    className={`w-full py-4 rounded-sm font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      addedId === quickViewProduct.id
                        ? 'bg-emerald-800 text-white'
                        : 'bg-[#B12535] hover:bg-[#8e1d29] text-white shadow-lg active:scale-98'
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
                      className="w-full py-2.5 text-center text-xs font-bold text-slate-700 hover:text-black uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-300 rounded-sm hover:border-slate-500 transition-colors cursor-pointer"
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
