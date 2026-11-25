import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Sparkles, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import type { Product } from '../data/products';

interface SemiLookbookPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateCollection: () => void;
  onBackHome: () => void;
}

interface LookbookReelSlot {
  id: string;
  title: string;
  garmentName: string;
  colorway: string;
  caption: string;
  posterSrc: string;
  videoSrc?: string;
  productId: string;
}

const SEMI_REEL_SLOTS: LookbookReelSlot[] = [
  {
    id: 'reel-01-carolina-course',
    title: '01 · Golden Hour on the Back Nine',
    garmentName: "Women's Weekender Polo",
    colorway: 'Carolina Blue · H | D Crest',
    caption: 'Featherweight 180 GSM micropique with an open Y-neck placket that moves effortlessly from first tee to sunset.',
    posterSrc: '/assets/products/editorial/women_polo_carolina_course.jpg',
    productId: 'women-polo-lst740',
  },
  {
    id: 'reel-02-clubhouse-aegean',
    title: '02 · Clubhouse Patio & Dinner Drape',
    garmentName: "Women's Clubhouse Fine Pique",
    colorway: 'Aegean Blue Heather · Crisp White Mark',
    caption: 'Combed 57/43 cotton-poly fine pique with a soft matte hand and lower-aligned 1.75" chest embroidery.',
    posterSrc: '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-monogram--aegean-blue-heather.jpg',
    productId: 'women-polo-lk830',
  },
  {
    id: 'reel-03-crisp-white-studio',
    title: '03 · Crisp White & Tracer Blue',
    garmentName: "Women's Weekender Polo",
    colorway: 'Crisp White · Light Blue Tracer',
    caption: 'UPF 50+ solar protection woven directly into breathable stretch yarns—tailored without clinging.',
    posterSrc: '/assets/products/printify_mockups/high-draw-weekender-women-s-polo-mark-wordmark--white.jpg',
    productId: 'women-polo-lst740',
  },
];

const GALLERY_SHOTS = [
  {
    src: '/assets/products/editorial/women_polo_carolina_course.jpg',
    label: 'On-Course Fairway Fit · Carolina Blue',
    productId: 'women-polo-lst740',
  },
  {
    src: '/assets/products/bespoke/women_polo_hero_wood.jpg',
    label: 'Clubhouse Table Flatlay · Black Tracer Thread',
    productId: 'women-polo-lst740',
  },
  {
    src: '/assets/products/catalog/women_polo_truenavy.jpg',
    label: 'Deep Midnight Navy · Contoured Y-Neck',
    productId: 'women-polo-lst740',
  },
  {
    src: '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-wordmark--charcoal-heather.jpg',
    label: 'Charcoal Heather · Clubhouse Fine Pique',
    productId: 'women-polo-lk830',
  },
  {
    src: '/assets/products/catalog/women_polo_black.jpg',
    label: 'Onyx Black · Studio Silhouette',
    productId: 'women-polo-lst740',
  },
  {
    src: '/assets/products/catalog/women_polo_white.jpg',
    label: 'Crisp White · Light Blue Monogram',
    productId: 'women-polo-lst740',
  },
];

