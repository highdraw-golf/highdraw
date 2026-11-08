import React from 'react';
import { m, type HTMLMotionProps } from 'framer-motion';
import { useMotionPreference } from './MotionProvider';
import { EASE_EDITORIAL, EASE_ACCENT, DURATION } from '../../lib/motion/tokens';

// --------------------------------------------------------------------------
// 1. RiseLines — Line-by-line masked rise for editorial display typography
// --------------------------------------------------------------------------
export interface RiseLinesProps {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function RiseLines({
  lines,
  className = '',
  delay = 0,
  immediate = false,
}: RiseLinesProps) {
  const { isReduced } = useMotionPreference();

  return (
    <m.span
      className={`block ${className}`}
      initial="hidden"
      {...(immediate
        ? { animate: 'visible' }
        : {
            whileInView: 'visible',
            viewport: { once: true, amount: 0.15 },
          })}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <m.span
            className="block"
            variants={{
              hidden: isReduced ? { opacity: 0 } : { y: '110%' },
              visible: isReduced ? { opacity: 1 } : { y: '0%' },
            }}
            transition={{
              duration: isReduced ? 0.2 : 0.9,
              ease: EASE_EDITORIAL,
              delay: delay + i * 0.08,
            }}
          >
            {line}
          </m.span>
        </span>
      ))}
    </m.span>
  );
}

// --------------------------------------------------------------------------
// 2. FadeUp — Soft 20px scroll-triggered settle reveal
// --------------------------------------------------------------------------
export interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
}

export function FadeUp({
  children,
  className = '',
  delay = 0,
  y = 20,
  immediate = false,
}: FadeUpProps) {
  const { isReduced } = useMotionPreference();

  return (
    <m.div
      className={className}
      initial={isReduced ? { opacity: 0 } : { opacity: 0, y }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-6% 0px' },
          })}
      transition={{
        duration: isReduced ? 0.2 : 0.75,
        ease: EASE_EDITORIAL,
        delay,
      }}
    >
      {children}
    </m.div>
  );
}

// --------------------------------------------------------------------------
// 3. Hairline — Left-origin horizontal rule draw (`scaleX: 0 -> 1`)
// --------------------------------------------------------------------------
export interface HairlineProps {
  className?: string;
  delay?: number;
}

export function Hairline({
  className = 'bg-slate-200',
  delay = 0,
}: HairlineProps) {
  const { isReduced } = useMotionPreference();

  return (
    <m.div
      initial={isReduced ? { opacity: 0 } : { scaleX: 0 }}
      whileInView={isReduced ? { opacity: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{
        duration: isReduced ? 0.2 : 0.85,
        delay,
        ease: EASE_EDITORIAL,
      }}
      style={{ transformOrigin: 'left center' }}
      className={`h-px w-full ${className}`}
    />
  );
}

// --------------------------------------------------------------------------
// 4. Stagger & StaggerItem — Coordinated grid container/child choreography
// --------------------------------------------------------------------------
export interface StaggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
}

export function Stagger({
  children,
  staggerChildren = 0.05,
  delayChildren = 0.02,
  className = '',
  ...rest
}: StaggerProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-5% 0px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isReduced } = useMotionPreference();

  return (
    <m.div
      className={className}
      variants={{
        hidden: isReduced ? { opacity: 0 } : { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: isReduced ? 0.2 : DURATION.slow,
            ease: EASE_ACCENT,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}
