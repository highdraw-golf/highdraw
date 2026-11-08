/**
 * High Draw Golf — Accént Motion 1.0 Motion Tokens & Physics
 *
 * Implements the Accént Motion Doctrine (https://design.pipes.pink/foundations/motion):
 * - Three durations: 120ms (`fast`), 200ms (`base`), 320ms (`slow`)
 * - One primary easing curve: `cubic-bezier(0.16, 1, 0.3, 1)`
 * - One editorial easing curve: `cubic-bezier(0.22, 1, 0.36, 1)`
 * - One shared layout spring (`SPRING_LAYOUT`) strictly for shared-element active indicators
 * - GPU-safe properties only (`transform`, `opacity`, `clipPath`)
 * - Domain-specific golf physics: `SPRING_BALL_FLIGHT`, `SPRING_STAY_FLAT`
 */

export const DURATION = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
} as const;

export const DURATION_MS = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;

export const EASE_ACCENT: readonly [number, number, number, number] = [0.16, 1, 0.3, 1] as const;
export const EASE_ACCENT_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)' as const;

export const EASE_EDITORIAL: readonly [number, number, number, number] = [0.22, 1, 0.36, 1] as const;
export const EASE_EDITORIAL_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)' as const;

export const EDITORIAL_DURATION = {
  staggerWord: 0.035,
  staggerCard: 0.06,
  fadeIn: 0.65,
  reveal: 0.85,
} as const;

/**
 * Shared spring physics for shared-element selection indicators (swatches, tabs)
 */
export const SPRING_LAYOUT = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 34,
};

/**
 * Tier 3 Domain Bespoke: Ball Flight Spring (Subtle launch release with soft apex settle)
 */
export const SPRING_BALL_FLIGHT = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 24,
  mass: 0.8,
};

/**
 * Tier 3 Domain Bespoke: Stay-Flat Collar Snap (Firm, zero-wobble return to form)
 */
export const SPRING_STAY_FLAT = {
  type: 'spring' as const,
  stiffness: 450,
  damping: 38,
};

/**
 * 120ms micro-feedback press scale for interactive buttons and pills
 */
export const TAP = {
  scale: 0.97,
} as const;

/**
 * Card hover micro-interaction preset (GPU-safe transform)
 */
export const CARD_HOVER = {
  y: -4,
  transition: { duration: DURATION.fast, ease: EASE_ACCENT },
} as const;

export const CARD_TAP = {
  scale: 0.985,
  transition: { duration: DURATION.fast, ease: EASE_ACCENT },
} as const;

export const MOTION_STORAGE_KEY = 'highdraw_motion_mode';
export const MOTION_EVENT_NAME = 'highdraw-motion-change';
export type MotionMode = 'natural' | 'reduced';
