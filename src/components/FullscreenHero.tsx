import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { RiseLines, FadeUp } from './motion/EditorialMotion';
import { useMotionPreference } from './motion/MotionProvider';
import { SPRING_LAYOUT } from '../lib/motion/tokens';

interface FullscreenHeroProps {
  heroImage: string;
  onScrollToShop: () => void;
  onShopMens?: () => void;
  onShopWomens?: () => void;
  onShopClubhouse?: () => void;
  onScrollToWhy: () => void;
}

type HeroMarkOption = {
  id: 'mark-monogram' | 'mark-only' | 'mark-wordmark';
  label: string;
  caption: string;
};

type HeroSwatchOption = {
  id: 'navy' | 'white' | 'heather';
  label: string;
  hex: string;
  tierLabel: string;
  price: number;
  getSrc: (mark: HeroMarkOption['id']) => string;
  target: 'mens' | 'clubhouse';
};

const HERO_MARKS: HeroMarkOption[] = [
  { id: 'mark-monogram', label: 'H | D Crest', caption: 'Signature Monogram' },
  { id: 'mark-only', label: 'The Tracer', caption: 'Ball Flight + Pin' },
  { id: 'mark-wordmark', label: 'Wordmark', caption: 'Full High Draw Lockup' },
];

const HERO_SWATCHES: HeroSwatchOption[] = [
  {
    id: 'navy',
    label: 'Midnight Navy',
    hex: '#1E293B',
    tierLabel: 'Weekender Micropique',
    price: 48,
    getSrc: mark => `/assets/products/printify_mockups/high-draw-weekender-men-s-polo-${mark}--true-navy.jpg`,
    target: 'mens',
  },
  {
    id: 'heather',
    label: 'Aegean Heather',
    hex: '#4A6B82',
    tierLabel: 'Clubhouse Fine Pique',
    price: 66,
    getSrc: mark => `/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-${mark}--aegean-blue-heather.jpg`,
    target: 'clubhouse',
  },
  {
    id: 'white',
    label: 'Crisp White',
    hex: '#FFFFFF',
    tierLabel: 'Weekender Micropique',
    price: 48,
    getSrc: mark => `/assets/products/printify_mockups/high-draw-weekender-men-s-polo-${mark}--white.jpg`,
    target: 'mens',
  },
];

