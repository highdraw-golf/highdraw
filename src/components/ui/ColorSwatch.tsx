import React from 'react';

export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface ColorSwatchProps {
  colors: ColorOption[];
  selectedColor: string;
  onSelectColor: (colorName: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  size = 'md',
  showLabel = true,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  return (
    <div className="space-y-2">
      {showLabel && (
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Color: <span className="text-[#1A1F26] font-medium ml-1">{selectedColor}</span>
        </span>
      )}

      <div className="flex items-center gap-2.5 flex-wrap">
        {colors.map((c) => {
          const isSelected = selectedColor === c.name;

          return (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={(e) => {
                e.stopPropagation();
                onSelectColor(c.name);
              }}
              style={{ backgroundColor: c.hex }}
              className={`${sizeMap} rounded-full border transition-all cursor-pointer relative ${
                isSelected
                  ? 'ring-2 ring-[#1C2C24] ring-offset-2 scale-110 border-white'
                  : 'border-slate-300 hover:scale-115 hover:border-slate-400'
              }`}
              aria-label={`Color: ${c.name}`}
            />
          );
        })}
      </div>
    </div>
  );
};