export const SemiLookbookPage: React.FC<SemiLookbookPageProps> = ({
  onSelectProduct,
  onNavigateCollection,
  onBackHome,
}) => {
  const [activeReelId, setActiveReelId] = useState<string>(SEMI_REEL_SLOTS[0].id);

  const womensWeekender = PRODUCTS.find(p => p.id === 'women-polo-lst740');
  const womensClubhouse = PRODUCTS.find(p => p.id === 'women-polo-lk830');

  const openById = (id: string) => {
    const found = PRODUCTS.find(p => p.id === id);
    if (found) onSelectProduct(found);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#151B23]">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-stone-200 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between text-xs text-stone-600">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 font-medium text-[#151B23] hover:text-[#14241D] cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
          <span className="tracking-[0.08em] uppercase text-stone-500">
            Women&rsquo;s Golf Edit &middot; Semi &times; High Draw
          </span>
        </div>
      </div>

      {/* Editorial Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#14241D]">
            <Sparkles size={14} />
            <span>The Women&rsquo;s Fairway &amp; Clubhouse Edit</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.06] text-[#151B23]">
            Tailored for the Swing. <br />
            <span className="italic font-light text-stone-600">Effortless Off the Course.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
            Designed around a flattering open Y-neck placket, breathable four-way stretch, and a refined 1.75&Prime; lower-aligned chest mark. Explore our featured women&rsquo;s silhouettes across the $48 Weekender and $66 Clubhouse collections.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {womensWeekender && (
              <button
                type="button"
                onClick={() => onSelectProduct(womensWeekender)}
                className="px-7 py-4 bg-[#14241D] hover:bg-[#0c1712] text-white text-xs font-semibold uppercase tracking-[0.06em] rounded-xs inline-flex items-center gap-2 cursor-pointer t-press"
              >
                <span>Shop Women&rsquo;s Weekender &middot; $48</span>
                <ArrowRight size={14} />
              </button>
            )}
            {womensClubhouse && (
              <button
                type="button"
                onClick={() => onSelectProduct(womensClubhouse)}
                className="px-6 py-4 bg-white hover:bg-stone-100 text-[#151B23] border border-stone-300 text-xs font-semibold uppercase tracking-[0.06em] rounded-xs inline-flex items-center gap-2 cursor-pointer t-press"
              >
                <span>Shop Clubhouse Fine Pique &middot; $66</span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-5 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#14241D]" />
              XS–4XL Contoured Sizing
            </span>
            <span>&middot;</span>
            <span>Save $10 + Free Shipping on Any 2 Polos</span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="aspect-[4/5] rounded-xs overflow-hidden bg-white shadow-xl border border-stone-200 relative">
            <img
              src="/assets/products/editorial/women_polo_carolina_course.jpg"
              alt="Women's Carolina Blue High Draw Polo on the course"
              fetchPriority="high"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xs flex items-center justify-between gap-3 shadow-md">
              <div>
                <p className="text-xs font-semibold text-[#151B23]">
                  The Weekender Performance Polo &mdash; Women&rsquo;s
                </p>
                <p className="text-[11px] text-stone-500">
                  Carolina Blue &middot; 1.75&Prime; Lower-Aligned Crest
                </p>
              </div>
              {womensWeekender && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(womensWeekender)}
                  className="text-xs font-semibold text-[#14241D] hover:underline shrink-0 cursor-pointer"
                >
                  View &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3-Slot Motion & Film Capsule (Ready for Semi's 2-3 Modeling Clips) */}
      <section className="bg-white border-y border-stone-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 block">
                In Motion &middot; 3 Featured Looks
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#151B23] mt-1">
                From the First Tee to the Patio
              </h2>
            </div>
            <button
              type="button"
              onClick={onNavigateCollection}
              className="text-xs font-semibold uppercase tracking-[0.08em] text-[#14241D] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Browse All Women&rsquo;s Colorways</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SEMI_REEL_SLOTS.map(slot => {
              const isSelected = activeReelId === slot.id;
              return (
                <article
                  key={slot.id}
                  onClick={() => setActiveReelId(slot.id)}
                  className={`rounded-xs border transition-all overflow-hidden bg-[#FAF9F6] flex flex-col justify-between cursor-pointer ${
                    isSelected ? 'border-[#14241D] shadow-lg' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="aspect-[4/5] bg-white relative overflow-hidden">
                      {slot.videoSrc ? (
                        <video
                          src={slot.videoSrc}
                          poster={slot.posterSrc}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={slot.posterSrc}
                          alt={slot.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#14241D]/90 text-white text-[10px] font-medium tracking-[0.06em] uppercase rounded-2xs inline-flex items-center gap-1">
                        <Play size={10} />
                        <span>Look {slot.title.slice(0, 2)}</span>
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                        {slot.colorway}
                      </p>
                      <h3 className="font-serif text-xl text-[#151B23]">
                        {slot.garmentName}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {slot.caption}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        openById(slot.productId);
                      }}
                      className="w-full py-2.5 bg-white hover:bg-[#14241D] text-[#151B23] hover:text-white border border-stone-300 hover:border-[#14241D] text-xs font-semibold uppercase tracking-[0.06em] rounded-xs transition-colors cursor-pointer"
                    >
                      Shop This Look
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Lookbook Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-10">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 block">
            Lookbook Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#151B23]">
            Studio &amp; Fairway Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_SHOTS.map(shot => (
            <div
              key={shot.src}
              onClick={() => openById(shot.productId)}
              className="group cursor-pointer space-y-2.5"
            >
              <div className="aspect-square bg-white rounded-xs overflow-hidden border border-stone-200">
                <img
                  src={shot.src}
                  alt={shot.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>{shot.label}</span>
                <span className="font-semibold text-[#14241D] group-hover:underline">Shop &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SemiLookbookPage;
