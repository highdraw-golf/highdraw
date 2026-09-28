import React from 'react';
import { DollarSign, ShieldCheck, Shirt } from 'lucide-react';

export const WhyHighDraw: React.FC = () => {
  const pillars = [
    {
      icon: <DollarSign size={24} className="text-[#C03221]" />,
      title: 'No Country Club Tax',
      subtitle: '$48 vs $115 Boutique Pricing',
      description: 'Golfers paying $115 for Peter Millar or Rhoback aren’t buying triple the quality—they’re paying for traditional retail markup and corporate sponsorships. We deliver direct-to-player pricing.',
    },
    {
      icon: <Shirt size={24} className="text-[#C03221]" />,
      title: 'Stay-Flat Collar Stand',
      subtitle: 'Wash-Tested 50+ Times',
      description: 'The single biggest pet peeve in golf apparel is a collar that curls flat after three washes. Our fused interlining collar stand holds its structure wash after wash.',
    },
    {
      icon: <ShieldCheck size={24} className="text-[#C03221]" />,
      title: 'Matte Micro-Pique Drape',
      subtitle: 'Zero Synthetic Gym Sheen',
      description: 'Engineered without the shiny synthetic sheen of commercial activewear or the suffocating weight of heavy cotton. Breathable 180 GSM technical drape built for 18 holes and dinner.',
    },
  ];

  return (
    <section id="why" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto bg-[#FBFBFA] border-y border-slate-200">
      
      <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
        <span className="font-mono text-xs uppercase tracking-widest text-[#C03221] font-bold block">
          THE HIGH DRAW DIFFERENCE
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#090C10] font-normal">
          Built for Dedicated Weekenders
        </h2>
        <p className="font-sans text-sm sm:text-base text-slate-600 font-light">
          Everything you care about on the course. Nothing you don't.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((p, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-8 space-y-4 shadow-sm hover:border-[#090C10] transition-colors">
            <div className="w-12 h-12 bg-slate-100 rounded-xs flex items-center justify-center">
              {p.icon}
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block">{p.subtitle}</span>
              <h3 className="font-serif text-2xl text-[#090C10] font-medium">{p.title}</h3>
            </div>
            <p className="font-sans text-xs text-slate-600 font-light leading-relaxed">
              {p.description}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};
