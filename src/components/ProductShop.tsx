import React, { useState } from 'react';
import { ShoppingBag, Check, ShieldCheck, Star } from 'lucide-react';

interface ProductShopProps {
  onAddToCart: (item: { id: string; name: string; price: number; color: string; size: string; image: string }) => void;
}

export const ProductShop: React.FC<ProductShopProps> = ({ onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState('Deep Maritime Navy');
  const [selectedSize, setSelectedSize] = useState('L');
  const [addedId, setAddedId] = useState<string | null>(null);

  const heroPolo = {
    id: 'polo-hero-01',
    name: 'The Classic Performance Polo',
    price: 48,
    originalPrice: 110,
    image: selectedColor === 'Charcoal Slate' ? '/assets/polo_navy_macro.png' : '/assets/hero_editorial.png',
    description: 'Matte micro-pique technical poly with stay-flat fused collar and subtle nape tracer needlework.',
  };

  const products = [
    {
      id: 'hat-rope-01',
      name: 'The High Draw Structured Rope Cap',
      price: 32,
      originalPrice: 55,
      image: '/assets/hat_rope_white.png',
      description: '5-panel performance weave with water-repellent finish, braided visor rope, and 3D monogram embroidery.',
    },
    {
      id: 'foursome-4pack-01',
      name: 'The Saturday Foursome Scramble Kit',
      price: 160,
      originalPrice: 192,
      image: '/assets/foursome_after.png',
      description: 'Outfit your regular foursome in matching High Draw performance polos & vintage rope caps. Save $32.',
    },
  ];

  const handleBuyPolo = () => {
    onAddToCart({
      id: heroPolo.id,
      name: heroPolo.name,
      price: heroPolo.price,
      color: selectedColor,
      size: selectedSize,
      image: heroPolo.image,
    });
    setAddedId(heroPolo.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleQuickAdd = (p: typeof products[0]) => {
    onAddToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      color: 'Standard',
      size: 'L / ONE SIZE',
      image: p.image,
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="shop" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-[#C03221] font-bold block">
          AUTUMN FAIRWAYS CAPSULE 001
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#090C10] font-normal">
          Select Your Fairway Gear
        </h2>
        <p className="font-sans text-sm sm:text-base text-slate-600 font-light">
          Direct-to-player pricing. Tour-grade quality without the $110 country club markup.
        </p>
      </div>

      {/* Hero Featured Product (The $48 Polo) */}
      <div className="bg-white border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
        
        {/* Left Hero Image (7 Cols) */}
        <div className="lg:col-span-7 aspect-[4/3] lg:aspect-auto h-full min-h-[400px] relative bg-slate-900 overflow-hidden">
          <img 
            src={heroPolo.image} 
            alt={heroPolo.name} 
            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-[#C03221] text-white font-mono text-xs font-bold uppercase tracking-widest px-3 py-1">
            HERO PIECE &bull; $48 USD
          </div>
        </div>

        {/* Right Buy Console (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-10 space-y-6">
          
          <div>
            <div className="flex items-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
              <span className="font-mono text-xs text-slate-600 ml-2 font-semibold">4.96/5 (1,420 Reviews)</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#090C10] font-medium leading-tight">
              {heroPolo.name}
            </h3>
            <div className="flex items-baseline gap-3 mt-2 font-mono">
              <span className="text-3xl font-bold text-[#090C10]">${heroPolo.price} USD</span>
              <span className="text-sm text-slate-400 line-through">${heroPolo.originalPrice}</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">SAVE $62</span>
            </div>
          </div>

          <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
            {heroPolo.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-wider text-slate-600 block">
              COLOR: <span className="text-[#090C10] font-bold">{selectedColor}</span>
            </label>
            <div className="flex gap-3">
              {[
                { name: 'Deep Maritime Navy', hex: '#0D1B2A' },
                { name: 'Charcoal Slate', hex: '#27272A' },
                { name: 'Crisp Warm Alabaster', hex: '#F8F9FA' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor === c.name ? 'border-[#090C10] scale-110 shadow-md' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor === c.name && (
                    <span className={`w-2 h-2 rounded-full ${c.hex === '#F8F9FA' ? 'bg-black' : 'bg-white'}`}></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-wider text-slate-600 block">
              SIZE: <span className="text-[#090C10] font-bold">{selectedSize}</span>
            </label>
            <div className="grid grid-cols-5 gap-2 font-mono text-xs">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 border text-center font-bold transition-all ${
                    selectedSize === sz
                      ? 'bg-[#090C10] text-white border-[#090C10]'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Unmissable Buy Button */}
          <button
            onClick={handleBuyPolo}
            className={`w-full py-4 font-mono text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              addedId === heroPolo.id
                ? 'bg-emerald-800 text-white'
                : 'bg-[#C03221] hover:bg-[#a62519] text-white shadow-lg'
            }`}
          >
            {addedId === heroPolo.id ? (
              <>
                <Check size={18} className="text-emerald-300" />
                <span>ADDED TO BAG &bull; $48</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>ADD TO BAG &bull; $48</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-slate-500 pt-1">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Free Shipping Over $75 &bull; 30-Day Fairway Guarantee</span>
          </div>

        </div>

      </div>

      {/* Secondary Products (2 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative border border-slate-200">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#090C10] text-white font-mono text-[10px] uppercase font-bold px-3 py-1">
                  ${p.price} USD
                </div>
              </div>
              <h4 className="font-serif text-xl text-[#090C10] font-medium">{p.name}</h4>
              <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">{p.description}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <button
                onClick={() => handleQuickAdd(p)}
                className={`w-full py-3.5 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  addedId === p.id ? 'bg-emerald-800 text-white' : 'bg-[#090C10] hover:bg-[#162a40] text-white'
                }`}
              >
                {addedId === p.id ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
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
