import React from 'react';
import { Star, Quote } from 'lucide-react';

export const SocialProofPress: React.FC = () => {
  const reviews = [
    {
      quote: "The drape and collar memory rival my $135 luxury polos, but at $48 I don't feel like I have to baby it in the rough. High Draw solved golf apparel.",
      author: "Marcus T.",
      title: "14 Handicap &bull; Pinehurst No. 2 Member",
      rating: 5,
    },
    {
      quote: "Handed 4 of these to my Saturday foursome. Three days later they were asking for the link. Understated, zero gym-shirt shine, absolute dignifying cut.",
      author: "David R.",
      title: "9 Handicap &bull; Pebble Beach Scramble Captain",
      rating: 5,
    },
    {
      quote: "A rare brand that respects the game's heritage without charging an overpriced retail tax. The nape tracer detail is pure insider subtlety.",
      author: "Julian K.",
      title: "Editorial Director &bull; Modern Fairways Review",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto hairline-b bg-white">
      
      {/* Editorial Press Ticker */}
      <div className="text-center space-y-3 mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C03221] font-semibold block">
          CRITICAL ACCLAIM & FIELD REVIEWS
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-[#090C10] font-normal tracking-tight-editorial">
          Vetted on the Fairways
        </h2>
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <span className="font-mono text-xs font-semibold text-[#090C10]">4.96 / 5.0 RATING</span>
          <span className="text-slate-400 font-mono text-xs">&bull; 1,420 VERIFIED PLAYERS</span>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((r, idx) => (
          <div 
            key={idx}
            className="p-8 bg-[#FBFBFA] hairline-all flex flex-col justify-between space-y-6 relative group hover:border-[#090C10] transition-colors"
          >
            <Quote size={28} className="text-[#C03221]/20 absolute top-6 right-6" />

            <div className="space-y-4 relative z-10">
              <div className="flex text-amber-500 gap-1">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-sm text-[#090C10] leading-relaxed font-normal">
                "{r.quote}"
              </p>
            </div>

            <div className="pt-4 hairline-t space-y-1">
              <div className="font-mono text-xs font-bold text-[#090C10] uppercase tracking-wider">
                {r.author}
              </div>
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                {r.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Press Publications Bar */}
      <div className="mt-16 pt-12 hairline-t grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-serif text-sm tracking-widest text-slate-400 uppercase font-semibold">
        <span className="hover:text-[#090C10] transition-colors">ROBB REPORT</span>
        <span className="hover:text-[#090C10] transition-colors">VOGUE HOMMES</span>
        <span className="hover:text-[#090C10] transition-colors">GOLF DIGEST</span>
        <span className="hover:text-[#090C10] transition-colors">MODERN FAIRWAYS</span>
      </div>

    </section>
  );
};
