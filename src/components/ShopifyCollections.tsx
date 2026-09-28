import React, { useState } from 'react';
import { ArrowUpRight, Check, X, ShieldCheck, ShoppingBag, Sparkles, RefreshCw } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: 'polos' | 'outerwear' | 'headwear' | 'bundles';
  collectionLabel: string;
  price: number;
  originalPrice: number;
  image: string;
  secondaryImage: string;
  colors: Array<{ name: string; hex: string; image?: string }>;
  sizes: string[];
  description: string;
  washGuarantee: string;
}

interface ShopifyCollectionsProps {
  onAddToCart: (item: { id: string; name: string; price: number; color: string; size: string; image: string }) => void;
}

export const ShopifyCollections: React.FC<ShopifyCollectionsProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Cypress Green');
  const [activeCardImages, setActiveCardImages] = useState<Record<string, string>>({});
  const [addedId, setAddedId] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: 'polo-cypress-01',
      name: 'The Heritage Cypress Micro-Pique Polo',
      category: 'polos',
      collectionLabel: "MEN'S CORE POLOS",
      price: 48,
      originalPrice: 115,
      image: '/assets/polo_cypress_green.jpg',
      secondaryImage: '/assets/polo_flatlay.jpg',
      colors: [
        { name: 'Cypress Green', hex: '#2A4236', image: '/assets/polo_cypress_green.jpg' },
        { name: 'Deep Navy', hex: '#1E293B', image: '/assets/lifestyle_golf.jpg' },
        { name: 'Carolina Stripe', hex: '#6BA4B8', image: '/assets/polo_carolina_blue.jpg' },
        { name: 'Crisp White', hex: '#FFFFFF', image: '/assets/polo_flatlay.jpg' },
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      description: 'Ultra-refined 4-way stretch drape engineered for 40+ golfers. Fused knit stay-flat collar, moisture-wicking micro-pique, and zero gym-shirt cling. Designed to survive 100+ machine washes.',
      washGuarantee: '100+ Washes Guarantee • Won’t Shrink or Fade',
    },
    {
      id: 'polo-carolina-01',
      name: 'The Coastal Carolina Performance Stripe Polo',
      category: 'polos',
      collectionLabel: "MEN'S STRIPE CAPSULE",
      price: 48,
      originalPrice: 115,
      image: '/assets/polo_carolina_blue.jpg',
      secondaryImage: '/assets/lifestyle_coastal_18th.jpg',
      colors: [
        { name: 'Carolina Stripe', hex: '#6BA4B8', image: '/assets/polo_carolina_blue.jpg' },
        { name: 'Deep Navy', hex: '#1E293B', image: '/assets/lifestyle_golf.jpg' },
        { name: 'Cypress Green', hex: '#2A4236', image: '/assets/polo_cypress_green.jpg' },
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      description: 'Subtle yarn-dyed maritime micro-stripe with breathable UPF 50+ UV solar shield. Perfect weight that drapes cleanly over midsection without pulling.',
      washGuarantee: '100+ Washes Guarantee • Anti-Pilling Knit',
    },
    {
      id: 'polo-navy-01',
      name: 'The Classic Performance Polo — Deep Navy',
      category: 'polos',
      collectionLabel: "MEN'S CORE POLOS",
      price: 48,
      originalPrice: 110,
      image: '/assets/lifestyle_golf.jpg',
      secondaryImage: '/assets/polo_navy_macro.png',
      colors: [
        { name: 'Deep Navy', hex: '#1E293B', image: '/assets/lifestyle_golf.jpg' },
        { name: 'Cypress Green', hex: '#2A4236', image: '/assets/polo_cypress_green.jpg' },
        { name: 'Carolina Stripe', hex: '#6BA4B8', image: '/assets/polo_carolina_blue.jpg' },
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      description: 'Tour-tested navy drape. Structured athletic tailoring, stay-flat fused placket, and luxury drape at an honest $48 mid-market price.',
      washGuarantee: '100+ Washes Guarantee • Wrinkle-Free Dry',
    },
    {
      id: 'outerwear-zip-01',
      name: 'The 19th Hole Performance Quarter-Zip',
      category: 'outerwear',
      collectionLabel: 'OUTERWEAR & LAYERING',
      price: 68,
      originalPrice: 145,
      image: '/assets/lifestyle_pullover.jpg',
      secondaryImage: '/assets/lifestyle_coastal_18th.jpg',
      colors: [
        { name: 'Charcoal Heather', hex: '#475569', image: '/assets/lifestyle_pullover.jpg' },
        { name: 'Deep Navy', hex: '#1E293B', image: '/assets/lifestyle_golf.jpg' },
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      description: 'Brushed thermal micro-fleece interior with technical stretch shell. Finished with lockdown zipper garage and storm placket.',
      washGuarantee: 'Cold Wash Tested • Retains Shape & Loft',
    },
    {
      id: 'headwear-rope-01',
      name: 'The High Draw Structured Visor Rope Cap',
      category: 'headwear',
      collectionLabel: 'HEADWEAR & ACCESSORIES',
      price: 32,
      originalPrice: 55,
      image: '/assets/hat_rope_white.png',
      secondaryImage: '/assets/lookbook_accessories.jpg',
      colors: [
        { name: 'Vintage White / Navy Rope', hex: '#F8FAFC', image: '/assets/hat_rope_white.png' },
        { name: 'Cypress Slate', hex: '#2A4236', image: '/assets/hat_rope_white.png' },
      ],
      sizes: ['ONE SIZE (SNAPBACK)'],
      description: 'Classic 5-panel retro structured crown with moisture-wicking headband and braided visor rope accent.',
      washGuarantee: 'Sweat-Stain Resistant • Hand Wash Rinse',
    },
    {
      id: 'bundle-foursome-01',
      name: 'The Saturday Foursome Scramble Kit (4 Polos)',
      category: 'bundles',
      collectionLabel: 'CURATED BUNDLES',
      price: 160,
      originalPrice: 192,
      image: '/assets/foursome_after.png',
      secondaryImage: '/assets/lifestyle_coastal_18th.jpg',
      colors: [
        { name: 'Mixed Foursome Selection', hex: '#2A4236' },
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      description: 'Outfit your regular weekend group in tour-grade performance polos. $40/shirt bulk bundle rate saves $32 immediately.',
      washGuarantee: 'Complete Foursome Guarantee',
    },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleColorSwatchClick = (productId: string, color: { name: string; hex: string; image?: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    if (color.image) {
      setActiveCardImages(prev => ({ ...prev, [productId]: color.image! }));
    }
  };

  const handleQuickAdd = () => {
    if (!quickViewProduct) return;

    onAddToCart({
      id: quickViewProduct.id,
      name: quickViewProduct.name,
      price: quickViewProduct.price,
      color: selectedColor,
      size: selectedSize,
      image: activeCardImages[quickViewProduct.id] || quickViewProduct.image,
    });

    setAddedId(quickViewProduct.id);
    setTimeout(() => {
      setAddedId(null);
      setQuickViewProduct(null);
    }, 1500);
  };

  return (
    <section id="polos" className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-white">
      
      {/* Category Navigation Header (Straight Down Style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-slate-200 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B12535]"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B12535]">
              MID-MARKET VALUE REVOLUTION &bull; $48 TOUR DRAPE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#32363F] font-bold tracking-tight">
            Crafted for Life on the Fairway
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Zero $120 country club markups. Engineered with 4-way stretch drape and wash-tested 100+ times to stay crisp, comfortable, and wrinkle-free.
          </p>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 font-mono text-xs uppercase tracking-wider">
          {[
            { id: 'all', label: 'All Gear' },
            { id: 'polos', label: "Men's Polos ($48)" },
            { id: 'outerwear', label: 'Outerwear ($68)' },
            { id: 'headwear', label: 'Caps ($32)' },
            { id: 'bundles', label: 'Foursome Kits ($160)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`pb-2 px-1 transition-all font-bold ${
                activeCategory === cat.id
                  ? 'text-[#32363F] border-b-2 border-[#B12535]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Picture-Heavy Collection Cards (Peter Millar / Straight Down Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredProducts.map((p) => {
          const currentImage = activeCardImages[p.id] || p.image;

          return (
            <div 
              key={p.id} 
              onClick={() => {
                setQuickViewProduct(p);
                setSelectedColor(p.colors[0].name);
                setSelectedSize(p.sizes[0]);
              }}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Huge Full-Bleed Imagery (No Cheap Price Overlay) */}
                <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative mb-4 rounded-xs border border-slate-100 shadow-sm">
                  <img 
                    src={currentImage} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Secondary Image Hover Effect */}
                  <img 
                    src={p.secondaryImage} 
                    alt={`${p.name} Detail`}
                    className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  />

                  {/* 100+ Washes Guarantee Badge */}
                  <div className="absolute top-3 left-3 bg-[#2A4236]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1.5">
                    <RefreshCw size={11} className="text-[#FDE022]" />
                    <span>100+ Washes Tested</span>
                  </div>

                  {/* Subtle Floating View Button */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-[#32363F] text-xs font-bold px-4 py-2.5 rounded-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                    <span>QUICK VIEW & SIZING</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>

                {/* Color Swatch Selector Directly on Card */}
                <div className="flex items-center gap-2 mb-2" onClick={(e) => e.stopPropagation()}>
                  {p.colors.map((c) => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={(e) => handleColorSwatchClick(p.id, c, e)}
                      style={{ backgroundColor: c.hex }}
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-xs hover:scale-125 transition-transform"
                      aria-label={c.name}
                    />
                  ))}
                  <span className="text-[11px] text-slate-400 font-medium ml-1">
                    {p.colors.length} Colorway{p.colors.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Clean Editorial Title */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#B12535] block">
                    {p.collectionLabel}
                  </span>
                  <h3 className="font-serif text-xl text-[#32363F] font-bold group-hover:text-[#B12535] transition-colors leading-snug">
                    {p.name}
                  </h3>
                </div>
              </div>

              {/* Price & Value Proposition Bar */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-baseline justify-between font-sans">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-lg font-bold text-[#32363F]">${p.price}</span>
                  <span className="font-mono text-xs text-slate-400 line-through">${p.originalPrice}</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A4236] bg-[#2A4236]/10 px-2 py-0.5 rounded-xs">
                  Tour Drape
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Quick View & Fitting Slide-Over Drawer */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
            
            {/* Header */}
            <div className="bg-[#2A4236] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FDE022] block">
                  {quickViewProduct.collectionLabel} &bull; HONEST MID-MARKET PRICING
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {quickViewProduct.name}
                </h3>
              </div>
              <button 
                onClick={() => setQuickViewProduct(null)} 
                className="p-2 text-slate-300 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
              
              {/* Product Image */}
              <div className="md:col-span-6 aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                <img 
                  src={activeCardImages[quickViewProduct.id] || quickViewProduct.image} 
                  alt={quickViewProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Options & Checkout */}
              <div className="md:col-span-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold font-mono text-[#32363F]">${quickViewProduct.price} USD</span>
                    <span className="text-sm text-slate-400 line-through">${quickViewProduct.originalPrice}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      SAVE ${quickViewProduct.originalPrice - quickViewProduct.price}
                    </span>
                  </div>

                  {/* Wash Durability Callout */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-700 flex items-center gap-2">
                    <RefreshCw size={15} className="text-[#2A4236]" />
                    <span className="font-bold">{quickViewProduct.washGuarantee}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {/* Color Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block uppercase">
                      Colorway: <span className="text-[#32363F]">{selectedColor}</span>
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {quickViewProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setSelectedColor(c.name);
                            if (c.image) {
                              setActiveCardImages(prev => ({ ...prev, [quickViewProduct.id]: c.image! }));
                            }
                          }}
                          className={`px-3 py-1.5 text-xs border rounded transition-all font-semibold flex items-center gap-2 ${
                            selectedColor === c.name
                              ? 'bg-[#32363F] text-white border-[#32363F]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-400" style={{ backgroundColor: c.hex }}></span>
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector with S to 3XL options */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block uppercase">
                      Select Size: <span className="text-[#32363F]">{selectedSize}</span>
                    </span>
                    <div className="grid grid-cols-6 gap-2">
                      {quickViewProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`py-2 text-xs border rounded font-bold transition-all ${
                            selectedSize === sz
                              ? 'bg-[#2A4236] text-white border-[#2A4236]'
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
                        <span>ADD TO BAG &bull; ${quickViewProduct.price}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span>Free Shipping Over $75 &bull; 30-Day Fairway Guarantee</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
