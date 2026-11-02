import React from 'react';
import {
  LOGO_STYLE_OPTIONS,
  LOGO_COLOR_OPTIONS,
  getLogoAssetPath,
} from '../brand/HighDrawLogo';
import type { LogoStyle, LogoVariant } from '../brand/HighDrawLogo';
import { Sparkles, Check, Ban, Users } from 'lucide-react';

interface LogoCustomizerProps {
  selectedStyle: LogoStyle;
  onSelectStyle: (style: LogoStyle) => void;
  selectedColor: LogoVariant;
  onSelectColor: (color: LogoVariant) => void;
  garmentHex?: string;
  garmentColorName?: string;
  recommendedColor?: LogoVariant;
  userTypeSelection?: string;
  onSelectUserType?: (userType: string) => void;
  userTypeOptions?: Array<{ id: string; label: string; sublabel?: string }>;
  compact?: boolean;
}

export const LogoCustomizer: React.FC<LogoCustomizerProps> = ({
  selectedStyle,
  onSelectStyle,
  selectedColor,
  onSelectColor,
  garmentHex = '#1E293B',
  garmentColorName = 'Deep Midnight Navy',
  recommendedColor = 'gold',
  userTypeSelection,
  onSelectUserType,
  userTypeOptions,
  compact = false,
}) => {
  const isLightGarment =
    garmentHex.toUpperCase() === '#FFFFFF' ||
    garmentColorName.toLowerCase().includes('white') ||
    garmentColorName.toLowerCase().includes('concrete');

  const isDarkGarment =
    garmentHex.toUpperCase() === '#111827' ||
    garmentColorName.toLowerCase().includes('black') ||
    garmentColorName.toLowerCase().includes('navy');

  const isToneOnTone =
    (isLightGarment && selectedColor === 'white') ||
    (isDarkGarment && selectedColor === 'black');

  const activeLogoPath = getLogoAssetPath(selectedStyle, selectedColor);

  return (
    <div className="p-4 sm:p-5 bg-[#FBFBFA] border border-slate-200 rounded-xs space-y-4 shadow-2xs">
      {/* Header with Live Fabric Swatch Preview */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#B12535]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B12535]">
              BESPOKE EMBROIDERY STUDIO
            </span>
          </div>
          <h4 className="font-serif text-base font-bold text-[#1A1F26] mt-0.5">
            Customize Logo &amp; Thread Color
          </h4>
        </div>

        {/* Live Miniature Fabric Loupe */}
        <div className="flex items-center gap-2.5 bg-white px-2.5 py-1.5 rounded-xs border border-slate-200 shadow-2xs">
          <div
            className="w-11 h-11 rounded-xs border border-slate-300 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner"
            style={{ backgroundColor: garmentHex }}
            title={`Live preview on ${garmentColorName}`}
          >
            {/* Subtle micro-pique texture grid */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.35) 0.5px, transparent 0.5px)',
                backgroundSize: '3px 3px',
              }}
            />
            {activeLogoPath ? (
              <img
                src={activeLogoPath}
                alt="Selected Embroidery Preview"
                className="w-8 h-8 object-contain relative z-10 drop-shadow-xs transition-all duration-200"
              />
            ) : (
              <span
                className={`text-[8px] font-mono uppercase tracking-wider font-bold px-1 text-center leading-tight ${
                  isLightGarment ? 'text-slate-600' : 'text-white/80'
                }`}
              >
                CLEAN
              </span>
            )}
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
              LIVE SWATCH
            </span>
            <span className="text-[11px] font-bold text-[#1A1F26] block leading-tight">
              {selectedStyle === 'none'
                ? 'Unbranded (No Logo)'
                : LOGO_STYLE_OPTIONS.find(s => s.id === selectedStyle)?.shortLabel}
            </span>
            {selectedStyle !== 'none' && (
              <span className="text-[10px] font-mono text-slate-500 block">
                {LOGO_COLOR_OPTIONS.find(c => c.id === selectedColor)?.name}
              </span>
            )}
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
                  className={`px-3 py-2 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between ${
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

      {/* 2. Logo Style Architecture Selector (4 Official Marks + Optional None) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
            {userTypeOptions ? '2.' : '1.'} Logo Style:{' '}
            <span className="text-[#1A1F26]">
              {LOGO_STYLE_OPTIONS.find(s => s.id === selectedStyle)?.name}
            </span>
          </span>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold">
            Included ($0)
          </span>
        </div>

        <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-5'} gap-2`}>
          {LOGO_STYLE_OPTIONS.map(styleOpt => {
            const isSelected = selectedStyle === styleOpt.id;
            const previewColor: LogoVariant =
              selectedStyle === 'none' ? recommendedColor : selectedColor;
            const previewImg = getLogoAssetPath(styleOpt.id, previewColor);

            return (
              <button
                key={styleOpt.id}
                type="button"
                onClick={() => onSelectStyle(styleOpt.id)}
                className={`p-2 rounded-xs border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 relative ${
                  isSelected
                    ? 'border-[#1C2C24] bg-white ring-1 ring-[#1C2C24] shadow-xs'
                    : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-400'
                }`}
              >
                {styleOpt.badge && (
                  <span
                    className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded-2xs font-bold ${
                      styleOpt.id === 'none'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-[#1C2C24] text-[#38BDF8]'
                    }`}
                  >
                    {styleOpt.badge}
                  </span>
                )}

                <div
                  className="w-full h-11 rounded-2xs flex items-center justify-center border border-slate-200/80 px-1.5"
                  style={{ backgroundColor: garmentHex }}
                >
                  {previewImg ? (
                    <img
                      src={previewImg}
                      alt={styleOpt.shortLabel}
                      className="max-h-8 max-w-full object-contain"
                    />
                  ) : (
                    <div
                      className={`flex flex-col items-center gap-0.5 ${
                        isLightGarment ? 'text-slate-500' : 'text-white/75'
                      }`}
                    >
                      <Ban size={13} />
                      <span className="text-[8px] font-mono uppercase font-bold">NONE</span>
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-bold text-[#1A1F26] leading-tight line-clamp-1">
                  {styleOpt.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Embroidery Thread Color Selector (Hidden/Disabled when No Logo is selected) */}
      {selectedStyle !== 'none' ? (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              {userTypeOptions ? '3.' : '2.'} Embroidery Thread Color:{' '}
              <span className="text-[#1A1F26]">
                {LOGO_COLOR_OPTIONS.find(c => c.id === selectedColor)?.name}
              </span>
            </span>
            {selectedColor === recommendedColor && (
              <span className="text-[10px] font-mono text-[#1C2C24] bg-emerald-100/80 px-2 py-0.5 rounded-2xs font-bold">
                ★ Pairing Match
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LOGO_COLOR_OPTIONS.map(colorOpt => {
              const isSelected = selectedColor === colorOpt.id;
              const isRec = recommendedColor === colorOpt.id;
              return (
                <button
                  key={colorOpt.id}
                  type="button"
                  onClick={() => onSelectColor(colorOpt.id)}
                  className={`px-2.5 py-2 rounded-xs border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#1A1F26] text-white border-[#1A1F26] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border"
                    style={{
                      backgroundColor: colorOpt.hex,
                      borderColor: isSelected ? '#FFFFFF' : colorOpt.borderHex,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold block truncate leading-tight">
                      {colorOpt.shortLabel}
                    </span>
                    {isRec && (
                      <span
                        className={`text-[8px] font-mono uppercase block leading-none mt-0.5 ${
                          isSelected ? 'text-[#38BDF8]' : 'text-emerald-700'
                        }`}
                      >
                        Recommended
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {isToneOnTone && (
            <p className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xs">
              Note: {LOGO_COLOR_OPTIONS.find(c => c.id === selectedColor)?.name} thread on{' '}
              {garmentColorName} creates a subtle tone-on-tone stealth embroidery finish.
            </p>
          )}
        </div>
      ) : (
        <div className="p-3 bg-white border border-slate-200 rounded-xs text-xs text-slate-600 flex items-center justify-between">
          <span>
            <strong>Clean Unbranded Finish Selected:</strong> Your garment will ship without exterior logo embroidery.
          </span>
          <button
            type="button"
            onClick={() => onSelectStyle('mark_monogram')}
            className="text-[11px] font-mono font-bold text-[#B12535] hover:underline uppercase ml-3 shrink-0 cursor-pointer"
          >
            Restore Logo
          </button>
        </div>
      )}
    </div>
  );
};
