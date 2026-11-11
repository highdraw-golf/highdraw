import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import type { Product } from '../data/products';
import { ArrowLeft, ArrowUpRight, RefreshCw, SlidersHorizontal, Bell, Check } from 'lucide-react';
import { resolvePrintifyFulfillment } from '../lib/fulfillmentResolver';
import { SPRING_LAYOUT } from '../lib/motion/tokens';
import { useMotionPreference } from '../components/motion/MotionProvider';

interface CollectionPageProps {
  category: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles';
  initialTier?: 'all' | 'weekender' | 'clubhouse' | 'tournament';
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (
    category: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles',
    tier?: 'all' | 'weekender' | 'clubhouse' | 'tournament'
  ) => void;
  onBackToHome: () => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  category,
  initialTier = 'all',
  products,
  onSelectProduct,
  onSelectCategory,
  onBackToHome,
}) => {
  const { isReduced } = useMotionPreference();
  const [selectedTier, setSelectedTier] = useState<'all' | 'weekender' | 'clubhouse' | 'tournament'>(initialTier);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [selectedUserFilter, setSelectedUserFilter] = useState<'all' | 'mens' | 'womens'>('all');
  const [activeCardImages, setActiveCardImages] = useState<Record<string, string>>({});
  const [activeCardColors, setActiveCardColors] = useState<Record<string, string>>({});
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  useEffect(() => {
    setSelectedTier(initialTier);
  }, [initialTier]);

  const tierTitles: Record<string, string> = {
    weekender: 'The Weekender Collection ($48)',
    clubhouse: 'The Clubhouse Collection ($66 – $68)',
    tournament: 'Tournament Edition Allocation (Summer 2026)',
  };

  const tierSubtitles: Record<string, string> = {
    weekender: '180 GSM technical UPF 50+ micropique polos engineered for hot summer rounds, capillary airflow, and 100+ machine washes.',
    clubhouse: 'Rich heathered 57/43 combed cotton-poly fine pique polos ($66) and midweight low-pill fleece 1/4-zip layering ($68) crafted for the 19th hole and dinner.',
    tournament: 'Proprietary 3.4 oz competition micro-knit prototype with laser-bonded stay-flat collar stand. Reserve priority access below.',
  };

  const categoryTitles = {
    all: 'Complete Fairway & Clubhouse Collection',
    polos: 'Weekender & Clubhouse Polos',
    outerwear: 'Clubhouse 1/4-Zip Fleece Layering',
    headwear: 'Tour Performance Poly-Mesh Caps',
    bundles: 'Saturday Foursome Scramble Kits',
  };

  const categorySubtitles = {
    all: 'Three distinct fabric tiers engineered with 4-way stretch drape, bespoke 3-mark embroidery, and zero $125 boutique retail markup.',
    polos: 'Compare our $48 Weekender UPF 50+ micropique and $66 Clubhouse 57/43 cotton-poly fine pique silhouettes for Men & Women.',
    outerwear: 'Cozy 8.3-ounce low-pill fleece cadet collar pullover ($68) embroidered to order for crisp morning tee times and evening patios.',
    headwear: 'Authentic Flexfit® Cool & Dry poly-block mesh with silver anti-glare underbill and structured High Draw crown mark ($35).',
    bundles: 'Outfit your regular four-ball scramble group in custom-embroidered polos at $40/shirt bulk savings ($160 complete kit).',
  };

  const headerTitle = selectedTier !== 'all' ? tierTitles[selectedTier] : categoryTitles[category];
  const headerSubtitle = selectedTier !== 'all' ? tierSubtitles[selectedTier] : categorySubtitles[category];

  let filtered = category === 'all' ? products : products.filter(p => p.category === category);

  if (selectedTier !== 'all') {
    filtered = filtered.filter(
      p => p.tier === selectedTier || (selectedTier === 'weekender' && p.category === 'bundles')
    );
  }

  if (selectedUserFilter !== 'all') {
    filtered = filtered.filter(
      p => p.userType === selectedUserFilter || p.userType === 'unisex' || p.userType === 'foursome'
    );
  }

  if (selectedColorFilter !== 'all') {
    filtered = filtered.filter(p =>
      p.colors.some(c => c.name.toLowerCase().includes(selectedColorFilter.toLowerCase()))
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const handleSwatchClick = (
    product: Product,
    color: { name: string; hex: string; image?: string },
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setActiveCardColors(prev => ({ ...prev, [product.id]: color.name }));
    const resolved = resolvePrintifyFulfillment({
      id: product.id,
      color: color.name,
      size: product.sizes?.[0] || 'L',
      logoStyle: 'mark_monogram',
    });
    setActiveCardImages(prev => ({
      ...prev,
      [product.id]: resolved.officialMockupUrl || color.image || product.image,
    }));
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem('highdraw_tournament_waitlist') || '[]');
      existing.push({ email: waitlistEmail.trim(), tier: 'tournament', at: new Date().toISOString() });
      localStorage.setItem('highdraw_tournament_waitlist', JSON.stringify(existing));
    } catch {
      // ignore
    }
    setWaitlistJoined(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner & Tier Switcher */}
      <div className="bg-[#1C2C24] text-white py-12 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer t-press"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/brand/logos/mark_monogram_cyan.png"
                  alt="High Draw Mark + Monogram"
                  className="h-5 w-auto object-contain"
                />
                <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                  HIGH DRAW GOLF CO. &bull; 3-TIER BESPOKE ARCHITECTURE
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold">{headerTitle}</h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">{headerSubtitle}</p>
            </div>

            {/* Interactive Tier Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-black/25 p-1.5 rounded-xs border border-white/10 self-start lg:self-auto">
              {[
                { id: 'all', label: 'All Tiers' },
                { id: 'weekender', label: 'Weekender ($48)' },
                { id: 'clubhouse', label: 'Clubhouse ($66)' },
                { id: 'tournament', label: 'Tournament' },
              ].map(t => {
                const active = selectedTier === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTier(t.id as any);
                      if (t.id !== 'all' && category !== 'all' && t.id === 'clubhouse') {
                        onSelectCategory('all', 'clubhouse');
                      }
                    }}
                    className={`relative px-3 py-1.5 rounded-2xs font-mono text-[11px] uppercase tracking-wider cursor-pointer transition-colors t-press ${
                      active ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {active && (
                      <m.span
                        layoutId={isReduced ? undefined : 'collection-tier-pill'}
                        transition={SPRING_LAYOUT}
                        className="absolute inset-0 bg-[#B12535] rounded-2xs"
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Controls */}
      <div className="border-b border-slate-200 bg-slate-50 sticky top-28 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: 'all', label: 'All Gear' },
              { id: 'polos', label: 'Polos' },
              { id: 'outerwear', label: 'Outerwear' },
              { id: 'headwear', label: 'Headwear' },
              { id: 'bundles', label: 'Foursome Kits' },
            ].map(cat => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id as any, selectedTier)}
                  className={`relative px-3 py-1.5 rounded-xs transition-colors uppercase tracking-wider font-bold cursor-pointer whitespace-nowrap t-press ${
                    active ? 'text-white' : 'text-slate-600 hover:text-black hover:bg-slate-200/70'
                  }`}
                >
                  {active && (
                    <m.span
                      layoutId={isReduced ? undefined : 'collection-cat-pill'}
                      transition={SPRING_LAYOUT}
                      className="absolute inset-0 bg-[#1C2C24] rounded-xs"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort, Golfer Profile & Color Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-white border border-slate-300 rounded-xs p-0.5 text-[11px]">
              {[
                { id: 'all', label: 'All Cuts' },
                { id: 'mens', label: "Men's" },
                { id: 'womens', label: "Women's" },
              ].map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUserFilter(u.id as any)}
                  className={`px-2.5 py-1 rounded-2xs font-bold uppercase cursor-pointer transition-colors ${
                    selectedUserFilter === u.id
                      ? 'bg-[#1A1F26] text-white'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              Showing {sorted.length} Item{sorted.length === 1 ? '' : 's'}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedColorFilter}
                onChange={e => setSelectedColorFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-xs px-2.5 py-1 text-xs text-slate-700 cursor-pointer focus:outline-none"
                aria-label="Filter by color"
              >
                <option value="all">All Colors</option>
                <option value="navy">Navy</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="blue">Blue / Aegean</option>
                <option value="charcoal">Charcoal / Grey</option>
                <option value="green">Forest / Teal</option>
                <option value="red">Red</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-slate-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-xs px-2.5 py-1 text-xs text-slate-700 cursor-pointer focus:outline-none"
                aria-label="Sort products"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Spaced-Out Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24 space-y-12">
        {selectedTier === 'tournament' && (
          <div className="p-6 sm:p-8 bg-[#0D1520] text-white rounded-xs border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <span className="font-mono text-[11px] text-[#38BDF8] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Bell size={13} />
                <span>SUMMER 2026 TOURNAMENT ALLOCATION</span>
              </span>
              <h2 className="font-serif text-2xl font-bold">
                Join the Private Allocation List for Early Sizing Access
              </h2>
              <p className="text-xs text-slate-300">
                Numbered first-run release at $110 direct (comparable to $195 tour pro-shop chassis).
              </p>
            </div>
            {waitlistJoined ? (
              <div className="px-4 py-3 bg-emerald-950 border border-emerald-500/40 rounded-xs text-xs text-emerald-200 flex items-center gap-2 font-semibold">
                <Check size={15} className="text-emerald-400" />
                <span>Priority Summer &rsquo;26 access confirmed.</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex w-full lg:w-auto gap-2">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="Enter your email..."
                  aria-label="Tournament waitlist email"
                  className="flex-1 lg:w-64 px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xs text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#38BDF8]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer t-press whitespace-nowrap"
                >
                  NOTIFY ME
                </button>
              </form>
            )}
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="text-center py-20 space-y-4 border border-slate-200 rounded-xs bg-slate-50">
            <p className="font-serif text-xl text-[#1A1F26]">No items match those exact filters.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedTier('all');
                setSelectedColorFilter('all');
                setSelectedUserFilter('all');
                onSelectCategory('all', 'all');
              }}
              className="px-5 py-2.5 bg-[#1C2C24] text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer t-press"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 lg:gap-x-14 lg:gap-y-24">
            {sorted.map(p => {
              const displayImg = activeCardImages[p.id] || p.image;
              const activeColName = activeCardColors[p.id];
              const cardSpecBadge = p.isComingSoon
                ? 'Summer 2026 Prototype'
                : p.tier === 'clubhouse' && p.category === 'polos'
                ? '57/43 Fine Pique'
                : p.category === 'polos'
                ? '180 GSM Micropique'
                : p.category === 'outerwear'
                ? '8.3 oz Midweight Fleece'
                : p.category === 'headwear'
                ? 'Flexfit® Poly-Mesh'
                : '4-Polo Kit • $40/Shirt';

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[3/4] bg-[#F7F7F6] overflow-hidden relative mb-5 rounded-xs transition-all duration-500">
                      <img
                        src={displayImg}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      />
                      {!activeCardImages[p.id] && (
                        <img
                          src={p.secondaryImage}
                          alt={`${p.name} secondary`}
                          loading="lazy"
                          className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        />
                      )}
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
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-[#1A1F26] text-[11px] font-bold tracking-wider px-4 py-2.5 rounded-xs shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                        <span>{p.isComingSoon ? 'JOIN WAITLIST' : 'CUSTOMIZE & VIEW'}</span>
                        <ArrowUpRight size={13} />
                      </div>
                    </div>

                    {/* Interactive Swatches */}
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap" onClick={e => e.stopPropagation()}>
                      {p.colors.map(c => {
                        const selected = activeColName === c.name;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            title={c.name}
                            onClick={e => handleSwatchClick(p, c, e)}
                            style={{ backgroundColor: c.hex }}
                            className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                              selected
                                ? 'ring-2 ring-offset-1 ring-[#1C2C24] border-white scale-115'
                                : 'border-slate-300 hover:scale-120'
                            }`}
                            aria-label={`${p.name} in ${c.name}`}
                          />
                        );
                      })}
                      <span className="text-[11px] text-slate-400 font-medium ml-1">
                        {activeColName || `${p.colors.length} Colorway${p.colors.length > 1 ? 's' : ''}`}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#B12535] block">
                        {p.collectionLabel}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#1A1F26] font-bold group-hover:text-[#B12535] transition-colors leading-snug">
                        {p.name}
                      </h3>
                    </div>
                  </div>

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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
