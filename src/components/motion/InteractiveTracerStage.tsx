import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Layers, RotateCcw, ShieldCheck } from 'lucide-react';
import { useMotionPreference } from './MotionProvider';
import { SPRING_BALL_FLIGHT } from '../../lib/motion/tokens';

/**
 * Interactive 3-Layer High Draw Emblem & Golfer's-Eye Trajectory Stage
 * Demonstrates how a true right-to-left High Draw shot forms the embroidered crest.
 */
export const InteractiveTracerStage: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const [isExploded, setIsExploded] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = [
    {
      index: 1,
      id: 'monogram',
      title: '01 · Tailored H | D Monogram',
      subtitle: 'Balanced serif initials framing the shot line in satin stitch.',
      src: '/assets/brand/hd-monogram/layer_1_monogram_hd_classic.png',
      offsetY: isExploded ? 24 : 0,
      offsetX: isExploded ? -18 : 0,
      scale: isExploded ? 0.95 : 1,
    },
    {
      index: 2,
      id: 'tracer',
      title: '02 · Right-to-Left Draw Flight',
      subtitle: 'Starts right of the flag, climbs to a high apex, and turns gently into the green.',
      src: '/assets/brand/hd-monogram/layer_2_ball_flight_tracer.png',
      offsetY: isExploded ? -4 : 0,
      offsetX: isExploded ? 4 : 0,
      scale: isExploded ? 1.02 : 1,
    },
    {
      index: 3,
      id: 'pin',
      title: '03 · Pin & Cup Anchor',
      subtitle: 'Clean flagstick silhouette marking the target at the top of the arc.',
      src: '/assets/brand/hd-monogram/layer_3_golf_cup_target.png',
      offsetY: isExploded ? -28 : 0,
      offsetX: isExploded ? 20 : 0,
      scale: isExploded ? 1.05 : 1,
    },
  ];

  return (
    <div className="mt-10 rounded-xs border border-white/15 bg-[#101C17] p-6 sm:p-9 text-white shadow-xl overflow-hidden relative">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-medium tracking-[0.12em] uppercase text-[#7DD3FC] block">
            Anatomy of the Mark
          </span>
          <h4 className="font-serif text-2xl sm:text-3xl font-normal mt-1">
            Why We Call It High Draw
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsExploded(v => !v)}
            className="px-4 py-2 rounded-xs bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-medium cursor-pointer t-press flex items-center gap-1.5"
          >
            <Layers size={13} className="text-[#7DD3FC]" />
            <span>{isExploded ? 'Combine Layers' : 'Separate 3 Stitch Layers'}</span>
          </button>
          <button
            type="button"
            onClick={() => setReplayKey(k => k + 1)}
            className="px-4 py-2 rounded-xs bg-white text-[#14241D] hover:bg-stone-100 text-xs font-semibold cursor-pointer t-press flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Replay Shot</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-7">
        {/* Left: Authentic Golfer's-Eye High Draw Flight + 3-Layer Crest */}
        <div
          key={replayKey}
          className="lg:col-span-7 relative h-[320px] sm:h-[350px] rounded-xs bg-[#0B1410] border border-white/10 flex items-center justify-center overflow-hidden p-6 select-none"
        >
          <svg
            viewBox="0 0 600 340"
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="trueHighDrawGrad" x1="50%" y1="100%" x2="45%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FAF9F6" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Putting Surface Contour */}
            <ellipse cx="286" cy="68" rx="68" ry="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Target Line (Tee to Pin) */}
            <line
              x1="300"
              y1="296"
              x2="286"
              y2="68"
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="3 6"
              strokeWidth="1"
            />

            {/* Initial Start Line (Pushed Out Right of Flag) */}
            <line
              x1="300"
              y1="296"
              x2="428"
              y2="76"
              stroke="rgba(125,211,252,0.22)"
              strokeDasharray="4 6"
              strokeWidth="1"
            />

            {/* Authentic Right-to-Left High Draw Curve: Tee (300,296) -> Right Apex (432,126) -> Pin (286,68) */}
            <m.path
              d="M 300 296 C 378 228, 442 114, 286 68"
              stroke="url(#trueHighDrawGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={isReduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.35 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.45, ease: [0.2, 0.9, 0.3, 1] }}
            />

            {/* Flagstick & Cup at (286, 68) */}
            <line x1="286" y1="68" x2="286" y2="36" stroke="#FAF9F6" strokeWidth="1.6" />
            <path d="M 286 36 L 306 43 L 286 50 Z" fill="#38BDF8" />
            <m.circle
              cx="286"
              cy="68"
              r="5.5"
              fill="#FAF9F6"
              stroke="#38BDF8"
              strokeWidth="2"
              initial={isReduced ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: isReduced ? 0 : 1.2, duration: 0.3 }}
            />

            {/* Tee Box Origin */}
            <circle cx="300" cy="296" r="3.5" fill="rgba(255,255,255,0.6)" />
          </svg>

          {/* 3 Embroidery PNG Layers */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            {layers.map(layer => {
              const isHighlighted = activeLayer === null || activeLayer === layer.index;
              return (
                <m.img
                  key={layer.id}
                  src={layer.src}
                  alt={layer.title}
                  loading="lazy"
                  initial={false}
                  animate={{
                    x: isReduced ? 0 : layer.offsetX,
                    y: isReduced ? 0 : layer.offsetY,
                    scale: isReduced ? 1 : layer.scale,
                    opacity: isHighlighted ? 1 : 0.22,
                  }}
                  transition={SPRING_BALL_FLIGHT}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_22px_rgba(0,0,0,0.6)]"
                />
              );
            })}
          </div>

          <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-[11px] text-stone-300/90">
            <span>Tee Box</span>
            <span className="text-[#7DD3FC]">Starts right &middot; Draws home to the pin</span>
          </div>
        </div>

        {/* Right: Clean Craft Layer Cards */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-sm text-stone-300 leading-relaxed mb-3">
            Select a stitch layer to inspect how the crest is digitized for smooth, pucker-free chest embroidery:
          </p>

          {layers.map(layer => {
            const isSelected = activeLayer === layer.index;
            return (
              <button
                key={layer.id}
                type="button"
                onMouseEnter={() => setActiveLayer(layer.index)}
                onMouseLeave={() => setActiveLayer(null)}
                onClick={() => setActiveLayer(isSelected ? null : layer.index)}
                className={`w-full text-left p-4 rounded-xs border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white/12 border-[#7DD3FC]'
                    : 'bg-white/5 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    {layer.title}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {isSelected ? 'Viewing' : 'Inspect'}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">{layer.subtitle}</p>
              </button>
            );
          })}

          <div className="pt-2 flex items-center gap-2 text-xs text-stone-300">
            <ShieldCheck size={15} className="text-[#7DD3FC] shrink-0" />
            <span>Soft cutaway stabilizer backing &middot; Tested for 100+ washes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
