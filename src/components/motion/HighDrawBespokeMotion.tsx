import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useMotionPreference } from './MotionProvider';
import {
  SPRING_BALL_FLIGHT,
  SPRING_STAY_FLAT,
  EASE_ACCENT,
  DURATION,
} from '../../lib/motion/tokens';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

// --------------------------------------------------------------------------
// 1. StripeSecurityBeacon: Glowing, tactile reassurance for payment surfaces
// --------------------------------------------------------------------------
export interface StripeSecurityBeaconProps {
  amount: number;
  className?: string;
}

export function StripeSecurityBeacon({
  amount,
  className = '',
}: StripeSecurityBeaconProps) {
  const { isReduced } = useMotionPreference();

  return (
    <m.div
      initial={isReduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: DURATION.slow, ease: EASE_ACCENT }}
      className={`p-3.5 bg-slate-900 text-white rounded-xs border border-white/15 shadow-xl space-y-2 select-none ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Subtle Encrypted Vault Beacon (Finite Settle — Zero Infinite Loops) */}
          <div className="relative flex items-center justify-center w-5 h-5">
            {!isReduced && (
              <m.span
                className="absolute w-full h-full rounded-full bg-[#635BFF]/40"
                initial={{ scale: 0.85, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: DURATION.slow, ease: EASE_ACCENT }}
              />
            )}
            <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF] relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#38BDF8] uppercase font-bold">
              <Lock size={11} className="text-[#38BDF8]" />
              <span>STRIPE 256-BIT VAULT ACTIVE</span>
            </div>
            <span className="text-[11px] font-sans text-slate-300">
              Zero Card Data Brokerage Guarantee
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs font-bold text-white block">
            ${amount} USD
          </span>
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">
            VERIFIED SECURE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-white/10 text-[9px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-slate-300">
          <CheckCircle2 size={10} className="text-emerald-400" />
          PCI-DSS Level 1
        </span>
        <span>&bull;</span>
        <span>Direct Bank Encryption</span>
        <span>&bull;</span>
        <span>100+ Washes Guarantee</span>
      </div>
    </m.div>
  );
}

// --------------------------------------------------------------------------
// 2. BallFlightReveal: Arc-driven tracer trajectory reveal
// --------------------------------------------------------------------------
export interface BallFlightRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function BallFlightReveal({
  children,
  delay = 0,
  className = '',
}: BallFlightRevealProps) {
  const { isReduced } = useMotionPreference();

  return (
    <m.div
      className={className}
      initial={isReduced ? { opacity: 0 } : { opacity: 0, x: -16, y: 12, rotate: -3 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{
        ...SPRING_BALL_FLIGHT,
        delay,
      }}
    >
      {children}
    </m.div>
  );
}

// --------------------------------------------------------------------------
// 3. StayFlatCollarIndicator: Snappy tactile feedback badge for 100+ wash guarantee
// --------------------------------------------------------------------------
export function StayFlatCollarBadge({
  text = '100+ WASHES GUARANTEED',
  className = '',
}: {
  text?: string;
  className?: string;
}) {
  const { isReduced } = useMotionPreference();

  return (
    <m.div
      whileHover={isReduced ? {} : { scale: 1.03, y: -1 }}
      whileTap={isReduced ? {} : { scale: 0.97 }}
      transition={SPRING_STAY_FLAT}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#1C2C24] text-white text-[10px] font-mono tracking-wider uppercase font-bold border border-white/10 shadow-sm cursor-default select-none ${className}`}
    >
      <ShieldCheck size={12} className="text-[#38BDF8]" />
      <span>{text}</span>
    </m.div>
  );
}
