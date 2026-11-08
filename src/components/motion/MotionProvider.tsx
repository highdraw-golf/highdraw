import React, { createContext, useContext, useEffect, useState } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import {
  DURATION,
  EASE_ACCENT,
  MOTION_STORAGE_KEY,
  MOTION_EVENT_NAME,
  type MotionMode,
} from '../../lib/motion/tokens';

interface MotionContextType {
  motionMode: MotionMode;
  isReduced: boolean;
  setMotionMode: (mode: MotionMode) => void;
  toggleMotionMode: () => void;
}

const MotionContext = createContext<MotionContextType>({
  motionMode: 'natural',
  isReduced: false,
  setMotionMode: () => {},
  toggleMotionMode: () => {},
});

export function useMotionPreference() {
  return useContext(MotionContext);
}

/**
 * High Draw MotionProvider:
 * - Wraps the application in `LazyMotion` using `domAnimation` (~16 KB lightweight bundle)
 * - Sets global `MotionConfig` with `reducedMotion="user"`
 * - Honors manual reduced-motion toggle stored in localStorage or system preferences
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [motionMode, setMotionModeState] = useState<MotionMode>('natural');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MOTION_STORAGE_KEY) as MotionMode | null;
      if (stored === 'natural' || stored === 'reduced') {
        setMotionModeState(stored);
      }
    } catch {
      // LocalStorage access may fail in private mode
    }

    const onExternalChange = (e: Event) => {
      const custom = e as CustomEvent<MotionMode>;
      if (custom.detail === 'natural' || custom.detail === 'reduced') {
        setMotionModeState(custom.detail);
      }
    };
    window.addEventListener(MOTION_EVENT_NAME, onExternalChange);
    return () => window.removeEventListener(MOTION_EVENT_NAME, onExternalChange);
  }, []);

  const setMotionMode = (mode: MotionMode) => {
    setMotionModeState(mode);
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, mode);
      window.dispatchEvent(new CustomEvent(MOTION_EVENT_NAME, { detail: mode }));
    } catch {
      // ignore
    }
  };

  const toggleMotionMode = () => {
    setMotionMode(motionMode === 'reduced' ? 'natural' : 'reduced');
  };

  const isReduced = motionMode === 'reduced';

  return (
    <MotionContext.Provider
      value={{
        motionMode,
        isReduced,
        setMotionMode,
        toggleMotionMode,
      }}
    >
      <LazyMotion features={domAnimation}>
        <MotionConfig
          reducedMotion={isReduced ? 'always' : 'user'}
          transition={{
            duration: DURATION.base,
            ease: EASE_ACCENT,
          }}
        >
          {children}
        </MotionConfig>
      </LazyMotion>
    </MotionContext.Provider>
  );
}