export const FullscreenHero: React.FC<FullscreenHeroProps> = ({
  heroImage,
  onScrollToShop,
  onShopMens,
  onShopClubhouse,
  onScrollToWhy,
}) => {
  const { isReduced } = useMotionPreference();
  const [selectedMark, setSelectedMark] = useState<HeroMarkOption['id']>('mark-monogram');
  const [selectedSwatchId, setSelectedSwatchId] = useState<HeroSwatchOption['id']>('navy');
  const [flightKey, setFlightKey] = useState(0);

  const activeSwatch = HERO_SWATCHES.find(s => s.id === selectedSwatchId) || HERO_SWATCHES[0];
  const activeMark = HERO_MARKS.find(m => m.id === selectedMark) || HERO_MARKS[0];
  const previewSrc = activeSwatch.getSrc(selectedMark);

  const handleOpenSelectedGarment = () => {
    if (activeSwatch.target === 'clubhouse' && onShopClubhouse) {
      onShopClubhouse();
      return;
    }
    if (onShopMens) {
      onShopMens();
      return;
    }
    onScrollToShop();
  };

  return (
    <section className="relative w-full min-h-[720px] lg:min-h-[86vh] flex items-center overflow-hidden bg-[#111916] text-white py-20 lg:py-24">
      {/* Full-Bleed Coastal Course Photography (LCP Candidate) */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Morning golf round overlooking coastal fairways"
          fetchPriority="high"
          className="w-full h-full object-cover object-center brightness-[0.88]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1814] via-[#0F1814]/70 to-[#0F1814]/30 lg:bg-gradient-to-r lg:from-[#0F1814]/92 lg:via-[#0F1814]/62 lg:to-[#0F1814]/25" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* LEFT: Quiet Editorial Authority — One Headline, One Promise, One Primary Action */}
        <div className="lg:col-span-7 space-y-7 text-left">
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#7DD3FC]">
            Founded in Oxford, Mississippi &middot; Stitched to Order
          </p>

          <div className="space-y-5">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-normal leading-[1.04] text-white tracking-[-0.018em]">
              <RiseLines
                immediate
                lines={[
                  'Designed for Sport.',
                  <span key="sub" className="italic font-light text-stone-200">
                    Crafted for Life.
                  </span>,
                ]}
              />
            </h1>

            <FadeUp immediate delay={0.2}>
              <p className="text-base sm:text-lg text-stone-200/95 max-w-xl leading-relaxed font-normal">
                The polo you&rsquo;d pay $120 for in a club pro shop, made to order from $48. Built with a relaxed athletic drape, stay-flat collar, and your choice of three embroidered chest marks.
              </p>
            </FadeUp>
          </div>

          {/* Focused Conversion CTA Pair (Eliminates 4-Link Redundancy) */}
          <FadeUp immediate delay={0.3} className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              type="button"
              onClick={onScrollToShop}
              className="px-8 py-4 bg-white hover:bg-stone-100 text-[#14241D] font-semibold text-[13px] tracking-[0.05em] uppercase transition-colors rounded-xs shadow-xl flex items-center justify-center gap-2.5 group cursor-pointer t-press"
            >
              <span>Shop the Collection</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onScrollToWhy}
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 font-medium text-[13px] tracking-[0.04em] transition-colors rounded-xs flex items-center justify-center gap-2 cursor-pointer t-press"
            >
              <span>Craft &amp; Fabric Standard</span>
            </button>
          </FadeUp>

          {/* Quiet Proof Line */}
          <div className="pt-3 border-t border-white/15 max-w-xl flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-stone-300">
            <span>Men&rsquo;s &amp; Women&rsquo;s XS–4XL</span>
            <span className="text-white/30">&middot;</span>
            <span>Save $10 + Free Shipping on Any 2 Polos</span>
            <span className="text-white/30">&middot;</span>
            <span>100+ Washes Guaranteed</span>
          </div>
        </div>

        {/* RIGHT: Converting Ball-Flight-to-Embroidery Interactive Polo Stage */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF9F6] text-[#151B23] rounded-xs p-5 sm:p-6 shadow-2xl border border-white/20 space-y-4">
            {/* Top Header + Flight Replay */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-200">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-stone-500 block">
                  The Signature Shot &amp; Mark
                </span>
                <p className="font-serif text-lg text-[#151B23] leading-snug">
                  Starts right. Peaks high. Draws to the pin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFlightKey(k => k + 1)}
                className="p-2 rounded-xs text-stone-500 hover:text-[#14241D] hover:bg-stone-200/60 transition-colors cursor-pointer"
                title="Replay High Draw ball flight"
                aria-label="Replay High Draw ball flight"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Split Visual: Live Ball-Flight Mini-Arc + Real Stitched Polo Preview */}
            <div className="grid grid-cols-12 gap-3.5 items-center">
              {/* Left 5 cols: Authentic Golfer's-Eye High Draw Trajectory */}
              <div
                key={flightKey}
                className="col-span-5 h-48 rounded-xs bg-[#14241D] relative overflow-hidden p-3 flex flex-col justify-between text-white"
              >
                <span className="text-[10px] tracking-[0.08em] uppercase text-stone-300/90 z-10">
                  Ball Flight
                </span>

                <svg
                  viewBox="0 0 180 180"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  fill="none"
                  aria-hidden="true"
                >
                  {/* Horizon & Putting Green Oval */}
                  <ellipse cx="78" cy="40" rx="28" ry="8" fill="rgba(255,255,255,0.08)" />
                  {/* Flagstick & Pin at Target (78, 40) */}
                  <line x1="78" y1="40" x2="78" y2="18" stroke="#FAF9F6" strokeWidth="1.4" />
                  <path d="M 78 18 L 91 23 L 78 27 Z" fill="#38BDF8" />

                  {/* Initial Push Line (Starts Right of Target) */}
                  <line
                    x1="86"
                    y1="158"
                    x2="138"
                    y2="42"
                    stroke="rgba(255,255,255,0.18)"
                    strokeDasharray="3 4"
                    strokeWidth="1"
                  />

                  {/* True Right-to-Left High Draw Curve: Tee (86,158) -> Right Apex (142,68) -> Pin (78,40) */}
                  <m.path
                    d="M 86 158 C 122 122, 148 64, 78 40"
                    stroke="#38BDF8"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    initial={isReduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.4 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.35, ease: [0.2, 0.9, 0.3, 1] }}
                  />

                  {/* Pin-Seek Landing Ring */}
                  <m.circle
                    cx="78"
                    cy="40"
                    r="5"
                    stroke="#7DD3FC"
                    strokeWidth="1.5"
                    fill="#FAF9F6"
                    initial={isReduced ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: isReduced ? 0 : 1.15, duration: 0.3 }}
                  />

                  {/* Selected Lockup Reveal: H | D Crest or HIGH DRAW Wordmark */}
                  {selectedMark === 'mark-monogram' && (
                    <m.g
                      initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: isReduced ? 0 : 0.95, duration: 0.35 }}
                    >
                      <text
                        x="94"
                        y="108"
                        textAnchor="middle"
                        fill="#FAF9F6"
                        fontSize="20"
                        fontFamily="Newsreader, Georgia, serif"
                        letterSpacing="0.06em"
                      >
                        H
                      </text>
                      <text
                        x="139"
                        y="108"
                        textAnchor="middle"
                        fill="#FAF9F6"
                        fontSize="20"
                        fontFamily="Newsreader, Georgia, serif"
                        letterSpacing="0.06em"
                      >
                        D
                      </text>
                    </m.g>
                  )}

                  {selectedMark === 'mark-wordmark' && (
                    <m.g
                      initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: isReduced ? 0 : 0.95, duration: 0.35 }}
                    >
                      <text
                        x="86"
                        y="112"
                        textAnchor="middle"
                        fill="#FAF9F6"
                        fontSize="11.5"
                        fontFamily="Newsreader, Georgia, serif"
                        letterSpacing="0.12em"
                      >
                        HIGH
                      </text>
                      <text
                        x="146"
                        y="112"
                        textAnchor="middle"
                        fill="#FAF9F6"
                        fontSize="11.5"
                        fontFamily="Newsreader, Georgia, serif"
                        letterSpacing="0.12em"
                      >
                        DRAW
                      </text>
                    </m.g>
                  )}

                  {/* Tee Marker */}
                  <circle cx="86" cy="158" r="2.5" fill="rgba(255,255,255,0.65)" />
                </svg>

                <span className="text-[10px] text-[#7DD3FC] z-10 font-medium">
                  {activeMark.label} &middot; {activeMark.caption}
                </span>
              </div>

              {/* Right 7 cols: Crisp Stitched Studio Garment Preview */}
              <div
                onClick={handleOpenSelectedGarment}
                className="col-span-7 h-48 rounded-xs bg-white border border-stone-200/90 relative overflow-hidden cursor-pointer group flex items-center justify-center p-2"
              >
                <img
                  key={previewSrc}
                  src={previewSrc}
                  alt={`${activeSwatch.label} polo with ${activeMark.label} embroidery`}
                  fetchPriority="low"
                  loading="lazy"
                  width={320}
                  height={320}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-stone-100/95 border border-stone-200 text-[#151B23] text-[10px] font-medium rounded-2xs">
                  {activeMark.label}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#14241D]/90 text-white text-[10px] tabular-nums font-medium rounded-2xs">
                  ${activeSwatch.price}
                </span>
              </div>
            </div>

            {/* Interactive 3-Mark Switcher */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5 bg-stone-200/70 p-1 rounded-xs">
                {HERO_MARKS.map(mk => {
                  const active = selectedMark === mk.id;
                  return (
                    <button
                      key={mk.id}
                      type="button"
                      onClick={() => {
                        setSelectedMark(mk.id);
                        setFlightKey(k => k + 1);
                      }}
                      className={`relative py-2 px-2 text-[11px] font-semibold rounded-2xs transition-colors cursor-pointer ${
                        active ? 'text-white' : 'text-stone-600 hover:text-[#151B23]'
                      }`}
                    >
                      {active && (
                        <m.span
                          layoutId={isReduced ? undefined : 'hero-mark-pill'}
                          transition={SPRING_LAYOUT}
                          className="absolute inset-0 bg-[#14241D] rounded-2xs shadow-xs"
                        />
                      )}
                      <span className="relative z-10">{mk.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Colorway Swatches + Direct Customize Conversion Link */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {HERO_SWATCHES.map(sw => {
                    const active = selectedSwatchId === sw.id;
                    return (
                      <button
                        key={sw.id}
                        type="button"
                        onClick={() => setSelectedSwatchId(sw.id)}
                        title={`${sw.label} (${sw.tierLabel})`}
                        aria-label={`Preview ${sw.label}`}
                        style={{ backgroundColor: sw.hex }}
                        className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                          active
                            ? 'ring-2 ring-offset-2 ring-[#14241D] border-white scale-110'
                            : 'border-stone-300 hover:scale-110'
                        }`}
                      />
                    );
                  })}
                  <span className="text-xs text-stone-600 ml-1">
                    {activeSwatch.label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenSelectedGarment}
                  className="text-xs font-semibold text-[#14241D] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Customize</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
