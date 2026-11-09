import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Layers, Sparkles, RotateCcw, Compass, ShieldCheck } from 'lucide-react';
import { useMotionPreference } from './MotionProvider';
import { SPRING_BALL_FLIGHT } from '../../lib/motion/tokens';

/**
 * Interactive 3-Layer Exploded High Draw Emblem & Live Ball-Flight Tracer Stage
 * Uses the existing deconstructed PNG layers in `/assets/brand/hd-monogram/`
 * plus an animated SVG right-to-left High Draw trajectory arc.
 */
export const InteractiveTracerStage: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const [isExploded, setIsExploded] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = [
    {
      index: 1,
      id: 'monogram',
      title: 'Layer 01 • Tailored H·D Monogram',
      subtitle: '12,400-Stitch High-Density Satin Column Lockup',
      src: '/assets/brand/hd-monogram/layer_1_hd_monogram.png',
      offsetY: isExploded ? 26 : 0,
      offsetX: isExploded ? -18 : 0,
      scale: isExploded ? 0.94 : 1,
    },
    {
      index: 2,
      id: 'tracer',
      title: 'Layer 02 • Right-to-Left Ball Flight Tracer',
      subtitle: 'Aerodynamic Draw Apex Trajectory Curve (-6 yd Draw Bias)',
      src: '/assets/brand/hd-monogram/layer_2_ball_flight_tracer.png',
      offsetY: isExploded ? -6 : 0,
      offsetX: isExploded ? 4 : 0,
      scale: isExploded ? 1.02 : 1,
    },
    {
      index: 3,
      id: 'pin',
      title: 'Layer 03 • Championship Cup & Flagstick',
      subtitle: 'Precision Center-Cup Target Anchor',
      src: '/assets/brand/hd-monogram/layer_3_golf_cup_target.png',
      offsetY: isExploded ? -32 : 0,
      offsetX: isExploded ? 22 : 0,
      scale: isExploded ? 1.06 : 1,
    },
  ];

  return (
    <div className="mt-8 rounded-xs border border-white/15 bg-[#0D1117] p-6 sm:p-8 text-white shadow-2xl overflow-hidden relative">
      {/* Subtle Radar Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(56,189,248,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.2) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] font-bold">
            <Layers size={13} />
            <span>3-LAYER DECONSTRUCTED EMBROIDERY ARCHITECTURE &bull; LIVE TELEMETRY</span>
          </div>
          <h4 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            Anatomy of the High Draw Mark
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsExploded((v) => !v)}
            className="px-3.5 py-2 rounded-xs bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-mono uppercase tracking-wider cursor-pointer t-press flex items-center gap-1.5"
          >
            <Layers size={13} className="text-[#38BDF8]" />
            <span>{isExploded ? 'Assemble Lockup' : 'Explode 3 Layers'}</span>
          </button>
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="px-3.5 py-2 rounded-xs bg-[#B12535] hover:bg-[#8E1D29] text-white text-xs font-mono uppercase tracking-wider font-bold cursor-pointer t-press flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Replay Draw Flight</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        {/* Left: Interactive 3-Layer Stage + Animated SVG Ball Flight Arc */}
        <div
          key={replayKey}
          className="lg:col-span-7 relative h-[320px] sm:h-[360px] rounded-xs bg-gradient-to-b from-[#131B24] to-[#0A0E13] border border-white/10 flex items-center justify-center overflow-hidden p-6 select-none"
        >
          {/* Animated SVG High Draw Trajectory Curve Behind Emblem */}
          <svg
            viewBox="0 0 600 320"
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
          >
            <defs>
              <linearGradient id="highDrawArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.15" />
                <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#E5A900" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Baseline Ground Target Line */}
            <line
              x1="70"
              y1="270"
              x2="530"
              y2="270"
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="4 6"
              strokeWidth="1"
            />

            {/* Straight Aim Line (Right of Target before Draw turns over) */}
            <line
              x1="90"
              y1="270"
              x2="510"
              y2="65"
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="3 5"
              strokeWidth="1"
            />

            {/* Animated Right-to-Left High Draw Ball Flight Curve */}
            <m.path
              d="M 90 270 C 260 220, 470 110, 390 52"
              stroke="url(#highDrawArcGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={isReduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Apex Target Pulse Dot */}
            <m.circle
              cx="390"
              cy="52"
              r="6"
              fill="#E5A900"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.35 }}
            />
          </svg>

          {/* 3 Deconstructed PNG Layers */}
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
            {layers.map((layer) => {
              const isHighlighted = activeLayer === null || activeLayer === layer.index;
              return (
                <m.img
                  key={layer.id}
                  src={layer.src}
                  alt={layer.title}
                  initial={false}
                  animate={{
                    x: isReduced ? 0 : layer.offsetX,
                    y: isReduced ? 0 : layer.offsetY,
                    scale: isReduced ? 1 : layer.scale,
                    opacity: isHighlighted ? 1 : 0.25,
                  }}
                  transition={SPRING_BALL_FLIGHT}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
                />
              );
            })}
          </div>

          {/* Live Launch Monitor Telemetry Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xs border border-white/10 font-mono text-[10px]">
            <span className="text-[#38BDF8] font-bold">LAUNCH: 14.2&deg; HIGH DRAW</span>
            <span className="text-slate-300">SPIN: 2,420 RPM</span>
            <span className="text-amber-400 font-bold">STITCH DENSITY: 12,400 PTS</span>
          </div>
        </div>

        {/* Right: Interactive Layer Inspector Cards */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed mb-2">
            Hover or tap any layer below to isolate its stitch geometry on the stage:
          </p>

          {layers.map((layer) => {
            const isSelected = activeLayer === layer.index;
            return (
              <div
                key={layer.id}
                onMouseEnter={() => setActiveLayer(layer.index)}
                onMouseLeave={() => setActiveLayer(null)}
                onClick={() => setActiveLayer(isSelected ? null : layer.index)}
                className={`p-3.5 rounded-xs border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/15 border-[#38BDF8] shadow-md'
                    : 'bg-white/5 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#38BDF8]">
                    {layer.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {isSelected ? 'ISOLATED' : 'HOVER TO ISOLATE'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{layer.subtitle}</p>
              </div>
            );
          })}

          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <ShieldCheck size={14} />
            <span>Zero Puckering Backing • Tested 100+ Machine Wash Cycles</span>
          </div>
        </div>
      </div>
    </div>
  );
};
