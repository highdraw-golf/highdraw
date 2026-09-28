import React, { useState } from 'react';
import { ShoppingBag, Check, Compass } from 'lucide-react';

interface CapsuleGridProps {
  onAddToCart: (item: { id: string; name: string; price: number; color: string; size: string; image: string }) => void;
  onOpenConcierge: () => void;
}

export const CapsuleGrid: React.FC<CapsuleGridProps> = ({ onAddToCart, onOpenConcierge }) => {
  const [addedId, setAddedId] = useState<string | null>(null);

  const products = [
    {
      id: 'polo-classic-01',
      name: 'The Classic Performance Polo',
      category: 'THE ANCHOR GARMENT',
      price: 48,
      originalPrice: 110,
      image: '/assets/polo_navy_macro.png',
      badge: 'POPULAR',
      colorOptions: ['Maritime Navy', 'Charcoal Slate', 'Crisp White'],
      description: 'Matte micro-pique technical poly with stay-flat fused collar and subtle nape tracer needlework.',
    },
    {
      id: 'hat-rope-01',
      name: 'The High Draw Structured Rope Cap',
      category: 'ESSENTIAL HEADWEAR',
      price: 32,
      originalPrice: 55,
      image: '/assets/hat_rope_white.png',
      badge: 'HERO ACCESSORY',
      colorOptions: ['Vintage White / Navy Rope', 'Charcoal Slate'],
      description: '5-panel performance weave with water-repellent finish, braided visor rope, and 3D monogram embroidery.',
    },
    {
      id: 'bundle-starter-01',
      name: 'The Weekend Starter Kit (Polo + Cap)',
      category: 'CURATED BUNDLE',
      price: 74,
      originalPrice: 165,
      image: '/assets/starter_kit_luxury.png',
      badge: 'SAVE $6 AUTOMATICALLY',
      colorOptions: ['Navy Polo + White Cap', 'Charcoal Polo + Slate Cap'],
      description: 'The definitive 19th-hole ensemble. Includes 1 Core Performance Polo and 1 Structured Rope Cap on marble flatlay.',
    },
  ];

  const handleQuickAdd = (product: typeof products[0]) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color: product.colorOptions[0],
      size: 'L',
      image: product.image,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="capsule" className="py-20 px-6 max-w-7xl mx-auto hairline-b">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 hairline-b gap-6">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C03221] font-semibold mb-2">
            CURATED CAPSULE // NO SKU CLUTTER
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-[#090C10] font-normal tracking-tight-editorial">
            The Autumn Fairways Drop
          </h2>
        </div>
        <p className="font-sans text-sm text-slate-500 max-w-md font-light">
          Three non-negotiable pieces built for maximum cross-occasion utility. From an 8:00 AM tee time to an informal dinner.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p) => (
          <div 
            key={p.id}
            className="group bg-white hairline-all p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-slate-400"
          >
            <div>
              {/* Image Container */}
              <div className="relative aspect-[4/5] bg-[#FBFBFA] mb-6 overflow-hidden hairline-all">
                <img 
                  src={p.image} 
                  alt={p.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-[#090C10] text-white font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1">
                  {p.badge}
                </div>

                {/* Concierge overlay button */}
                <button
                  onClick={onOpenConcierge}
                  className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm hover:bg-[#090C10] hover:text-white text-[#090C10] font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2 border border-slate-200 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Compass size={12} className="text-[#C03221]" />
                  <span>GROUP FIT</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 block">
                  {p.category}
                </span>
                <h3 className="font-serif text-xl text-[#090C10] font-medium leading-snug">
                  {p.name}
                </h3>
                <p className="font-sans text-xs text-slate-500 font-light leading-relaxed pt-1">
                  {p.description}
                </p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-6 mt-6 hairline-t">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-xl font-bold text-[#090C10]">${p.price}</span>
                  <span className="text-xs text-slate-400 line-through">${p.originalPrice}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                  LIMITED DROP 001
                </span>
              </div>

              <button
                onClick={() => handleQuickAdd(p)}
                className={`w-full py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  addedId === p.id 
                    ? 'bg-emerald-800 text-white' 
                    : 'bg-[#090C10] text-white hover:bg-[#162a40]'
                }`}
              >
                {addedId === p.id ? (
                  <>
                    <Check size={14} className="text-emerald-300" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>ADD TO BAG &bull; ${p.price}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
