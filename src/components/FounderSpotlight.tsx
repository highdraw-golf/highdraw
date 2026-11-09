import React, { useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, Play, Video, Camera } from 'lucide-react';

interface FounderSpotlightProps {
  onLearnMore?: () => void;
  onShopNow?: () => void;
}

type FounderMediaId = 'swing_video' | 'backswing' | 'apex_swing' | 'fairway_sun';

export const FounderSpotlight: React.FC<FounderSpotlightProps> = ({
  onLearnMore,
  onShopNow,
}) => {
  const [activeMedia, setActiveMedia] = useState<FounderMediaId>('swing_video');

  const mediaReels: Array<{
    id: FounderMediaId;
    label: string;
    caption: string;
    subcaption: string;
    type: 'video' | 'image';
    src: string;
    poster?: string;
    thumb: string;
  }> = [
    {
      id: 'swing_video',
      label: 'Live Range Draw Video',
      caption: 'Dr. Ken Cyree • Live High Draw Range Session',
      subcaption: '2.9 Handicap Index • Right-to-Left Ball Flight & Full Shoulder Turn',
      type: 'video',
      src: '/assets/founder/ken_range_draw_swing.mp4',
      poster: '/assets/founder/ken_range_draw_poster.png',
      thumb: '/assets/founder/ken_range_draw_poster.png',
    },
    {
      id: 'backswing',
      label: 'Tee Box Backswing',
      caption: 'Dr. Ken Cyree • Driver Backswing Coil',
      subcaption: 'Structured Shoulder Seam Freedom • Zero Torso Pulling',
      type: 'image',
      src: '/assets/founder/ken_tee_shot_backswing.jpg',
      thumb: '/assets/founder/ken_tee_shot_backswing.jpg',
    },
    {
      id: 'apex_swing',
      label: 'Course Follow-Through',
      caption: 'High Draw Apex Finish • 180 GSM Drape',
      subcaption: 'Balanced Finish After Pure Fairway Impact',
      type: 'image',
      src: '/assets/founder/ken_overcast_apex_swing.jpg',
      thumb: '/assets/founder/ken_overcast_apex_swing.jpg',
    },
    {
      id: 'fairway_sun',
      label: '47-State Fairway Walk',
      caption: 'Sunny Fairway Walk • UPF 50+ Breathability',
      subcaption: 'Tested Across 47 US States & Mississippi Summer Heat',
      type: 'image',
      src: '/assets/founder/ken_fairway_wave_sun.jpg',
      thumb: '/assets/founder/ken_fairway_wave_sun.jpg',
    },
  ];

  const currentMedia = mediaReels.find((m) => m.id === activeMedia) || mediaReels[0];

  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-[#1C2C24] text-white border-b border-slate-800 relative overflow-hidden">
      {/* Background Accent Grid / Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Pill & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#38BDF8] text-[11px] font-mono tracking-widest uppercase">
              <Compass size={14} />
              <span>THE CO-FOUNDER&apos;S PERSPECTIVE &bull; LIVE COURSE REEL</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              40 Years of Golf. 47 States Played. <br />
              <span className="italic font-normal text-slate-300">
                One Obsession: The $48 Honest Tour Polo.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {onLearnMore && (
              <button
                onClick={onLearnMore}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-xs cursor-pointer border border-white/15 transition-all inline-flex items-center gap-2"
              >
                <span>Read Full Story</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Feature Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Showcase (Video Player + Multi-Shot Reel + Family Portrait) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 relative aspect-[4/5] rounded-xs overflow-hidden border border-white/15 shadow-2xl bg-black group">
                {currentMedia.type === 'video' ? (
                  <video
                    key={currentMedia.src}
                    src={currentMedia.src}
                    poster={currentMedia.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    key={currentMedia.src}
                    src={currentMedia.src}
                    alt={currentMedia.caption}
                    className="w-full h-full object-cover object-[22%_center] group-hover:scale-103 transition-transform duration-700"
                  />
                )}

                {/* Top-Left Live Video / Photo Pill */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-xs border border-white/15 flex items-center gap-1.5 pointer-events-none">
                  {currentMedia.type === 'video' ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE RANGE SWING VIDEO</span>
                    </>
                  ) : (
                    <>
                      <Camera size={11} className="text-[#38BDF8]" />
                      <span>ON-COURSE ARCHIVE</span>
                    </>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-3 rounded-xs border border-white/10 text-xs font-mono pointer-events-none">
                  <span className="text-white font-bold block">{currentMedia.caption}</span>
                  <span className="text-[#38BDF8] text-[10px]">{currentMedia.subcaption}</span>
                </div>
              </div>

              <div className="sm:col-span-4 flex flex-col gap-4">
                <div className="relative aspect-square rounded-xs overflow-hidden border border-white/10 shadow-xl group">
                  <img
                    src="/assets/founder/ken_and_lori_portrait.jpg"
                    alt="Ken and Lori Cyree"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Handicap Index
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#38BDF8]">2.9</div>
                  <div className="text-[11px] text-slate-300">Senior Athletic Drape</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    National Quest
                  </div>
                  <div className="font-mono text-2xl font-bold text-white">47 / 50</div>
                  <div className="text-[11px] text-slate-400">States Played</div>
                </div>
              </div>
            </div>

            {/* 4-Shot Interactive Founder Reel Switcher */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {mediaReels.map((item) => {
                const isSelected = activeMedia === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveMedia(item.id)}
                    className={`p-1.5 rounded-xs border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-[#38BDF8] bg-white/15 shadow-sm'
                        : 'border-white/10 bg-white/5 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[16/10] w-full rounded-2xs overflow-hidden relative bg-black">
                      <img
                        src={item.thumb}
                        alt={item.label}
                        className="w-full h-full object-cover"
                      />
                      {item.type === 'video' && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <Video size={14} className="text-[#38BDF8]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-200 truncate block text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Narrative & Quote */}
          <div className="lg:col-span-6 space-y-7">
            <blockquote className="text-lg sm:text-2xl font-serif leading-relaxed text-slate-100 italic border-l-4 border-[#38BDF8] pl-5 sm:pl-6">
              &ldquo;I traveled across 47 states playing golf. Paying $125 for a shirt you sweat through in Mississippi heat never sat right with me as a finance professor. High Draw captures the pure joy of a solid shot at an honest $48 price point.&rdquo;
            </blockquote>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Founded by <strong>Dr. Ken Cyree</strong> (Professor of Finance, former Dean of Business at Ole Miss) and his family, High Draw was born on real fairways. Ken is renowned for playing a consistent draw on every shot—the most coveted ball flight in golf for distance, control, and that unforgettable feeling of pure impact.
              </p>
              <p>
                Ken is not a touring professional—he is a dedicated senior golfer and former business dean who understands both a good golf swing and honest economics. By eliminating expensive professional tour player sponsorships and luxury retail markups, High Draw delivers premium 180 GSM micro-pique and a tailored athletic fit at less than half the price of legacy brands.
              </p>
            </div>

            {/* Hallmarks Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#38BDF8] mt-0.5 shrink-0" />
                <span className="text-xs text-slate-200">
                  <strong>Senior Athletic Cut:</strong> Comfort through the torso without baggy excess.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Play size={18} className="text-[#38BDF8] mt-0.5 shrink-0" />
                <span className="text-xs text-slate-200">
                  <strong>Signature High Draw:</strong> Engineered for rotational freedom through the swing.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="px-7 py-3.5 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg inline-flex items-center gap-2 transition-all hover:scale-102"
                >
                  <span>SHOP KEN&apos;S PICK &bull; $48</span>
                  <ArrowRight size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveMedia('swing_video')}
                className="text-xs font-mono text-[#38BDF8] hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Play Range Swing Video &uarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
