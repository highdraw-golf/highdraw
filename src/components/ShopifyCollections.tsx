import React, { useState } from 'react';
import { ArrowUpRight, Check, X, ShieldCheck, ShoppingBag } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: 'polos' | 'outerwear' | 'headwear' | 'bundles';
  collectionLabel: string;
  price: number;
  originalPrice: number;
  image: string;
  secondaryImage: string;
  colors: string[];
  sizes: string[];
  description: string;
}

interface ShopifyCollectionsProps {
  onAddToCart: (item: { id: string; name: string; price: number; color: string; size: string; image: string }) => void;
}

export const ShopifyCollections: React.FC<ShopifyCollectionsProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Deep Navy');
  const [addedId, setAddedId] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: 'polo-navy-01',
      name: 'The Classic Performance Polo',
      category: 'polos',
      collectionLabel: "MEN'S POLOS",
      price: 48,
      originalPrice: 110,
      image: '/assets/lifestyle_golf.jpg',
      secondaryImage: '/assets/polo_flatlay.jpg',
      colors: ['Deep Navy', 'Augusta Green', 'Charcoal Slate', 'Crisp White'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
      description: 'Matte micro-pique performance drape with stay-flat fused collar stand. Zero synthetic gym-shirt shine.',
    },
    {
      id: 'outerwear-zip-01',
      name: 'The 19th Hole Performance Quarter-Zip',
      category: 'outerwear',
      collectionLabel: 'OUTERWEAR & LAYERING',
      price: 68,
      originalPrice: 145,
      image: '/assets/lifestyle_pullover.jpg',
      secondaryImage: '/assets/hero_balenciaga.png',
      colors: ['Charcoal Heather', 'Deep Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Lightweight stretch performance pullover featuring a lockdown zipper garage and brushed interior warmth.',
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
      colors: ['Vintage White / Navy Rope', 'Charcoal Slate'],
      sizes: ['ONE SIZE'],
      description: '5-panel performance weave with water-repellent finish, braided visor rope, and subtle 3D monogram embroidery.',
    },
    {
      id: 'bundle-starter-01',
      name: 'The Weekend Starter Ensemble',
      category: 'bundles',
      collectionLabel: 'CURATED BUNDLES',
      price: 74,
      originalPrice: 165,
      image: '/assets/starter_kit_luxury.png',
      secondaryImage: '/assets/lookbook_accessories.jpg',
      colors: ['Navy Polo + White Cap', 'Slate Polo + Slate Cap'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Includes 1 Core Performance Polo and 1 Structured Visor Cap on marble flatlay. Saves $6 automatically.',
    },
    {
      id: 'bundle-foursome-01',
      name: 'The Saturday Foursome Scramble Kit',
      category: 'bundles',
      collectionLabel: 'CURATED BUNDLES',
      price: 160,
      originalPrice: 192,
      image: '/assets/foursome_after.png',
      secondaryImage: '/assets/lifestyle_golf.jpg',
      colors: ['Matching Foursome Mix'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Outfit your regular foursome in matching High Draw performance gear. Saves $32 automatically.',
    },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleQuickAdd = () => {
    if (!quickViewProduct) return;

    onAddToCart({
      id: quickViewProduct.id,
      name: quickViewProduct.name,
      price: quickViewProduct.price,
      color: selectedColor,
      size: selectedSize,
      image: quickViewProduct.image,
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
          <span className="text-xs font-bold uppercase tracking-widest text-[#B12535] block mb-1">
            CURATED CATALOG &bull; EDITION 001
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#32363F] font-bold">
            Explore Collections
          </h2>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'polos', label: "Men's Polos" },
            { id: 'outerwear', label: 'Outerwear' },
            { id: 'headwear', label: 'Headwear' },
            { id: 'bundles', label: 'Scramble Bundles' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`pb-2 transition-all font-semibold ${
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
        {filteredProducts.map((p) => (
          <div 
            key={p.id} 
            onClick={() => {
              setQuickViewProduct(p);
              setSelectedColor(p.colors[0]);
              setSelectedSize(p.sizes[0]);
            }}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Huge Full-Bleed Imagery (No Cheap Price Overlay) */}
              <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative mb-4 rounded-xs">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Secondary Image Hover Effect */}
                <img 
                  src={p.secondaryImage} 
                  alt={`${p.name} Detail`}
                  className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />

                {/* Subtle Floating View Button */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-[#32363F] text-xs font-semibold px-4 py-2 rounded-xs shadow-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                  <span>QUICK VIEW & FIT</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>

              {/* Clean Editorial Title (Text Light, No Loud Prices) */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
                  {p.collectionLabel}
                </span>
                <h3 className="font-serif text-xl text-[#32363F] font-bold group-hover:text-[#B12535] transition-colors leading-snug">
                  {p.name}
                </h3>
              </div>
            </div>

            {/* Soft Price & Color Count Indicator */}
            <div className="pt-3 flex items-center justify-between font-sans text-xs text-slate-500 font-medium">
              <span>{p.colors.length} Colorway{p.colors.length > 1 ? 's' : ''} Available</span>
              <span className="font-mono text-sm font-bold text-[#32363F]">${p.price} USD</span>
            </div>

          </div>
        ))}
      </div>

      {/* Quick View & Fitting Slide-Over Drawer */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
            
            {/* Header */}
            <div className="bg-[#2E3033] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block">
                  {quickViewProduct.collectionLabel}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {quickViewProduct.name}
                </h3>
              </div>
              <button 
                onClick={() => setQuickViewProduct(null)} 
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
              
              {/* Product Image */}
              <div className="md:col-span-6 aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden">
                <img 
                  src={quickViewProduct.image} 
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
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">SAVE $62</span>
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
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 text-xs border rounded transition-all font-semibold ${
                            selectedColor === c
                              ? 'bg-[#32363F] text-white border-[#32363F]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  {quickViewProduct.sizes.length > 1 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 block uppercase">
                        Select Size: <span className="text-[#32363F]">{selectedSize}</span>
                      </span>
                      <div className="grid grid-cols-5 gap-2">
                        {quickViewProduct.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`py-2 text-xs border rounded font-bold transition-all ${
                              selectedSize === sz
                                ? 'bg-[#32363F] text-white border-[#32363F]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Add to Bag CTA */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <button
                    onClick={handleQuickAdd}
                    className={`w-full py-4 rounded-md font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
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
                    <span>Free Shipping Over $75 &bull; 30-Day Guarantee</span>
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
