import React, { useState } from 'react';
import type { Product } from '../data/products';
import { ArrowLeft, ArrowUpRight, RefreshCw, SlidersHorizontal } from 'lucide-react';

interface CollectionPageProps {
  category: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles';
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles') => void;
  onBackToHome: () => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  category,
  products,
  onSelectProduct,
  onSelectCategory,
  onBackToHome,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');

  const categoryTitles = {
    all: 'Complete Fairway Collection',
    polos: 'Tour Performance Polos',
    outerwear: '1/4-Zip Performance Layering',
    headwear: 'Tour Performance Poly-Mesh Caps',
    bundles: 'Saturday Foursome Scramble Kits',
  };

  const categorySubtitles = {
    all: 'Engineered for dedicated weekenders with 4-way stretch drape and zero overpriced retail markup.',
    polos: 'Tour-grade micro-pique drape, fused stay-flat collar engineering, and 100+ wash guarantee for men & women.',
    outerwear: 'Water-resistant cadet collar pullover with 4-way stretch for brisk early morning tee times.',
    headwear: 'Flexfit breathable poly-block mesh with silver anti-glare underbill and crisp High Draw tracer mark.',
    bundles: 'Outfit your regular four-ball group in tour-grade gear at $40/shirt bulk savings.',
  };

  let filtered = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);

  if (selectedColorFilter !== 'all') {
    filtered = filtered.filter(p => p.colors.some(c => c.name.toLowerCase().includes(selectedColorFilter.toLowerCase())));
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-white">
      
      {/* Top Banner & Breadcrumbs */}
      <div className="bg-[#1C2C24] text-white py-14 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/assets/brand/logo_tracer_cyan.png" alt="Tracer" className="h-4 w-auto object-contain" />
              <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                HIGH DRAW GOLF CO. &bull; FLAGSHIP STORE
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold">
              {categoryTitles[category]}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {categorySubtitles[category]}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Sort Controls */}
      <div className="border-b border-slate-200 bg-slate-50 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {[
              { id: 'all', label: 'All Gear' },
              { id: 'polos', label: 'Polos' },
              { id: 'outerwear', label: 'Outerwear' },
              { id: 'headwear', label: 'Headwear' },
              { id: 'bundles', label: 'Foursome Kits' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xs transition-all uppercase tracking-wider font-bold cursor-pointer whitespace-nowrap ${
                  category === cat.id
                    ? 'bg-[#1C2C24] text-white shadow-xs'
                    : 'text-slate-600 hover:text-black hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort & Color Controls */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              Showing {sorted.length} Products
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedColorFilter}
                onChange={(e) => setSelectedColorFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700 cursor-pointer focus:outline-none"
                aria-label="Filter by color"
              >
                <option value="all">All Colors</option>
                <option value="navy">Navy</option>
                <option value="cypress">Cypress</option>
                <option value="white">White</option>
                <option value="blue">Carolina Blue</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700 cursor-pointer focus:outline-none"
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

      {/* Spaced-Out Product Grid (Frameless Luxury Presentation) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 lg:gap-x-14 lg:gap-y-24">
          {sorted.map(p => {
            const cardSpecBadge =
              p.category === 'polos'
                ? '180 GSM Micro-Pique'
                : p.category === 'outerwear'
                ? '4-Way Stretch Layer'
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
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />
                    <img
                      src={p.secondaryImage}
                      alt={`${p.name} secondary`}
                      className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                    <div className="absolute top-3.5 left-3.5 bg-[#1C2C24]/85 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-xs uppercase shadow-sm flex items-center gap-1.5">
                      <RefreshCw size={11} className="text-[#38BDF8]" />
                      <span>100+ Washes</span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-[#1A1F26] text-[11px] font-bold tracking-wider px-4 py-2.5 rounded-xs shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                      <span>VIEW DETAILS</span>
                      <ArrowUpRight size={13} />
                    </div>
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-2 mb-2.5">
                    {p.colors.map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        style={{ backgroundColor: c.hex }}
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      />
                    ))}
                    <span className="text-[11px] text-slate-400 font-medium ml-1">
                      {p.colors.length} Colorway{p.colors.length > 1 ? 's' : ''}
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
      </div>

    </div>
  );
};
