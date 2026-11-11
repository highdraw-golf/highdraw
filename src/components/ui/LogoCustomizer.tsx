import React from 'react';
import { m } from 'framer-motion';
import {
  CHEST_LOGO_STYLE_OPTIONS,
  LOGO_COLOR_OPTIONS,
  getLogoAssetPath,
} from '../brand/HighDrawLogo';
import type { LogoStyle, LogoVariant } from '../brand/HighDrawLogo';
import { Sparkles, Check, Users, ShieldCheck } from 'lucide-react';
import { SPRING_LAYOUT } from '../../lib/motion/tokens';
import { useMotionPreference } from '../motion/MotionProvider';

interface LogoCustomizerProps {
  selectedStyle: LogoStyle;
  onSelectStyle: (style: LogoStyle) => void;
  selectedColor: LogoVariant;
  onSelectColor?: (color: LogoVariant) => void;
  garmentHex?: string;
  garmentColorName?: string;
  recommendedColor?: LogoVariant;
  userTypeSelection?: string;
  onSelectUserType?: (userType: string) => void;
  userTypeOptions?: Array<{ id: string; label: string; sublabel?: string }>;
  compact?: boolean;
  decorationSpecLabel?: string;
}

export const LogoCustomizer: React.FC<LogoCustomizerProps> = ({
  selectedStyle,
  onSelectStyle,
  selectedColor,
  garmentHex = '#1E293B',
  garmentColorName = 'Deep Midnight Navy',
  userTypeSelection,
  onSelectUserType,
  userTypeOptions,
  decorationSpecLabel = '2.5" Centered Left-Chest Embroidery',
}) => {
  const { isReduced } = useMotionPreference();

  const isLightGarment =
    garmentHex.toUpperCase() === '#FFFFFF' ||
    garmentColorName.toLowerCase().includes('white');

  // Matched contrast thread per High Draw factory calibration
  const matchedThread: LogoVariant = isLightGarment ? 'cyan' : 'white';
  const effectiveThread: LogoVariant =
    selectedColor === 'cyan' || selectedColor === 'white' ? matchedThread : matchedThread;

  const normalizedStyle: LogoStyle =
    selectedStyle === 'mark_only' || selectedStyle === 'mark_text' || selectedStyle === 'mark_monogram'
      ? selectedStyle
      : 'mark_monogram';

  const activeLogoPath = getLogoAssetPath(normalizedStyle, effectiveThread);
  const activeColorMeta = LOGO_COLOR_OPTIONS.find(c => c.id === effectiveThread);

  return (
    <div className="p-4 sm:p-5 bg-[#FBFBFA] border border-slate-200 rounded-xs space-y-4 shadow-2xs">
      {/* Header with Live Fabric Swatch Preview */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#B12535]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B12535]">
              BESPOKE EMBROIDERY SUITE
            </span>
          </div>
          <h4 className="font-serif text-base font-bold text-[#1A1F26] mt-0.5">
            Select Signature Chest Mark
          </h4>
        </div>

        {/* Live Miniature Fabric Loupe */}
        <div className="flex items-center gap-2.5 bg-white px-2.5 py-1.5 rounded-xs border border-slate-200 shadow-2xs">
          <div
            className="w-11 h-11 rounded-xs border border-slate-300 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner transition-colors duration-200"
            style={{ backgroundColor: garmentHex }}
            title={`Live preview on ${garmentColorName}`}
          >
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.35) 0.5px, transparent 0.5px)',
                backgroundSize: '3px 3px',
              }}
            />
            {activeLogoPath && (
              <img
                src={activeLogoPath}
                alt="Selected Embroidery Preview"
                className="w-8 h-8 object-contain relative z-10 drop-shadow-xs transition-transform duration-200"
              />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
              THREAD PAIRING
            </span>
            <span className="text-[11px] font-bold text-[#1A1F26] block leading-tight">
              {CHEST_LOGO_STYLE_OPTIONS.find(s => s.id === normalizedStyle)?.shortLabel}
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold block">
              {activeColorMeta?.name || 'Crisp White'}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Optional User Type / Cut Selector */}
      {userTypeOptions && userTypeOptions.length > 0 && onSelectUserType && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px] flex items-center gap-1.5">
              <Users size={12} className="text-[#1C2C24]" />
              <span>1. Select Cut / Golfer Profile:</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              Tailored per Golfer
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {userTypeOptions.map(opt => {
              const active = userTypeSelection === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectUserType(opt.id)}
                  className={`px-3 py-2 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between t-press relative ${
                    active
                      ? 'bg-[#1C2C24] text-white border-[#1C2C24] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block leading-tight">{opt.label}</span>
                    {opt.sublabel && (
                      <span
                        className={`text-[10px] font-mono block mt-0.5 ${
                          active ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                  {active && <Check size={14} className="text-[#38BDF8] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Official 3-Mark Selector with Shared-Element Spring Halo */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
            {userTypeOptions ? '2.' : '1.'} Chest Lockup:{' '}
            <span className="text-[#1A1F26]">
              {CHEST_LOGO_STYLE_OPTIONS.find(s => s.id === normalizedStyle)?.name}
            </span>
          </span>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold">
            Included ($0)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {CHEST_LOGO_STYLE_OPTIONS.map(styleOpt => {
            const isSelected = normalizedStyle === styleOpt.id;
            const previewImg = getLogoAssetPath(styleOpt.id, effectiveThread);

            return (
              <button
                key={styleOpt.id}
                type="button"
                onClick={() => onSelectStyle(styleOpt.id)}
                className={`p-2.5 rounded-xs border text-center transition-colors cursor-pointer flex flex-col items-center justify-between gap-1.5 relative t-press ${
                  isSelected
                    ? 'border-[#1C2C24] bg-white shadow-sm'
                    : 'border-slate-200 bg-white/75 hover:bg-white hover:border-slate-400'
                }`}
              >
                {isSelected && !isReduced && (
                  <m.span
                    layoutId="active-logo-mark-ring"
                    transition={SPRING_LAYOUT}
                    className="absolute inset-0 rounded-xs ring-2 ring-[#1C2C24] pointer-events-none"
                  />
                )}

                {styleOpt.badge && (
                  <span className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-2xs font-bold bg-[#1C2C24] text-[#38BDF8]">
                    {styleOpt.badge}
                  </span>
                )}

                <div
                  className="w-full h-12 rounded-2xs flex items-center justify-center border border-slate-200/80 px-2 transition-colors duration-200"
                  style={{ backgroundColor: garmentHex }}
                >
                  {previewImg && (
                    <img
                      src={previewImg}
                      alt={styleOpt.shortLabel}
                      className="max-h-9 max-w-full object-contain"
                    />
                  )}
                </div>

                <span className="text-[10px] font-bold text-[#1A1F26] leading-tight">
                  {styleOpt.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Master Tailor Contrast Assurance Bar */}
      <div className="px-3 py-2 bg-white border border-slate-200/90 rounded-xs flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
          <span>
            <strong>Tailor-Matched Contrast:</strong>{' '}
            {isLightGarment
              ? 'Light Blue tracer thread on Crisp White garment'
              : `Crisp White thread on ${garmentColorName}`}
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] text-slate-400 shrink-0">
          {decorationSpecLabel}
        </span>
      </div>
    </div>
  );
};
