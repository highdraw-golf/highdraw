import React, { useState } from 'react';

export const CraftsmanshipSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fabric' | 'collar' | 'cut'>('fabric');

  const pillars = {
    fabric: {
      title: 'Matte Micro-Pique Knit',
      subtitle: 'Zero Synthetic Sheen &bull; 180 GSM Hydrophobic Drape',
      description: 'Most performance polos look slick and shiny, resembling gym activewear. We engineered a proprietary matte micro-pique weave that breathes in midday heat while maintaining the structured, non-reflective appearance of fine cotton.',
      details: ['180 GSM Weight', '92% Technical Micro-Poly / 8% Elastane', 'Matte Non-Reflective Finish', 'Anti-Odor & Sweat-Wicking'],
      image: '/assets/polo_navy_macro.png',
    },
    collar: {
      title: 'Stay-Flat Fused Collar Stand',
      subtitle: 'Perpetual Shape Retention &bull; Wash-Tested 50+ Times',
      description: 'The single biggest pet peeve in golf apparel is a collar that curls flat after three washes. Our polos feature a reinforced internal collar stand that stays upright under sweaters or casual blazers.',
      details: ['Fused Interlining Stand', 'Anti-Curl Ribbed Edges', 'Cross-Occasion Collar Height', 'Zero Ironing Required'],
      image: '/assets/starter_kit_luxury.png',
    },
    cut: {
      title: 'The Zero-Distraction Swing Fit',
      subtitle: 'Tailored Silhouette &bull; Full Upper-Back Articulation',
      description: 'Designed specifically for the follow-through. Stripping away tight biceps bindings and excess torso fabric to ensure the shirt stays tucked and comfortable from the 1st tee box to the 19th hole.',
      details: ['Articulated Shoulder Seams', 'Extended Drop Tail Hem', 'Unrestricted Upper Back Flex', 'Tailored Midsection'],
      image: '/assets/hero_editorial.png',
    },
  };

  const current = pillars[activeTab];

  return (
    <section id="craftsmanship" className="py-20 px-6 max-w-7xl mx-auto hairline-b bg-white">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-16 space-y-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C03221] font-semibold block">
          TEXTILE ARCHITECTURE & ANATOMY
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-[#090C10] font-normal tracking-tight-editorial">
          Crafted Without Compromise
        </h2>
        <p className="font-sans text-sm md:text-base text-slate-500 font-light leading-relaxed">
          Stripping away marketing buzzwords down to what dedicated golfers actually care about: collar memory, fabric drape, and swing articulation.
        </p>
      </div>

      {/* Interactive Craftsmanship Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Navigation Tabs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <button
            onClick={() => setActiveTab('fabric')}
            className={`w-full p-6 text-left border transition-all ${
              activeTab === 'fabric'
                ? 'bg-[#090C10] text-white border-[#090C10] shadow-lg'
                : 'bg-[#FBFBFA] text-[#090C10] border-slate-200 hover:border-slate-400'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C03221] mb-1">
              PILLAR 01
            </div>
            <h3 className="font-serif text-xl font-medium">1. Matte Micro-Pique Knit</h3>
            <p className={`font-sans text-xs mt-2 font-light ${activeTab === 'fabric' ? 'text-slate-300' : 'text-slate-500'}`}>
              Zero synthetic gym-shirt shine. Pure breathable drape.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('collar')}
            className={`w-full p-6 text-left border transition-all ${
              activeTab === 'collar'
                ? 'bg-[#090C10] text-white border-[#090C10] shadow-lg'
                : 'bg-[#FBFBFA] text-[#090C10] border-slate-200 hover:border-slate-400'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C03221] mb-1">
              PILLAR 02
            </div>
            <h3 className="font-serif text-xl font-medium">2. Stay-Flat Fused Collar Stand</h3>
            <p className={`font-sans text-xs mt-2 font-light ${activeTab === 'collar' ? 'text-slate-300' : 'text-slate-500'}`}>
              Never curls into bacon folds after washing.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('cut')}
            className={`w-full p-6 text-left border transition-all ${
              activeTab === 'cut'
                ? 'bg-[#090C10] text-white border-[#090C10] shadow-lg'
                : 'bg-[#FBFBFA] text-[#090C10] border-slate-200 hover:border-slate-400'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C03221] mb-1">
              PILLAR 03
            </div>
            <h3 className="font-serif text-xl font-medium">3. Zero-Distraction Swing Fit</h3>
            <p className={`font-sans text-xs mt-2 font-light ${activeTab === 'cut' ? 'text-slate-300' : 'text-slate-500'}`}>
              Articulated shoulders for full follow-through freedom.
            </p>
          </button>

        </div>

        {/* Right Detail Pane & Macro Image (7 Cols) */}
        <div className="lg:col-span-7 bg-[#FBFBFA] hairline-all p-8 md:p-10 space-y-6">
          <div className="relative aspect-[16/10] overflow-hidden hairline-all bg-slate-900 mb-6">
            <img 
              src={current.image} 
              alt={current.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-[#090C10] text-white font-mono text-[9px] uppercase tracking-[0.25em] px-3 py-1">
              MACRO ANATOMY // {activeTab.toUpperCase()}
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {current.subtitle}
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#090C10] font-normal">
              {current.title}
            </h3>
            <p className="font-sans text-sm text-slate-600 font-light leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Details List */}
          <div className="grid grid-cols-2 gap-3 pt-4 hairline-t font-mono text-xs text-[#090C10]">
            {current.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C03221]"></span>
                <span>{detail}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};
