import React from 'react';

export interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onOpenSizeGuide?: () => void;
  lowStockSizes?: string[];
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
  lowStockSizes = ['XL', '2XL'],
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800 uppercase tracking-wider">
          Size: <span className="text-[#1A1F26] font-mono text-sm ml-1">{selectedSize}</span>
        </span>
        {onOpenSizeGuide && (
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-slate-500 hover:text-[#B12535] underline font-semibold text-[11px] cursor-pointer"
          >
            Find My Fit / Size Guide
          </button>
        )}
      </div>

      <div className="grid grid-cols-6 gap-2">
        {sizes.map((sz) => {
          const isSelected = selectedSize === sz;
          const isLowStock = lowStockSizes.includes(sz);

          return (
            <button
              key={sz}
              type="button"
              onClick={() => onSelectSize(sz)}
              className={`relative py-3 text-xs border rounded-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1C2C24] text-white border-[#1C2C24] shadow-sm scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <span>{sz}</span>
              {isLowStock && !isSelected && (
                <span className="absolute -top-1.5 -right-1 w-2 h-2 rounded-full bg-amber-500" title="Low Stock" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
