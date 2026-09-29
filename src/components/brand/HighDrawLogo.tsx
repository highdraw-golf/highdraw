import React from 'react';

export type LogoVariant = 'cyan' | 'gold' | 'white' | 'black';

interface HighDrawLogoProps {
  variant?: LogoVariant;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  subtextClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LOGO_PATHS: Record<LogoVariant, string> = {
  cyan: '/assets/brand/logo_tracer_cyan.png',
  gold: '/assets/brand/logo_tracer_gold.png',
  white: '/assets/brand/logo_tracer_white.png',
  black: '/assets/brand/logo_tracer_black.png',
};

const SIZE_CLASSES = {
  sm: 'h-4 w-auto',
  md: 'h-6 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-14 w-auto',
};

export const HighDrawLogo: React.FC<HighDrawLogoProps> = ({
  variant = 'cyan',
  className = '',
  showWordmark = false,
  wordmarkClassName = 'text-white',
  subtextClassName = 'text-slate-400',
  size = 'md',
}) => {
  const logoSrc = LOGO_PATHS[variant] || LOGO_PATHS.cyan;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (!showWordmark) {
    return (
      <img
        src={logoSrc}
        alt="High Draw Ball Flight Tracer"
        className={`${sizeClass} object-contain select-none ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="High Draw Ball Flight Tracer"
        className={`${sizeClass} object-contain shrink-0`}
      />
      <div className="flex flex-col">
        <span className={`font-serif text-2xl font-black tracking-[0.2em] uppercase leading-none ${wordmarkClassName}`}>
          HIGH DRAW
        </span>
        <span className={`text-[9px] font-mono tracking-[0.3em] uppercase mt-0.5 ${subtextClassName}`}>
          GOLF APPAREL CO.
        </span>
      </div>
    </div>
  );
};
