import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Compass, Zap, RefreshCw } from 'lucide-react';

interface EditorialHeroProps {
  onAddToCart: (item: { id: string; name: string; price: number; color: string; size: string; image: string }) => void;
  onOpenConcierge: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onAddToCart, onOpenConcierge }) => {
  const [selectedColor, setSelectedColor] = useState('Deep Maritime Navy');
  const [selectedSize, setSelectedSize] = useState('L');
  const [isAdded, setIsAdded] = useState(false);
  const [campaignStyle, setCampaignStyle] = useState<'veranda' | 'balenciaga'>('veranda');

  const campaignImages = {
    veranda: '/assets/hero_editorial.png',
    balenciaga: '/assets/hero_balenciaga.png',
  };

  const colors = [
    { name: 'Deep Maritime Navy', hex: '#0D1B2A', image: '/assets/hero_editorial.png' },
    { name: 'Charcoal Heather', hex: '#27272A', image: '/assets/polo_navy_macro.png' },
    { name: 'Crisp Warm Alabaster', hex: '#F8F9FA', image: '/assets/hero_editorial.png' },
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddHeroItem = () => {
    onAddToCart({
      id: 'polo-hero-01',
      name: 'The Classic Performance Pique Polo',
      price: 48,
      color: selectedColor,
      size: selectedSize,
      image: campaignImages[campaignStyle],
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="hairline-b bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[88vh]">
        
        {/* Left Editorial Visual Pane (7 Cols) */}
        <div className="lg:col-span-7 relative min-h-[520px] lg:min-h-full overflow-hidden flex flex-col justify-end p-8 md:p-12 hairline-r bg-slate-900 group">
          
          {/* Background Photography */}
          <img 
            src={campaignImages[campaignStyle]} 
            alt="High Draw Golf Editorial Campaign" 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-95 transition-all duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090C10]/90 via-[#090C10]/30 to-transparent"></div>

          {/* Campaign Style Toggle Badge */}
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="bg-[#090C10]/90 backdrop-blur-md px-4 py-2 border border-white/10 font-mono text-[10px] uppercase tracking-[0.25em] text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C03221]"></span>
              <span>LOOKBOOK: {campaignStyle === 'veranda' ? 'VERANDA EDITION' : 'ARCHITECTURAL TWILIGHT'}</span>
            </div>

            <button
              onClick={() => setCampaignStyle(campaignStyle === 'veranda' ? 'balenciaga' : 'veranda')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-2 border border-white/20 font-mono text-[10px] uppercase tracking-widest text-white transition-all flex items-center gap-1"
              title="Toggle Editorial Mood"
            >
              <RefreshCw size={11} />
              <span>SWITCH PERSPECTIVE</span>
            </button>
          </div>

          {/* Overlay Statement */}
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C03221] text-white font-mono text-[10px] uppercase tracking-[0.2em]">
              <Zap size={11} />
              <span>THE SMART VALUE PLAY</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.08] tracking-tight-editorial">
              "The high draw cannot be bought. <br className="hidden sm:inline" />
              <span className="italic font-light text-slate-300">It is struck.</span>"
            </h1>
            <p className="font-sans text-sm md:text-base text-slate-300 max-w-md font-light leading-relaxed">
              Dignified performance apparel for the 10–20 round weekender. Tour-grade matte micro-pique without the $110 country club tax.
            </p>
          </div>
        </div>

        {/* Right Dossier & Commerce Pane (5 Cols) */}
        <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-white">
          <div className="space-y-8">
            
            {/* Dossier Header */}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C03221] font-semibold mb-2">
                DOSSIER // EDITION 001
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#090C10] font-medium leading-tight">
                The Classic Performance Polo
              </h2>
              <div className="mt-3 flex items-baseline gap-4">
                <span className="font-mono text-2xl font-semibold text-[#090C10]">$48 USD</span>
                <span className="font-mono text-xs text-slate-400 line-through">$115 RETAIL TAX</span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] uppercase tracking-widest font-semibold">
                  DIRECT-TO-PLAYER
                </span>
              </div>
            </div>

            {/* Narrative Breakdown */}
            <p className="font-sans text-sm text-slate-600 leading-relaxed font-normal">
              Engineered without the synthetic sheen of commercial activewear or the suffocating weight of heavy cotton piques. Features an unyielding fused collar stand that commands presence off the course.
            </p>

            {/* Specification Grid */}
            <div className="hairline-all bg-[#FBFBFA] p-5 space-y-3 font-mono text-[11px]">
              <div className="flex justify-between text-slate-600 pb-2 hairline-b">
                <span className="text-slate-400">MATERIAL</span>
                <span className="text-[#090C10] font-medium">180 GSM Matte Micro-Poly / Elastane</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 hairline-b">
                <span className="text-slate-400">NEEDLEWORK</span>
                <span className="text-[#090C10] font-medium">6,200-Stitch Nape Yoke Tracer</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 hairline-b">
                <span className="text-slate-400">COLLAR TECH</span>
                <span className="text-[#090C10] font-medium">Fused Stay-Flat Ribbed Stand</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">AVAILABILITY</span>
                <span className="text-[#090C10] font-medium">Limited Edition 001 Drop (In Stock)</span>
              </div>
            </div>

            {/* Colorway Selection */}
            <div className="space-y-3">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 block">
                COLORWAY: <span className="text-[#090C10] font-semibold">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === c.name ? 'border-[#090C10] scale-110 shadow-md' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <span className={`w-2.5 h-2.5 rounded-full ${c.hex === '#F8F9FA' ? 'bg-black' : 'bg-white'}`}></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-[11px]">
                <label className="uppercase tracking-[0.2em] text-slate-500">
                  SELECT SIZE: <span className="text-[#090C10] font-semibold">{selectedSize}</span>
                </label>
                <span className="text-slate-400 underline cursor-pointer hover:text-[#090C10]">FIT GUIDE</span>
              </div>
              <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border text-center transition-all ${
                      selectedSize === size
                        ? 'bg-[#090C10] text-white border-[#090C10] font-semibold'
                        : 'bg-white text-[#090C10] border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-8 hairline-t mt-8">
            <button
              onClick={handleAddHeroItem}
              className="w-full btn-obsidian py-4 text-xs tracking-[0.25em] flex items-center justify-center gap-3"
            >
              {isAdded ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span>ADDED TO BAG &bull; $48</span>
                </>
              ) : (
                <>
                  <span>ACQUIRE HERO PIECE &bull; $48</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <button
              onClick={onOpenConcierge}
              className="w-full btn-outline py-3.5 text-[11px] tracking-[0.2em] flex items-center justify-center gap-2"
            >
              <Compass size={14} className="text-[#C03221]" />
              <span>FOURSOME CONCIERGE & SCRAMBLE KITS</span>
            </button>

            <div className="flex items-center justify-center gap-6 font-mono text-[10px] text-slate-500 pt-2">
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-600" /> Free Shipping Over $75</span>
              <span>&bull;</span>
              <span>30-Day Fairway Guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
