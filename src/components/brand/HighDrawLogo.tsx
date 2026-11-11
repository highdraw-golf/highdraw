import React from 'react';

export type LogoVariant = 'cyan' | 'gold' | 'white' | 'black';
export type LogoStyle = 'mark_monogram' | 'mark_only' | 'monogram' | 'mark_text' | 'none';

export interface LogoStyleOption {
  id: LogoStyle;
  name: string;
  shortLabel: string;
  description: string;
  badge?: string;
}

export interface LogoColorOption {
  id: LogoVariant;
  name: string;
  shortLabel: string;
  hex: string;
  borderHex: string;
}

export const CHEST_LOGO_STYLE_OPTIONS: LogoStyleOption[] = [
  {
    id: 'mark_monogram',
    name: 'Mark + Monogram (H | D)',
    shortLabel: 'Mark + Monogram',
    description: 'Signature H·D serif initials flanking the High Draw ball flight tracer & flagstick.',
    badge: 'SIGNATURE',
  },
  {
    id: 'mark_only',
    name: 'Mark-Only (Ball Flight Tracer)',
    shortLabel: 'Mark-Only',
    description: 'Minimalist tour ball flight apex tracer and pin without initials.',
  },
  {
    id: 'mark_text',
    name: 'Mark + Wordmark (HIGH DRAW)',
    shortLabel: 'Mark + Wordmark',
    description: 'Full HIGH DRAW championship wordmark split by the ball flight tracer.',
  },
];

export const LOGO_STYLE_OPTIONS: LogoStyleOption[] = [
  {
    id: 'mark_monogram',
    name: 'Mark + Monogram (H | D)',
    shortLabel: 'Mark + Monogram',
    description: 'Signature H·D serif initials flanking the High Draw ball flight tracer & flagstick.',
    badge: 'SIGNATURE',
  },
  {
    id: 'mark_only',
    name: 'Mark-Only (Ball Flight Tracer)',
    shortLabel: 'Mark-Only',
    description: 'Minimalist tour ball flight apex tracer and pin without initials.',
  },
  {
    id: 'monogram',
    name: 'Monogram Only (HD)',
    shortLabel: 'Monogram (HD)',
    description: 'Classic tailored H·D serif monogram lockup.',
  },
  {
    id: 'mark_text',
    name: 'Mark + Wordmark (HIGH DRAW)',
    shortLabel: 'Mark + Wordmark',
    description: 'Full HIGH DRAW championship wordmark split by the ball flight tracer.',
  },
  {
    id: 'none',
    name: 'No Logo (Clean / Unbranded)',
    shortLabel: 'No Logo (Optional)',
    description: 'Optional unbranded garment with zero exterior chest or crown embroidery.',
    badge: 'OPTIONAL',
  },
];

export const LOGO_COLOR_OPTIONS: LogoColorOption[] = [
  {
    id: 'cyan',
    name: 'Cyan Tracer',
    shortLabel: 'Cyan',
    hex: '#00A3FF',
    borderHex: '#0284C7',
  },
  {
    id: 'gold',
    name: 'Championship Gold',
    shortLabel: 'Gold',
    hex: '#E5A900',
    borderHex: '#B45309',
  },
  {
    id: 'white',
    name: 'Crisp White',
    shortLabel: 'White',
    hex: '#FFFFFF',
    borderHex: '#CBD5E1',
  },
  {
    id: 'black',
    name: 'Onyx Black',
    shortLabel: 'Black',
    hex: '#111827',
    borderHex: '#000000',
  },
];

export function getLogoAssetPath(style: LogoStyle, color: LogoVariant): string | null {
  if (style === 'none') return null;
  return `/assets/brand/logos/${style}_${color}.png`;
}

export function formatCustomizationSummary(style: LogoStyle, color: LogoVariant): string {
  if (style === 'none') return 'No Logo (Unbranded)';
  const styleOpt = LOGO_STYLE_OPTIONS.find(s => s.id === style);
  const colorOpt = LOGO_COLOR_OPTIONS.find(c => c.id === color);
  return `${styleOpt?.shortLabel || 'Mark + Monogram'} • ${colorOpt?.name || 'Cyan Tracer'}`;
}

interface HighDrawLogoProps {
  variant?: LogoVariant;
  styleVariant?: Exclude<LogoStyle, 'none'>;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  subtextClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES = {
  sm: 'h-4 w-auto',
  md: 'h-6 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-14 w-auto',
};

export const HighDrawLogo: React.FC<HighDrawLogoProps> = ({
  variant = 'cyan',
  styleVariant = 'mark_monogram',
  className = '',
  showWordmark = false,
  wordmarkClassName = 'text-white',
  subtextClassName = 'text-slate-400',
  size = 'md',
}) => {
  const logoSrc = getLogoAssetPath(styleVariant, variant) || '/assets/brand/logos/mark_monogram_cyan.png';
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (!showWordmark) {
    return (
      <img
        src={logoSrc}
        alt="High Draw Official Brand Mark"
        className={`${sizeClass} object-contain select-none ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="High Draw Official Brand Mark"
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
